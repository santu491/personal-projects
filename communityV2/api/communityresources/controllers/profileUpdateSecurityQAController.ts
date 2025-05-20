import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES, memberInfo, Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2,
  OpenAPI2, QueryParam2
} from '@anthem/communityapi/utils';
import { Get, JsonController, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  ISecurityQuestions
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { ProfileSecurityQACommercialService } from '../services/profileSecurityQACommercialService';
import { ProfileSecurityQAMedicaidService } from '../services/profileSecurityQAMedicaidService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.PROFILE)
export class ProfileUpdateSecurityQAController extends BaseController {
  constructor(
    private profileSecurityQACommercialService: ProfileSecurityQACommercialService,
    private profileSecurityQAMedicaidService: ProfileSecurityQAMedicaidService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/securityQuestions')
  @OpenAPI2({
    description: 'Get list of security questions from manage profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getSecurityQuestions(
    @QueryParam2('memberId') memberId?: string,
      @QueryParam2('webguid') webguid?: string,
      @QueryParam2('memberType') memberType?: string,
      @QueryParam2('dn') dn?: string
  ): Promise<BaseResponse> {
    try {
      if (!memberType) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.memberTypeMissing;
        return this.result.createError([this.result.errorInfo]);
      }
      const isMedicaidUser: boolean = memberType === memberInfo.GBD_MEMBER;
      if (isMedicaidUser && !dn) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noDnDetails;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!webguid && !isMedicaidUser) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.webGuidMissing;
        return this.result.createError([this.result.errorInfo]);
      } else if (!memberId && !isMedicaidUser) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.mbrUidMissing;
        return this.result.createError([this.result.errorInfo]);
      }
      return isMedicaidUser ? this.profileSecurityQAMedicaidService.getMedicaidSecretQuestionsList(dn) : this.profileSecurityQACommercialService.getSecurityQuestions(memberId, webguid);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/securityQuestions')
  @OpenAPI2({
    description: 'Update security questions from manage profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateSecurityQuestions(
    @Body2() securityQuestions: ISecurityQuestions
  ): Promise<BaseResponse> {
    try {
      if (!securityQuestions?.memberType) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.memberTypeMissing;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!securityQuestions?.usernm) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const isMedicaidUser: boolean = securityQuestions?.memberType === memberInfo.GBD_MEMBER;
      if (!securityQuestions?.webguid && !isMedicaidUser) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.webGuidMissing;
        return this.result.createError([this.result.errorInfo]);
      }
      else if (!securityQuestions?.memberId && !isMedicaidUser) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.mbrUidMissing;
        return this.result.createError([this.result.errorInfo]);
      }
      else if (!securityQuestions?.dn && isMedicaidUser) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noDnDetails;
        return this.result.createError([this.result.errorInfo]);
      }
      return isMedicaidUser ? this.profileSecurityQAMedicaidService.updateMedicaidSecretQuestions(securityQuestions) : this.profileSecurityQACommercialService.updateSecurityQuestions(securityQuestions);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
