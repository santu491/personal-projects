import { headers, memberInfo, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  IGbdMemberContactRequest,
  IGbdMemberContactResponse, IMemberContactResponse, IMemberTwoFAParameters,
  IPhoneNumber
} from '../models/memberModel';

@Service()
export class MemberContactsGateway {
  constructor(private _http: RestClient) { }
  memberGetContactsApi(
    token: string,
    request: IMemberTwoFAParameters
  ): Promise<IMemberContactResponse> {
    return this._http.invoke<IMemberContactResponse>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.memberContactsDetails,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.MEMBER_GET_CONTACT_DETAILS
    });
  }

  getGbdMemberContacts(
    token: string,
    guid: string,
    payload: IGbdMemberContactRequest
  ): Promise<IGbdMemberContactResponse> {
    return this._http.invoke<IGbdMemberContactResponse>({
      allowExceptions: true,
      url: APP.config.restApi.psgbdTenant.gbdContactsDetails,
      method: HttpMethod.Post,
      data: payload,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.META_TRANS_ID,
          value: guid
        },
        {
          name: headers.META_SENDER_APP,
          value: memberInfo.APPLICATION
        },
        APP.config.restApi.gbdHeader
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GBD_CONTACT_DETAILS
    });
  }

  getGbdMemberContactsSynthetic(
    token: string,
    guid: string,
    payload: IGbdMemberContactRequest
  ): Promise<IGbdMemberContactResponse> {
    return this._http.invoke<IGbdMemberContactResponse>({
      allowExceptions: true,
      url: APP.config.restApi.member.gbdContactsDetailsSynthetic,
      method: HttpMethod.Post,
      data: payload,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.syntheticAPIKey
        },
        {
          name: headers.META_TRANS_ID,
          value: guid
        },
        {
          name: headers.META_SENDER_APP,
          value: memberInfo.APPLICATION
        },
        APP.config.restApi.syntheticHeader
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GBD_CONTACT_DETAILS_SYNTHETIC
    });
  }

  memberRecoveryContactApi(
    token: string,
    username: string
  ): Promise<IPhoneNumber> {
    return this._http.invoke<IPhoneNumber>({
      allowExceptions: true,
      url: APP.config.restApi.onPrem.recoveryContact,
      method: HttpMethod.Get,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.USER_NAME,
          value: username
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.MEMBER_RECOVERY_CONTACT
    });
  }
}
