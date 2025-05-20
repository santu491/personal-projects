import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  OpenAPI2,
  Param2,
  QueryParam2,
  RequestContext
} from '@anthem/communityapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { CommunityService } from '../services/communityServies';

@JsonController(API_INFO.securePath)
export class CommunitiesController extends BaseController {
  constructor(
    private communityService: CommunityService,
    private validate: Validation,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/communities')
  @OpenAPI2({
    description: 'Get all Communities',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllCommunity(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const pageParams = { pageNumber, pageSize, sort };
      const validationResponse = this.validate.isValid(pageParams);
      if (!validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = validationResponse.reason;
        return this.result.createError(this.result.errorInfo);
      }
      const community = await this.communityService.getAllCommunities(
        pageParams,
        language
      );
      return community;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities/getAllCategories')
  @OpenAPI2({
    description: 'Get all categories and communities',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllCategories(@QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const community = await this.communityService.getAllCategories(language);
      return community;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities/nested')
  @OpenAPI2({
    description: 'Get all Communities in nested format',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAllCommunitiesNested(@QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const nestedCommunities = await this.communityService.getAllCommunitiesNested(language);
      return nestedCommunities;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities/getMyCommunities')
  @OpenAPI2({
    description: 'Get my communities',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getMyCommunities(
    @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return await this.communityService.getMyCommunities(
        language,
        currentUser.id
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities/recentActivity/:activeCommunityId')
  @OpenAPI2({
    description: 'Get specific activity for given community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getActivePageForCommunity(
    @Param2('activeCommunityId') activeCommunityId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(activeCommunityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.communityService.getActivePageForCommunity(activeCommunityId);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/communities/:id')
  @OpenAPI2({
    description: 'Get specific community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCommunityById(
    @Param2('id') id: string,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;

        return this.result.createError([this.result.errorInfo]);
      }
      const community = await this.communityService.getCommunityById(id, language);
      return community;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/community/image/:id')
  @OpenAPI2({
    description: 'Get community image string',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCommunityImage(@Param2('id') id: string): Promise<BaseResponse> {
    if (!this.validate.isHex(id)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const profileImage = await this.communityService.getCommunityImage(id);

    return profileImage;
  }
}
