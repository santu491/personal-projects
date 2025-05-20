import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  RequestValidation,
  Result,
  Validation
} from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PageParam } from '../models/pageParamModel';
import { BaseResponse } from '../models/resultModel';
import { ViewStoryRequest } from '../models/storyModel';
import { ViewStoryService } from '../services/viewStoryService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.STORY)
export class ViewStoryController extends BaseController {
  constructor(
    private result: Result,
    private validate: Validation,
    private viewStoryService: ViewStoryService,
    private requestValidator: RequestValidation
  ) {
    super();
  }

  @Post('/all')
  @OpenAPI2({
    description: 'Get all the stories based on the community (Published/Draft)',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getStories(
    @Body2() payload: ViewStoryRequest,
      @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      if (payload.communities) {
        const response = this.requestValidator.validCommunityArray(
          payload.communities
        );
        if (response.validationResult) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = response.reason;
          return this.result.createError(this.result.errorInfo);
        }
      }
      const pageParams: PageParam = { pageNumber, pageSize, sort };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      return await this.viewStoryService.getAllStories(
        pageParams,
        payload.type,
        payload.communities
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('')
  @OpenAPI2({
    description: 'Get the story based on the id',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getStory(
    @QueryParam2('id', { required: true }) id: string
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
      return await this.viewStoryService.getStory(id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
