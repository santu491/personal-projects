import {
  API_RESPONSE,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation,
  articleProvider
} from '@anthem/communityadminapi/common';
import { Body2, OpenAPI2, Param2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  ArticleRequest,
  LibraryResponse,
  SectionEditRequest,
  SectionRequest
} from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { LibSectionService } from '../services/libSectionService';
import { LibraryService } from '../services/libraryService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.LIBRARY)
export class LibraryController extends BaseController {
  constructor(
    private libraryService: LibraryService,
    private result: Result,
    private validate: Validation,
    private sectionService: LibSectionService
  ) {
    super();
  }

  @Get('/:communityId')
  @OpenAPI2({
    description: 'Get library by communityid',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getLibraryByCommunityId(
    @Param2('communityId') communityId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.libraryService.getLibraryByCommunityId(communityId);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/section')
  @OpenAPI2({
    description: 'Add a section under community API',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async createSection(
    @Body2() model: SectionRequest
  ): Promise<BaseResponse> {
    try {
      if (
        !this.validate.isHex(model.section.en.communityId) ||
        model.section.en.communityId !== model.section.es.communityId
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.libraryService.createCommunitySection(model);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/section/edit')
  @OpenAPI2({
    description: 'Edit a section under community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async editSection(
    @Body2() model: SectionEditRequest
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(model.communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
        return this.result.createError([this.result.errorInfo]);
      }

      if (
        this.validate.isNullOrWhiteSpace(model.en.title) ||
        this.validate.isNullOrWhiteSpace(model.es.title)
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.badModelTitle;
        return this.result.createError([this.result.errorInfo]);
      }

      if (model?.subSectionIndex > -1) {
        return this.sectionService.editSubSectionDetails(model);
      } else {
        return this.sectionService.editSectionDetails(model);
      }
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/article/get')
  @OpenAPI2({
    description: 'Get article data based on ID',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getArticle(
    @Body2() articleData: ArticleRequest
  ): Promise<BaseResponse> {
    try {
      if (this.validate.isNullOrWhiteSpace(articleData.articleId)) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdTitle;
        return this.result.createError(this.result.errorInfo);
      }
      switch (articleData.provider) {
        case articleProvider[0]:
          return this.libraryService.getHealthwiseArticle(articleData);
        case articleProvider[1]:
          return this.libraryService.getMeredithArticle(articleData);
        default:
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.invalidArticleType;
          return this.result.createError(this.result.errorInfo);
      }
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/')
  @OpenAPI2({
    description: 'Add a new library',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async createLibrary(
    @Body2() model: LibraryResponse
  ): Promise<BaseResponse> {
    try {
      if (
        model.en.sections.length <= 0 ||
        model.en.sections.length !== model.es.sections.length
      ) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.invalidlanguageCompatibility;
        return this.result.createError(this.result.errorInfo);
      }

      if (
        !this.validate.isHex(model.en.helpfulInfoId) ||
        model.en.helpfulInfoId !== model.es.helpfulInfoId
      ) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError(this.result.errorInfo);
      }

      return this.libraryService.createLibrary(model);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
