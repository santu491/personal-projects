import {
  API_RESPONSE,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityadminapi/common';
import {
  Body2,
  OpenAPI2,
  Param2,
  QueryParam2
} from '@anthem/communityadminapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  EditContentRequest,
  HelpfulInfoLibRequest,
  LibraryDetail,
  LibrarySectionRequest
} from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { ArticleService } from '../services/articleService';
import { HelpfulInfoService } from '../services/helpfulInfoService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.HELPFULINFO)
export class HelpfulInfoController extends BaseController {
  constructor(
    private helpfulService: HelpfulInfoService,
    private articleService: ArticleService,
    private result: Result,
    private validate: Validation
  ) {
    super();
  }

  @Get('/communityLibrary')
  @OpenAPI2({
    description: 'Get the community helpfulInfo library.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCommunityLibrary(
    @QueryParam2('communityId', { required: true }) communityId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.helpfulService.getCommunityHelpfulInfo(communityId);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/commonLibrary')
  @OpenAPI2({
    description: 'Get the community helpfulInfo library.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getCommonLibrary(): Promise<BaseResponse> {
    try {
      return await this.helpfulService.getCommonHelpfulInfo();
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/library')
  @OpenAPI2({
    description: 'Get the helpfulInfo library based on the Id.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getLibraryWithId(
    @QueryParam2('id', { required: true }) id: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.helpfulService.getHelpfulInfoById(id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/library')
  @OpenAPI2({
    description: 'Update the helpfulInfo content based on the Id.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateLibraryWithId(
    @Body2() payload: HelpfulInfoLibRequest
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.helpfulInfoId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.helpfulService.updateHelpfulInfo(
        payload.helpfulInfoId,
        payload
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/library/details')
  @OpenAPI2({
    description: 'Update the helpfulInfo details based on the Id.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateLibraryDetailsWithId(
    @Body2() payload: LibraryDetail
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.helpfulInfoId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      if (this.validate.isNullOrWhiteSpace(payload.en.title) || this.validate.isNullOrWhiteSpace(payload.es.title)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.badModelTitle;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.helpfulService.updateLibraryDetail(payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/communityLibrary/section')
  @OpenAPI2({
    description:
      'Update the section with in the library of helpfulInfo content based on the Id.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateLibrarySectionWithId(
    @Body2() payload: LibrarySectionRequest
  ): Promise<BaseResponse> {
    try {
      if (
        !this.validate.isHex(payload.sectionId) ||
        !this.validate.isHex(payload.communityId)
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.helpfulService.updateLibrarySection(payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/article')
  @OpenAPI2({
    description: 'Update the article data in section',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateArticleDetails(
    @Body2() payload: EditContentRequest
  ): Promise<BaseResponse> {
    try {
      if (
        !this.validate.isHex(payload.sectionId) ||
        !this.validate.isHex(payload.helpfulInfoId)
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.articleService.editArticle(payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/externalLink/:index')
  @OpenAPI2({
    description: 'Update the external link data in section',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateContentBasedOnIndex(
    @Param2('index') index: number,
      @Body2() payload: EditContentRequest
  ): Promise<BaseResponse> {
    try {
      if (
        !this.validate.isHex(payload.sectionId) ||
        !this.validate.isHex(payload.helpfulInfoId)
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.articleService.editContentBasedOnIndex(payload, index);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
