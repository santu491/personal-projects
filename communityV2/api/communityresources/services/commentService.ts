import { API_RESPONSE, collections, mongoDbTables, queryStrings, Result, storyReactionsType } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { FlaggedUserLog } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { BooleanResponse, DeleteStoryCommentRequest } from '../models/storyModel';
import { CommentHelper } from './helpers/commentHelper';
import { NotificationHelper } from './helpers/notificationHelper';

@Service()
export class CommentService {
  constructor(
    private mongoService: MongoDatabaseClient,
    private result: Result,
    private commentHelper: CommentHelper,
    private notificationHelper: NotificationHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  /**
   * Marks the comment or reply by user as removed
   * Comment can be deleted by both the author of the comment and the author of the story
   * @param request paylod with story,comment and reply ids
   * @param userId user id
   * @returns success or failure of query
   */
  public async removeComment(request: DeleteStoryCommentRequest, userId: string): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.id]: new ObjectId(request.storyId),
        [mongoDbTables.story.commentId]: new ObjectId(request.commentId)
      };
      const story = await this.mongoService.readByValue(
        collections.STORY,
        query
      );
      let updateOperation;
      const comment = story.comments.filter((c) =>
        c[mongoDbTables.story.id].toString() === request.commentId
      )[0];
      if (request.replyId) {
        const reply = comment.replies.filter((r) =>
          r[mongoDbTables.story.id].toString() === request.replyId
        )[0];
        if (reply.author.id.toString() !== userId && story.authorId !== userId) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.notTheAuthor;
          return this.result.createError([this.result.errorInfo]);
        }

        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectId(request.storyId)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.story.replyRemoved]: true,
            [mongoDbTables.story.replyUpdatedAt]: new Date()
          }
        };
        const arrayFilters = {
          [queryStrings.arrayFilters]: [
            { [mongoDbTables.story.postOuterFilter]: new ObjectId(request.commentId) },
            { [mongoDbTables.story.postInnerFilter]: new ObjectId(request.replyId) }
          ]
        };
        updateOperation = await this.mongoService.updateByQuery(collections.STORY, updateQuery, updateSetValue, arrayFilters);
        if (updateOperation === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.commentEditFailure;
          return this.result.createError([this.result.errorInfo]);
        }
      } else {
        if (comment.author.id.toString() !== userId && story.authorId !== userId) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.notTheAuthor;
          return this.result.createError([this.result.errorInfo]);
        }

        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectId(request.storyId),
          [mongoDbTables.story.commentId]: new ObjectId(request.commentId)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.story.commentRemoved]: true,
            [mongoDbTables.story.commentUpdatedAt]: new Date()
          }
        };
        updateOperation = await this.mongoService.updateByQuery(collections.STORY, updateQuery, updateSetValue);
        if (updateOperation === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.commentEditFailure;
          return this.result.createError([this.result.errorInfo]);
        }
      }
      const response = new BooleanResponse();
      response.operation = updateOperation >= 1? true : false;
      return this.result.createSuccess(response);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  /**
   * Updates a comment as flagged and adds a userLog
   * @param payload payload with story id, comment id and reply id
   * @param userId user id
   * @returns a response of success or failure
   */
  public async flagComment(payload: DeleteStoryCommentRequest, userId: string): Promise<BaseResponse> {
    try {
      const userLog: FlaggedUserLog = {
        userId: userId,
        createdDate: new Date()
      };
      if (payload.replyId) {
        const replyStory = await this.commentHelper.getReplyStory(payload.storyId, payload.commentId, payload.replyId);
        if (!replyStory) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
          return this.result.createError([this.result.errorInfo]);
        }

        const comment = replyStory.comments.filter((c) => c[mongoDbTables.posts.id].toString() === payload.commentId)[0];
        const reply = comment.replies.filter((r) => r[mongoDbTables.posts.id].toString() === payload.replyId)[0];

        const updateSetValue = this.commentHelper.getUpdateCommentQuery(reply, userId, userLog, storyReactionsType[2]);
        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectId(payload.storyId)
        };
        const arrayFilters = {
          [queryStrings.arrayFilters]: [
            { [mongoDbTables.story.postOuterFilter]: new ObjectId(payload.commentId) },
            { [mongoDbTables.story.postInnerFilter]: new ObjectId(payload.replyId) }
          ]
        };
        await this.mongoService.updateByQuery(collections.STORY, updateQuery, updateSetValue, arrayFilters);

        this.commentHelper.reportToAdmin(replyStory, storyReactionsType[2]);
        this.notificationHelper.notifyAdminOnFlagStory(payload.storyId, userId, replyStory.communityId, payload.commentId, payload.replyId);
      }
      else {
        const query = {
          [mongoDbTables.story.removed]: false,
          [mongoDbTables.story.id]: new ObjectId(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectId(payload.commentId)
        };
        const commentStory = await this.mongoService.readByValue(
          collections.STORY,
          query
        );
        if (commentStory === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const comment = commentStory.comments.filter((c) => c[mongoDbTables.posts.id].toString() === payload.commentId)[0];

        const updateSetValue = this.commentHelper.getUpdateCommentQuery(comment, userId, userLog, storyReactionsType[1]);
        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectId(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectId(payload.commentId)
        };
        await this.mongoService.updateByQuery(collections.STORY, updateQuery, updateSetValue);

        this.commentHelper.reportToAdmin(commentStory, storyReactionsType[1]);
        this.notificationHelper.notifyAdminOnFlagStory(payload.storyId, userId, commentStory.communityId, payload.commentId);
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
}
