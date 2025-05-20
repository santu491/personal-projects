import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Body2, OpenAPI2, Param2, QueryParam2 } from '@anthem/communityapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { PageParam } from '../models/pageParamModel';
import { PromptModel } from '../models/promptModel';
import { BaseResponse } from '../models/resultModel';
import { PromptService } from '../services/promptService';

@JsonController(API_INFO.securePath)
export class PromptController extends BaseController {
  constructor(
    private promptService: PromptService,
    private validate: Validation,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/prompt')
  @OpenAPI2({
    description: 'Get All prompts',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllPrompt(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const pageParams: PageParam = { pageNumber, pageSize, sort };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      const prompt = await this.promptService.getAllPrompt(pageParams, language);
      return prompt;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/prompt/:id')
  @OpenAPI2({
    description: 'Get a specific prompt',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPromptById(@Param2('id') id: string, @QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }
      const prompt = await this.promptService.getPromptById(id, language);
      return prompt;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/prompt/community/:id')
  @OpenAPI2({
    description: 'Get all prompts for a community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getByCommunityId(@Param2('id') id: string,@QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }
      const prompt = await this.promptService.getByCommunityId(id, language);
      return prompt;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/prompt')
  @OpenAPI2({
    description: 'Create a prompt for a community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async createPrompt(@Body2() model: PromptModel): Promise<BaseResponse> {
    try {
      const validationResponse = this.validate.isValidPrompt(model);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      const prompt = await this.promptService.create(model);
      return prompt;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/prompt/communitiesList/:communityName/:language')
  @OpenAPI2({
    description: 'Get the list of communities to be listed in prompt option',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCommunitiesList(
    @Param2('communityName') community: string,
      @Param2('language') language: string
  ): Promise<BaseResponse> {
    return this.promptService.getCommunitiesList(community, language);
  }
}
