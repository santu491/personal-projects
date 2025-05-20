import {
  API_RESPONSE,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { OpenAPI2, Param2, QueryParam2, RequestContext } from '@anthem/communityapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { LibraryService } from '../services/libraryService';
import { PartnerService } from '../services/partnerService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.LIBRARY)
export class LibraryController extends BaseController {
  constructor(
    private libraryService: LibraryService,
    private partnerService: PartnerService,
    private validate: Validation,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/partner')
  @OpenAPI2({
    description: 'Get list of partners from section',
    responses: { ...DEFAULT_RESPONSES }
  })
  getPartnerList(
  @QueryParam2('communityId', { required: true }) communityId: string,
    @QueryParam2('sectionId', { required: true }) sectionId: string,
    @QueryParam2('language') language: string
  ) {
    language = language ?? TranslationLanguage.ENGLISH;
    if (!this.validate.isHex(communityId) || !this.validate.isHex(sectionId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    return this.partnerService.getPartnerList(communityId, sectionId, language);
  }

  @Get('/:communityId')
  @OpenAPI2({
    description: 'Gets the Library landing page associated with that Community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getLibraryByCommunityId(@Param2('communityId') communityId: string,
    @QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }

      if (this.validate.isNullOrWhiteSpace(communityId)){
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.noIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      if (currentUser.id == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }

      if (!this.validate.isHex(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;

        return this.result.createError([this.result.errorInfo]);
      }
      const library = await this.libraryService.getLibraryByCommunityId(communityId, currentUser.id, language);
      return library;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/referenceContent/:libraryId/:title')
  @OpenAPI2({
    description: 'Gets the content by given reference and topic',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getReferenceContent(
    @Param2('libraryId') libraryId: string,
      @Param2('title') title: string,
      @QueryParam2('language') language: string,
      @QueryParam2('htmlDescription') htmlDescription: boolean): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }

      if (this.validate.isNullOrWhiteSpace(libraryId)){
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.noIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      if (!this.validate.isHex(libraryId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidLibraryId;

        return this.result.createError([this.result.errorInfo]);
      }
      const link = `/v2/library/referenceContent/${libraryId}/${title}?htmlDescription=${htmlDescription}`;
      const library = await this.libraryService.getReferenceContent(libraryId, title, htmlDescription, language, link);
      return library;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/content/:libraryId')
  @OpenAPI2({
    description: 'Gets the Library page associated with that Content\'s library Id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getLibraryContent(@Param2('libraryId') libraryId: string,
    @QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }

      if (this.validate.isNullOrWhiteSpace(libraryId)){
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.noIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(libraryId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidLibraryId;
        return this.result.createError([this.result.errorInfo]);
      }
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (currentUser.id == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const library = await this.libraryService.getLibraryContent(libraryId, language);
      return library;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
