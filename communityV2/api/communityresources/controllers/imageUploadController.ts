import { BaseController, DEFAULT_RESPONSES, Result } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Body2, OpenAPI2, RequestContext } from '@anthem/communityapi/utils';
import { JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { ProfilePicture } from '../models/userModel';
import { ImageUploadService } from '../services/imageUploadService';

@JsonController(API_INFO.securePath)
export class ImageUploadController extends BaseController {
  constructor(
    private _imageUploadService: ImageUploadService,
    private _result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Post('/uploadImage/base64')
  @OpenAPI2({
    description: 'Upload A Image',
    responses:{ ...DEFAULT_RESPONSES }
  })
  public async addProfilePictureBase64(
    @Body2() model: ProfilePicture
  ): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      return this._imageUploadService.uploadImageBase64(model.profilePicture, currentUser.id);
    }
    catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }
}
