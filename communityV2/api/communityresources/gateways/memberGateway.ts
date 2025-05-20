import { headers, memberInfo, requestName, unitOfTime } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import * as moment from 'moment';
import { Service } from 'typedi';
import { InternalAuthResponse } from '../models/internalRequestModel';
import {
  ICommercialAuthenticateRequest,
  ICommercialAuthenticateResponse,
  ICookieSaveResponse,
  IEligibilityResponse,
  IGbdMemberContactRequest,
  IGbdMemberContactResponse,
  IMemberAuthenticateRequest,
  IMemberAuthenticateResponse,
  IMemberContactResponse,
  IMemberInformation,
  IMemberPasswordRequest,
  IMemberQAValidateRequest,
  IMemberSearchRequest,
  IMemberSearchResponse,
  IMemberTwoFALoginThreatRequest,
  IMemberTwoFALoginThreatResponse,
  IMemberTwoFAParameters,
  IPhoneNumber,
  ISecurityQAResponse,
  ISendOtpRequest,
  ISendOtpResponse,
  IUpdatePasswordResponse,
  IValidateOtpResponse,
  SaveCookieModel,
  SaveCookieRequestDetails,
  SendOtpRequest,
  TreatRequestDetails,
  ValidateOtpModel,
  WebUserRequestData
} from '../models/memberModel';

@Service()
export class MemberGateway {
  constructor(private _http: RestClient) { }

  authToken(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: APP.config.awsEndpoints.oauthAccessToken,
      method: HttpMethod.Post,
      headers: [
        {
          name: headers.CONTENT_TYPE,
          value: headers.CONTENT_VALUE
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BASIC} ${APP.config.restApi.internal.basicTokenForAuth}`
        }
      ],
      data: headers.BODY_VALUE,
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: requestName.ON_PREM_TOKEN
    });
  }

  onPremSyntheticToken(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: APP.config.restApi.onPrem.syntheticAccessToken,
      method: HttpMethod.Post,
      headers: [
        {
          name: headers.CONTENT_TYPE,
          value: headers.CONTENT_VALUE
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.syntheticAPIKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BASIC} ${APP.config.restApi.internal.basicTokenForAuth}`
        }
      ],
      data: headers.BODY_VALUE,
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: requestName.ON_PREM_SYNTHETIC_TOKEN
    });
  }

  webUserSearch(
    searchUrl: string,
    webUserRequest: WebUserRequestData,
    request: IMemberSearchRequest
  ): Promise<IMemberSearchResponse> {
    return this._http.invoke<IMemberSearchResponse>({
      allowExceptions: true,
      url: searchUrl,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequest.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequest.token}`
        },
        webUserRequest.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.WEB_USER_SEARCH
    });
  }

  webUserAuthenticate(
    webUserRequest: WebUserRequestData,
    request: IMemberAuthenticateRequest
  ): Promise<IMemberAuthenticateResponse> {
    return this._http.invoke<IMemberAuthenticateResponse>({
      allowExceptions: true,
      url: APP.config.awsEndpoints.gbdAuthenticate,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequest.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequest.token}`
        },
        webUserRequest.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.MEMBER_AUTHENTICATE
    });
  }

  generatePasswordApi(
    url: string,
    webUserRequest: WebUserRequestData,
    request: IMemberPasswordRequest
  ): Promise<IUpdatePasswordResponse> {
    return this._http.invoke<IUpdatePasswordResponse>({
      allowExceptions: true,
      url: url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequest.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequest.token}`
        },
        webUserRequest.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GENERATE_PASSWORD
    });
  }

  updateNewPasswordApi(
    url: string,
    webUserRequest: WebUserRequestData,
    request: IMemberPasswordRequest
  ): Promise<IUpdatePasswordResponse> {
    return this._http.invoke<IUpdatePasswordResponse>({
      allowExceptions: true,
      url: url,
      method: HttpMethod.Put,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequest.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequest.token}`
        },
        webUserRequest.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.UPDATE_PASSWORD
    });
  }

  commercialMemberAuthenticate(
    webUserRequest: WebUserRequestData,
    request: ICommercialAuthenticateRequest
  ): Promise<ICommercialAuthenticateResponse> {
    return this._http.invoke<ICommercialAuthenticateResponse>({
      allowExceptions: true,
      url: APP.config.awsEndpoints.loginAuthenticate,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequest.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequest.token}`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.COMMERCIAL_SUMMARY
    });
  }

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

  memberInformationApi(
    token: string,
    request: IMemberTwoFAParameters
  ): Promise<IMemberInformation> {
    return this._http.invoke<IMemberInformation>({
      allowExceptions: true,
      url: APP.config.awsEndpoints.validateMemberInfo,
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
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.MEMBER_INFO_VALIDATE
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

  memberLoginThreatApi(
    loginTreatRequestParameters: TreatRequestDetails,
    request: IMemberTwoFALoginThreatRequest
  ): Promise<IMemberTwoFALoginThreatResponse> {
    return this._http.invoke<IMemberTwoFALoginThreatResponse>({
      allowExceptions: true,
      allowRawResponse: true,
      url: loginTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
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
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...loginTreatRequestParameters.header
      ],
      responseType: ResponseType.JSON,
      requestName: loginTreatRequestParameters.requestName
    });
  }

  memberRecoveryThreatApi(
    recoveryTreatRequestParameters: TreatRequestDetails,
    request: IMemberTwoFALoginThreatRequest
  ): Promise<IMemberTwoFALoginThreatResponse> {
    return this._http.invoke<IMemberTwoFALoginThreatResponse>({
      allowExceptions: true,
      allowRawResponse: true,
      url: recoveryTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
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
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...recoveryTreatRequestParameters.header
      ],
      responseType: ResponseType.JSON,
      requestName: recoveryTreatRequestParameters.requestName
    });
  }

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

  medicaidValidateOtpApi(
    token: string,
    request: ValidateOtpModel
  ): Promise<IValidateOtpResponse> {
    return this._http.invoke<IValidateOtpResponse>({
      allowExceptions: true,
      url: APP.config.restApi.onPrem.medicaidValidateOtp,
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
      requestName: requestName.MEMBER_GBD_VALIDATE_OTP
    });
  }

  loginSaveCookieApi(
    savecookiePathParameters: SaveCookieRequestDetails,
    request: SaveCookieModel
  ): Promise<ICookieSaveResponse> {
    return this._http.invoke<ICookieSaveResponse>({
      allowExceptions: true,
      url: savecookiePathParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        {
          name: headers.COOKIE,
          value: request?.cookieValue ?? ''
        },
        ...savecookiePathParameters.header
      ],
      responseType: ResponseType.JSON,
      requestName: savecookiePathParameters.requestName
    });
  }

  loginValidateQaApi(
    url: string,
    webUserRequest: WebUserRequestData,
    request: IMemberQAValidateRequest
  ): Promise<ISecurityQAResponse> {
    return this._http.invoke<ISecurityQAResponse>({
      allowExceptions: true,
      url: url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequest.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequest.token}`
        },
        webUserRequest.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.VALIDATE_SECURITY_ANSWERS
    });
  }

  memberEligibility(
    token: string,
    hcid: string
  ): Promise<IEligibilityResponse> {
    const endDate = moment().subtract(1, unitOfTime.days).format(memberInfo.DATE_FORMAT);
    const startDate = moment().subtract(5, unitOfTime.years).format(memberInfo.DATE_FORMAT);
    return this._http.invoke<IEligibilityResponse>({
      allowExceptions: true,
      url: APP.config.restApi.onPrem.eligibility,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: true,
          name: headers.HCID,
          value: hcid
        },
        {
          isQueryParam: true,
          name: headers.MCID_FLAG,
          value: true.toString()
        },
        {
          isQueryParam: true,
          name: headers.START_DATE,
          value: startDate.toString()
        },
        {
          isQueryParam: true,
          name: headers.END_DATE,
          value: endDate.toString()
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
        },
        APP.config.restApi.gbdHeader
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GBD_ELIGIBILITY
    });
  }

  memberEligibilitySynthetic(
    token: string,
    hcid: string
  ): Promise<IEligibilityResponse> {
    return this._http.invoke<IEligibilityResponse>({
      allowExceptions: true,
      url: APP.config.restApi.onPrem.eligibilitySynthetic,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: true,
          name: headers.HCID,
          value: hcid
        },
        {
          isQueryParam: true,
          name: headers.MCID_FLAG,
          value: true.toString()
        }
      ],
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.syntheticAPIKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${token}`
        },
        APP.config.restApi.syntheticHeader
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GBD_ELIGIBILITY_SYNTHETIC
    });
  }
}
