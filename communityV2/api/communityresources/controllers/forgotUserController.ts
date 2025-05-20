import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES, Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Body2, OpenAPI2 } from '@anthem/communityapi/utils';
import { JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  ForgotUserModel, UpdatePasswordModel
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { ForgotUserService } from '../services/forgotUser/forgotUserService';
import { MemberService } from '../services/memberService';

@JsonController(API_INFO.contextPath + BASE_URL_EXTENSION.MEMBER)
export class ForgotUserController extends BaseController {
  constructor(
    private memberService: MemberService,
    private forgotUserService: ForgotUserService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Post('/forgotUser')
  @OpenAPI2({
    description: 'GBD or commercial member forgot user and password',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async forgotUser(
    @Body2() forgotUserModel: ForgotUserModel
  ): Promise<BaseResponse> {
    try {
      if (!forgotUserModel?.fname) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.noSufficientFupDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!forgotUserModel?.lname) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.noSufficientFupDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!forgotUserModel?.dob) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.noSufficientFupDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const isIdAvailable: boolean = !forgotUserModel.hcid && !forgotUserModel.employeeId && !forgotUserModel.email && !forgotUserModel.studentId;
      if (isIdAvailable) {
        this.result.errorInfo.title = API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noSufficientFupDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.forgotUserService.forgotUser(forgotUserModel);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/updateSecret')
  @OpenAPI2({
    description: 'GBD or commercial member update password',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateSecret(
    @Body2() updatePasswordModel: UpdatePasswordModel
  ): Promise<BaseResponse> {
    try {
      if (!updatePasswordModel?.username) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!updatePasswordModel?.newPassword) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noPasswordDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.memberService.updateSecret(updatePasswordModel);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
