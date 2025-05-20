import {
  API_RESPONSE,
  cacheKey,
  memberInfo,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { MemberGateway } from '../gateways/memberGateway';
import { ProfileCredentialsGateway } from '../gateways/profileCredentialsGateway';
import { IProfileCredentials, MemberType } from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { AccessTokenHelper } from './helpers/accessTokenHelper';
import { MemberServiceHelper } from './helpers/memberServiceHelper';

@Service()
export class ProfileCredentialService {
  constructor(
    private result: Result,
    private memberServiceHelper: MemberServiceHelper,
    private accessTokenHelper: AccessTokenHelper,
    private memberGateway: MemberGateway,
    private profileCredentialsGateway: ProfileCredentialsGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async profileUpdatePassword(
    updatePasswordRequest: IProfileCredentials
  ): Promise<BaseResponse> {
    try {
      const memberType = new MemberType();
      memberType.isGbdMember =
        updatePasswordRequest?.memberType === memberInfo.GBD_MEMBER
          ? true
          : false;
      const updateCredentialsRequest = updatePasswordRequest;
      updateCredentialsRequest.username = updatePasswordRequest.currentUsernm;
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      const authDetails = await this.accessTokenHelper.getOauthToken(
        cacheKey.memberToken,
        false
      );
      let updatedResponse: IProfileCredentials;
      if (memberType.isGbdMember) {
        const updatePasswordUrl = APP.config.awsEndpoints.gbdUpdatePassword;
        updatePasswordRequest = await this.memberServiceHelper.generateUpdatePasswordObject(
          updateCredentialsRequest
        );
        const cumulatedObject = await this.memberServiceHelper.cumulateWebUserData(
          updateCredentialsRequest.memberType,
          onPremToken.access_token,
          authDetails.access_token
        );
        updatedResponse = await this.memberGateway.updateNewPasswordApi(
          updatePasswordUrl,
          cumulatedObject,
          updatePasswordRequest
        );
      } else {
        updatedResponse = await this.profileCredentialsGateway.commercialProfileCredentialUpdateApi(
          onPremToken.access_token,
          updatePasswordRequest
        );
      }

      if (updatedResponse?.status === 400) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        if (updatedResponse.body.exceptions[0].code === '5119' || updatedResponse.body.exceptions[0].code === 'WRONGCURRPASSWORD') {
          this.result.errorInfo.detail =
          API_RESPONSE.messages.commercialCurrentPasswordError;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
          return this.result.createError([this.result.errorInfo]);
        } else if (updatedResponse.body.exceptions[0].code === '5101' || updatedResponse.body.exceptions[0].code === 'PWDALREADYUSED') {
          this.result.errorInfo.detail =
          API_RESPONSE.messages.commercialNewPasswordError;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[470];
          return this.result.createError([this.result.errorInfo]);
        } else if (updatedResponse.body.exceptions[0].code === '5029') {
          this.result.errorInfo.detail =
          API_RESPONSE.messages.commercialCredentialsMatchError;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[471];
          return this.result.createError([this.result.errorInfo]);
        }
      }
      if (updatedResponse?.status!==400 && Object.keys(updatedResponse).length > 0 && !updatedResponse?.responseContext) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.profileSecretUpdateError;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      updatedResponse['updateStatus'] = 'Success';
      return this.result.createSuccess(updatedResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
