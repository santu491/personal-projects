import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  memberInfo,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Body2, OpenAPI2 } from '@anthem/communityapi/utils';
import { JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  QAValidationModel,
  SendOtpModel,
  ValidateOtpModel
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { MemberService } from '../services/memberService';
import { SendOneTimePasswordService } from '../services/oneTimePassword/sendOneTimePasswordService';
import { ValidateOneTimePasswordService } from '../services/oneTimePassword/validateOneTimePasswordService';

@JsonController(API_INFO.contextPath + BASE_URL_EXTENSION.MEMBER)
export class ValidationController extends BaseController {
  constructor(
    private memberService: MemberService,
    private sendOneTimePasswordService: SendOneTimePasswordService,
    private validateOneTimePasswordService: ValidateOneTimePasswordService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Post('/otp/send')
  @OpenAPI2({
    description: 'GBD or commercial member 2FA login send otp',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async memberSendOtp(
    @Body2() sendOtpModel: SendOtpModel
  ): Promise<BaseResponse> {
    try {
      if (!sendOtpModel?.channel) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noEmailTextChannel;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!sendOtpModel?.userName) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!sendOtpModel?.contactUid) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noContactDetails;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.sendOneTimePasswordService.memberSendOtp(sendOtpModel);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/otp/validate')
  @OpenAPI2({
    description: 'GBD or commercial member 2FA login process validate otp',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async loginValidateOtp(
    @Body2() validateOtpModel: ValidateOtpModel
  ): Promise<BaseResponse> {
    try {
      const gbdMember: boolean =
        validateOtpModel.memberType === memberInfo.GBD_MEMBER;
      if (!validateOtpModel?.otp) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noOtpDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!validateOtpModel?.usernm) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return gbdMember
        ? this.validateOneTimePasswordService.medicaidValidateOtp(
          validateOtpModel
        )
        : this.validateOneTimePasswordService.commercialValidateOtp(
          validateOtpModel
        );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/securityAnswers/validate')
  @OpenAPI2({
    description: 'GBD or commercial member 2FA login secure Answer validate',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async loginAnswerValidate(
    @Body2() qaValidationModel: QAValidationModel
  ): Promise<BaseResponse> {
    try {
      if (!qaValidationModel?.username) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }
      if (!qaValidationModel?.secretAnswerText1) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noSecurityAnswer;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[473];
        return this.result.createError([this.result.errorInfo]);
      }
      return this.memberService.loginAnswerValidate(qaValidationModel);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
