import { API_RESPONSE, BaseController, DEFAULT_RESPONSES, PostResponse, RequestValidation, Result, Validation, ValidationResponse } from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2, Param2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Delete, Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PageParam } from '../models/pageParamModel';
import { CommentRequest, PostRequest, ReactionRequest, ReplyRequest, ReportComment, ReportReply } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { PostsService } from '../services/postsService';

@JsonController(API_INFO.securePath)
export class PostsController extends BaseController {
  constructor(
    private postsService: PostsService,
    private result: Result,
    private validate: Validation,
    private requestValidator: RequestValidation
  ) {
    super();
  }

  @Put('/post')
  @OpenAPI2({
    description: 'Insert or update admin generated post',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertPost(@Body2() payload: PostRequest): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      const validation: ValidationResponse = this.requestValidator.isValidPostModel(
        payload
      );
      if (!validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.incorrectModel;
        this.result.errorInfo.detail = validation.reason;
        return this.result.createError(this.result.errorInfo);
      }

      if (payload.communities == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunities;
        return this.result.createError([this.result.errorInfo]);
      }

      // Content moderation for post data.
      payload.content.en.body = this.validate.moderatedWords(payload.content.en.body);
      payload.content.en.title = this.validate.moderatedWords(payload.content.en.title);
      if (payload.content.pnDetails) {
        payload.content.pnDetails.body = this.validate.moderatedWords(payload.content.pnDetails.body);
        payload.content.pnDetails.title = this.validate.moderatedWords(payload.content.pnDetails.title);
      }

      return await this.postsService.upsertPost(payload, adminUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Delete('/post/delete/:id')
  @OpenAPI2({
    description: 'admin Generated Draft Content post delete soft or hard',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async deletePost(
    @Param2('id') id: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.postsService.deletePost(id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/post/:postId')
  @OpenAPI2({
    description: 'Get the Admin post based on the Id.',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getPost(
    @Param2('postId') postId: string,
      @QueryParam2('flagged') flagged: boolean,
      @QueryParam2('published') published: boolean
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(postId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.postsService.getPost(postId, published, flagged);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/posts/all')
  @OpenAPI2({
    description: 'Get all the Admin posts (Published/Draft)',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getAllPost(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number,
      @QueryParam2('status', { required: true }) status: string[],
      @QueryParam2('communities', { required: true }) communityIds: string[]
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      const pageParams: PageParam = { pageNumber, pageSize, sort };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      return await this.postsService.getAllPosts(pageParams, status, communityIds, adminUser.id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/posts/communities')
  @OpenAPI2({
    description: 'Get all the Admin posts based on the community (Published/Draft)',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getAllCommunityPosts(
    @QueryParam2('communities', { required: true }) communityIds: string[],
      @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number,
      @QueryParam2('published') published: boolean
  ): Promise<BaseResponse> {
    try {
      if (this.requestValidator.validCommunityArray(communityIds, false).validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (published === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.noPostAvailableTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noPostAvailableDetail;
        return this.result.createError(this.result.errorInfo);
      }

      const pageParams: PageParam = { pageNumber, pageSize, sort };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }

      return await this.postsService.getCommunityPosts(pageParams, published, communityIds);
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
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
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
      payload.comment = this.validate.moderatedWords(payload.comment);
      return await this.postsService.upsertComment(payload, adminUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reply')
  @OpenAPI2({
    description: 'Insert or update reply to a comment on admin generated post',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertReply(@Body2() payload: ReplyRequest): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(payload.postId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }

      if (!this.validate.isHex(payload.commentId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }

      if (this.validate.isNullOrWhiteSpace(payload.comment)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.emptyComment;
        return this.result.createError([this.result.errorInfo]);
      }

      payload.comment = this.validate.moderatedWords(payload.comment);
      return await this.postsService.upsertReply(payload, adminUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Delete('/post/:postId/comment/:commentId')
  @OpenAPI2({
    description: 'delete comment by id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async deleteComment(
    @Param2('postId') postId: string,
      @Param2('commentId') commentId: string,
      @QueryParam2('flagged') flagged: boolean
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(postId) || !this.validate.isHex(commentId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.postsService.deleteComment(postId, commentId, adminUser, flagged);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/comment/flag')
  @OpenAPI2({
    description: 'flag or un-flag a comment',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async flagComment(@Body2() payload: ReportComment): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(payload.postId) || !this.validate.isHex(payload.commentId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }
      return await this.postsService.flagComment(payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reaction')
  @OpenAPI2({
    descriptio: 'Add/Edit the Reaction for post/Comments/Reply',
    response: { ...DEFAULT_RESPONSES }
  })
  public async addReaction(
    @Body2() payload: ReactionRequest
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      const validation: ValidationResponse = this.requestValidator.isValidReactionRequest(
        payload
      );
      if (!validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.incorrectModel;
        this.result.errorInfo.detail = validation.reason;
        return this.result.createError(this.result.errorInfo);
      }

      let isRemove = false;
      if (payload.reaction === PostResponse.REMOVE) {
        isRemove = true;
      }

      return await this.postsService.addReaction(payload, adminUser, isRemove);
    } catch(error){
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/post/flag/:postId')
  @OpenAPI2({
    description: 'Flag or un-flag a post',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async flagPost(@Param2('postId') postId: string,
    @QueryParam2('flagged', { required: true }) flagged: boolean): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(postId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.postsService.flagPost(postId, flagged);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reply/flag')
  @OpenAPI2({
    description: 'flag or un-flag a reply',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async flagReply(@Body2() payload: ReportReply): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (
        !this.validate.isHex(payload.postId) ||
        !this.validate.isHex(payload.commentId) ||
        !this.validate.isHex(payload.replyId)
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }
      return await this.postsService.flagOrDeleteReply(payload, adminUser, false);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Delete('/post/reply')
  @OpenAPI2({
    description: 'delete reply by id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async deleteReply(@Body2() payload: ReportReply): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (
        !this.validate.isHex(payload.postId) ||
        !this.validate.isHex(payload.commentId) ||
        !this.validate.isHex(payload.replyId)
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.postsService.flagOrDeleteReply(payload, adminUser, true);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
