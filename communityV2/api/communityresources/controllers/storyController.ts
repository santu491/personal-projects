import {
  API_RESPONSE,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result, TranslationLanguage, USER_IDENTITY, Validation,
  ValidationResponse,
  reactionRemove
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { EncryptionUtil } from '@anthem/communityapi/security';
import {
  Body2,
  OpenAPI2,
  Param2,
  QueryParam2,
  RequestContext
} from '@anthem/communityapi/utils';
import { Get, JsonController, Post, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PageParam } from '../models/pageParamModel';
import { BaseResponse } from '../models/resultModel';
import { DeleteStoryCommentRequest, PromptAnswerModel, StoryCommentRequest, StoryModel, StoryReactionRequest, StoryReplyRequest } from '../models/storyModel';
import { CommentService } from '../services/commentService';
import { StoryService } from '../services/storyService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.STORY)
export class StoryController extends BaseController {
  constructor(
    private storyService: StoryService,
    private validate: Validation,
    private result: Result,
    private commentService: CommentService,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('')
  @OpenAPI2({
    description: 'Get All Story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllStories(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number
  ): Promise<BaseResponse> {
    try {
      const pageParams: PageParam = {
        pageNumber,
        pageSize,
        sort: sort ? sort : 1
      };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      return this.storyService.getAllStories(pageParams, null);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/:id')
  @OpenAPI2({
    description: 'Get a Story by the ID',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getStoryById(
    @Param2('id') id: string,
      @QueryParam2('encrypted') encrypted: boolean,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (encrypted) {
        id = EncryptionUtil.decrypt(id, 'aes-symmetric');
      }

      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }

      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return this.storyService.getStoryById(id, currentUser.id, language);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/user/:id')
  @OpenAPI2({
    description: 'Get all stories for a specific user by ID',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getStoryByUserId(
    @Param2('id') id: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.storyService.getStoryByUserId(id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/community/:id')
  @OpenAPI2({
    description: 'Get stories for a single community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getByCommunity(
    @Param2('id') id: string,
      @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number
  ): Promise<BaseResponse> {
    try {
      const pageParams = { pageNumber, pageSize, sort };
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return this.storyService.getByCommunity(
        id,
        pageParams,
        currentUser.id
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/community/:id/user/:userId')
  @OpenAPI2({
    description: 'Get stories for a single community and for a single user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getByCommunityAndStoryAuthor(
    @Param2('id') id: string,
      @Param2('userId') userId: string,
      @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number
  ): Promise<BaseResponse> {
    try {
      const pageParams = { pageNumber, pageSize, sort };
      if (!this.validate.isHex(id) || !this.validate.isHex(userId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.storyService.getByCommunityAndStoryAuthor(
        id,
        userId,
        pageParams
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/answerprompt')
  @OpenAPI2({
    description: 'An author can Add answers to prompts for a particular story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async createAnswersForPrompt(
    @Body2() model: PromptAnswerModel
  ): Promise<BaseResponse> {
    try {
      const validation: ValidationResponse = this.validate.isValidPromptAnswerModel(
        model
      );
      if (!validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validation.reason;
        return this.result.createError(this.result.errorInfo);
      }

      return this.storyService.createAnswersForPrompt(
        model
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('')
  @OpenAPI2({
    description: 'Update a story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateStory(@Body2() model: StoryModel): Promise<BaseResponse> {
    try {
      const validation: ValidationResponse = this.validate.isValidStoryModel(
        model,
        false
      );
      if (!validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validation.reason;
        return this.result.createError(this.result.errorInfo);
      }

      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      if (!currentUser.active) {
        this.result.errorInfo.title = API_RESPONSE.messages.userNotActiveTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.userNotActiveMessage;
        return this.result.createError(this.result.errorInfo);
      }

      return this.storyService.updateStory(model);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/comment')
  @OpenAPI2({
    description: 'Insert or update comment on stories',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertComment(@Body2() payload: StoryCommentRequest): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (!this.validate.isHex(payload.storyId)) {
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
        return this.result.createExceptionWithValue(API_RESPONSE.messages.contentModerationError, moderateStoryModelContent.commentModel);
      }

      return this.storyService.upsertComment(payload, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/reply')
  @OpenAPI2({
    description: 'Insert or update reply comments in stories',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertReply(@Body2() payload: StoryReplyRequest): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (!this.validate.isHex(payload.storyId) || !this.validate.isHex(payload.commentId)) {
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
        return this.result.createExceptionWithValue(API_RESPONSE.messages.contentModerationError, moderateStoryModelContent.commentModel);
      }
      return this.storyService.upsertReply(payload, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/comment/delete')
  @OpenAPI2({
    description: 'Delete a Comment',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeComment(@Body2() payload: DeleteStoryCommentRequest): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.storyId) || !this.validate.isHex(payload.commentId)) {
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
      return this.commentService.removeComment(payload, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/comment/flag')
  @OpenAPI2({
    description: 'Flag a Comment',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async flagComment(@Body2() payload: DeleteStoryCommentRequest): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.storyId) || !this.validate.isHex(payload.commentId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (payload.replyId) {
        if (!this.validate.isHex(payload.replyId)) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
          return this.result.createError([this.result.errorInfo]);
        }
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return this.commentService.flagComment(payload, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/:storyId')
  @OpenAPI2({
    description: 'Updates the Publish-state of the Story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async setPublished(
    @Param2('storyId') storyId: string,
      @QueryParam2('publish') publish: boolean
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(storyId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      return this.storyService.setPublished(
        currentUser.id,
        storyId,
        publish
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/:storyId/removePrompt/:promptId')
  @OpenAPI2({
    description: 'An author can remove an answered prompt from their story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removePrompt(
    @Param2('storyId') storyId: string,
      @Param2('promptId') promptId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(promptId) || !this.validate.isHex(storyId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      return this.storyService.removePromptFromStory(
        currentUser.id,
        storyId,
        promptId
      );
    } catch (error) {
      return this.result.createError(error);
    }
  }

  @Put('/flag/:storyId')
  @OpenAPI2({
    description: 'Set a Flag for a Story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async flagStory(
    @Param2('storyId') storyId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(storyId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      const currentUserData = RequestContext.getContextItem(USER_IDENTITY);

      return this.storyService.flagStory(
        storyId,
        JSON.parse(currentUserData).id
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/delete/:id')
  @OpenAPI2({
    description: 'Delete a story by ID',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async deleteStoryById(
  @Param2('id') storyId: string
  ) {
    try {
      if (!this.validate.isHex(storyId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      const currentUserData = RequestContext.getContextItem(USER_IDENTITY);

      return this.storyService.deleteStoryById(storyId, JSON.parse(currentUserData).id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('')
  @OpenAPI2({
    description: 'Create a story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async create(
    @Body2() model: StoryModel,
      @QueryParam2('autoPublish') autoPublish: boolean
  ): Promise<BaseResponse> {
    try {
      const validation: ValidationResponse = this.validate.isValidStoryModel(
        model,
        true
      );
      if (!validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validation.reason;
        return this.result.createError([this.result.errorInfo]);
      }

      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (!currentUser.active) {
        this.result.errorInfo.title = API_RESPONSE.messages.userNotActiveTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userNotActiveMessage;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.storyService.create(model, autoPublish);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/comment/reaction')
  @OpenAPI2({
    description: 'Add reaction on to story comment or reply',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async upsertReaction(@Body2() payload: StoryReactionRequest): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.storyId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      const isRemove = payload.reaction === reactionRemove ? true : false;
      return this.storyService.upsertReaction(payload, isRemove, currentUser.id);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
