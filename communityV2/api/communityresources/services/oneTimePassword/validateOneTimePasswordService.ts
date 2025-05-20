import {
  API_RESPONSE,
  cacheKey,
  collections,
  memberInfo,
  mongoDbTables,
  Result
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { BaseResponse } from 'api/communityresources/models/resultModel';
import { Service } from 'typedi';
import { MemberGateway } from '../../gateways/memberGateway';
import { ValidateOtpModel } from '../../models/memberModel';
import { AccessTokenHelper } from '../helpers/accessTokenHelper';
import { MemberServiceHelper } from '../helpers/memberServiceHelper';

@Service()
export class ValidateOneTimePasswordService {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private memberGateway: MemberGateway,
    private mongoService: MongoDatabaseClient,
    private memberServiceHelper: MemberServiceHelper,
    @LoggerParam(__filename) private log: ILogger
  ) {}

  public async commercialValidateOtp(
    validateOtpModel: ValidateOtpModel
  ): Promise<BaseResponse> {
    try {
      const sydneyMemberTenantToken =
      await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
        cacheKey.sydneyMemberToken
      );
      validateOtpModel.model = memberInfo.loginTwoFAModel;
      validateOtpModel.metaBrandCode = memberInfo.APPLICATION;
      const otpValidationResponse = await this.memberGateway.loginValidateOtpApi(
        sydneyMemberTenantToken.access_token,
        validateOtpModel
      );

      if (!otpValidationResponse.valid) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.otpValidation;
        return this.result.createError([this.result.errorInfo]);
      }

      let response = otpValidationResponse;
      if (validateOtpModel.isLogin) {
        const user = await this.getUserData(validateOtpModel.usernm, validateOtpModel?.isPNLogin);
        response = user ? {
          ...otpValidationResponse,
          ...user.attributes
        }: otpValidationResponse;
      }
      return this.result.createSuccess(response);
    } catch (error) {
      this.log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async medicaidValidateOtp(
    validateOtpModel: ValidateOtpModel
  ): Promise<BaseResponse> {
    try {
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      validateOtpModel.model = memberInfo.loginTwoFAModel;
      validateOtpModel.metaBrandCode = memberInfo.APPLICATION;
      const validateMedicaidOtp = await this.memberGateway.medicaidValidateOtpApi(
        onPremToken.access_token,
        validateOtpModel
      );

      if (!validateMedicaidOtp.valid) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.otpValidation;
        return this.result.createError([this.result.errorInfo]);
      }
      let response = validateMedicaidOtp;
      if (validateOtpModel.isLogin) {
        const user = await this.getUserData(validateOtpModel.usernm, validateOtpModel?.isPNLogin);
        response = user ? {
          ...validateMedicaidOtp,
          ...user.attributes
        }: validateMedicaidOtp;
      }
      return this.result.createSuccess(response);
    } catch (error) {
      this.log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async getUserData(username: string, skipStoryPromotion: boolean) {
    const currentUser = await this.mongoService.readByValue(collections.USERS, { [mongoDbTables.users.username]: username });
    if (!skipStoryPromotion) {
      this.memberServiceHelper.manageStoryPromotion(currentUser);
    }
    return currentUser;
  }
}
