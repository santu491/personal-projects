import { AdminRole, API_RESPONSE, collections, mongoDbTables, NotificationDeepLink, NotificationMessages, NotificationType, PostResponse, Result, SQSParams } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { Activity, ActivityList, StoryLink } from '../models/activityModel';
import { Admin } from '../models/adminUserModel';
import { Reaction, ReactionLog } from '../models/commonModel';
import { ReactionRequest } from '../models/postsModel';
import { NotificationQueue } from '../models/pushNotificationModel';
import { Story, StoryResponse } from '../models/storyModel';
import { AdminUser, Installations, User } from '../models/userModel';
import { AdminUserService } from '../services/adminUserService';
import { SqsService } from '../services/aws/sqsService';
import { EmailService } from '../services/emailServices';
import { PostHelperService } from './postHelper';

@Service()
export class StoryHelperService {
  public emailService = Container.get(EmailService);
  public adminUserService = Container.get(AdminUserService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private sqsService: SqsService,
    private result: Result,
    private postHelper: PostHelperService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  /* Add pushNotification to the user who added the comment when admin replies to the user comment */
  public async userNotification(payload, type: string, admin: Admin, commentId?: string, replyId?: string) {
    const story: Story = await this._mongoSvc.readByID(collections.STORY, payload.storyId);

    if (type === PostResponse.REPLY) {
      const commentIndex = story.comments.map((value) => {
        return value[mongoDbTables.story.id].toString();
      }).indexOf(payload.commentId);
      const comment = story.comments[commentIndex];

      const notificationMessageBody = (admin.role === AdminRole.scadmin)
        ? `${admin?.displayTitle} ${NotificationMessages.ReplyContent.toLowerCase()}`
        : NotificationMessages.ReplyAdvocate;

      await this.notifyUserOverStory(
        comment.author.id,
        story.id,
        admin.id,
        NotificationMessages.ReplyTitleStory,
        NotificationMessages.ReplyContent,
        type, notificationMessageBody, commentId, replyId
      );
    }

    if (type === PostResponse.COMMENT) {
      const notificationMessageBody = (admin.role === AdminRole.scadmin)
        ? `${admin?.displayTitle} ${NotificationMessages.CommentStoryContent.toLowerCase()}`
        : NotificationMessages.CommentStoryAdvocate;

      await this.notifyUserOverStory(
        story.authorId,
        story.id, admin.id,
        NotificationMessages.ReplyTitleStory,
        NotificationMessages.CommentStoryContent,
        type, notificationMessageBody, commentId
      );
    }

  }

  public async handleUserActivityForStory(activeUser: User, storyId: string, adminId: string, message: string, commentId?: string, replyId?: string, customDeepLink: boolean = false, linkedText?: string): Promise<ActivityList> {
    try {
      const admin: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminId);
      const existingActivity: Activity = await this._mongoSvc.readByValue(
        collections.ACTIVITY,
        { [mongoDbTables.activity.userId]: activeUser.id }
      );

      const adminUser = new AdminUser();
      adminUser[mongoDbTables.adminUser.id] = admin.id;
      adminUser.displayName = admin.displayName;
      adminUser.firstName = admin.firstName;
      adminUser.lastName = admin.lastName;
      adminUser.role = admin.role;
      adminUser.displayTitle = admin.displayTitle;

      const storyLink = new StoryLink();
      storyLink.storyId = storyId;
      storyLink.commentId = commentId;
      storyLink.replyId = replyId;

      const activity = new ActivityList();
      activity[mongoDbTables.activity.id] = new ObjectId();
      activity.isActivityNotificationRead = false;
      activity.isTouContent = customDeepLink;
      activity.linkedText = linkedText;
      activity.activityCreatedDate = new Date();
      activity.activityText = message;
      activity.activityInitiator = adminUser;
      activity.storyLink = storyLink;

      if (existingActivity !== null) {
        const filterData = { _id: new ObjectId(existingActivity.id) };
        const setvalue = {
          $push: { [mongoDbTables.activity.activityList]: activity }
        };
        await this._mongoSvc.updateByQuery(collections.ACTIVITY, filterData, setvalue);
      }
      else {
        const newActivity = new Activity();
        newActivity.userId = activeUser.id;

        const activityList: ActivityList[] = [];
        activityList.push(activity);

        newActivity.activityList = activityList;

        await this._mongoSvc.insertValue(collections.ACTIVITY, newActivity);
      }

      return activity;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  public async notifyUserOverStory(
    receiverId: string,
    storyId: string,
    adminUser: string,
    messageTitle: string,
    messageBody: string,
    type: string,
    notificationMessageBody: string,
    commentId?: string,
    replyId?: string,
    linkedText?: string,
    customDeepLink: boolean = false
  ) {
    let user: User = await this._mongoSvc.readByID(collections.USERS, receiverId);
    user = { ...user, ...user?.attributes };
    if (user !== null) {
      const activity = await this.handleUserActivityForStory(user, storyId, adminUser, messageBody, commentId, replyId, customDeepLink, linkedText);
      let notificationFlag;
      switch (type) {
        case NotificationType.REPLY:
          notificationFlag = user?.attributes?.replyNotificationFlag ?? true;
          break;
        case NotificationType.REACTION:
          notificationFlag = user?.attributes?.commentReactionNotificationFlag ?? true;
          break;
        case NotificationType.COMMENT:
          notificationFlag = user?.attributes?.commentNotificationFlag ?? true;
          break;
        case NotificationType.STORY:
          notificationFlag = user?.attributes?.communityNotificationFlag ?? true;
          break;
        default:
          notificationFlag = false;
          break;
      }

      /* Send message to the SQS and trigger the PN*/
      const installation: Installations = await this._mongoSvc.readByValue(
        collections.INSTALLATIONS,
        {
          [mongoDbTables.installations.userId]: user.id
        }
      );

      if (user.active && installation !== null && notificationFlag) {
        const notificationData: NotificationQueue = {
          type: type,
          receiverId: user.id,
          senderId: adminUser,
          title: messageTitle,
          body: notificationMessageBody,
          activityObjId: activity[mongoDbTables.activity.id].toString(),
          deepLink: NotificationDeepLink.ACTIVITY,
          createdDate: new Date(),
          env: getArgument('env'),
          deepLinkInApp: activity.storyLink
        };
        await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.userActivityQueue, SQSParams.ACTIVITY_MESSAGE_GROUP_ID);
      }
    }
  }

  public getStoryAuthor(stories: StoryResponse[], authors) {
    for (const story of stories) {
      const userDetails = authors.filter((user) => user.id === story.authorId)[0];
      story.author = userDetails;
    }
    return stories;
  }

  public async readStoryCollection(id: string) {
    const value = {
      $match: {
        [mongoDbTables.story.id]: new ObjectId(id)
      }
    };

    const userCommentLookup = {
      $lookup: {
        from: collections.USERS,
        localField: mongoDbTables.story.commentAuthorId,
        foreignField: mongoDbTables.story.id,
        as: mongoDbTables.story.commentAuthors
      }
    };

    const userReplyLookup = {
      $lookup: {
        from: collections.USERS,
        localField: mongoDbTables.story.replyAuthorId,
        foreignField: mongoDbTables.story.id,
        as: mongoDbTables.story.replyAuthors
      }
    };

    const story: StoryResponse[] = await this._mongoSvc.readByAggregate(
      collections.STORY,
      [value, userCommentLookup, userReplyLookup]
    );
    return story[0];
  }

  public async handleReactions(
    modelObject,
    reactionObject: Reaction,
    reactionData: ReactionRequest,
    isRemove: boolean,
    type: string,
    storyId: string,
    adminUser: AdminUser,
    collection: string,
    receiverId?: string,
    filter?: {},
    commentId?: string,
    replyId?: string) {
    try {
      const objIndex = reactionObject.log.findIndex((userLog) => userLog.userId === adminUser.id);

      if (isRemove && objIndex < 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
        return this.result.createError([this.result.errorInfo]);
      }

      reactionObject = await this.postHelper.updateReactionObject(reactionObject, objIndex, reactionData.reaction, isRemove);

      if (objIndex < 0 && !isRemove) {
        const reaction = new ReactionLog();
        reaction.userId = adminUser.id;
        reaction.reaction = reactionData.reaction;
        reaction.createdDate = new Date();
        reaction.updatedDate = new Date();
        reactionObject.log.push(reaction);

        modelObject.reactions = reactionObject;

        let notificationMessageBody;
        switch (type) {
          case NotificationType.COMMENT: // we handle bth reply and comment here only.
            notificationMessageBody = (adminUser.role === AdminRole.scadmin)
              ? `${adminUser?.displayTitle} ${NotificationMessages.ReactionContent.toLowerCase()}`
              : NotificationMessages.ReactionAdvocate;
            break;
          case NotificationType.STORY:
            notificationMessageBody = (adminUser.role === AdminRole.scadmin)
              ? `${adminUser?.displayTitle} ${NotificationMessages.ReactionContentStory.toLowerCase()}`
              : NotificationMessages.ReactionAdvocateStory;
            break;
          case NotificationType.REPLY:
            notificationMessageBody = (adminUser.role === AdminRole.scadmin)
              ? `${adminUser?.displayTitle} ${NotificationMessages.ReactionContent.toLowerCase()}`
              : NotificationMessages.ReactionAdvocate;
            break;
          default:

        }

        const activityLine = (type === NotificationType.STORY) ? NotificationMessages.ReactionContentStory : NotificationMessages.ReactionContent;
        await this.notifyUserOverStory(
          receiverId,
          storyId, adminUser.id,
          NotificationMessages.ReactionTitle,
          activityLine,
          NotificationType.REACTION,
          notificationMessageBody,
          commentId,
          replyId
        );
      }

      let setValue = {};
      switch (type) {
        case PostResponse.REPLY:
          const searchFilterPost = {
            [mongoDbTables.posts.id]: new ObjectId(reactionData.id)
          };
          setValue = {
            $set: {
              [mongoDbTables.posts.postReplyReactionFilter]: reactionObject
            }
          };
          await this._mongoSvc.updateByQuery(collection, searchFilterPost, setValue, filter);
          break;

        case PostResponse.COMMENT:
          const searchFilterComment = {
            [mongoDbTables.posts.id]: new ObjectId(reactionData.id),
            [mongoDbTables.posts.commentId]: new ObjectId(reactionData.commentId)
          };
          setValue = {
            $set: {
              [mongoDbTables.posts.postCommentReaction]: reactionObject
            }
          };
          await this._mongoSvc.updateByQuery(collection, searchFilterComment, setValue, filter);
          break;

        case PostResponse.STORY:
          const searchFilterStory = {
            [mongoDbTables.story.id]: new ObjectId(reactionData.id)
          };

          setValue = {
            $set: {
              [mongoDbTables.story.reactions]: reactionObject
            }
          };
          await this._mongoSvc.updateByQuery(collections.STORY, searchFilterStory, setValue, filter);
          break;
      }

      return true;

    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async formateComments(story: StoryResponse, commentAuthors?, replyAuthors?, adminUsers? ) {
    const filteredComments = [];
    if (story.comments ?? false) {
      for (const comment of story.comments) {
        if (comment.replies ?? false) {
          const filteredReplies = [];
          for (const reply of comment.replies) {
            if (reply.removedBy) {
              const processedReply = await this.postHelper.modifyToRemovedComment(reply, PostResponse.REPLY);
              filteredReplies.push(processedReply);
            } else if(!reply.removed){
              filteredReplies.push(reply);
            }
            if (replyAuthors) {
              this.postHelper.addUserAuthor(filteredReplies, replyAuthors, adminUsers);
            }
            comment.replies = (comment.removed) ? null : filteredReplies;
          }
        }
        if (comment.removedBy) {
          filteredComments.push(await this.postHelper.modifyToRemovedComment(comment, PostResponse.COMMENT));
        } else if(!comment.removed){
          filteredComments.push(comment);
        }
      }
      if (commentAuthors) {
        this.postHelper.addUserAuthor(filteredComments, commentAuthors, adminUsers);
      }
    }
    story.comments = filteredComments;

    return story;
  }
}
