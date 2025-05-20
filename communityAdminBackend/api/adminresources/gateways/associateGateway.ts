import { headers, requestName } from '@anthem/communityadminapi/common';
import { HttpMethod } from '@anthem/communityadminapi/http';
import { ResponseType, RestClient } from '@anthem/communityadminapi/rest';
import { APP } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';
import { IAssociateAuthenticateRequest, IAssociateAuthenticateResponse, IAssociateSearchRequest, IAssociateSearchResponse, WebUserRequestData } from '../models/associateModel';
import { InternalAuthResponse } from '../models/internalRequestModel';

@Service()
export class AssociateGateway {
  constructor(private _http: RestClient) { }

  onPremToken(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: APP.config.restApi.onPrem.accesstoken,
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

  webUserSearch(
    searchUrl: string,
    webUserRequest: WebUserRequestData,
    request: IAssociateSearchRequest
  ): Promise<IAssociateSearchResponse> {
    return this._http.invoke<IAssociateSearchResponse>({
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
    request: IAssociateAuthenticateRequest
  ): Promise<IAssociateAuthenticateResponse> {
    return this._http.invoke<IAssociateAuthenticateResponse>({
      allowExceptions: true,
      url: APP.config.restApi.member.authenticationURL,
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
        // webUserRequest.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.MEMBER_AUTHENTICATE
    });
  }

}
