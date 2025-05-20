import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  Result,
  TranslationLanguage, USER_IDENTITY
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2,
  OpenAPI2,
  Param2,
  QueryParam2,
  RequestContext
} from '@anthem/communityapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { RecommenededResourcesData } from '../models/searchTermModel';
import { SearchTermService } from '../services/searchTermService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.LOCALCATEGORY)
export class SearchTermController extends BaseController {
  constructor(
    private searchTermService: SearchTermService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/all')
  @OpenAPI2({
    description: 'Get All Search Terms',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllSearchTerms(@QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const healthStatus = await this.searchTermService.getAllSearchTerms(language);
      return healthStatus;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/allByUser')
  @OpenAPI2({
    description: 'Get All Local Categories Given By User',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllLocalCategoriesByUser(@QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return this.searchTermService.getAllLocalCategoriesByUser(currentUser.id, language);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/userRecommendedResources/:zipcode')
  @OpenAPI2({
    description: 'Get All User Recommended Resources',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getUserRecommendedResources(
    @Param2('zipcode') zipcode: number,
      @Body2() body: RecommenededResourcesData
  ): Promise<BaseResponse> {
    try {
      if (!zipcode || zipcode === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.noZipcodeTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noZipcodeDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      if (!body.language) {
        body.language = TranslationLanguage.ENGLISH;
      }

      const userIdentity = RequestContext.getContextItem(
        USER_IDENTITY
      );
      const currentUser = JSON.parse(userIdentity);

      return this.searchTermService.getUserRecommendedResources(
        currentUser.id,
        zipcode,
        body.resources,
        body.language
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
