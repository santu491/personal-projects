import {
  API_RESPONSE,
  BASE_URL_EXTENSION,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  Validation,
  allowedContentKeys,
  contentKeys,
  contentTypeKeys
} from '@anthem/communityadminapi/common';
import {
  Body2,
  OpenAPI2,
  Param2,
  QueryParam2
} from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post, Put, UploadedFile } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { TrainingLinkRequest } from '../models/contentModel';
import { LinkRequest } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { ContentService } from '../services/contentService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.CONTENT)
export class ContentController extends BaseController {
  constructor(
    private contentService: ContentService,
    private result: Result,
    private validate: Validation
  ) {
    super();
  }

  @Get('/deepLink')
  @OpenAPI2({
    description: 'Get the admin Content for Post Deeplinks',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAdminContent(): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      if (!adminUser) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.contentService.getAdminContent();
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/')
  @OpenAPI2({
    description: 'Update content with new version',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateContent(
    @UploadedFile('file') file,
      @QueryParam2('language', { required: true }) language: string,
      @QueryParam2('contentType', { required: true }) contentType: string
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      if (!file) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.fileNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      if (file.mimetype !== 'application/json') {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.uploadJsonFile;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.contentService.updateContent(
        file,
        currentUser.id,
        language,
        contentType
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/')
  @OpenAPI2({
    description: 'get content',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getContent(
    @QueryParam2('language', { required: true }) language: string,
      @QueryParam2('version', { required: true }) version: string,
      @QueryParam2('contentType', { required: true }) contentType: string
  ): Promise<BaseResponse> {
    try {
      return await this.contentService.getContent(
        language,
        version,
        contentType
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/options')
  @OpenAPI2({
    description: 'get distinct content options',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getContentOptions(
    @QueryParam2('key', { required: true }) key: string
  ): Promise<BaseResponse> {
    try {
      if (!allowedContentKeys.includes(key)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidContentKey;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.contentService.getContentOptions(key);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/versions')
  @OpenAPI2({
    description: 'get content versions based on content type and language',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getContentVersions(
    @QueryParam2('contentType', { required: true }) contentType: string,
      @QueryParam2('language', { required: true }) language: string
  ): Promise<BaseResponse> {
    try {
      return await this.contentService.getContentVersions(
        contentType,
        language
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/links')
  @OpenAPI2({
    description: 'Get the community articles for Deeplinks',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getDeeplinkData(
    @QueryParam2('language', { required: true }) language: string,
      @QueryParam2('communityId') communityId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (communityId && !this.validate.isHex(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.contentService.getDeeplinkContent(
        communityId,
        language
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/contentLink')
  @OpenAPI2({
    description: 'Get the community articles for Deeplinks',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getContentLink(
    @QueryParam2('libraryId', { required: true }) libraryId: string,
      @QueryParam2('language', { required: true }) language: string,
      @QueryParam2('communityId', { required: true }) communityId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.checkUserIdentity()) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      if (!this.validate.isHex(libraryId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      if (!this.validate.isHex(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return await this.contentService.getLibContent(
        libraryId,
        communityId,
        language
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/getLinkPreview')
  @OpenAPI2({
    description: 'Get Preview Images',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPreviewImages(
    @Body2() link: LinkRequest
  ): Promise<BaseResponse> {
    if (!this.validate.isValidUrl(link.url)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidUrl;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUrl;
      return this.result.createError(this.result.errorInfo);
    }
    return this.contentService.getPreviewImages(link.url);
  }

  @Get('/tou')
  @OpenAPI2({
    description: 'Get tou content',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getTouContent(@QueryParam2('language') language: string) {
    try {
      return await this.contentService.getTouContent(
        language ?? contentKeys.english
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/:contentType')
  @OpenAPI2({
    description: 'Get getContent',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getLatestContent(
    @Param2('contentType') contentType: string,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!contentTypeKeys.includes(contentType)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.contentNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.contentService.getLatestContent(contentType, language);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/training-link')
  @OpenAPI2({
    description: 'Edit training link collection',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateTrainingLinks(
  @Body2() payload: TrainingLinkRequest
  ) {
    try {
      if (this.validate.isNullOrWhiteSpace(payload?.sectionTitle)) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.incorrectModel;
        return this.result.createError([this.result.errorInfo]);
      }

      const isLinkNullish = Object.values(payload.link).some((link) => this.validate.isNullOrWhiteSpace(link.title) || this.validate.isNullOrWhiteSpace(link.url));
      if (payload?.link && payload?.link?.length !== 0 && isLinkNullish) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.incorrectModel;
        return this.result.createError([this.result.errorInfo]);
      }

      if (!this.validate.isNullOrWhiteSpace(payload?.sectionId)) {
        return await this.contentService.updateLinkSection(payload);
      }

      return await this.contentService.createLinkSection(payload);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
