import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { ICookieSaveResponse, IMemberQAValidateRequest, ISecurityQAResponse, SaveCookieModel, SaveCookieRequestDetails, WebUserRequestData } from '../models/memberModel';

@Service()
export class MemberSecretQAGateway {
  constructor(private _http: RestClient) { }

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
          value: request.cookieValue
        },
        ...savecookiePathParameters.header
      ],
      responseType: ResponseType.JSON,
      requestName: savecookiePathParameters.requestName
    });
  }
}
