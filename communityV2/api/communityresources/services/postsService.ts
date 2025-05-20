import {
  AdminRole,
  API_RESPONSE,
  collections,
  mongoDbTables,
  NotificationMessages,
  NotificationType,
  PostResponse,
  queryStrings,
  REACTIONS,
  reactionsType,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { Admin } from '../models/adminUserModel';
import { Community } from '../models/communitiesModel';
import { NotificationContentType } from '../models/notificationModel';
import { PageParam } from '../models/pageParamModel';
import {
  ActivityAuthor,
  AdminActivity,
  AdminActivityList,
  CommentAuthor,
  CommentModel,
  CommentRequest,
  DeleteCommentRequest,
  FlaggedUserLog,
  Post,
  ReactionRequest,
  ReplyRequest
} from '../models/postsModel';
import { Reaction, ReactionLog } from '../models/reactionModel';
import { BaseResponse } from '../models/resultModel';
import { BooleanResponse } from '../models/storyModel';
import { User } from '../models/userModel';
import { EmailService } from './emailService';
import { CommentHelper } from './helpers/commentHelper';
import { NotificationHelper } from './helpers/notificationHelper';
import { PostsHelper } from './helpers/postsHelper';
import { ReactionHelper } from './helpers/reactionHelper';
import { UserHelper } from './helpers/userHelper';
import { PollService } from './pollService';
import { PostImageService } from './postImageService';

@Service()
export class PostsService {
  postsHelper = Container.get(PostsHelper);
  reactionHelper = Container.get(ReactionHelper);
  pollService = Container.get(PollService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private emailService: EmailService,
    private validate: Validation,
    private postImageService: PostImageService,
    private userService: UserHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getAllPosts(
    pageParams: PageParam,
    published: boolean,
    userId: string,
    language: string
  ): Promise<BaseResponse> {
    try {
      const filter = {
        flagged: false,
        removed: false,
        published: published
      };

      const sort = {
        publishedAt: -1
      };

      const limit = pageParams.pageSize;
      const skip = pageParams.pageSize * (pageParams.pageNumber - 1);

      const posts: Post[] = await this._mongoSvc.readAllByValue(
        collections.POSTS,
        filter,
        sort,
        limit,
        skip
      );

      for (const post of posts) {
        await this.postImageService.setPostImage(post);
        await this.postsHelper.formatPosts(post, userId, language);
      }
      return this.result.createSuccess(posts);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAllPostsForCommunity(
    pageParams: PageParam,
    published: boolean,
    userId: string,
    communityId: string,
    language: string
  ): Promise<BaseResponse> {
    try {
      let filter = {};
      if (communityId === 'null') {
        filter = {
          flagged: false,
          removed: false,
          published: published
        };
      } else {
        filter = {
          flagged: false,
          removed: false,
          published: published,
          communities: {
            $in: [communityId]
          }
        };
      }

      const sort = {
        publishedAt: -1
      };

      const limit = pageParams.pageSize;
      const skip = pageParams.pageSize * (pageParams.pageNumber - 1);

      const posts: Post[] = await this._mongoSvc.readAllByValue(
        collections.POSTS,
        filter,
        sort,
        limit,
        skip
      );

      for (const post of posts) {
        await this.postImageService.setPostImage(post);
        await this.postsHelper.formatPosts(post, userId, language);
        if (
          post.content[mongoDbTables.posts.poll] &&
          post.content[mongoDbTables.posts.poll].question !== ''
        ) {
          await this.pollService.calculatePollResult(post, userId);
        }
      }

      return this.result.createSuccess(posts);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPostById(
    id: string,
    userId: string,
    language: string
  ): Promise<BaseResponse> {
    try {
      const query = {
        $match: {
          [mongoDbTables.posts.id]: new ObjectId(id),
          flagged: false,
          removed: false,
          published: true
        }
      };

      const commentLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.posts.commentAuthorId,
          foreignField: mongoDbTables.posts.id,
          as: mongoDbTables.posts.commentAuthors
        }
      };

      const replyLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.posts.replyAuthorId,
          foreignField: mongoDbTables.posts.id,
          as: mongoDbTables.posts.replyAuthors
        }
      };

      const post: Post[] = await this._mongoSvc.readByAggregate(
        collections.POSTS,
        [query, commentLookup, replyLookup]
      );

      if (!post || post.length < 1) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      let newPost = await this.buildPostObject(post[0], userId, language);
      if (
        newPost.content[mongoDbTables.posts.poll] &&
        newPost.content[mongoDbTables.posts.poll].question !== ''
      ) {
        newPost = await this.pollService.calculatePollResult(newPost, userId);
      }
      await this.postImageService.setPostImage(newPost);
      return this.result.createSuccess(newPost);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async upsertComment(
    payload: CommentRequest,
    authorId: string
  ): Promise<BaseResponse> {
    try {
      const post = await this._mongoSvc.readByID(
        collections.POSTS,
        payload.postId
      );
      if (post === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const commQuery = {
        [mongoDbTables.community.id]: new ObjectId(post.communities[0])
      };
      const community: Community = await this._mongoSvc.readByValue(
        collections.COMMUNITY,
        commQuery
      );

      if (payload.id) {
        const updateQuery = {
          [mongoDbTables.posts.id]: new ObjectId(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectId(payload.id)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.posts.commentMsg]: payload.comment,
            [mongoDbTables.posts.isCommentProfane]:
              payload.isCommentTextProfane,
            [mongoDbTables.posts.commentUpdatedAt]: new Date()
          }
        };
        const updatedCount = await this._mongoSvc.updateByQuery(
          collections.POSTS,
          updateQuery,
          updateSetValue
        );
        if (updatedCount === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.commentDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const response = new BooleanResponse();
        response.operation = true;
        this.checkForKeyWords(
          payload.comment,
          community?.title,
          post.author.id,
          post.content.en.title,
          authorId,
          payload.postId,
          PostResponse.COMMENT,
          payload.id
        );
        return this.result.createSuccess(response);
      }
      // New comment
      const commentObj = await this.createCommentObject(payload, authorId);
      delete commentObj.postId;
      const query = { [mongoDbTables.posts.id]: new ObjectId(payload.postId) };
      const setValue = { $addToSet: { comments: commentObj } };
      await this._mongoSvc.updateByQuery(collections.POSTS, query, setValue);

      /* Send email message if comment's author is an admin */
      const adminQuery = {
        [mongoDbTables.adminUser.id]: new ObjectId(post.author.id)
      };
      const adminUser: Admin = await this._mongoSvc.readByValue(
        collections.ADMINUSERS,
        adminQuery
      );

      if (adminUser !== null) {
        /* update admin activity */
        await this.createActivityObject(
          adminUser.id,
          authorId,
          reactionsType[1],
          `${API_RESPONSE.messages.postComment}: ${post.content.en.title}`,
          false,
          payload.postId,
          null,
          commentObj[mongoDbTables.posts.id].toHexString()
        );

        const html = this.emailService.htmlForComment(
          payload.postId,
          APP.config.smtpSettings.adminUrl
        );
        this.emailService.sendEmailMessage(
          APP.config.smtpSettings,
          APP.config.smtpSettings.adminEmail,
          `${API_RESPONSE.messages.commentSubject} ${community?.title} community`,
          html
        );
      }

      // CCX-7277: Notify other admins as well related to the user reponse.
      const admins: Admin[] = await this._mongoSvc.readAllByValue(
        collections.ADMINUSERS,
        {
          [mongoDbTables.adminUser.active]: true,
          [mongoDbTables.adminUser.id]: { $nin: [new ObjectId(adminUser.id)] },
          [mongoDbTables.adminUser.communities]: { $in: [community.id] }
        }
      );
      const member = await this._mongoSvc.readByID(collections.USERS, authorId);
      admins.forEach(async (admin) => {
        const adminName =
          adminUser.displayName === '' || adminUser.displayName === null
            ? adminUser.firstName
            : adminUser.displayName;
        await this.createActivityObject(
          admin.id,
          authorId,
          reactionsType[1],
          `${member?.displayName} commented on ${adminName}'s post: ${post.content.en.title}`,
          false,
          payload.postId,
          null,
          commentObj[mongoDbTables.posts.id].toHexString()
        );
      });

      // Add the activity line to the Admin when the keywords are used.
      this.checkForKeyWords(
        payload.comment,
        community?.title,
        post.author.id,
        post.content.en.title,
        authorId,
        payload.postId,
        PostResponse.COMMENT,
        commentObj[mongoDbTables.posts.id].toHexString()
      );
      commentObj.id = commentObj[mongoDbTables.posts.id];
      delete commentObj[mongoDbTables.posts.id];
      return this.result.createSuccess(commentObj);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async upsertReaction(
    payload: ReactionRequest,
    isRemove: boolean,
    userId: string
  ): Promise<BaseResponse> {
    try {
      let result = null;
      switch (payload.type) {
        case reactionsType[0]:
          result = await this.upsertPostReaction(payload, isRemove, userId);
          break;
        case reactionsType[1]:
          result = await this.upsertCommentReaction(payload, isRemove, userId);
          break;
        case reactionsType[2]:
          result = await this.upsertReplyReaction(payload, isRemove, userId);
          break;
        default:
          break;
      }
      if (!result.operation) {
        return this.result.createError([this.result.errorInfo]);
      }
      const query = {
        $match: {
          [mongoDbTables.posts.id]: new ObjectId(payload.postId),
          removed: false
        }
      };
      const commentLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.posts.commentAuthorId,
          foreignField: mongoDbTables.posts.id,
          as: mongoDbTables.posts.commentAuthors
        }
      };
      const replyLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.posts.replyAuthorId,
          foreignField: mongoDbTables.posts.id,
          as: mongoDbTables.posts.replyAuthors
        }
      };

      const newPost: Post[] = await this._mongoSvc.readByAggregate(
        collections.POSTS,
        [query, commentLookup, replyLookup]
      );
      if (!payload.language) {
        payload.language = TranslationLanguage.ENGLISH;
      }
      await this.buildPostObject(newPost[0], userId, payload.language);
      return this.result.createSuccess(newPost);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async upsertReply(
    payload: ReplyRequest,
    authorId: string
  ): Promise<BaseResponse> {
    try {
      const post: Post = await this._mongoSvc.readByValue(collections.POSTS, {
        [mongoDbTables.posts.removed]: false,
        [mongoDbTables.posts.id]: new ObjectId(payload.postId)
      });
      const community: Community = await this._mongoSvc.readByID(
        collections.COMMUNITY,
        post.communities[0]
      );
      if (payload.id) {
        const queryData = {
          [mongoDbTables.posts.id]: new ObjectId(payload.postId)
        };
        const setValueObj = {
          $set: {
            [mongoDbTables.posts.postCommentFilter]: payload.comment,
            [mongoDbTables.posts.isReplyProfane]: payload.isCommentTextProfane,
            [mongoDbTables.posts.postDateFilter]: new Date()
          }
        };
        const filter = {
          arrayFilters: [
            {
              [mongoDbTables.posts.postOuterFilter]: new ObjectId(
                payload.commentId
              )
            },
            { [mongoDbTables.posts.postInnerFilter]: new ObjectId(payload.id) }
          ]
        };
        const result = await this._mongoSvc.updateByQuery(
          collections.POSTS,
          queryData,
          setValueObj,
          filter
        );
        if (result === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.commentFailure;
          return this.result.createError([this.result.errorInfo]);
        }
        const response = new BooleanResponse();
        response.operation = result ? true : false;
        this.checkForKeyWords(
          payload.comment,
          community?.title,
          post.author.id,
          post.content.en.title,
          authorId,
          payload.postId,
          PostResponse.REPLY,
          payload.commentId,
          payload.id
        );
        return this.result.createSuccess(response);
      }
      const commentReplyObj = await this.createCommentObject(payload, authorId);
      delete commentReplyObj.postId;
      const query = {
        [mongoDbTables.posts.id]: new ObjectId(payload.postId),
        [mongoDbTables.posts.commentId]: new ObjectId(payload.commentId)
      };
      const setValue = {
        $addToSet: { [mongoDbTables.posts.postReplies]: commentReplyObj }
      };
      const updateCount = await this._mongoSvc.updateByQuery(
        collections.POSTS,
        query,
        setValue
      );
      if (updateCount === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentFailure;
        return this.result.createError([this.result.errorInfo]);
      }

      /* Notify Admin if the reply is for the Admin Comment */
      const commentObj = post.comments.filter(
        (r) => r[mongoDbTables.posts.id].toString() === payload.commentId
      )[0];
      const adminUser: Admin = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        commentObj.author.id.toString()
      );
      if (adminUser !== null) {
        /* update admin activity */
        await this.createActivityObject(
          adminUser.id,
          authorId,
          reactionsType[2],
          `${API_RESPONSE.messages.replyComment}`,
          false,
          payload.postId,
          null,
          payload.commentId,
          commentReplyObj[mongoDbTables.posts.id].toHexString()
        );

        // CCX-7277: Notify other admins as well related to the user reponse.
        if (adminUser.role === AdminRole.scadvocate) {
          const admins: Admin[] = await this._mongoSvc.readAllByValue(
            collections.ADMINUSERS,
            {
              [mongoDbTables.adminUser.active]: true,
              [mongoDbTables.adminUser.id]: {
                $nin: [new ObjectId(adminUser.id)]
              },
              [mongoDbTables.adminUser.communities]: { $in: post.communities }
            }
          );
          const member = await this._mongoSvc.readByID(
            collections.USERS,
            authorId
          );
          admins.forEach(async (admin) => {
            const adminName =
              adminUser.displayName === '' || adminUser.displayName === null
                ? adminUser.firstName
                : adminUser.displayName;
            await this.createActivityObject(
              admin.id,
              authorId,
              reactionsType[2],
              `${member.displayName} replied to ${adminName} comment`,
              false,
              payload.postId,
              null,
              payload.commentId,
              commentReplyObj[mongoDbTables.posts.id].toHexString()
            );
          });
        }

        const html = this.emailService.htmlForReply(
          payload.postId,
          APP.config.smtpSettings.adminUrl
        );
        this.emailService.sendEmailMessage(
          APP.config.smtpSettings,
          APP.config.smtpSettings.adminEmail,
          `${API_RESPONSE.messages.replySubject} ${community?.title} community`,
          html
        );
      }

      await Container.get(NotificationHelper).notifyUser(
        NotificationContentType.POST,
        commentObj.author.id.toString(),
        authorId,
        post.id,
        {
          title: NotificationMessages.UserReplyTitle,
          body: NotificationMessages.UserReplyBody
        },
        NotificationMessages.UserReplyContent,
        PostResponse.COMMENT,
        payload.commentId,
        NotificationType.REPLY,
        commentReplyObj[mongoDbTables.posts.id].toString()
      );
      this.checkForKeyWords(
        payload.comment,
        community?.title,
        post.author.id,
        post.content.en.title,
        authorId,
        payload.postId,
        PostResponse.REPLY,
        payload.commentId,
        commentReplyObj[mongoDbTables.posts.id].toHexString()
      );
      commentReplyObj.id = commentReplyObj[mongoDbTables.posts.id];
      delete commentReplyObj[mongoDbTables.posts.id];
      return this.result.createSuccess(commentReplyObj);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removeComment(
    request: DeleteCommentRequest,
    userId: string
  ): Promise<BaseResponse> {
    try {
      const post = await this._mongoSvc.readByID(
        collections.POSTS,
        request.postId
      );
      if (post === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const comment = post.comments.filter(
        (c) => c[mongoDbTables.posts.id].toString() === request.commentId
      )[0];

      if (request.replyId) {
        //Validate Author
        const reply = comment.replies.filter(
          (r) => r[mongoDbTables.posts.id].toString() === request.replyId
        )[0];
        if (reply && reply.author.id.toString() !== userId) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.notTheAuthor;
          return this.result.createError([this.result.errorInfo]);
        }
        //Update reply
        const updateQuery = {
          [mongoDbTables.posts.id]: new ObjectId(request.postId)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.posts.replyRemoved]: true,
            [mongoDbTables.posts.replyUpdatedAt]: new Date()
          }
        };
        const arrayFilters = {
          [queryStrings.arrayFilters]: [
            {
              [mongoDbTables.posts.postOuterFilter]: new ObjectId(
                request.commentId
              )
            },
            {
              [mongoDbTables.posts.postInnerFilter]: new ObjectId(
                request.replyId
              )
            }
          ]
        };
        const responseCount = await this._mongoSvc.updateByQuery(
          collections.POSTS,
          updateQuery,
          updateSetValue,
          arrayFilters
        );
        if (responseCount === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }
      } else {
        if (comment.author.id.toString() !== userId) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.notTheAuthor;
          return this.result.createError([this.result.errorInfo]);
        }
        // delete comment
        const updateQuery = {
          [mongoDbTables.posts.id]: new ObjectId(request.postId),
          [mongoDbTables.posts.commentId]: new ObjectId(request.commentId)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.posts.commentRemoved]: true,
            [mongoDbTables.posts.commentUpdatedAt]: new Date()
          }
        };
        const updateResult = await this._mongoSvc.updateByQuery(
          collections.POSTS,
          updateQuery,
          updateSetValue
        );
        if (updateResult === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }
      }
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async reportComment(
    payload: DeleteCommentRequest,
    userId: string
  ): Promise<BaseResponse> {
    try {
      const userLog: FlaggedUserLog = {
        userId: userId,
        createdDate: new Date()
      };
      if (payload.replyId) {
        //Validate reply
        const replyPost = await this.getReplyPost(
          payload.postId,
          payload.commentId,
          payload.replyId
        );
        if (replyPost === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }
        //Set query to add user log based on the availability
        const comment = replyPost.comments.filter(
          (c) => c[mongoDbTables.posts.id].toString() === payload.commentId
        )[0];
        const reply = comment.replies.filter(
          (r) => r[mongoDbTables.posts.id].toString() === payload.replyId
        )[0];
        let updateSetValue;
        if (reply.flaggedUserLog === undefined) {
          updateSetValue = {
            $set: {
              [mongoDbTables.posts.replyFlagged]: true,
              [mongoDbTables.posts.replyUpdatedAt]: new Date(),
              [mongoDbTables.posts.replyFlaggedLog]: [userLog]
            }
          };
        } else {
          updateSetValue = {
            $set: {
              [mongoDbTables.posts.replyFlagged]: true,
              [mongoDbTables.posts.replyUpdatedAt]: new Date()
            }
          };
          if (!this.hasUserFlagged(reply.flaggedUserLog, userId)) {
            updateSetValue['$push'] = {
              [mongoDbTables.posts.replyFlaggedLog]: userLog
            };
          }
        }
        const updateQuery = {
          [mongoDbTables.posts.id]: new ObjectId(payload.postId)
        };

        const arrayFilters = {
          [queryStrings.arrayFilters]: [
            {
              [mongoDbTables.posts.postOuterFilter]: new ObjectId(
                payload.commentId
              )
            },
            {
              [mongoDbTables.posts.postInnerFilter]: new ObjectId(
                payload.replyId
              )
            }
          ]
        };

        //Update reply
        await this._mongoSvc.updateByQuery(
          collections.POSTS,
          updateQuery,
          updateSetValue,
          arrayFilters
        );
        const commQuery = {
          [mongoDbTables.community.id]: new ObjectId(replyPost.communities[0])
        };
        const community: Community = await this._mongoSvc.readByValue(
          collections.COMMUNITY,
          commQuery
        );
        /* update admin activity */
        const commentData = replyPost.comments.filter(
          (c) => c[mongoDbTables.posts.id].toString() === payload.commentId
        )[0];
        const replyData = commentData.replies.filter(
          (c) => c[mongoDbTables.posts.id].toString() === payload.replyId
        )[0];
        const admin = await this._mongoSvc.readByID(
          collections.ADMINUSERS,
          replyData.author.id
        );
        const message =
          admin === null
            ? API_RESPONSE.messages.flaggedCommentBody
            : API_RESPONSE.messages.flaggedAdminCommentBody;
        const receiver = admin === null ? replyPost.author.id : admin.id;
        await this.createActivityObject(
          receiver,
          userId,
          reactionsType[2],
          message,
          true,
          payload.postId,
          null,
          payload.commentId,
          payload.replyId
        );
        const html = this.emailService.htmlForFlagComment(
          payload.postId,
          APP.config.smtpSettings.adminUrl,
          reactionsType[2]
        );
        this.emailService.sendEmailMessage(
          APP.config.smtpSettings,
          APP.config.smtpSettings.flagReviewEmail,
          `${API_RESPONSE.messages.flaggedReply} ${community?.title} community`,
          html
        );
      } else {
        const query = {
          [mongoDbTables.posts.removed]: false,
          [mongoDbTables.posts.id]: new ObjectId(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectId(payload.commentId)
        };
        const commentPost = await this._mongoSvc.readByValue(
          collections.POSTS,
          query
        );
        if (commentPost === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.commentDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const comment = commentPost.comments.filter(
          (c) => c[mongoDbTables.posts.id].toString() === payload.commentId
        )[0];

        let updateSetValue;
        if (comment.flaggedUserLog === undefined) {
          updateSetValue = {
            $set: {
              [mongoDbTables.posts.commentFlagged]: true,
              [mongoDbTables.posts.commentUpdatedAt]: new Date(),
              [mongoDbTables.posts.commentFlaggedLog]: [userLog]
            }
          };
        } else {
          updateSetValue = {
            $set: {
              [mongoDbTables.posts.commentFlagged]: true,
              [mongoDbTables.posts.commentUpdatedAt]: new Date()
            }
          };
          if (!this.hasUserFlagged(comment.flaggedUserLog, userId)) {
            updateSetValue['$push'] = {
              [mongoDbTables.posts.commentFlaggedLog]: userLog
            };
          }
        }
        //flag comment
        const updateQuery = {
          [mongoDbTables.posts.id]: new ObjectId(payload.postId),
          [mongoDbTables.posts.commentId]: new ObjectId(payload.commentId)
        };

        await this._mongoSvc.updateByQuery(
          collections.POSTS,
          updateQuery,
          updateSetValue
        );
        const commQuery = {
          [mongoDbTables.community.id]: new ObjectId(
            commentPost.communities[0]
          )
        };
        const community: Community = await this._mongoSvc.readByValue(
          collections.COMMUNITY,
          commQuery
        );
        /* update admin activity */
        const commentData = commentPost.comments.filter(
          (c) => c[mongoDbTables.posts.id].toString() === payload.commentId
        )[0];
        const admin = await this._mongoSvc.readByID(
          collections.ADMINUSERS,
          commentData.author.id
        );
        const message =
          admin === null
            ? API_RESPONSE.messages.flaggedCommentBody
            : API_RESPONSE.messages.flaggedAdminCommentBody;
        const receiver = admin === null ? commentPost.author.id : admin.id;
        await this.createActivityObject(
          receiver,
          userId,
          reactionsType[1],
          message,
          true,
          payload.postId,
          null,
          payload.commentId
        );
        const html = this.emailService.htmlForFlagComment(
          payload.postId,
          APP.config.smtpSettings.adminUrl,
          reactionsType[1]
        );
        this.emailService.sendEmailMessage(
          APP.config.smtpSettings,
          APP.config.smtpSettings.flagReviewEmail,
          `${API_RESPONSE.messages.flaggedComment} ${community?.title} community`,
          html
        );
      }
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async checkForKeyWords(
    comment: string,
    communityName: string,
    authorId: string,
    postTitle: string,
    userId: string,
    postId: string,
    type: string,
    commentId?: string,
    replyId?: string
  ) {
    if (this.validate.identifySpecialKeyWords(comment)) {
      const html = this.emailService.htmlForKeywords(
        postId,
        APP.config.smtpSettings.adminUrl
      );
      this.emailService.sendEmailMessage(
        APP.config.smtpSettings,
        APP.config.smtpSettings.flagReviewEmail,
        `${API_RESPONSE.messages.keyWordPublished} ${communityName} community`,
        html
      );
      const message =
        NotificationMessages.AdminActivityLineForKeyWord + ' ' + postTitle;
      await this.createActivityObject(
        authorId,
        userId,
        type,
        message,
        true,
        postId,
        null,
        commentId,
        replyId
      );
    }
  }

  public async createActivityObject(
    adminId: string,
    userId: string,
    type: string,
    title: string,
    isFlagged: boolean,
    postId?: string,
    storyId?: string,
    commentId?: string,
    replyId?: string,
    reactionType?: string
  ) {
    const obj = new AdminActivity();
    obj.userId = adminId;
    obj.list = [];
    const list = new AdminActivityList();
    list[mongoDbTables.posts.id] = new ObjectId();
    list.author = await this.getUser(userId);
    list.postId = postId;
    list.storyId = storyId;
    list.commentId = commentId;
    list.replyId = replyId;
    list.reactionType = reactionType;
    list.entityType = type;
    list.isRead = false;
    list.isRemoved = false;
    list.isFlagged = isFlagged;
    list.title = title;
    list.createdAt = new Date();
    list.updatedAt = new Date();
    obj.list.push(list);

    const actQuery = { [mongoDbTables.adminActivity.userId]: adminId };
    const activity: AdminActivity = await this._mongoSvc.readByValue(
      collections.ADMINACTIVITY,
      actQuery
    );
    if (activity) {
      const updateSetValue = {
        $push: {
          [mongoDbTables.adminActivity.list]: list
        }
      };
      await this._mongoSvc.updateByQuery(
        collections.ADMINACTIVITY,
        actQuery,
        updateSetValue
      );
    } else {
      await this._mongoSvc.insertValue(collections.ADMINACTIVITY, obj);
    }
  }

  private async createCommentObject(request, authorId: string) {
    const cmnt = new CommentModel();
    cmnt[mongoDbTables.posts.id] = new ObjectId();

    const user: User = await this._mongoSvc.readByID(
      collections.USERS,
      authorId
    );
    const author = new CommentAuthor();
    author.id = new ObjectId(authorId);
    author.displayName = user.displayName;

    cmnt.comment = request.comment;
    cmnt.createdAt = new Date();
    cmnt.updatedAt = new Date();
    cmnt.flagged = false;
    cmnt.removed = false;
    cmnt.isCommentTextProfane = request.isCommentTextProfane;
    cmnt.author = author;
    return cmnt;
  }

  private async handleReactions(
    postReaction: Reaction,
    reactionRequest: ReactionRequest,
    objIndex: number,
    isRemove: boolean,
    userId: string,
    adminUserId: string,
    post: Post
  ) {
    postReaction = Container.get(ReactionHelper).updateReactionObject(
      postReaction,
      objIndex,
      reactionRequest.reaction,
      isRemove
    );
    if (objIndex === -1 && !isRemove) {
      const r = new ReactionLog();
      r.userId = userId;
      r.reaction = reactionRequest.reaction;
      r.createdDate = new Date();
      r.updatedDate = new Date();
      postReaction.log.push(r);
    }

    /* Handle Admin user Activity based on the user action on reactions */
    if (objIndex !== -1 && isRemove) {
      await this.handleAdminActivity(
        post,
        adminUserId,
        userId,
        true,
        false,
        reactionRequest
      );
    }

    if (objIndex !== -1 && !isRemove) {
      await this.handleAdminActivity(
        post,
        adminUserId,
        userId,
        false,
        true,
        reactionRequest
      );
    }
    return postReaction;
  }

  private async getUser(userId: string): Promise<ActivityAuthor> {
    const author = new ActivityAuthor();
    const user = await this._mongoSvc.readByID(collections.USERS, userId);
    author.id = user.id;
    author.displayName = user.displayName;
    author.profilePicture = user.profilePicture;
    return author;
  }

  private async getReplyPost(
    postId: string,
    commentId: string,
    replyId: string
  ) {
    const query = {
      [mongoDbTables.posts.id]: new ObjectId(postId),
      [mongoDbTables.posts.comments]: {
        [queryStrings.elemMatch]: {
          [mongoDbTables.posts.id]: new ObjectId(commentId),
          [mongoDbTables.posts.replies]: {
            [queryStrings.elemMatch]: {
              [mongoDbTables.posts.id]: new ObjectId(replyId)
            }
          }
        }
      }
    };
    const replyObj = await this._mongoSvc.readByValue(collections.POSTS, query);
    return replyObj;
  }

  private async upsertReplyReaction(
    payload: ReactionRequest,
    isRemove: boolean,
    userId: string
  ): Promise<BooleanResponse> {
    const replyObj = await this.getReplyPost(
      payload.postId,
      payload.commentId,
      payload.replyId
    );
    const response = new BooleanResponse();
    if (replyObj === null) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
      response.operation = false;
      return response;
    }
    const replyCommentObj = replyObj.comments.filter(
      (c) => c[mongoDbTables.posts.id].toString() === payload.commentId
    )[0];
    const reply = replyCommentObj.replies.filter(
      (r) => r[mongoDbTables.posts.id].toString() === payload.replyId
    )[0];

    let replyReaction: Reaction = reply.reactions
      ? reply.reactions
      : this.reactionHelper.createReactionObject();
    const replyIndex = replyReaction.log.findIndex(
      (reactions) => reactions.userId === userId
    );
    if (replyIndex === -1 && isRemove) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
      response.operation = false;
      return response;
    }
    replyReaction = await this.handleReactions(
      replyReaction,
      payload,
      replyIndex,
      isRemove,
      userId,
      reply.author.id,
      replyObj
    );
    const updateQuery = {
      [mongoDbTables.posts.id]: new ObjectId(payload.postId)
    };
    const updateSetValue = {
      $set: {
        [mongoDbTables.posts.replyReactions]: replyReaction,
        [mongoDbTables.posts.replyUpdatedAt]: new Date()
      }
    };
    const arrayFilters = {
      [queryStrings.arrayFilters]: [
        {
          [mongoDbTables.posts.postOuterFilter]: new ObjectId(
            payload.commentId
          )
        },
        {
          [mongoDbTables.posts.postInnerFilter]: new ObjectId(payload.replyId)
        }
      ]
    };
    await this._mongoSvc.updateByQuery(
      collections.POSTS,
      updateQuery,
      updateSetValue,
      arrayFilters
    );

    /* If the reaction added for the first then only Notify the Admin/Users */
    if (replyIndex === -1 && !isRemove) {
      /* Notify the users each other when the user adds the reactions to the another user reply under the admin post */
      await Container.get(NotificationHelper).notifyUser(
        NotificationContentType.POST,
        reply.author.id.toString(),
        userId,
        replyObj.id,
        {
          title: NotificationMessages.ReactionTitle,
          body: NotificationMessages.UserReactionBody
        },
        NotificationMessages.UserReactionContent,
        PostResponse.COMMENT,
        payload.commentId,
        NotificationType.REACTION,
        payload.replyId
      );
    }
    response.operation = true;
    return response;
  }

  private async upsertCommentReaction(
    payload: ReactionRequest,
    isRemove: boolean,
    userId: string
  ): Promise<BooleanResponse> {
    const response = new BooleanResponse();
    const cmntVal = {
      [mongoDbTables.posts.removed]: false,
      [mongoDbTables.posts.id]: new ObjectId(payload.postId),
      [mongoDbTables.posts.commentId]: new ObjectId(payload.commentId)
    };
    const postObj: Post = await this._mongoSvc.readByValue(
      collections.POSTS,
      cmntVal
    );

    const commentObjId = postObj.comments
      .map((value) => {
        return value[mongoDbTables.posts.id].toString();
      })
      .indexOf(payload.commentId);
    const commentObj = postObj.comments[commentObjId];
    let cmntReaction: Reaction = commentObj.reactions
      ? commentObj.reactions
      : this.reactionHelper.createReactionObject();
    const index = cmntReaction.log.findIndex(
      (reactions) => reactions.userId === userId
    );
    if (index === -1 && isRemove) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
      response.operation = false;
      return response;
    }
    cmntReaction = await this.handleReactions(
      cmntReaction,
      payload,
      index,
      isRemove,
      userId,
      commentObj.author.id.toString(),
      postObj
    );
    const searchFilterComment = {
      [mongoDbTables.posts.id]: new ObjectId(payload.postId),
      [mongoDbTables.posts.commentId]: new ObjectId(payload.commentId)
    };
    const setValue = {
      $set: {
        [mongoDbTables.posts.commentReaction]: cmntReaction
      }
    };
    const result = await this._mongoSvc.updateByQuery(
      collections.POSTS,
      searchFilterComment,
      setValue
    );
    if (result === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.reactionFailure;
      response.operation = false;
      return response;
    }
    if (index === -1 && !isRemove) {
      /* Notify the users each other when the user adds the reactions to the another user comment under the admin post */
      await Container.get(NotificationHelper).notifyUser(
        NotificationContentType.POST,
        commentObj.author.id.toString(),
        userId,
        postObj.id,
        {
          title: NotificationMessages.ReactionTitle,
          body: NotificationMessages.UserReactionBody
        },
        NotificationMessages.UserReactionContent,
        PostResponse.COMMENT,
        payload.commentId,
        NotificationType.REACTION
      );
    }
    response.operation = true;
    return response;
  }

  private async upsertPostReaction(
    payload: ReactionRequest,
    isRemove: boolean,
    userId: string
  ): Promise<BooleanResponse> {
    const response = new BooleanResponse();
    const value = {
      [mongoDbTables.posts.removed]: false,
      [mongoDbTables.posts.id]: new ObjectId(payload.postId)
    };
    const post: Post = await this._mongoSvc.readByValue(
      collections.POSTS,
      value
    );

    let postReaction: Reaction = post.reactions
      ? post.reactions
      : this.reactionHelper.createReactionObject();
    const objIndex = postReaction.log.findIndex(
      (reactions) => reactions.userId === userId
    );
    if (objIndex === -1 && isRemove) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
      response.operation = false;
      return response;
    }
    postReaction = await this.handleReactions(
      postReaction,
      payload,
      objIndex,
      isRemove,
      userId,
      post.author.id,
      post
    );
    post.reactions = postReaction;
    const filter = { _id: new ObjectId(post.id) };
    const setvalues = {
      $set: { [mongoDbTables.posts.reactions]: postReaction }
    };
    const result = await this._mongoSvc.updateByQuery(
      collections.POSTS,
      filter,
      setvalues
    );
    if (result === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.reactionFailure;
      response.operation = false;
      return response;
    }

    response.operation = true;
    return response;
  }

  private async buildPostObject(post: Post, userId: string, language: string) {
    post.author = await this._mongoSvc.readByID(
      collections.ADMINUSERS,
      post.author.id
    );
    post.author.profileImage = await this.userService.buildAdminImagePath(
      post.author.id
    );
    const reactionData = this.reactionHelper.getReactionForCurrentUser(
      post.reactions,
      userId
    );
    post[REACTIONS.REACTION_COUNT] = reactionData.reactionCount;
    post[REACTIONS.USER_REACTION] = reactionData.userReaction;
    delete post?.reactions;

    post.comments = await Container.get(CommentHelper).buildComment(
      post.comments,
      post[mongoDbTables.posts.commentAuthors],
      post[mongoDbTables.posts.replyAuthors],
      userId,
      language
    );

    post.content = this.postsHelper.updateContent(post.content, language);
    post.commentCount = post?.comments
      ? Container.get(CommentHelper).getCommentCount(post.comments)
      : 0;
    post.id = post[mongoDbTables.posts.id];
    delete post[mongoDbTables.posts.id];
    delete post[mongoDbTables.posts.commentAuthors];
    delete post[mongoDbTables.posts.replyAuthors];
    return post;
  }

  private async handleAdminActivity(
    post: Post,
    adminId: string,
    userId: string,
    isDelete: boolean,
    isUpdate: boolean,
    reactionRequest: ReactionRequest
  ) {
    const title =
      API_RESPONSE.messages.reactionTitle +
      ' ' +
      reactionRequest.type +
      ': ' +
      post.content.en.title;
    const search = {
      [mongoDbTables.adminActivity.userId]: adminId,
      [mongoDbTables.adminActivity.list]: {
        $elemMatch: {
          [mongoDbTables.adminActivity.listAuthorId]: userId,
          [mongoDbTables.adminActivity.listEntityType]: reactionRequest.type,
          [mongoDbTables.adminActivity.listPostId]: reactionRequest.postId,
          [mongoDbTables.adminActivity.listTitle]: title,
          [mongoDbTables.adminActivity.listCommentId]:
            reactionRequest.commentId,
          [mongoDbTables.adminActivity.listReplyId]: reactionRequest.replyId
        }
      }
    };
    if (reactionRequest.type === PostResponse.POST) {
      delete search.list['$elemMatch'].replyId;
      delete search.list['$elemMatch'].commentId;
    }
    if (reactionRequest.type === PostResponse.COMMENT) {
      delete search.list['$elemMatch'].replyId;
    }

    const adminActivity: AdminActivity = await this._mongoSvc.readByValue(
      collections.ADMINACTIVITY,
      search
    );
    if (adminActivity !== null) {
      if (isDelete) {
        const updateSetValue = {
          $set: {
            [mongoDbTables.adminActivity.listRemove]: true,
            [mongoDbTables.adminActivity.listUpdated]: new Date()
          }
        };
        await this._mongoSvc.updateByQuery(
          collections.ADMINACTIVITY,
          search,
          updateSetValue
        );
      }

      if (isUpdate) {
        const setValue = {
          $set: {
            [mongoDbTables.adminActivity.listReactionValue]:
              reactionRequest.reaction,
            [mongoDbTables.adminActivity.listRead]: false,
            [mongoDbTables.adminActivity.listRemove]: false,
            [mongoDbTables.adminActivity.listUpdated]: new Date()
          }
        };
        await this._mongoSvc.updateByQuery(
          collections.ADMINACTIVITY,
          search,
          setValue
        );
      }
    }
  }

  private hasUserFlagged(flaggedUserLog: FlaggedUserLog[], userId: string) {
    if (flaggedUserLog === undefined || flaggedUserLog.length === 0) {
      return false;
    }
    const userLog = flaggedUserLog.filter((log) => log.userId === userId);
    return userLog.length > 0 ? true : false;
  }
}
