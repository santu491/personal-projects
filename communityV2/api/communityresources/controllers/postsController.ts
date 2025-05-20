import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES, reactionRemove,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2, OpenAPI2, Param2, QueryParam2, RequestContext
} from '@anthem/communityapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PageParam } from '../models/pageParamModel';
import { CommentRequest, DeleteCommentRequest, ReactionRequest, ReplyRequest } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { PostsService } from '../services/postsService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.POST)
export class PostsController extends BaseController {
  constructor(
    private postsService: PostsService,
    private validate: Validation,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/all')
  @OpenAPI2({
    description: 'Get All Posts',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllPosts(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('published') published: boolean,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      published = published ?? true;

      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const pageParams: PageParam = {
        pageNumber,
        pageSize,
        sort: 1
      };
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      return await this.postsService.getAllPosts(pageParams, published, currentUser.id, language);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/community/:communityId')
  @OpenAPI2({
    description: 'Get All Posts for a specific community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllPostsForCommunity(
    @Param2('communityId') communityId: string,
      @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('published') published: boolean,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      published = published ?? true;

      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const pageParams: PageParam = {
        pageNumber,
        pageSize,
        sort: 1
      };
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      return await this.postsService.getAllPostsForCommunity(pageParams, published, currentUser.id, communityId, language);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('')
  @OpenAPI2({
    description: 'Get Posts Details with Id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPostById(
    @QueryParam2('id') id: string,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      return await this.postsService.getPostById(id, currentUser.id, language);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/comment')
  @OpenAPI2({
    description: 'Insert or update comment on admin generated post',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertComment(@Body2() payload: CommentRequest): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (!this.validate.isHex(payload.postId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (this.validate.isNullOrWhiteSpace(payload.comment)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.emptyComment;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!payload.isCommentTextProfane) {
        payload.isCommentTextProfane = false;
      }
      const moderateStoryModelContent = this.validate.moderatePostCommentModelContent(
        payload
      );
      if (moderateStoryModelContent.moderationFlag) {
        const errorMessage = API_RESPONSE.messages.contentModerationError;
        const value = moderateStoryModelContent.commentModel;
        return this.result.createExceptionWithValue(errorMessage, value);
      }

      return await this.postsService.upsertComment(payload, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reply')
  @OpenAPI2({
    description: 'Insert or update reply on admin generated post',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertReply(@Body2() payload: ReplyRequest): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (!this.validate.isHex(payload.postId) || !this.validate.isHex(payload.commentId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      if (this.validate.isNullOrWhiteSpace(payload.comment)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.emptyComment;
        return this.result.createError([this.result.errorInfo]);
      }

      if (!payload.isCommentTextProfane) {
        payload.isCommentTextProfane = false;
      }

      const moderateStoryModelContent = this.validate.moderatePostCommentModelContent(
        payload
      );
      if (moderateStoryModelContent.moderationFlag) {
        const errorMessage = API_RESPONSE.messages.contentModerationError;
        const value = moderateStoryModelContent.commentModel;
        return this.result.createExceptionWithValue(errorMessage, value);
      }
      return await this.postsService.upsertReply(payload, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reaction')
  @OpenAPI2({
    description: 'Add reaction on to admin generated post or comments',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertReaction(@Body2() payload: ReactionRequest): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.postId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      const isRemove = payload.reaction === reactionRemove ? true : false;
      return this.postsService.upsertReaction(payload, isRemove, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/deleteComment')
  @OpenAPI2({
    description: 'Remove comment or replies from posts',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeComment(@Body2() payload: DeleteCommentRequest): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.postId) || !this.validate.isHex(payload.commentId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (typeof payload.replyId !== 'undefined') {
        if (!this.validate.isHex(payload.replyId)) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
          return this.result.createError([this.result.errorInfo]);
        }
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return this.postsService.removeComment(payload, currentUser.id);
    }
    catch(error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/comment/flag')
  @OpenAPI2({
    description: 'Flags the comment or replies on post',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async reportComment(@Body2() payload: DeleteCommentRequest): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.postId) || !this.validate.isHex(payload.commentId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (typeof payload.replyId !== 'undefined') {
        if (!this.validate.isHex(payload.replyId)) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
          return this.result.createError([this.result.errorInfo]);
        }
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return this.postsService.reportComment(payload, currentUser.id);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
