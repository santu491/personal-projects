import {
  AdminRole,
  API_RESPONSE,
  collections,
  LinkedTexts, mongoDbTables, NotificationDeepLink, NotificationMessages, NotificationType, PostResponse, Result,
  schedulePostStatus,
  SQSParams, Validation
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument, StringUtils } from '@anthem/communityadminapi/utils';
import { ObjectID } from 'mongodb';
import Container, { Service } from 'typedi';
import { PostHelperService } from '../helpers/postHelper';
import { Admin } from '../models/adminUserModel';
import { Reaction, SetQuery } from '../models/commonModel';
import { ValidationModel } from '../models/contentModel';
import { PageParam } from '../models/pageParamModel';
import {
  BooleanResponse,
  CommentModel,
  CommentRequest,
  Post,
  PostActivityArgs,
  PostRequest,
  ReactionRequest,
  ReplyModel,
  ReplyRequest,
  ReportComment,
  ReportReply
} from '../models/postsModel';
import { NotificationQueue } from '../models/pushNotificationModel';
import { BaseResponse } from '../models/resultModel';
import { AdminUser, Installations, User } from '../models/userModel';
import { AdminUserService } from './adminUserService';
import { Schedule } from './aws/schedule';
import { SqsService } from './aws/sqsService';
import { EmailService } from './emailServices';
import { PostImageService } from './images/postImageServices';
import { PollService } from './pollService';

@Service()
export class PostsService {
  emailService = Container.get(EmailService);
  adminUserService = Container.get(AdminUserService);
  scheduler = Container.get(Schedule);
  pollSvc = Container.get(PollService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private postHelperService: PostHelperService,
    private validation: Validation,
    private imageService: PostImageService,
    private sqsService: SqsService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async upsertPost(payload: PostRequest, admin: AdminUser): Promise<BaseResponse> {
    try {
      if (!await this.postHelperService.validateCommunityAccessForPost(payload, admin)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedTitle;
        return this.result.createError([this.result.errorInfo]);
      }

      // Moderation check.
      const validation = this.checkModeration(payload);

      // Bad word
      if (validation.isBadWord ) {
        this.result.errorInfo.errorCode = validation.isBadWord ? API_RESPONSE.statusCodes[400] : API_RESPONSE.statusCodes[477];
        this.result.errorInfo.title = validation.isBadWord ? API_RESPONSE.messages.invalidContent : API_RESPONSE.messages.invalidContentWithKeyWords;
        this.result.errorInfo.detail = JSON.stringify(validation.errorFields);
        return this.result.createError([this.result.errorInfo]);
      }

      // Update Post
      if (payload.id) {
        return await this.updatePost(payload, admin, validation);
      }

      const newPost = await this.postHelperService.createPostObject(payload, admin, true);
      await this._mongoSvc.insertValue(collections.POSTS, newPost);
      newPost.id = newPost[mongoDbTables.posts.id];
      delete newPost[mongoDbTables.posts.id];
      // Store the image in PostImages.
      if (payload.content.image) {
        await this.imageService.postImageHandler(newPost.id, payload.content.image, true, false);
      }
      if (payload.content?.link?.isImageUploaded) {
        await this.imageService.postImageHandler(newPost.id, payload.content.link.imageBase64, true, false, true);
      }
      // Attach the image string.
      await this.setPostImage(newPost);
      await this.handleSchedulePost(newPost, payload, admin);

      return this.result.createSuccess(newPost);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async deletePost(postId: string): Promise<BaseResponse> {
    try {
      const post: Post = await this._mongoSvc.readByID(
        collections.POSTS,
        postId
      );
      if (post === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDelateFailed;
        return this.result.createError([this.result.errorInfo]);
      }

      // Cancel all the jobs that are related to the post.
      await this.scheduler.cancelPostJob(postId);
      await this.scheduler.cancelPollClosingSoonJob(postId);
      await this.scheduler.cancelPollClosedJob(postId);

      // Delete the poll response if the post if removed.
      if (post.content?.en?.poll?.question) {
        await this._mongoSvc.deleteOneByValue(
          collections.POLLRESPONSE,
          {
            [mongoDbTables.pollResponse.postId]: post.id
          }
        );
      }

      const value = { [mongoDbTables.posts.id]: new ObjectID(postId) };
      if (post.published === false) {
        await this.imageService.postImageHandler(postId, null, false, true);
        const response = new BooleanResponse();
        response.operation = await this._mongoSvc.deleteOneByValue(
          collections.POSTS,
          value
        );
        return this.result.createSuccess(response);
      }
      const setSoftDelete = {
        $set: {
          [mongoDbTables.posts.removed]: true,
          [mongoDbTables.posts.status]: schedulePostStatus.CANCELLED
        }
      };
      const storyResponse = await this._mongoSvc.updateByQuery(collections.POSTS, value, setSoftDelete);
      return this.result.createSuccess(storyResponse);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getPost(postId: string, published: boolean, flagged: boolean) {

    const value = {
      $match: {
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.flagged]: flagged,
        [mongoDbTables.posts.published]: published,
        [mongoDbTables.posts.id]: new ObjectID(postId)
      }
    };

    if (flagged === undefined) {
      delete value.$match[mongoDbTables.posts.flagged];
    }

    const userCommentLookup = {
      $lookup: {
        from: collections.USERS,
        localField: mongoDbTables.posts.commentAuthorId,
        foreignField: mongoDbTables.posts.id,
        as: mongoDbTables.posts.commentAuthors
      }
    };

    const userReplyLookup = {
      $lookup: {
        from: collections.USERS,
        localField: mongoDbTables.posts.replyAuthorId,
        foreignField: mongoDbTables.posts.id,
        as: mongoDbTables.posts.replyAuthors
      }
    };

    const projection = {
      'projection': {
        [mongoDbTables.adminUser.id]: true,
        [mongoDbTables.adminUser.displayTitle]: true,
        [mongoDbTables.adminUser.displayName]: true,
        [mongoDbTables.adminUser.firstName]: true,
        [mongoDbTables.adminUser.lastName]: true
      }
    };

    const post = await this._mongoSvc.readByAggregate(
      collections.POSTS,
      [value, userCommentLookup, userReplyLookup]
    );

    const adminUsers = await this._mongoSvc.readAllByValue(collections.ADMINUSERS, {}, {}, null, null, projection);

    if (post.length === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.postDoesNotExist;
      this.result.errorInfo.detail = API_RESPONSE.messages.noPostAvailableDetail;

      return this.result.createError([this.result.errorInfo]);
    }

    this.postHelperService.addPostAuthor(adminUsers, post[0]);
    post[0] = await this.formateComments(post[0], post[mongoDbTables.posts.commentAuthors], post[mongoDbTables.posts.replyAuthors], adminUsers);

    post[0].communities = await this.postHelperService.createCommunityData(post[0].communities);
    post[0].id = post[0][mongoDbTables.posts.id].toString();
    await this.setPostImage(post[0]);
    delete post[0].commentAuthors;
    delete post[0].replyAuthors;

    if (post[0].content.en.poll) {
      await this.pollSvc.calculatePollResult(post[0]);
    }

    return this.result.createSuccess(post[0]);
  }

  public async getAllPosts(pageParams: PageParam, status: string[], communityIds: string[], adminId: string) {
    const start = (pageParams.pageNumber - 1) * pageParams.pageSize;
    const end = start + pageParams.pageSize;
    const sortOption = { [mongoDbTables.posts.createdDate]: pageParams.sort };
    let value;
    let draftPosts = [];
    let scheduledPosts = [];
    let posts = [];

    // Since admisn can see only thier own draft/scheduled posts.
    const draftIndex = status.indexOf(schedulePostStatus.DRAFT);
    const scheduledIndex = status.indexOf(schedulePostStatus.SCHEDULED);
    if (draftIndex !== -1) {
      value = {
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.communities]: { $in: communityIds },
        [mongoDbTables.posts.createdBy]: adminId,
        [mongoDbTables.posts.status]: { $exists: true, $eq: status[draftIndex] }
      };
      draftPosts = await this._mongoSvc.readAllByValue(collections.POSTS, value, sortOption);
      status.splice(draftIndex, 1);
    }
    if (scheduledIndex !== -1) {
      value = {
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.communities]: { $in: communityIds },
        [mongoDbTables.posts.createdBy]: adminId,
        [mongoDbTables.posts.status]: { $exists: true, $eq: status[scheduledIndex] }
      };
      scheduledPosts = await this._mongoSvc.readAllByValue(collections.POSTS, value, sortOption);
      delete status[scheduledIndex];
    }
    if (status.length > 0) {
      value = {
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.communities]: { $in: communityIds },
        [mongoDbTables.posts.status]: {
          $in: status,
          $exists: true
        }
      };
      posts = await this._mongoSvc.readAllByValue(collections.POSTS, value, sortOption);
    }
    const allPosts = [].concat(draftPosts, scheduledPosts, posts);
    allPosts.sort((post1: Post, post2: Post) => {
      return post2.updatedDate.getTime() - post1.updatedDate.getTime();
    });

    const finalposts = [];
    for (let post of allPosts.slice(start, end)) {
      post.communities = await this.postHelperService.createCommunityData(post.communities);
      post.commentsCount = this.postHelperService.getCommentCount(post?.comments);
      post.reactionCount = (post.reactions) ? post.reactions.count.total : 0;
      post = await this.formateComments(post);
      post.author = await this._mongoSvc.readByID(collections.ADMINUSERS, post.author.id);
      // Attach the image string.
      await this.setPostImage(post);
      if (post.content.en.poll) {
        await this.pollSvc.calculatePollResult(post);
      }
      finalposts.push(post);
    }

    return this.result.createSuccess({ posts: finalposts, totalPosts: allPosts.length });
  }

  public async getCommunityPosts(pageParams: PageParam, published: boolean, communityIds: string[]) {
    const start = (pageParams.pageNumber - 1) * pageParams.pageSize;
    const end = start + pageParams.pageSize;
    const value = {
      [mongoDbTables.posts.published]: published,
      [mongoDbTables.posts.removed]: false,
      [mongoDbTables.posts.communities]: { $in: communityIds }
    };
    const sortOption = { [mongoDbTables.posts.createdDate]: pageParams.sort };
    const posts = await this._mongoSvc.readAllByValue(collections.POSTS, value, sortOption, end, start);

    const finalposts = [];
    for (let post of posts.slice(-pageParams.pageSize)) {
      post.communities = await this.postHelperService.createCommunityData(post.communities);
      post = await this.formateComments(post);
      post.commentsCount = this.postHelperService.getCommentCount(post?.comments);
      post.reactionCount = (post.reactions) ? post.reactions.count.total : 0;
      post.author = await this._mongoSvc.readByID(collections.ADMINUSERS, post.author.id);
      await this.setPostImage(post);
      if (post.content.en.poll) {
        await this.pollSvc.calculatePollResult(post);
      }
      finalposts.push(post);
    }
    const totalPosts = await this._mongoSvc.getDocumentCount(collections.POSTS, value);

    return this.result.createSuccess({ posts: finalposts, totalPosts: totalPosts });
  }

  public async upsertComment(payload: CommentRequest, admin): Promise<BaseResponse> {
    try {
      const value = {
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.id]: new ObjectID(payload.postId)
      };
      const post: Post = await this._mongoSvc.readByValue(
        collections.POSTS,
        value
      );
      if (post === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      // Check for the badwords or sensitive word before adding the comment.
      const validationDetails = new ValidationModel();
      validationDetails.errorFields = [];
      const validation = this.moderationOnFieldLevel(NotificationType.COMMENT, payload.comment, validationDetails);
      if (!payload.isProfane && validation.isBadWord ) {
        this.result.errorInfo.errorCode = validation.isBadWord ? API_RESPONSE.statusCodes[400] : API_RESPONSE.statusCodes[477];
        this.result.errorInfo.title = validation.isBadWord ? API_RESPONSE.messages.invalidContent : API_RESPONSE.messages.invalidContentWithKeyWords;
        this.result.errorInfo.detail = JSON.stringify(validation.errorFields);
        return this.result.createError([this.result.errorInfo]);
      }
      if (payload.id) {
        const cmntVal = {
          [mongoDbTables.posts.removed]: false,
          [mongoDbTables.posts.id]: new ObjectID(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectID(payload.id)
        };
        const comment: Post = await this._mongoSvc.readByValue(
          collections.POSTS,
          cmntVal
        );
        if (comment === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const updateQuery = {
          [mongoDbTables.posts.id]: new ObjectID(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectID(payload.id)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.posts.commentMsg]: payload.comment,
            [mongoDbTables.posts.commentUpdatedAt]: new Date(),
            [mongoDbTables.posts.commentDeeplink]: payload?.deeplink
          }
        };
        await this._mongoSvc.updateByQuery(collections.POSTS, updateQuery, updateSetValue);
        const response = new BooleanResponse();
        response.operation = true;
        return this.result.createSuccess(response);
      } else {
        const adminUser = await this.postHelperService.getCommentAuthor(admin.id, post);
        const commentObj = await this.postHelperService.createCommentObject(payload, adminUser);
        delete commentObj.postId;
        const query = { [mongoDbTables.posts.id]: new ObjectID(payload.postId) };
        const setValue = { $addToSet: { comments: commentObj } };
        await this._mongoSvc.updateByQuery(collections.POSTS, query, setValue);
        commentObj.id = commentObj[mongoDbTables.posts.id];
        delete commentObj[mongoDbTables.posts.id];

        return this.result.createSuccess(commentObj);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async upsertReply(payload: ReplyRequest, adminUser): Promise<BaseResponse> {
    try {

      const comment: Post = await this._mongoSvc.readByValue(
        collections.POSTS,
        {
          [mongoDbTables.posts.removed]: false,
          [mongoDbTables.posts.id]: new ObjectID(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectID(payload.commentId)
        }
      );
      if (comment === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      // Check for the badwords or sensitive word before adding the comment.
      const validationDetails = new ValidationModel();
      validationDetails.errorFields = [];
      const validation = this.moderationOnFieldLevel(NotificationType.COMMENT, payload.comment, validationDetails);
      if (!payload.isProfane && validation.isBadWord ) {
        this.result.errorInfo.errorCode = validation.isBadWord ? API_RESPONSE.statusCodes[400] : API_RESPONSE.statusCodes[477];
        this.result.errorInfo.title = validation.isBadWord ? API_RESPONSE.messages.invalidContent : API_RESPONSE.messages.invalidContentWithKeyWords;
        this.result.errorInfo.detail = JSON.stringify(validation.errorFields);
        return this.result.createError([this.result.errorInfo]);
      }

      if (payload.id) {
        const searchFilter = {
          [mongoDbTables.posts.id]: new ObjectID(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectID(payload.commentId),
          [mongoDbTables.posts.removed]: false,
          [mongoDbTables.posts.comments]: {
            $elemMatch: {
              [mongoDbTables.posts.replies]: {
                $elemMatch: {
                  [mongoDbTables.posts.id]: new ObjectID(payload.id),
                  [mongoDbTables.posts.removed]: false
                }
              }
            }
          }
        };
        const commentReply: CommentModel = await this._mongoSvc.readByValue(
          collections.POSTS,
          searchFilter
        );
        if (commentReply == null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdDetail;
          this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }

        const query = {
          [mongoDbTables.posts.id]: new ObjectID(payload.postId)
        };
        const setValue = {
          $set: {
            [mongoDbTables.posts.postCommentFilter]: payload.comment,
            [mongoDbTables.posts.postDateFilter]: new Date(),
            [mongoDbTables.posts.replyDeeplink]: payload?.deeplink
          }
        };
        const filter = {
          'arrayFilters': [
            { [mongoDbTables.posts.postOuterFilter]: new ObjectID(payload.commentId) },
            { [mongoDbTables.posts.postInnerFilter]: new ObjectID(payload.id) }
          ]
        };
        const result = await this._mongoSvc.updateByQuery(collections.POSTS, query, setValue, filter);
        const response = new BooleanResponse();
        response.operation = (result) ? true : false;

        return this.result.createSuccess(response);
      } else {
        const author: Admin = await this.postHelperService.getCommentAuthor(adminUser.id, comment);
        if (author === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidUserIdDetail;
          this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const commentReplyObj = await this.postHelperService.createCommentObject(payload, author);
        delete commentReplyObj.postId;
        const query = {
          [mongoDbTables.posts.id]: new ObjectID(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectID(payload.commentId)
        };
        const setValue = { $addToSet: { [mongoDbTables.posts.postReplies]: commentReplyObj } };
        await this._mongoSvc.updateByQuery(collections.POSTS, query, setValue);

        /* Add pushNotification to the user who added the comment */
        const commentIndex = comment.comments.map((value) => {
          return value[mongoDbTables.posts.id].toString();
        }).indexOf(payload.commentId);

        const userComment: CommentModel = comment.comments[commentIndex];
        const user: User = await this._mongoSvc.readByID(collections.USERS, userComment.author.id);
        if (user !== null) {
          const handleActivityData: PostActivityArgs = {
            userId: user.id,
            postId: payload.postId,
            adminId: author.id,
            commentId: payload.commentId,
            replyId: commentReplyObj[mongoDbTables.posts.id].toString()
          };
          const activity = await this.postHelperService.handleUserActivityForPost(
            handleActivityData,
            NotificationMessages.ReplyContent);

          /* Send message to the SQS and trigger the PN*/
          const installation: Installations = await this._mongoSvc.readByValue(
            collections.INSTALLATIONS,
            {
              [mongoDbTables.installations.userId]: user.id
            });

          /* TODO: Add the notification pref check here after adding the falg to user collections */
          const notificationMessageBody = (author.role === AdminRole.scadmin)
            ? `${author?.displayTitle} ${NotificationMessages.ReplyContent.toLowerCase()}`
            : NotificationMessages.ReplyAdvocate;
          if (user.active && installation !== null) {
            const notificationData: NotificationQueue = {
              type: NotificationType.COMMENT,
              receiverId: user.id,
              senderId: author.id,
              title: NotificationMessages.ReplyTitle,
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
        commentReplyObj.id = commentReplyObj[mongoDbTables.posts.id];
        delete commentReplyObj[mongoDbTables.posts.id];

        return this.result.createSuccess(commentReplyObj);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async deleteComment(postId: string, commentId: string, adminUser, flag: boolean): Promise<BaseResponse> {
    try {
      const cmntVal = {
        [mongoDbTables.posts.id]: new ObjectID(postId),
        [mongoDbTables.posts.commentId]: new ObjectID(commentId),
        [mongoDbTables.posts.commentFlag]: flag
      };
      if (flag === undefined) {
        delete cmntVal[mongoDbTables.posts.commentFlag];
      }

      const comment: Post = await this._mongoSvc.readByValue(
        collections.POSTS,
        cmntVal
      );
      if (comment === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const commentObject = comment.comments.filter((cmnt) =>
        cmnt[mongoDbTables.posts.id].toString() === commentId
      )[0];

      if (adminUser.role === AdminRole.scadvocate && commentObject.author.id !== adminUser.id) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
        this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedDeleteDetails;
        return this.result.createError(this.result.errorInfo);
      }

      const query = { [mongoDbTables.posts.id]: new ObjectID(postId) };
      const updateSetValue = {
        $set: {
          [mongoDbTables.posts.commentOuterRemoved]: true,
          [mongoDbTables.posts.commentOuterUpdated]: new Date(),
          [mongoDbTables.posts.commentOuterFlag]: false
        }
      };
      const filter = {
        'arrayFilters': [
          { [mongoDbTables.posts.postOuterFilter]: new ObjectID(commentId) }
        ]
      };

      if (commentObject.author.id !== adminUser.id) {
        updateSetValue.$set[mongoDbTables.posts.commentOuterRemovedBy] = adminUser.id;
      }
      await this._mongoSvc.updateByQuery(collections.POSTS, query, updateSetValue, filter);
      const response = new BooleanResponse();
      response.operation = true;

      /* Notify the User when the Admin Deletes the user comment which is flagged */
      const user: User = await this._mongoSvc.readByID(collections.USERS, commentObject.author.id);
      if (user !== null) {
        const handleActivityData: PostActivityArgs = {
          userId: user.id,
          postId: comment.id,
          adminId: adminUser.id,
          commentId: commentId,
          replyId: ''
        };
        await this.postHelperService.handleUserActivityForPost(handleActivityData, NotificationMessages.storyComment, true, LinkedTexts.touText);
      }
      return this.result.createSuccess(response);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async flagComment(payload: ReportComment): Promise<BaseResponse> {
    try {
      const cmntVal = {
        [mongoDbTables.posts.id]: new ObjectID(payload.postId),
        [mongoDbTables.posts.commentId]: new ObjectID(payload.commentId),
        [mongoDbTables.posts.removed]: false
      };
      const comment: Post = await this._mongoSvc.readByValue(
        collections.POSTS,
        cmntVal
      );
      if (comment === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const updateSetValue = {
        $set: {
          [mongoDbTables.posts.commentFlagged]: payload.flagged,
          [mongoDbTables.posts.commentUpdatedAt]: new Date()
        }
      };
      await this._mongoSvc.updateByQuery(collections.POSTS, cmntVal, updateSetValue);
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async addReaction(reactionData: ReactionRequest, admin, isRemove: boolean): Promise<BaseResponse> {
    try {
      const adminUser: AdminUser = await this._mongoSvc.readByID(collections.ADMINUSERS, admin.id);
      if (adminUser === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      // Update the reaction for reply.
      if (reactionData.replyId) {
        const searchFilter = {
          [mongoDbTables.posts.id]: new ObjectID(reactionData.id),
          [mongoDbTables.posts.commentId]: new ObjectID(reactionData.commentId),
          [mongoDbTables.posts.removed]: false,
          [mongoDbTables.posts.comments]: {
            $elemMatch: {
              [mongoDbTables.posts.replies]: {
                $elemMatch: {
                  [mongoDbTables.posts.id]: new ObjectID(reactionData.replyId),
                  [mongoDbTables.posts.removed]: false
                }
              }
            }
          }
        };
        const post = await this._mongoSvc.readByValue(
          collections.POSTS,
          searchFilter
        );
        if (post == null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdDetail;
          this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }

        const commentObjIndex = post.comments.map((value) => {
          return value[mongoDbTables.posts.id].toString();
        }).indexOf(reactionData.commentId);
        const commentObj = post.comments[commentObjIndex];

        const replyObjectIndex = commentObj.replies.map((value) => {
          return value[mongoDbTables.posts.id].toString();
        }).indexOf(reactionData.replyId);
        const replyObj: ReplyModel = post.comments[commentObjIndex].replies[replyObjectIndex];
        const replyReactionObject: Reaction = (replyObj.reactions) ? replyObj.reactions : this.postHelperService.createReactionObject();

        const postAuthor = await this.postHelperService.getCommentAuthor(admin.id, post);

        const filter = {
          'arrayFilters': [
            { [mongoDbTables.posts.postInnerFilter]: replyObj[mongoDbTables.posts.id] },
            { [mongoDbTables.posts.postOuterFilter]: commentObj[mongoDbTables.posts.id] }
          ]
        };
        const result = await this.postHelperService.handleReactions(
          replyObj,
          replyReactionObject,
          reactionData,
          isRemove,
          PostResponse.REPLY,
          post.id,
          postAuthor,
          collections.POSTS,
          replyObj.author.id,
          filter, reactionData.commentId,
          replyObj[mongoDbTables.posts.id].toString());

        const response = new BooleanResponse();
        response.operation = (result) ? true : false;
        return this.result.createSuccess(response);
      }

      // Update reaction for comment
      if (!reactionData.replyId && reactionData.commentId) {
        const searchFilter = {
          [mongoDbTables.posts.id]: new ObjectID(reactionData.id),
          [mongoDbTables.posts.commentId]: new ObjectID(reactionData.commentId),
          [mongoDbTables.posts.removed]: false
        };
        const post = await this._mongoSvc.readByValue(
          collections.POSTS,
          searchFilter
        );
        if (post == null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdDetail;
          this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }

        const commentObjId = post.comments.map((value) => {
          return value[mongoDbTables.posts.id].toString();
        }).indexOf(reactionData.commentId);
        const commentObj: CommentModel = post.comments[commentObjId];
        const commentReactionObject: Reaction = (commentObj.reactions) ? commentObj.reactions : this.postHelperService.createReactionObject();

        const postAuthor = await this.postHelperService.getCommentAuthor(admin.id, post);

        const result = await this.postHelperService.handleReactions(
          commentObj,
          commentReactionObject,
          reactionData,
          isRemove,
          PostResponse.COMMENT,
          post.id,
          postAuthor,
          collections.POSTS,
          commentObj.author.id,
          {},
          commentObj[mongoDbTables.posts.id].toString()
        );

        const response = new BooleanResponse();
        response.operation = (result) ? true : false;
        return this.result.createSuccess(response);
      }

      // Update reaction for post
      if (!reactionData.replyId && !reactionData.commentId && reactionData.id) {
        const searchFilter = {
          [mongoDbTables.posts.id]: new ObjectID(reactionData.id),
          [mongoDbTables.posts.removed]: false
        };
        const post = await this._mongoSvc.readByValue(
          collections.POSTS,
          searchFilter
        );
        if (post == null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdDetail;
          this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }

        const author = await this.postHelperService.getCommentAuthor(admin.id, post);
        const postReactionObject: Reaction = (post.reactions) ? post.reactions : this.postHelperService.createReactionObject();

        const result = await this.postHelperService.handleReactions(post, postReactionObject, reactionData, isRemove, PostResponse.POST, post.id, author, collections.POSTS);

        const response = new BooleanResponse();
        response.operation = (result) ? true : false;
        return this.result.createSuccess(response);
      }

      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async flagPost(postId: string, flagged: boolean): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.posts.id]: new ObjectID(postId),
        [mongoDbTables.posts.removed]: false
      };
      const post: Post = await this._mongoSvc.readByValue(
        collections.POSTS,
        query
      );
      if (post === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const updateSetValue = {
        $set: {
          [mongoDbTables.posts.flagged]: flagged,
          [mongoDbTables.posts.updateDate]: new Date()
        }
      };
      await this._mongoSvc.updateByQuery(collections.POSTS, query, updateSetValue);
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async flagOrDeleteReply(payload: ReportReply, adminUser, isDelete: boolean): Promise<BaseResponse> {
    try {
      const replyQuery = {
        [mongoDbTables.posts.id]: new ObjectID(payload.postId),
        [mongoDbTables.posts.commentId]: new ObjectID(payload.commentId),
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.comments]: {
          $elemMatch: {
            [mongoDbTables.posts.replies]: {
              $elemMatch: {
                [mongoDbTables.posts.id]: new ObjectID(payload.replyId),
                [mongoDbTables.posts.removed]: false
              }
            }
          }
        }
      };
      const reply: Post = await this._mongoSvc.readByValue(
        collections.POSTS,
        replyQuery
      );
      if (reply === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
        return this.result.createError([this.result.errorInfo]);
      }
      const commentData = reply.comments.filter((cmnt) =>
        cmnt[mongoDbTables.posts.id].toString() === payload.commentId)[0];
      const replyData = commentData.replies.filter((rply) =>
        rply[mongoDbTables.posts.id].toString() === payload.replyId)[0];

      const query = {
        [mongoDbTables.posts.id]: new ObjectID(payload.postId)
      };
      let setValue = {};
      if (isDelete) {
        if (adminUser.role === AdminRole.scadvocate && replyData.author.id !== adminUser.id) {
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
          this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedDeleteDetails;
          return this.result.createError(this.result.errorInfo);
        }
        setValue = {
          $set: {
            [mongoDbTables.posts.replyFlagged]: false,
            [mongoDbTables.posts.replyRemoved]: true,
            [mongoDbTables.posts.postDateFilter]: new Date()
          }
        };
        if (replyData.author.id !== adminUser.id) {
          setValue = {
            $set: {
              [mongoDbTables.posts.replyFlagged]: false,
              [mongoDbTables.posts.replyRemoved]: true,
              [mongoDbTables.posts.postDateFilter]: new Date(),
              [mongoDbTables.posts.replyRemovedBy]: adminUser.id
            }
          };
        }
      } else {
        setValue = {
          $set: {
            [mongoDbTables.posts.replyFlagged]: payload.flagged,
            [mongoDbTables.posts.postDateFilter]: new Date()
          }
        };
      }
      const filter = {
        'arrayFilters': [
          { [mongoDbTables.posts.postOuterFilter]: new ObjectID(payload.commentId) },
          { [mongoDbTables.posts.postInnerFilter]: new ObjectID(payload.replyId) }
        ]
      };
      const result = await this._mongoSvc.updateByQuery(collections.POSTS, query, setValue, filter);
      const response = new BooleanResponse();
      response.operation = (result) ? true : false;

      /* Notify the User when the Admin Deletes the user reply which is flagged */
      const user: User = await this._mongoSvc.readByID(collections.USERS, replyData.author.id);
      if (isDelete && user !== null) {
        const handleActivityData: PostActivityArgs = {
          userId: user.id,
          postId: reply.id,
          adminId: adminUser.id,
          commentId: payload.commentId,
          replyId: payload.replyId
        };
        await this.postHelperService.handleUserActivityForPost(handleActivityData, NotificationMessages.storyReply, true, LinkedTexts.touText);
      }
      return this.result.createSuccess(response);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public moderationOnFieldLevel(field: string, value: string, validationDetails: ValidationModel) {
    // Check for bad words
    if (StringUtils.isModerated(value)) {
      validationDetails.isBadWord = true;
      validationDetails.errorFields.push(field);
    }

    return validationDetails;

  }

  public async formateComments(post: Post, commentAuthors?, replyAuthors?, adminUsers?) {
    const projection = {
      'projection': {
        [mongoDbTables.adminUser.id]: true,
        [mongoDbTables.adminUser.displayTitle]: true,
        [mongoDbTables.adminUser.displayName]: true,
        [mongoDbTables.adminUser.firstName]: true,
        [mongoDbTables.adminUser.lastName]: true
      }
    };
    adminUsers = adminUsers ?? await this._mongoSvc.readAllByValue(collections.ADMINUSERS, {}, {}, null, null, projection);

    const filteredComments = [];
    if (post.comments ?? false) {
      for (const comment of post.comments) {
        if (comment.replies ?? false) {
          const filteredReplies = [];
          for (const reply of comment.replies) {
            if (reply.removedBy) {
              const processedReply = await this.postHelperService.modifyToRemovedComment(reply, PostResponse.REPLY);
              filteredReplies.push(processedReply);
            } else if (!reply.removed) {
              filteredReplies.push(reply);
            }
            if (replyAuthors) {
              this.postHelperService.addUserAuthor(filteredReplies, replyAuthors, adminUsers);
            }
            comment.replies = filteredReplies;
          }
        }
        if (comment.removedBy) {
          filteredComments.push(await this.postHelperService.modifyToRemovedComment(comment, PostResponse.COMMENT));
        } else if (!comment.removed) {
          filteredComments.push(comment);
        }
      }
      if (commentAuthors) {
        this.postHelperService.addUserAuthor(filteredComments, commentAuthors, adminUsers);
      }
    }
    post.comments = filteredComments;

    return post;
  }

  private async handleSchedulePost(post: Post, payload: PostRequest, admin) {
    if (payload.publishOn) {
      const jobData = {
        publishOn: new Date(payload.publishOn),
        postId: post.id,
        adminId: admin.id,
        published: post.published,
        isNotify: post.isNotify,
        isKeyword: false,
        isSent: false
      };
      await this.scheduler.schedulePostJob(jobData);
    }

    // ToDo: Schedule the Poll Closing PN scheduler also.
    if (post.content?.en?.poll && post.content?.en?.poll?.question) {
      await this.postHelperService.postPollClosingSoon(post);
      await this.postHelperService.postPollClose(post);
    }

    // If the newPost is published, then update the activity and trigger the PN
    await this.postHelperService.upsertPostHelper(post, payload, true);
  }

  private checkModeration(payload: PostRequest) {
    // Content moderation for the Post Content.
    const validationDetails = new ValidationModel();
    validationDetails.errorFields = [];

    this.moderationOnFieldLevel(
      mongoDbTables.posts.body,
      this.validation.convertHtmlToPlainText(payload.content.en.body),
      validationDetails
    );
    this.moderationOnFieldLevel(
      mongoDbTables.posts.title,
      payload.content.en.title,
      validationDetails
    );

    if (payload.content.pnDetails) {
      this.moderationOnFieldLevel(mongoDbTables.posts.pnBody, payload.content.pnDetails.body, validationDetails);
      this.moderationOnFieldLevel(mongoDbTables.posts.pnTitle, payload.content.pnDetails.title, validationDetails);
    }
    return validationDetails;
  }

  private async setPostImage(post) {
    const image = await this.imageService.getPostImage(post.id);
    if (image) {
      if (image.isLinkImage) {
        post.content.link.imageBase64 = image.postImageBase64;
      }
      else {
        post.content.image = image.postImageBase64;
      }
    }
  }

  private async updatePost(payload: PostRequest, admin: AdminUser, validationResult: ValidationModel) {
    try {
      let post: Post = await this._mongoSvc.readByValue(
        collections.POSTS,
        {
          [mongoDbTables.posts.removed]: false,
          [mongoDbTables.posts.id]: new ObjectID(payload.id)
        }
      );
      if (post === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const setData: SetQuery = {
        '$set': {
          [mongoDbTables.posts.communities]: payload.communities,
          [mongoDbTables.posts.contentEn]: payload.content.en,
          [mongoDbTables.posts.contentEs]: payload.content.es,
          [mongoDbTables.posts.updateDate]: new Date(),
          [mongoDbTables.posts.published]: payload.published,
          [mongoDbTables.posts.isNotify]: payload.isNotify,
          [mongoDbTables.posts.updatedBy]: admin.id,
          [mongoDbTables.posts.link]: payload.content?.link,
          [mongoDbTables.posts.publishOn]: payload.publishOn,
          [mongoDbTables.posts.status]: this.postHelperService.getPostStatus(payload)
        }
      };
      setData.$set[mongoDbTables.posts.author] = (payload.author) ? await this.postHelperService.getAuthor(payload, admin) : post.author;
      // Store the image in PostImages.
      await this.imageService.postImageHandler(payload.id, payload.content.image, false, (payload.content.image ? false : true));

      // Post Link Images Update
      if (payload.content?.link?.isImageUploaded) {
        await this.imageService.postImageHandler(payload.id, payload.content.link.imageBase64, false, false, true);
      } else {
        if (post.content?.link?.imageBase64) {
          await this.imageService.postImageHandler(payload.id, payload.content?.link?.imageBase64, false, true, true);
        }
      }
      /* If the post is edited after publish */
      if (payload.published && post.hasContentBeenPublishedOnce) {
        setData.$set.editedAfterPublish = true;
      } else {
        setData.$set[mongoDbTables.posts.pnDetails] = payload.content.pnDetails;
      }

      const oldStatus = post.status;
      post = await this._mongoSvc.findAndUpdateOne(collections.POSTS, {
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.id]: new ObjectID(payload.id)
      }, setData);

      /* If the post is published, then update the activity and trigger the PN */
      this.postHelperService.upsertPostHelper(post, payload, false);

      post = await this._mongoSvc.readByID(collections.POSTS, post.id);
      await this.postHelperService.postStatus(
        post,
        oldStatus,
        this.postHelperService.getPostStatus(payload),
        payload,
        admin.id
      );
      await this.setPostImage(post);
      this.postHelperService.updateBinderPost(post);
      return this.result.createSuccess(post);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
