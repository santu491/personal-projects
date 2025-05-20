import {
  allowedMimeTypes,
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  RequestValidation,
  Result,
  Validation,
  ValidationResponse
} from '@anthem/communityadminapi/common';
import { OpenAPI2, QueryParam2 } from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post, Put, UploadedFile } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { ImageService } from '../services/images/imageService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.IMAGE)
export class ImageController extends BaseController {
  constructor(
    private result: Result,
    private imageService: ImageService,
    private validate: Validation,
    private requestValdation: RequestValidation
  ) {
    super();
  }

  @Post('/')
  @OpenAPI2({
    description: 'Upload profile or post images',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async uploadImages(
    @UploadedFile('file') file,
      @QueryParam2('isProfile', { required: true }) isProfile: boolean,
      @QueryParam2('postId') postId: string
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      if (!file) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.missingImage;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!allowedMimeTypes.includes(file.mimetype)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = `${file.mimetype} ${API_RESPONSE.messages.invalidMimeType}`;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!isProfile && !this.validate.isHex(postId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidPostId;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.imageService.uploadImage(
        file,
        currentUser.id,
        isProfile,
        postId);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/')
  @OpenAPI2({
    description: 'update or delete profile or post images',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateImages(
    @UploadedFile('file', { required: false }) file,
      @QueryParam2('isProfile', { required: true }) isProfile: boolean,
      @QueryParam2('isDelete', { required: true }) isDelete: boolean,
      @QueryParam2('postId') postId: string
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      if (!isDelete && !file) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.missingImage;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!isDelete && !allowedMimeTypes.includes(file?.mimetype)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = `${file.mimetype} ${API_RESPONSE.messages.invalidMimeType}`;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!isProfile && !this.validate.isHex(postId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidPostId;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.imageService.updateImage(file,
        currentUser.id,
        isProfile,
        isDelete,
        postId);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/')
  @OpenAPI2({
    description: 'Get the image',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getImage(
  @QueryParam2('isProfile', { required: true }) isProfile: boolean,
    @QueryParam2('isUser', { required: true }) isUser: boolean,
    @QueryParam2('id') id: string) {
    try {
      const currentUser = this.validate.checkUserIdentity();
      const validationResponse: ValidationResponse = this.requestValdation.getImageValidation(isProfile, isUser, id);
      if (validationResponse.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validationResponse.reason;

        return this.result.createError(this.result.errorInfo);
      }

      return await this.imageService.getImage(currentUser, isProfile, isUser, id);

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
