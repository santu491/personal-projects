import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  PostResponse,
  RequestValidation,
  Result,
  Validation,
  ValidationResponse
} from '@anthem/communityadminapi/common';
import {
  Body2,
  OpenAPI2
} from '@anthem/communityadminapi/utils';
import { Delete, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { ReactionRequest } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { DeleteCommentRequest, ReportComment, StoryCommentRequest, StoryReplyRequest } from '../models/storyModel';
import { StoryCommentService } from '../services/storyCommentService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.STORY)
export class StoryCommentsController extends BaseController {
  constructor(
    private storyService: StoryCommentService,
    private result: Result,
    private validate: Validation,
    private requestValidator: RequestValidation
  ) {
    super();
  }

  @Put('/comment')
  @OpenAPI2({
    description: 'Add/Update comment to a story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async storyComment(@Body2() payload: StoryCommentRequest): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!this.validate.isHex(payload.storyId) || (payload.id && !this.validate.isHex(payload.id))) {
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
      return await this.storyService.upsertComment(payload, adminUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reply')
  @OpenAPI2({
    description: 'Add/Update reply to a story comment',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async storyReply(@Body2() payload: StoryReplyRequest): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!this.validate.isHex(payload.storyId) || (payload.id && !this.validate.isHex(payload.id))) {
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
      return await this.storyService.upsertReply(payload, adminUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Delete('/comment')
  @OpenAPI2({
    description: 'Remove comment or replies from story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeComment(@Body2() payload: DeleteCommentRequest): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.storyId) ||
        !this.validate.isHex(payload.commentId) ||
        (payload.replyId && !this.validate.isHex(payload.replyId))
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      const adminUser = this.validate.checkUserIdentity();
      return this.storyService.removeComment(payload, adminUser);
    }
    catch(error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reaction')
  @OpenAPI2({
    descriptio: 'Add/Edit the Reaction for story/Comments/Reply',
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

      return await this.storyService.addReaction(payload, adminUser, isRemove);
    } catch(error){
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/flag')
  @OpenAPI2({
    description: 'flag or un-flag a comment/reply',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async flagComment(@Body2() payload: ReportComment): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(payload.id) || !this.validate.isHex(payload.commentId) || (payload.replyId && !this.validate.isHex(payload.replyId))) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }
      return await this.storyService.flagComment(payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
