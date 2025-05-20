import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES, Result,
  Validation
} from '@anthem/communityadminapi/common';
import {
  OpenAPI2,
  Param2,
  QueryParam2
} from '@anthem/communityadminapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { StoryService } from '../services/storyService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.STORY)
export class StoryController extends BaseController {
  constructor(
    private storyService: StoryService,
    private result: Result,
    private validate: Validation
  ) {
    super();
  }

  @Get('/removedStories')
  @OpenAPI2({
    description: 'Get All Removed Stories',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removedStory(): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      return await this.storyService.getRemovedStory();
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/removeStory/:id')
  @OpenAPI2({
    description: 'Remove a story',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeStory(
    @Param2('id') id: string
  ): Promise<BaseResponse> {
    try {
      const admin = this.validate.checkUserIdentity();
      if (admin === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.storyService.removeStory(id, admin);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/flag/:id')
  @OpenAPI2({
    description: 'Remove a story flag',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async storyFlag(
    @Param2('id', { required: true }) id: string,
      @QueryParam2('flag', { required: true }) flag: boolean
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
      return await this.storyService.storyFlag(id, flag);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
