import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2,
  OpenAPI2,
  Param2,
  QueryParam2
} from '@anthem/communityapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BinderArticleModel, BinderPostModel, BinderResourceModel, BinderStoryModel } from '../models/binderModel';
import { BaseResponse } from '../models/resultModel';
import { BinderService } from '../services/binderService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.BINDER)
export class BinderController extends BaseController {
  constructor(
    private binderService: BinderService,
    private validate: Validation,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/getBinderByUserId/:id')
  @OpenAPI2({
    description: 'Get Binder by UserId',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getBinderByUser(
    @Param2('id') id: string,
      @QueryParam2('sortOrder') sortOrder: number
  ): Promise<BaseResponse> {
    sortOrder = sortOrder === 1 ? sortOrder : -1;

    if (!this.validate.isHex(id)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

      return this.result.createError([this.result.errorInfo]);
    }
    return this.binderService.getBinderByUser(id, sortOrder);
  }

  @Post('/addResourceToBinder')
  @OpenAPI2({
    description: 'A user can add a resource to their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addResource(
    @Body2() binderModel: BinderResourceModel
  ): Promise<BaseResponse> {
    const validationResult = this.validate.isValidForResourceBinder(
      binderModel,
      true
    );
    if (!validationResult.validationResult) {
      this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
      this.result.errorInfo.detail = validationResult.reason;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.binderService.addResourceToBinder(binderModel);
  }

  @Post('/removeResourceFromBinder')
  @OpenAPI2({
    description: 'A user can remove a resource from their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeResource(
    @Body2() binderModel: BinderResourceModel
  ): Promise<BaseResponse> {
    try {
      const validationResult = this.validate.isValidForResourceBinder(
        binderModel,
        false
      );
      if (!validationResult.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResult.reason;
        return this.result.createError([this.result.errorInfo]);
      }
      const binder = await this.binderService.removeResourceFromBinder(
        binderModel
      );
      return binder;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/addArticleToBinder')
  @OpenAPI2({
    description: 'A user can add a article to their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addArticle(
    @Body2() binderModel: BinderArticleModel
  ): Promise<BaseResponse> {
    const validationResult = this.validate.isValidForArticleBinder(
      binderModel,
      true
    );
    if (!validationResult.validationResult) {
      this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
      this.result.errorInfo.detail = validationResult.reason;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.binderService.addArticleToBinder(binderModel);
  }

  @Post('/removeArticleFromBinder')
  @OpenAPI2({
    description: 'A user can remove a article from their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeArticle(
    @Body2() binderModel: BinderArticleModel
  ): Promise<BaseResponse> {
    try {
      const validationResult = this.validate.isValidForArticleBinder(
        binderModel,
        false
      );
      if (!validationResult.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResult.reason;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.binderService.removeArticleFromBinder(
        binderModel
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/addStoryToBinder')
  @OpenAPI2({
    description: 'A user can add a story to their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addStoryToBinder(
    @Body2() binderModel: BinderStoryModel
  ): Promise<BaseResponse> {
    try {
      const validationResult = this.validate.isValidForStoryBinder(
        binderModel
      );
      if (!validationResult.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResult.reason;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.binderService.addStoryToBinder(
        binderModel
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/removeStoryFromBinder')
  @OpenAPI2({
    description: 'A user can remove a story from their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeStoryFromBinder(
    @Body2() binderModel: BinderStoryModel
  ): Promise<BaseResponse> {
    try {
      const validationResult = this.validate.isValidForStoryBinder(
        binderModel
      );
      if (!validationResult.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResult.reason;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.binderService.removeStoryFromBinder(
        binderModel
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/addPostToBinder')
  @OpenAPI2({
    description: 'A user can add a post to their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addPost(
    @Body2() binderModel: BinderPostModel
  ): Promise<BaseResponse> {
    const validationResult = this.validate.isValidForPostsBinder(
      binderModel
    );
    if (!validationResult.validationResult) {
      this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
      this.result.errorInfo.detail = validationResult.reason;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.binderService.addPostToBinder(binderModel);
  }

  @Post('/removePostFromBinder')
  @OpenAPI2({
    description: 'A user can remove a post from their binder',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removePostFromBinder(
    @Body2() binderModel: BinderPostModel
  ): Promise<BaseResponse> {
    try {
      const validationResult = this.validate.isValidForPostsBinder(
        binderModel
      );
      if (!validationResult.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResult.reason;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.binderService.removePostFromBinder(binderModel);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
