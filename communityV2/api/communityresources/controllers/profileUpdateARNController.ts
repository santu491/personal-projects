import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES, memberInfo, Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2,
  OpenAPI2
} from '@anthem/communityapi/utils';
import { JsonController, Post, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  IProfileRecoveryNumber
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { ProfileCommercialARNService } from '../services/profileCommercialARNService';
import { ProfileMedicaidARNService } from '../services/profileMedicaidARNService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.PROFILE)
export class ProfileUpdateARNController extends BaseController {
  constructor(
    private result: Result,
    private profileCommercialARNService: ProfileCommercialARNService,
    private profileMedicaidARNService: ProfileMedicaidARNService,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Put('/recoveryNumbers')
  @OpenAPI2({
    description: 'update contact numbers for manage profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateRecoveryContactNumber(
    @Body2() recoveryRequest: IProfileRecoveryNumber
  ): Promise<BaseResponse> {
    try {
      if (!recoveryRequest?.usernm) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!recoveryRequest.memberType) {
        this.result.errorInfo.title = API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noMemberTypeDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const gbdMember: boolean = recoveryRequest.memberType === memberInfo.GBD_MEMBER;
      return gbdMember ? this.profileMedicaidARNService.updateMedicaidRecoveryNumber(recoveryRequest) : this.profileCommercialARNService.recoveryContactNumber(recoveryRequest, 'put');
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/recoveryNumbers')
  @OpenAPI2({
    description: 'add recovery contact numbers for manage profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addRecoveryContactNumber(
    @Body2() recoveryRequest: IProfileRecoveryNumber
  ): Promise<BaseResponse> {
    try {
      if (!recoveryRequest?.usernm) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.profileCommercialARNService.recoveryContactNumber(recoveryRequest, 'post');
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
