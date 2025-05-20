import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { Service } from 'typedi';
import { IMemberPasswordRequest, IUpdatePasswordResponse, WebUserRequestData } from '../models/memberModel';

@Service()
export class MemberCredentialGateway {
  constructor(private _http: RestClient) {}

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
}
