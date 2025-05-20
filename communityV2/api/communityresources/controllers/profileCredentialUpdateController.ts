import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  memberInfo,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2,
  OpenAPI2
} from '@anthem/communityapi/utils';
import { JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  IProfileCredentials
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { ProfileCredentialService } from '../services/profileCredentialService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.PROFILE)
export class ProfileCredentialUpdateController extends BaseController {
  constructor(
    private profileCredentialService: ProfileCredentialService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Post('/updateSecret')
  @OpenAPI2({
    description: 'Commercial user password  update from manage profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateProfilePassword(
    @Body2() updatePasswordRequest: IProfileCredentials
  ): Promise<BaseResponse> {
    try {
      if (!updatePasswordRequest?.currentUsernm) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!updatePasswordRequest?.newPassword) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noNewPasswordDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!updatePasswordRequest?.currentPassword) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noCurrentPasswordDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const isMedicaidUser: boolean = updatePasswordRequest?.memberType === memberInfo.GBD_MEMBER;
      if (!updatePasswordRequest?.memberId && !isMedicaidUser) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.mbrUidMissing;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!updatePasswordRequest?.confirmPassword && !isMedicaidUser) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noConfirmPasswordDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.profileCredentialService.profileUpdatePassword(updatePasswordRequest);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
