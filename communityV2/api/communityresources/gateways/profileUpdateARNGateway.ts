import { headers, memberInfo, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  IMedicaidARNRequest,
  IMedicaidUpdateARN,
  IPhoneNumber, IProfilePhoneNumber,
  IProfileRecoveryNumber, ITextPhoneNumber
} from '../models/memberModel';

@Service()
export class ProfileUpdateARNGateway {
  constructor(private _http: RestClient) {}
  commercialTelephoneNumberApi(
    token: string,
    memberId: string
  ): Promise<IProfilePhoneNumber> {
    return this._http.invoke<IProfilePhoneNumber>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialTelephoneNumber,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: false,
          name: headers.MEMBERID,
          value: memberId
        }
      ],
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_COMMERCIAL_TELEPHONE
    });
  }

  commercialTextNumberApi(
    token: string,
    memberId: string
  ): Promise<ITextPhoneNumber> {
    return this._http.invoke<ITextPhoneNumber>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialTextNumber,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: false,
          name: headers.MEMBERID,
          value: memberId
        }
      ],
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_COMMERCIAL_TXTNBR
    });
  }

  commercialRecoveryNumberApi(
    token: string,
    request: IProfileRecoveryNumber
  ): Promise<IPhoneNumber> {
    return this._http.invoke<IPhoneNumber>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialRecoveryNumber,
      method: HttpMethod[request.method],
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        }
      ],
      ...request,
      responseType: ResponseType.JSON
    });
  }

  medicaidRecoveryNumberUpdateApi(
    token: string,
    request: IMedicaidARNRequest
  ): Promise<IMedicaidUpdateARN> {
    return this._http.invoke<IMedicaidUpdateARN>({
      allowExceptions: true,
      url: APP.config.restApi.onPrem.medicaidRecoveryNumber,
      method: HttpMethod.Put,
      data: request.data,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.META_SENDER_APP,
          value: memberInfo.APPLICATION
        },
        request.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.UPDATE_MEDICAID_RECOVERYNBR
    });
  }
}
