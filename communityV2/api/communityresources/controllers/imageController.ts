import {
  allowedMimeTypes,
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityapi/common';
import { OpenAPI2, Param2, QueryParam2, RequestContext } from '@anthem/communityapi/utils';
import { Get, JsonController, Post, Put, UploadedFile } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { AdminService } from '../services/adminService';
import { ImageService } from '../services/imageService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.IMAGE)
export class ImageController extends BaseController {
  constructor(
    private result: Result,
    private imageService: ImageService,
    private validate: Validation,
    private adminService: AdminService
  ) {
    super();
  }

  @Post('/')
  @OpenAPI2({
    description: 'Upload profile or post images',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async uploadImages(
    @UploadedFile('file') file
  ): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
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
      return await this.imageService.uploadImage(
        file,
        currentUser.id
      );
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
      @QueryParam2('isDelete', { required: true }) isDelete: boolean
  ): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
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
      return await this.imageService.updateImage(
        file,
        currentUser.id,
        isDelete
      );
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/')
  @OpenAPI2({
    description: 'Get profile or post images',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getImage(
  @QueryParam2('isProfile', { required: true }) isProfile: boolean,
    @QueryParam2('isUser', { required: true }) isUser: boolean,
    @QueryParam2('id') id: string
  ) {
    try {
      if (!this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.imageService.getImage(
        isUser,
        isProfile,
        id);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/adminUser/:adminId')
  @OpenAPI2({
    description: 'Get admin image string',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAdminImage(@Param2('adminId') adminId: string): Promise<BaseResponse> {
    if (!this.validate.isHex(adminId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const profileImage = await this.adminService.getAdminImage(adminId);

    return profileImage;
  }
}
