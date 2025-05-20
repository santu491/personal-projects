import {
  API_RESPONSE,
  cacheKey,
  memberInfo,
  requestName,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { EncryptionUtil } from '@anthem/communityapi/security';
import { APP } from '@anthem/communityapi/utils';
import { BaseResponse } from 'api/communityresources/models/resultModel';
import { Service } from 'typedi';
import { MemberGateway } from '../../gateways/memberGateway';
import { SendOtpModel, SendOtpRequest } from '../../models/memberModel';
import { AccessTokenHelper } from '../helpers/accessTokenHelper';

@Service()
export class SendOneTimePasswordService {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private memberGateway: MemberGateway,
    @LoggerParam(__filename) private log: ILogger
  ) {}

  public async memberSendOtp(
    sendOtpModel: SendOtpModel
  ): Promise<BaseResponse> {
    try {
      const payload = new SendOtpRequest();
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      const sydneyMemberTenantToken =
      await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
        cacheKey.sydneyMemberToken
      );
      payload.channel = sendOtpModel.channel;
      let url: string;
      const apiKey = APP.config.restApi.onPrem.apiKey;
      let acccessToken = '';
      let otpRequestName: string;
      if (sendOtpModel.memberType === memberInfo.GBD_MEMBER) {
        acccessToken = onPremToken.access_token;
        url = APP.config.restApi.onPrem.medicaidSendOtp;
        otpRequestName = requestName.GBD_SEND_OTP;
        payload.recoveryContact = EncryptionUtil.decrypt(
          sendOtpModel.contactUid,
          'aes-symmetric'
        );
      } else {
        acccessToken = sydneyMemberTenantToken.access_token;
        url = APP.config.restApi.sydneyMemberTenant.commercialSendOtp;
        otpRequestName = requestName.COMMERCIAL_SEND_OTP;
        payload.contactUid = sendOtpModel.contactUid;
      }
      const requestObject = {
        userName: sendOtpModel.userName,
        model: memberInfo.loginTwoFAModel,
        metaBrandCode: memberInfo.APPLICATION,
        metaPersonType: sendOtpModel.metaPersonType,
        cookie: sendOtpModel.cookie,
        requestName: otpRequestName,
        apiKey
      };
      const otpResponse = await this.memberGateway.memberSendOtp(
        acccessToken,
        url,
        payload,
        requestObject
      );
      if (!otpResponse.pingDeviceId) {
        this.result.createError(otpResponse);
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.internalServerOtpError;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(otpResponse);
    } catch (error) {
      this.log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
