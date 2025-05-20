import {
  API_RESPONSE,
  cacheKey,
  memberInfo,
  Result
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { TokenGateway } from '../gateways/onPremTokenGateway';
import { ProfileUpdateARNGateway } from '../gateways/profileUpdateARNGateway';
import {
  IGbdMemberContactResponse,
  IMedicaidARNRequest,
  IMedicaidUpdateARN,
  IProfileContactNumbers,
  IProfileRecoveryNumber,
  IUserAccountSummary
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { AccessTokenHelper } from './helpers/accessTokenHelper';
import { LoginServiceHelper } from './helpers/loginServiceHelper';
import { MemberServiceHelper } from './helpers/memberServiceHelper';

@Service()
export class ProfileMedicaidARNService {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private memberServiceHelper: MemberServiceHelper,
    private loginServiceHelper: LoginServiceHelper,
    private profileUpdateARNGateway: ProfileUpdateARNGateway,
    private onPremTokenGateway: TokenGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async gbdContactDetails(
    recoveryRequest: IProfileRecoveryNumber
  ): Promise<BaseResponse> {
    try {
      const summary = await this.memberServiceHelper.getGbdMemberSummary(
        recoveryRequest.usernm,
        (await this.onPremTokenGateway.psgbdTenantToken()).access_token,
        false
      );
      const psgbdToken = await this.accessTokenHelper.getPSGBDTenantOAuthToken(
        cacheKey.psgbdToken
      );

      if (!summary.data.isSuccess) {
        return summary;
      }
      const accountSummary = summary.data.value as IUserAccountSummary;
      const isDummy = await this.loginServiceHelper.isDemoUser(
        accountSummary.username
      );
      const contactResponse = await this.memberServiceHelper.getGBDContactDetails(
        psgbdToken.access_token,
        accountSummary.hcid,
        isDummy
      );
      const contactsDetails = contactResponse.data
        .value as IGbdMemberContactResponse;
      const isContactsThere = !contactsDetails.contactDetails;
      const userContactsResponse = await this.getContacts(
        isContactsThere,
        contactsDetails
      );
      return this.result.createSuccess(userContactsResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateMedicaidRecoveryNumber(
    recoveryRequest: IMedicaidUpdateARN
  ): Promise<BaseResponse> {
    try {
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      const summary = await this.memberServiceHelper.getGbdMemberSummary(
        recoveryRequest.usernm,
        (await this.onPremTokenGateway.psgbdTenantToken()).access_token,
        false
      );

      if (!summary.data.isSuccess) {
        return summary;
      }
      const accountSummary = summary.data.value as IUserAccountSummary;
      const requestObject: IMedicaidARNRequest = new Object();
      requestObject['data'] = {
        hcId: accountSummary?.hcid,
        phoneType: recoveryRequest.phoneType,
        phoneNumber: recoveryRequest?.phoneNumber
      };
      requestObject.header = APP.config.restApi.gbdHeader;
      const recoveryResponse = await this.profileUpdateARNGateway.medicaidRecoveryNumberUpdateApi(
        onPremToken.access_token,
        requestObject
      );
      if (recoveryResponse?.status === 400) {
        this.result.errorInfo.title = API_RESPONSE.messages.arnUpdateErrorTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.arnUpdateErrorDetails;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      recoveryResponse.updatedStatus = 'Success';
      return this.result.createSuccess(recoveryResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async getContacts(
    isContactsThere: boolean,
    contactsDetails: IGbdMemberContactResponse
  ): Promise<IProfileContactNumbers> {
    const userPhoneNumbers: IProfileContactNumbers = new Object();
    if (isContactsThere) {
      userPhoneNumbers.recoveryNumbers = [];
      userPhoneNumbers.actualNumbers = [];
    } else {
      const contacts = contactsDetails?.contactDetails;
      userPhoneNumbers.recoveryNumbers = contacts
        .filter(
          (num) =>
            num.source === memberInfo.ARN &&
            num.contactType === memberInfo.PHONE
        )
        .map((n) => {
          return { phoneNbr: n.contactValue, phoneType: n.contactSubType };
        });
      userPhoneNumbers.actualNumbers = contacts
        .filter(
          (num) =>
            num.source !== memberInfo.ARN &&
            num.contactType === memberInfo.PHONE
        )
        .map((n) => {
          return { phoneNbr: n.contactValue, phoneType: n.contactSubType };
        });
    }
    return userPhoneNumbers;
  }
}
