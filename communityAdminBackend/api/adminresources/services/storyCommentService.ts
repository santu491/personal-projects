import {
  AdminRole,
  API_RESPONSE,
  collections,
  LinkedTexts,
  mongoDbTables,
  NotificationMessages, NotificationType, PostResponse,
  Result
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectId, ObjectID } from 'mongodb';
import Container, { Service } from 'typedi';
import { PostHelperService } from '../helpers/postHelper';
import { StoryHelperService } from '../helpers/storyHelper';
import { Admin } from '../models/adminUserModel';
import { Reaction } from '../models/commonModel';
import { ValidationModel } from '../models/contentModel';
import { CommentModel, ReactionRequest, ReplyModel } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { BooleanResponse, DeleteCommentRequest, ReportComment, Story, StoryCommentRequest, StoryReplyRequest } from '../models/storyModel';
import { AdminUser, User } from '../models/userModel';
import { PostsService } from './postsService';

@Service()
export class StoryCommentService {
  public postService = Container.get(PostsService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private postHelperService: PostHelperService,
    private storyHelper: StoryHelperService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async upsertReply(payload: StoryReplyRequest, adminUser): Promise<BaseResponse> {
    try {
      // Check for the badwords or sensitive word before adding the comment.
      const validationDetails = new ValidationModel();
      validationDetails.errorFields = [];
      const validation = this.postService.moderationOnFieldLevel(NotificationType.COMMENT, payload.comment, validationDetails);
      if (!payload.isProfane && validation.isBadWord ) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        this.result.errorInfo.title = API_RESPONSE.messages.invalidContent;
        this.result.errorInfo.detail = JSON.stringify(validation.errorFields);
        return this.result.createError([this.result.errorInfo]);
      }
      const author: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminUser.id);
      if (payload.id) {
        const searchFilter = {
          [mongoDbTables.story.id]: new ObjectId(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectId(payload.commentId),
          [mongoDbTables.story.removed]: false,
          [mongoDbTables.story.comments]: {
            $elemMatch: {
              [mongoDbTables.story.replies]: {
                $elemMatch: {
                  [mongoDbTables.story.id]: new ObjectID(payload.id),
                  [mongoDbTables.story.removed]: false
                }
              }
            }
          }
        };
        const commentReply: Story = await this._mongoSvc.readByValue(
          collections.STORY,
          searchFilter
        );
        if (commentReply == null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdDetail;
          this.result.errorInfo.detail = API_RESPONSE.messages.storyReplyDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }

        const queryData = {
          [mongoDbTables.story.id]: new ObjectID(payload.storyId)
        };
        const setData = {
          $set: {
            [mongoDbTables.story.storyCommentFilter]: payload.comment,
            [mongoDbTables.story.storyDateFilter]: new Date(),
            [mongoDbTables.story.storyCommentAuthorFilter]: await this.postHelperService.personaAdminAuthor(payload.authorId),
            [mongoDbTables.story.replyDeeplink]: payload?.deeplink
          }
        };
        const filter = {
          'arrayFilters': [
            { [mongoDbTables.story.storyOuterFilter]: new ObjectID(payload.commentId) },
            { [mongoDbTables.story.storyInnerFilter]: new ObjectID(payload.id) }
          ]
        };
        const result = await this._mongoSvc.updateByQuery(collections.STORY, queryData, setData, filter);
        const response = new BooleanResponse();
        response.operation = (result) ? true : false;

        return this.result.createSuccess(response);
      }
      const commentReplyObj = await this.postHelperService.createCommentObject(payload, author, payload.authorId);
      const query = {
        [mongoDbTables.story.id]: new ObjectID(payload.storyId),
        [mongoDbTables.story.commentId]: new ObjectID(payload.commentId)
      };
      const setValue = {
        $addToSet: {
          [mongoDbTables.story.postReplies]: commentReplyObj
        }
      };
      await this._mongoSvc.updateByQuery(collections.STORY, query, setValue);
      commentReplyObj.id = commentReplyObj[mongoDbTables.story.id];
      delete commentReplyObj[mongoDbTables.story.id];

      /* Notify the User admin reply to the User Comment */
      const commentAuthor = await this._mongoSvc.readByID(collections.ADMINUSERS, payload.authorId);
      await this.storyHelper.userNotification(payload, PostResponse.REPLY, commentAuthor, payload.commentId, commentReplyObj.id);

      return this.result.createSuccess(commentReplyObj);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async upsertComment(payload: StoryCommentRequest, admin) {
    try {
      // Check for the badwords or sensitive word before adding the comment.
      const validationDetails = new ValidationModel();
      validationDetails.errorFields = [];
      const validation = this.postService.moderationOnFieldLevel(NotificationType.COMMENT, payload.comment, validationDetails);
      if (!payload.isProfane && validation.isBadWord) {
        this.result.errorInfo.errorCode = validation.isBadWord ? API_RESPONSE.statusCodes[400] : API_RESPONSE.statusCodes[477];
        this.result.errorInfo.title = validation.isBadWord ? API_RESPONSE.messages.invalidContent : API_RESPONSE.messages.invalidContentWithKeyWords;
        this.result.errorInfo.detail = JSON.stringify(validation.errorFields);
        return this.result.createError([this.result.errorInfo]);
      }

      const adminUser: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, admin.id);
      if (payload.id) {
        const cmntVal = {
          [mongoDbTables.story.removed]: false,
          [mongoDbTables.story.id]: new ObjectID(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectID(payload.id)
        };
        const comment: Story = await this._mongoSvc.readByValue(
          collections.STORY,
          cmntVal
        );
        if (comment === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.storyCommentDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectID(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectID(payload.id)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.story.commentMsg]: payload.comment,
            [mongoDbTables.story.commentUpdatedAt]: new Date(),
            [mongoDbTables.story.commentAuthor]: await this.postHelperService.personaAdminAuthor(payload.authorId),
            [mongoDbTables.story.commentDeeplink]: payload?.deeplink
          }
        };
        await this._mongoSvc.updateByQuery(collections.STORY, updateQuery, updateSetValue);
        const response = new BooleanResponse();
        response.operation = true;
        return this.result.createSuccess(response);
      } else {
        const commentObj = await this.postHelperService.createCommentObject(payload, adminUser, payload.authorId);
        const query = { [mongoDbTables.story.id]: new ObjectID(payload.storyId) };
        const setValue = { $addToSet: { comments: commentObj } };
        await this._mongoSvc.updateByQuery(collections.STORY, query, setValue);
        commentObj.id = commentObj[mongoDbTables.story.id];
        delete commentObj[mongoDbTables.story.id];

        /* Notify the User over Admin Comment */
        const commentAuthor = await this._mongoSvc.readByID(collections.ADMINUSERS, payload.authorId);
        await this.storyHelper.userNotification(payload, PostResponse.COMMENT, commentAuthor, commentObj.id.toString());

        return this.result.createSuccess(commentObj);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removeComment(payload: DeleteCommentRequest, admin): Promise<BaseResponse> {
    try {
      // Validate comment
      let story: Story = await this._mongoSvc.readByValue(
        collections.STORY,
        {
          [mongoDbTables.story.removed]: false,
          [mongoDbTables.story.id]: new ObjectID(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectID(payload.commentId)
        }
      );

      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      if (payload.replyId) {
        //Validate reply
        const query = {
          [mongoDbTables.story.id]: new ObjectID(payload.storyId),
          [mongoDbTables.story.comments]: {
            $elemMatch: {
              [mongoDbTables.story.id]: new ObjectID(payload.commentId),
              [mongoDbTables.story.replies]: {
                $elemMatch: {
                  [mongoDbTables.story.id]: new ObjectID(payload.replyId)
                }
              }
            }
          }
        };
        story = await this._mongoSvc.readByValue(collections.STORY, query);
        if (story === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }

        const commentData = story.comments.filter((cmnt) =>
          cmnt[mongoDbTables.posts.id].toString() === payload.commentId)[0];
        const replyData = commentData.replies.filter((rply) =>
          rply[mongoDbTables.posts.id].toString() === payload.replyId)[0];
        if (admin.role !== AdminRole.scadmin && replyData.author.id !== admin.id) {
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
          this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedDeleteDetails;
          return this.result.createError(this.result.errorInfo);
        }

        //Update reply
        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectID(payload.storyId)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.story.replyRemoved]: true,
            [mongoDbTables.story.replyUpdatedAt]: new Date()
          }
        };
        if (replyData.author.id !== admin.id) {
          updateSetValue.$set[mongoDbTables.story.replyRemovedBy] = admin.id;
        }
        const arrayFilters = {
          arrayFilters: [
            { [mongoDbTables.story.storyOuterFilter]: new ObjectID(payload.commentId) },
            { [mongoDbTables.story.storyInnerFilter]: new ObjectID(payload.replyId) }
          ]
        };
        await this._mongoSvc.updateByQuery(collections.STORY, updateQuery, updateSetValue, arrayFilters);

        // Notify the user about the removed Comment.
        const user: User = await this._mongoSvc.readByID(collections.USERS, replyData.author.id);
        if (user) {
          this.storyHelper.handleUserActivityForStory(user, story.id, admin.id, NotificationMessages.storyReply, payload.commentId, payload.replyId, true, LinkedTexts.touText);
        }
      }
      else {
        const comment = story.comments.filter((cmnt) =>
          cmnt[mongoDbTables.posts.id].toString() === payload.commentId)[0];

        if (admin.role !== AdminRole.scadmin && comment.author.id !== admin.id) {
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
          this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedDeleteDetails;
          return this.result.createError(this.result.errorInfo);
        }

        //delete comment
        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectID(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectID(payload.commentId)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.story.commentRemoved]: true,
            [mongoDbTables.story.commentUpdatedAt]: new Date()
          }
        };
        if (comment.author.id !== admin.id) {
          updateSetValue.$set[mongoDbTables.story.commentRemovedBy] = admin.id;
        }
        await this._mongoSvc.updateByQuery(collections.STORY, updateQuery, updateSetValue);

        // Notify the user about the removed Comment.
        const user: User = await this._mongoSvc.readByID(collections.USERS, comment.author.id);
        if (user) {
          this.storyHelper.handleUserActivityForStory(user, story.id, admin.id, NotificationMessages.storyComment, payload.commentId, null, true, LinkedTexts.touText);
        }
      }
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async addReaction(reactionData: ReactionRequest, admin, isRemove: boolean): Promise<BaseResponse> {
    try {
      const authorAdmin: AdminUser = await this._mongoSvc.readByID(collections.ADMINUSERS, reactionData.authorId);

      const searchFilter = {
        [mongoDbTables.story.id]: new ObjectID(reactionData.id),
        [mongoDbTables.story.removed]: false
      };
      const story = await this._mongoSvc.readByValue(
        collections.STORY,
        searchFilter
      );
      if (story == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdDetail;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      // Update the reaction for reply.
      if (reactionData.replyId) {
        const commentObjIndex = story.comments.map((value) => {
          return value[mongoDbTables.story.id].toString();
        }).indexOf(reactionData.commentId);
        const commentObj = story.comments[commentObjIndex];

        const replyObjectIndex = commentObj.replies.map((value) => {
          return value[mongoDbTables.story.id].toString();
        }).indexOf(reactionData.replyId);

        const replyObj: ReplyModel = story.comments[commentObjIndex].replies[replyObjectIndex];
        const replyReactionObject: Reaction = (replyObj.reactions) ? replyObj.reactions : this.postHelperService.createReactionObject();

        const filter = {
          'arrayFilters': [
            { [mongoDbTables.story.storyInnerFilter]: replyObj[mongoDbTables.story.id] },
            { [mongoDbTables.story.storyOuterFilter]: commentObj[mongoDbTables.story.id] }
          ]
        };
        const result = await this.storyHelper.handleReactions(
          replyObj,
          replyReactionObject,
          reactionData,
          isRemove,
          PostResponse.REPLY,
          story.id,
          authorAdmin,
          collections.STORY,
          replyObj.author.id,
          filter, reactionData.commentId,
          replyObj[mongoDbTables.posts.id].toString()
        );

        const response = new BooleanResponse();
        response.operation = (result) ? true : false;
        return this.result.createSuccess(response);
      }

      // Update reaction for comment
      if (!reactionData.replyId && reactionData.commentId) {
        const commentObjId = story.comments.map((value) => {
          return value[mongoDbTables.posts.id].toString();
        }).indexOf(reactionData.commentId);
        const commentObj: CommentModel = story.comments[commentObjId];
        const commentReactionObject: Reaction = (commentObj.reactions) ? commentObj.reactions : this.postHelperService.createReactionObject();

        const result = await this.storyHelper.handleReactions(
          commentObj,
          commentReactionObject,
          reactionData,
          isRemove,
          PostResponse.COMMENT,
          story.id,
          authorAdmin,
          collections.STORY,
          commentObj.author.id,
          {},
          commentObj[mongoDbTables.posts.id].toString()
        );

        const response = new BooleanResponse();
        response.operation = (result) ? true : false;
        return this.result.createSuccess(response);
      }

      // Update reaction for story
      if (!reactionData.replyId && !reactionData.commentId && reactionData.id) {
        const postReactionObject: Reaction = (story.reaction) ? story.reaction : this.postHelperService.createReactionObject();
        const result = await this.storyHelper.handleReactions(
          story,
          postReactionObject,
          reactionData,
          isRemove,
          PostResponse.STORY,
          story.id,
          authorAdmin,
          collections.STORY,
          story.authorId);
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

  public async flagComment(payload: ReportComment): Promise<BaseResponse> {
    try {
      // Validate comment
      const story: Story = await this._mongoSvc.readByValue(
        collections.STORY,
        {
          [mongoDbTables.story.removed]: false,
          [mongoDbTables.story.id]: new ObjectID(payload.id)
        }
      );

      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (payload.replyId) {
        // Flag or unflag the reply
        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectID(payload.id)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.story.replyFlag]: payload.flagged,
            [mongoDbTables.story.replyUpdatedAt]: new Date()
          }
        };
        const arrayFilters = {
          arrayFilters: [
            { [mongoDbTables.story.storyOuterFilter]: new ObjectID(payload.commentId) },
            { [mongoDbTables.story.storyInnerFilter]: new ObjectID(payload.replyId) }
          ]
        };
        await this._mongoSvc.updateByQuery(collections.STORY, updateQuery, updateSetValue, arrayFilters);

        const resp = new BooleanResponse();
        resp.operation = true;
        return this.result.createSuccess(resp);
      }

      //flag the comment
      const updateQuery = {
        [mongoDbTables.story.id]: new ObjectID(payload.id),
        [mongoDbTables.story.commentId]: new ObjectID(payload.commentId)
      };
      const updateSetValue = {
        $set: {
          [mongoDbTables.story.commentFlagged]: payload.flagged,
          [mongoDbTables.story.commentUpdatedAt]: new Date()
        }
      };

      await this._mongoSvc.updateByQuery(collections.STORY, updateQuery, updateSetValue);
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
