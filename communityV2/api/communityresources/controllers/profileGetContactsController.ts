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
  OpenAPI2, QueryParam2
} from '@anthem/communityapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  IProfileRecoveryNumber
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { ProfileCommercialARNService } from '../services/profileCommercialARNService';
import { ProfileMedicaidARNService } from '../services/profileMedicaidARNService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.PROFILE)
export class ProfileGetContactsController extends BaseController {
  constructor(
    private profileCommercialARNService: ProfileCommercialARNService,
    private profileMedicaidARNService: ProfileMedicaidARNService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/contactNumbers')
  @OpenAPI2({
    description: 'Get list of contact numbers for manage profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getUserContactNumbers(
    @QueryParam2('memberId') memberId: string
  ): Promise<BaseResponse> {
    try {
      if (!memberId) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.mbrUidMissing;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.profileCommercialARNService.getUserContactNumbers(memberId);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/recoveryNumbers')
  @OpenAPI2({
    description: 'Get recovery contact number for manage profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getRecoveryContactNumbers(
    @QueryParam2('usernm') usernm: string,
      @QueryParam2('memberType') memberType: string
  ): Promise<BaseResponse> {
    try {
      const gbdMember: boolean = memberType === memberInfo.GBD_MEMBER;
      if (!usernm) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!memberType) {
        this.result.errorInfo.title = API_RESPONSE.messages.missingRequiredParameters;
        this.result.errorInfo.detail = API_RESPONSE.messages.noMemberTypeDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const reqObj: IProfileRecoveryNumber = new Object();
      reqObj.usernm = usernm;
      reqObj.memberType = memberType;
      return gbdMember ? this.profileMedicaidARNService.gbdContactDetails(reqObj) : this.profileCommercialARNService.recoveryContactNumber(reqObj, 'get');
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
