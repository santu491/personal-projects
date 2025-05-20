import { AdminRole, API_RESPONSE, collections, deletedCommentMessage, deletedReplyMessage, mongoDbTables, NotificationDeepLink, NotificationMessages, NotificationType, PostResponse, ReactionEnum, Result, schedulePostStatus, selfDeletedCommentMessage, selfDeletedReplyMessage, SQSParams } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { Activity, ActivityList, PostLink } from '../models/activityModel';
import { Admin } from '../models/adminUserModel';
import { CommentDeeplink, Reaction, ReactionLog } from '../models/commonModel';
import { Author, CommentModel, CommentRequest, Content, Language, Link, LinkData, Post, PostActivityArgs, PostRequest, PushNotificationDetails, ReactionRequest, ReplyModel } from '../models/postsModel';
import { NotificationQueue, PollClosingPN } from '../models/pushNotificationModel';
import { StoryCommentRequest } from '../models/storyModel';
import { AdminUser, Installations, User } from '../models/userModel';
import { Schedule } from '../services/aws/schedule';
import { SqsService } from '../services/aws/sqsService';

@Service()
export class PostHelperService {
  constructor(
    private result: Result,
    private _mongoSvc: MongoDatabaseClient,
    private sqsService: SqsService,
    private scheduler: Schedule,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async upsertPostHelper(post: Post, payload: PostRequest, isNew: boolean) {
    switch (isNew) {
      case true: /* If the post is published, then update the activity and trigger the PN */
        if (post.published) {
          await this.publishPost(post);
          if (post.isNotify) {
            await this.notifyOnNewPost(post);
          }
        }
        break;

      case false: /* If the post is published, then update the activity and trigger the PN */
        if (payload.published && !post.hasContentBeenPublishedOnce) {
          await this.publishPost(post);
          if (payload.isNotify) {
            await this.notifyOnNewPost(post);
          }
        }
        break;

      default: break;
    }
  }

  public async createPostObject(request: PostRequest, adminUser: AdminUser, isCreate: boolean) {
    const author = await this.getAuthor(request, adminUser);
    const post = new Post();
    post.communities = request.communities;
    post.content = new Content();
    if (request.content.pnDetails) {
      post.content.pnDetails = new PushNotificationDetails();
      post.content.pnDetails.title = request.content.pnDetails.title;
      post.content.pnDetails.body = request.content.pnDetails.body;
    }

    post.content.en = post.content.es = new Language();
    post.content.en = request.content.en;
    post.content.es = request.content.es;
    if (isCreate) {
      post.createdDate = new Date();
    }
    if (request.content.link) {
      post.content.link = new Link();
      post.content.link.en = this.getLinkData(request.content.link.en);
      post.content.link.es = this.getLinkData(request.content.link.es);
      post.content.link.imageLink = request.content.link?.imageLink ?? '';
      post.content.link.isImageUploaded = request.content.link?.isImageUploaded ?? false;
    }
    post.updatedDate = new Date();
    post.published = request.published;
    post.publishOn = request.publishOn;
    post.status = this.getPostStatus(request);
    post.isNotify = request.isNotify;
    post.hasContentBeenPublishedOnce = request.published;
    if (request.published) {
      post.publishedAt = new Date();
    }
    post.createdBy = post.updatedBy = adminUser.id;
    post.flagged = false;
    post.removed = false;
    post.editedAfterPublish = false;
    post.author = author;

    return post;
  }

  public async createCommentObject(request: CommentRequest | StoryCommentRequest, adminUser: Admin, personaUserId?: string) {
    let author = new Author();
    if (personaUserId) {
      author = await this.personaAdminAuthor(personaUserId);
    } else {
      author.id = adminUser.id;
      author.firstName = adminUser.firstName;
      author.lastName = adminUser.lastName;
      author.displayName = adminUser.displayName;
      author.displayTitle = adminUser.displayTitle;
      author.role = adminUser.role;
    }

    const cmnt = new CommentModel();
    cmnt[mongoDbTables.posts.id] = new ObjectId();
    cmnt.comment = request.comment;
    cmnt.createdAt = new Date();
    cmnt.updatedAt = new Date();
    cmnt.flagged = false;
    cmnt.removed = false;
    cmnt.author = author;
    cmnt.createdBy = adminUser.id;
    if (request?.deeplink) {
      cmnt.deeplink = new CommentDeeplink();
      cmnt.deeplink = request.deeplink;
    }
    return cmnt;
  }

  public createReactionObject() {
    const reactionObject = new Reaction();
    reactionObject.log = [];
    reactionObject.count = {
      like: 0,
      care: 0,
      celebrate: 0,
      good_idea: 0,
      total: 0
    };

    return reactionObject;
  }

  public async publishPost(postObject: Post) {
    if (!postObject.hasContentBeenPublishedOnce) {
      await this._mongoSvc.updateByQuery(
        collections.POSTS,
        {
          [mongoDbTables.posts.id]: new ObjectId(postObject.id)
        },
        {
          $set: {
            [mongoDbTables.posts.hasContentBeenPublishedOnce]: true,
            [mongoDbTables.posts.publishedAt]: new Date()
          }
        }
      );
    }
    /* Update the community users activity collection with the admin post data */
    //Get all users with matching community
    const usersList = await this._mongoSvc.readAllByValue(
      collections.USERS,
      {
        [mongoDbTables.users.myCommunities]: postObject.communities[0]
      }
    );

    //Get all blocked users
    const blockedUsersObj = await this._mongoSvc.getDistinct(
      collections.BLOCKED,
      mongoDbTables.blocked.id
    );

    const blockedUsers = blockedUsersObj.map((busers) => {
      return busers.toString();
    });

    usersList.forEach(async (activeUser) => {
      if (
        activeUser.active === true &&
        !blockedUsers.includes(activeUser.id)
      ) {
        const message = (postObject.content.pnDetails) ? postObject.content.pnDetails.title : NotificationMessages.PostContent;
        const handleActivityData: PostActivityArgs = {
          userId: activeUser.id,
          postId: postObject.id,
          adminId: postObject.author.id,
          commentId: '',
          replyId: ''
        };
        await this.handleUserActivityForPost(handleActivityData, message);
      }
    });
  }

  public async updateReactionObject(reactionObject: Reaction, userIndex: number, reaction: string, isRemove: boolean) {
    try {
      if (!isRemove) {
        switch (reaction) {
          case ReactionEnum.REACTION_LIKE: reactionObject.count.like++;
            break;
          case ReactionEnum.REACTION_CARE: reactionObject.count.care++;
            break;
          case ReactionEnum.REACTION_CELIBRATE: reactionObject.count.celebrate++;
            break;
          case ReactionEnum.REACTION_GOOD_IDEA: reactionObject.count.good_idea++;
            break;
        }

        reactionObject.count.total++;
      }

      if (userIndex !== -1) {
        if (reactionObject.count[reactionObject.log[userIndex].reaction]) {
          reactionObject.count[reactionObject.log[userIndex].reaction]--;
        }

        if (reactionObject.log[userIndex].reaction !== PostResponse.REMOVE) {
          reactionObject.count.total--;
        }

        reactionObject.log[userIndex].reaction = reaction;
        reactionObject.log[userIndex].updatedDate = new Date();
      }

      return reactionObject;
    } catch (error) {
      this._log.error(error as Error);
      return reactionObject;
    }
  }

  public async handleReactions(
    modelObject,
    reactionObject: Reaction,
    reactionData: ReactionRequest,
    isRemove: boolean, type: string,
    postId: string,
    postAuthor: AdminUser,
    collection: string,
    receiverId?: string,
    filter?: {},
    commentId?: string,
    replyId?: string) {
    try {
      const objIndex = reactionObject.log.findIndex((userLog) => userLog.userId === postAuthor.id);

      if (isRemove && objIndex < 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
        return this.result.createError([this.result.errorInfo]);
      }

      reactionObject = await this.updateReactionObject(reactionObject, objIndex, reactionData.reaction, isRemove);

      if (objIndex < 0 && !isRemove) {
        const reaction = new ReactionLog();
        reaction.userId = postAuthor.id;
        reaction.reaction = reactionData.reaction;
        reaction.createdDate = new Date();
        reaction.updatedDate = new Date();
        reactionObject.log.push(reaction);

        modelObject.reactions = reactionObject;

        // Trigger the PN to the author of the Reply.
        const notificationMessageBody = (postAuthor.role === AdminRole.scadmin)
          ? `${postAuthor?.displayTitle} ${NotificationMessages.ReactionContent.toLowerCase()}`
          : NotificationMessages.ReactionAdvocate;
        await this.notifyOnAdminResponse(
          receiverId,
          postId,
          postAuthor,
          NotificationMessages.ReactionTitle,
          NotificationMessages.ReactionContent,
          NotificationType.REACTION,
          notificationMessageBody,
          commentId,
          replyId);
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

        case PostResponse.POST:
          const searchFilter = {
            [mongoDbTables.posts.id]: new ObjectId(reactionData.id)
          };

          setValue = {
            $set: {
              [mongoDbTables.posts.reactions]: reactionObject
            }
          };
          await this._mongoSvc.updateByQuery(collections.POSTS, searchFilter, setValue, filter);
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

  public async handleUserActivityForPost(idsArgs: PostActivityArgs, message: string, customDeepLink: boolean = false, linkedText?: string): Promise<ActivityList> {
    try {
      const admin: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, idsArgs.adminId);
      const existingActivity: Activity = await this._mongoSvc.readByValue(
        collections.ACTIVITY,
        { [mongoDbTables.activity.userId]: idsArgs.userId }
      );

      const adminUser = new AdminUser();
      adminUser[mongoDbTables.adminUser.id] = admin.id;
      adminUser.displayName = admin.displayName;
      adminUser.firstName = admin.firstName;
      adminUser.lastName = admin.lastName;
      adminUser.role = admin.role;
      adminUser.displayTitle = admin.displayTitle;

      const postLink = new PostLink();
      postLink.postId = idsArgs.postId;
      postLink.commentId = idsArgs.commentId;
      postLink.replyId = idsArgs.replyId;

      const activity = new ActivityList();
      activity[mongoDbTables.activity.id] = new ObjectId();
      activity.isActivityNotificationRead = false;
      activity.activityCreatedDate = new Date();
      activity.activityText = message;
      activity.activityInitiator = adminUser;
      activity.postLink = postLink;
      activity.isTouContent = customDeepLink;
      activity.linkedText = linkedText;

      if (existingActivity !== null) {
        const filterData = { _id: new ObjectId(existingActivity.id) };
        const setvalue = {
          $push: { [mongoDbTables.activity.activityList]: activity }
        };
        await this._mongoSvc.updateByQuery(collections.ACTIVITY, filterData, setvalue);

        return activity;
      }
      else {
        const newActivity = new Activity();
        newActivity.userId = idsArgs.userId;

        const activityList: ActivityList[] = [];
        activityList.push(activity);

        newActivity.activityList = activityList;

        await this._mongoSvc.insertValue(collections.ACTIVITY, newActivity);

        return activity;
      }
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  public async createCommunityData(commynityIds) {
    const communityIdList = commynityIds.map((id) => {
      return new ObjectId(id);
    });

    const projections = {
      'projection': {
        [mongoDbTables.community.id]: true,
        [mongoDbTables.community.displayName]: true
      }
    };

    return this._mongoSvc.readByIDArray(
      collections.COMMUNITY,
      communityIdList,
      projections
    );

  }

  public async notifyOnNewPost(post: Post) {
    /* push the message to the sqs. */
    const postLinkData: PostLink = new PostLink();
    postLinkData.postId = post.id;
    const notificationData: NotificationQueue = {
      type: NotificationType.ADMINPOST,
      deepLink: NotificationDeepLink.ACTIVITY,
      senderId: post.author.id,
      title: (post.content.pnDetails) ? post.content.pnDetails.title : NotificationMessages.PostTitle,
      body: (post.content.pnDetails) ? post.content.pnDetails.body : NotificationMessages.PostBody,
      env: getArgument('env'),
      createdDate: new Date(),
      communities: post.communities,
      postId: post.id,
      activityDeepLink: postLinkData,
      postWithPoll: false
    };
    await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.genericQueue, SQSParams.GENERIC_MESSAGE_GROUP_ID);
  }

  public async notifyOnAdminResponse(
    receiverId: string,
    postId: string,
    postAuthor: AdminUser,
    messageTitle: string,
    messageBody: string,
    type: string,
    notificationMessageBody: string,
    commentId?: string,
    replyId?: string) {
    const user: User = await this._mongoSvc.readByID(collections.USERS, receiverId);
    if (user !== null) {
      const handleActivityData: PostActivityArgs = {
        userId: user.id,
        postId: postId,
        adminId: postAuthor.id,
        commentId: commentId,
        replyId: replyId
      };
      const activity = await this.handleUserActivityForPost(handleActivityData, messageBody);

      /* Send message to the SQS and trigger the PN*/
      const installation: Installations = await this._mongoSvc.readByValue(
        collections.INSTALLATIONS,
        {
          [mongoDbTables.installations.userId]: user.id
        }
      );

      /* TODO: Add the notification pref check here after adding the falg to user collections */
      if (user.active && installation !== null) {
        const notificationData: NotificationQueue = {
          type: type,
          receiverId: user.id,
          senderId: postAuthor.id,
          title: messageTitle,
          body: notificationMessageBody,
          activityObjId: activity[mongoDbTables.activity.id].toString(),
          deepLink: NotificationDeepLink.ACTIVITY,
          createdDate: new Date(),
          env: getArgument('env'),
          deepLinkInApp: activity.postLink
        };
        await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.userActivityQueue, SQSParams.ACTIVITY_MESSAGE_GROUP_ID);
      }
    }
  }

  public addUserAuthor(comments: CommentModel[] | ReplyModel[], authors: User[], adminAuthors: Admin[]) {
    comments.forEach((comment) => {
      // Comments from Admin user.
      if (comment.author.role) {
        const adminAuthorObj = adminAuthors.filter((author) => {
          return author['id'] === comment.author.id;
        })[0];

        comment.author.displayName = adminAuthorObj.displayName ?? null;
        comment.author.displayTitle = adminAuthorObj.displayTitle ?? null;
        comment.author.firstName = adminAuthorObj.firstName;
        comment.author.lastName = adminAuthorObj.lastName;
      } else {
        // Comments from users.
        const authorObj = authors.filter((author) => {
          return author[mongoDbTables.posts.id].toString() === comment.author.id.toString();
        })[0];
        if (!authorObj) {
          return;
        }
        comment.author.displayName = authorObj.displayName ?? null;
        comment.author.firstName = authorObj.firstName;
        comment.author.lastName = authorObj.lastName;
      }
    });
  }

  public addPostAuthor(adminAuthors: Admin[], post: Post) {
    if (post) {
      const postAuthor = adminAuthors.filter((author) => {
        return author['id'] === post.author.id;
      })[0];
      post.author.displayName = postAuthor.displayName ?? null;
      post.author.displayTitle = postAuthor.displayTitle ?? null;
      post.author.firstName = postAuthor.firstName;
      post.author.lastName = postAuthor.lastName;
    }
  }

  public async updateBinderPost(post: Post) {
    const getPostQuery = {
      [mongoDbTables.binder.binderPostsId]: post.id
    };

    const updatePostValue = {
      $set: {
        [mongoDbTables.binder.binderPostsTitle]: {
          en: post.content.en.title,
          es: post.content.es.title
        },
        [mongoDbTables.binder.binderPostsAuthorDisplayName]: post.author.displayName,
        [mongoDbTables.binder.binderPostsAuthorProfileImage]: post.author.profileImage
      }
    };
    const arrayFilter = {
      arrayFilters: [
        { [mongoDbTables.binder.binderPostsIdFilter]: post.id }
      ]
    };
    this._mongoSvc.updateManyByQuery(
      collections.BINDER,
      getPostQuery,
      updatePostValue,
      arrayFilter
    );
  }

  public async getAuthor(request: PostRequest, adminUser: AdminUser) {
    const admin: Admin = (request.author) ?
      await this._mongoSvc.readByID(collections.ADMINUSERS, request.author.id) :
      await this._mongoSvc.readByID(collections.ADMINUSERS, adminUser.id);
    const author = new Author();
    author.firstName = admin.firstName;
    author.lastName = admin.lastName;
    author.displayName = admin.displayName;
    author.role = admin.role;
    author.id = admin.id;
    author.profileImage = admin.profileImage;
    author.displayTitle = admin.displayTitle;

    return author;
  }

  public async validateCommunityAccessForPost(request: PostRequest, adminUser) {
    if (adminUser.role === AdminRole.scadvocate) {
      const admin: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminUser.id);
      const difference = request.communities.filter((value) => !admin.communities.includes(value));
      if (difference.length > 0)
      {
        return false;
      }

      if (request.author) {
        return false;
      }
    }

    if (request.author) {
      const admin: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, request.author.id);
      const difference = request.communities.filter((value) => !admin.communities.includes(value));
      if (difference.length > 0)
      {
        return false;
      }
    }
    return true;
  }

  public async getCommentAuthor(userId: string, post: Post) {
    const adminUser: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, userId);
    if (adminUser.role === AdminRole.scadmin && adminUser.id === post.createdBy) {
      const authorUser: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, post.author.id);
      if (authorUser?.isPersona) {
        return authorUser;
      }
    }
    return adminUser;
  }

  public getCommentCount(comments: CommentModel[]) {
    let count = 0;
    if (comments ?? false) {
      const publishedComments = comments.filter((c) => c.removed === false);
      count += publishedComments.length;
      publishedComments.forEach((comment) => {
        if (comment.replies ?? false) {
          const publishedReplies = comment.replies.filter((r) => r.removed === false);
          count += publishedReplies.length;
        }
      });
    }
    return count;
  }

  public async modifyToRemovedComment(commentElement: CommentModel | ReplyModel, type?: string) {
    try {
      const adminUser = (commentElement.removedBy) ? await this._mongoSvc.readByID(collections.ADMINUSERS, commentElement.removedBy) : null;
      if (adminUser !== null) {
        commentElement.comment = (type === PostResponse.COMMENT) ? deletedCommentMessage : deletedReplyMessage;
        commentElement.author = {
          id: adminUser.id.toString(),
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          displayName: adminUser.displayName,
          displayTitle: adminUser.displayTitle,
          profileImage: adminUser.profileImage,
          role: adminUser.role
        };
      } else {
        commentElement.comment = (type === PostResponse.COMMENT) ? selfDeletedCommentMessage : selfDeletedReplyMessage;
      }

      return commentElement;
    } catch (error) {
      this._log.error(error as Error);
      return commentElement;
    }

  }

  public async personaAdminAuthor(adminUserId: string): Promise<Author> {
    const adminUser: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminUserId);
    const author: Author = {
      id: adminUser.id,
      role: adminUser.role,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      displayName: adminUser.displayName,
      displayTitle: adminUser.displayTitle,
      profileImage: ''
    };
    return author;
  }

  public getPostStatus(request: PostRequest): string {
    let status;
    if (request.published) {
      status = schedulePostStatus.PUBLISHED;
    } else if (request.publishOn) {
      status = schedulePostStatus.SCHEDULED;
    } else {
      status = schedulePostStatus.DRAFT;
    }

    return status;
  }

  public async postStatus(
    post: Post,
    oldStatus: string,
    newStatus: string,
    payload: PostRequest,
    adminId: string
  ) {
    try {
      switch (newStatus) {
        case schedulePostStatus.DRAFT:
          if (oldStatus === schedulePostStatus.SCHEDULED) {
            // Cancel Post Scheduled Job
            await this.scheduler.cancelPostJob(post.id);
          }
          await this.pollJobHandler(post);
          break;
        case schedulePostStatus.SCHEDULED:
          // create post scheduling job
          const jobData = {
            publishOn: payload.publishOn,
            postId: post.id,
            adminId: adminId,
            published: post.published,
            isNotify: post.isNotify,
            isKeyword: false,
            isSent: false
          };
          await this.scheduler.schedulePostJob(jobData);
          await this.pollJobHandler(post);
          break;
        case schedulePostStatus.PUBLISHED:
          if (oldStatus === schedulePostStatus.SCHEDULED) {
            // Close the scheduled post job
            await this.scheduler.cancelPostJob(post.id);
          }
          await this.pollJobHandler(post);
          break;
        default: return true;
      }
      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async postPollClosingSoon(post: Post) {
    try {
      if (!post.content?.en?.poll?.question && (!post.publishOn || !post.publishedAt)) {
        return true;
      }

      /**
       * Get the Post Published time.
       * Add (Poll ends in days - 1)
       */
      if (post.content.en.poll.endsOn < 2) {
        return true;
      }
      const previousDayOfPollClosing = post.publishedAt ? new Date(post.publishedAt) : new Date(post.publishOn);
      previousDayOfPollClosing.setDate(previousDayOfPollClosing.getDate() + (post.content.en.poll.endsOn - 1));

      const postLinkData: PostLink = new PostLink();
      postLinkData.postId = post.id;
      const jobData: PollClosingPN = {
        postId: post.id,
        type: NotificationType.ADMINPOST,
        senderId: post.author.id,
        title: NotificationMessages.pollClosingSoonTitle,
        body: NotificationMessages.pollClosingSoonBody,
        env: getArgument('env'),
        createdDate: new Date(),
        activityText: NotificationMessages.pollClosingSoonActivity,
        postWithPoll: true,
        sendOn: previousDayOfPollClosing,
        activityDeepLink: postLinkData,
        isSent: false,
        communities: post.communities
      };
      await this.scheduler.schedulePollClosingSoon(jobData);
      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async postPollClose(post: Post) {
    try {
      if (!post.content?.en?.poll?.question && (!post.publishOn || !post.publishedAt)) {
        return true;
      }

      /**
       * Get the Post Published time.
       * Add (Poll ends in days)
       */
      const pollClosingDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.publishOn);
      pollClosingDate.setDate(pollClosingDate.getDate() + post.content.en.poll.endsOn);

      const postLinkData: PostLink = new PostLink();
      postLinkData.postId = post.id;
      const jobData: PollClosingPN = {
        postId: post.id,
        type: NotificationType.ADMINPOST,
        senderId: post.author.id,
        title: NotificationMessages.pollClosedTitle,
        body: NotificationMessages.pollClosedBody,
        env: getArgument('env'),
        createdDate: new Date(),
        activityText: NotificationMessages.pollClosedActivity,
        postWithPoll: true,
        sendOn: pollClosingDate,
        activityDeepLink: postLinkData,
        isSent: false,
        communities: post.communities
      };
      await this.scheduler.schedulePollClosed(jobData);
      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  private async pollJobHandler(post: Post) {
    if (post.content?.en.poll?.question) {
      await this.postPollClosingSoon(post);
      await this.postPollClose(post);
    } else {
      await this.scheduler.cancelPollClosingSoonJob(post.id);
      await this.scheduler.cancelPollClosedJob(post.id);
    }
  }

  private getLinkData(requestLink: LinkData) {
    const linkData = new LinkData();
    linkData.url = requestLink.url;
    linkData.title = requestLink.title;
    linkData.description = requestLink.description;

    return linkData;
  }
}
