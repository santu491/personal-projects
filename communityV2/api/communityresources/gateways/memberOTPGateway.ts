import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  ISendOtpRequest,
  ISendOtpResponse, IValidateOtpResponse, SendOtpRequest, ValidateOtpModel
} from '../models/memberModel';

@Service()
export class MemberOTPGateway {
  constructor(private _http: RestClient) {}
  loginValidateOtpApi(
    token: string,
    request: ValidateOtpModel
  ): Promise<IValidateOtpResponse> {
    return this._http.invoke<IValidateOtpResponse>({
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.memberValidateOtp,
      method: HttpMethod.Post,
      data: {
        otp: request.otp
      },
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
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        },
        {
          name: headers.META_PING_RISK_ID,
          value: request.pingRiskId
        },
        {
          name: headers.META_PING_DEVICE_ID,
          value: request.pingDeviceId
        },
        {
          name: headers.META_PING_USER_ID,
          value: request.pingUserId
        },
        {
          name: headers.META_BRAND_CODE,
          value: request.metaBrandCode
        },
        {
          name: headers.COOKIE,
          value: request.cookie
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.MEMBER_LOGIN_VALIDATE_OTP
    });
  }

  memberSendOtp(
    token: string,
    url: string,
    payload: SendOtpRequest,
    request: ISendOtpRequest
  ): Promise<ISendOtpResponse> {
    return this._http.invoke<ISendOtpResponse>({
      allowExceptions: true,
      url: url,
      method: HttpMethod.Post,
      data: payload,
      headers: [
        {
          name: headers.API_KEY,
          value: request.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.userName
        },
        {
          name: headers.META_BRAND_CODE,
          value: request.metaBrandCode
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        },
        {
          name: headers.COOKIE,
          value: request.cookie
        }
      ],
      responseType: ResponseType.JSON,
      requestName: request.requestName
    });
  }
}
