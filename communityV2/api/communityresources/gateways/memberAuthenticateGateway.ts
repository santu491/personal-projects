import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { Service } from 'typedi';
import {
  IMemberSearchRequest,
  IMemberSearchResponse, WebUserRequestData
} from '../models/memberModel';

@Service()
export class MemberAuthenticateGateway {
  constructor(private _http: RestClient) { }

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

  // webUserAuthenticate(
  //   webUserRequest: WebUserRequestData,
  //   request: IMemberAuthenticateRequest
  // ): Promise<IMemberAuthenticateResponse> {
  //   return this._http.invoke<IMemberAuthenticateResponse>({
  //     allowExceptions: true,
  //     url: APP.config.awsEndpoints.gbdAuthenticate,
  //     method: HttpMethod.Post,
  //     data: request,
  //     headers: [
  //       {
  //         name: headers.API_KEY,
  //         value: webUserRequest.apiKey
  //       },
  //       {
  //         name: headers.AUTHORIZATION,
  //         value: `${headers.BEARER} ${webUserRequest.token}`
  //       },
  //       webUserRequest.header
  //     ],
  //     responseType: ResponseType.JSON,
  //     requestName: requestName.MEMBER_AUTHENTICATE
  //   });
  // }
}
