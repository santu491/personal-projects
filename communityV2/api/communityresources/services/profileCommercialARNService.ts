import {
  API_RESPONSE,
  cacheKey,
  memberInfo,
  requestName,
  Result
} from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { ProfileUpdateARNGateway } from '../gateways/profileUpdateARNGateway';
import {
  IProfileContactNumbers, IProfileRecoveryNumber
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { AccessTokenHelper } from './helpers/accessTokenHelper';

@Service()
export class ProfileCommercialARNService {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private profileUpdateARNGateway: ProfileUpdateARNGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getUserContactNumbers(memberId: string): Promise<BaseResponse> {
    try {
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      const userPhoneNumbers = await this.getCommercialPhoneNumbers(
        onPremToken.access_token,
        memberId
      );
      const phoneNumbers = userPhoneNumbers.data.value as string[];
      return this.result.createSuccess(phoneNumbers);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommercialPhoneNumbers(
    token: string,
    memberId: string
  ): Promise<BaseResponse> {
    try {
      const userPhoneNumbers: IProfileContactNumbers = new Object();
      const commercialContacts = [];
      const phoneNumbers = await this.profileUpdateARNGateway.commercialTelephoneNumberApi(
        token,
        memberId
      );
      if (phoneNumbers?.telephone && phoneNumbers?.telephone?.length !== 0) {
        phoneNumbers?.telephone.forEach((n) =>
          commercialContacts.push({ phoneNbr: n.phoneNbr, phoneType: memberInfo.VOICE })
        );
      }
      const textNumbers = await this.profileUpdateARNGateway.commercialTextNumberApi(
        token,
        memberId
      );

      if (
        textNumbers?.textNumberDetails &&
        textNumbers?.textNumberDetails?.length !== 0
      ) {
        textNumbers?.textNumberDetails.forEach((n) =>
          commercialContacts.push({ phoneNbr: n.deviceNumber, phoneType: memberInfo.TEXT })
        );
      }
      userPhoneNumbers.actualNumbers = commercialContacts;
      return this.result.createSuccess(userPhoneNumbers);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async recoveryContactNumber(
    recoveryRequest: IProfileRecoveryNumber,
    method: string
  ): Promise<BaseResponse> {
    try {
      const requestObject: IProfileRecoveryNumber = new Object();
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      requestObject.data = recoveryRequest.data;
      requestObject.usernm = recoveryRequest.usernm;
      if (method === 'get') {
        requestObject.requestName = requestName.GET_COMMERCIAL_RECOVERYNBR;
        requestObject.method = HttpMethod.Get;
        requestObject.usernm = recoveryRequest.usernm;
      } else if (method === 'put') {
        requestObject.requestName = requestName.UPDATE_COMMERCIAL_RECOVERYNBR;
        requestObject.method = HttpMethod.Put;
      } else {
        requestObject.requestName = requestName.ADD_COMMERCIAL_RECOVERYNBR;
        requestObject.method = HttpMethod.Post;
      }
      const recoveryResponse = await this.profileUpdateARNGateway.commercialRecoveryNumberApi(
        onPremToken.access_token,
        requestObject
      );
      if (
        recoveryResponse?.status === 400 ||
        (!recoveryResponse?.phoneNbrDetails && method !== 'post')
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.internalServerError;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      if (method === 'get') {
        const arnContacts: IProfileContactNumbers = new Object();
        arnContacts.recoveryNumbers = !recoveryResponse?.phoneNbrDetails.phoneNbr ? [] : new Array({ phoneNbr: recoveryResponse?.phoneNbrDetails.phoneNbr, phoneType:`${memberInfo.VOICE}/${memberInfo.TEXT}` }) ;
        return this.result.createSuccess(arnContacts);
      }
      return this.result.createSuccess(recoveryResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
