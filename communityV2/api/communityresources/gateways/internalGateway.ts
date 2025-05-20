import { functionNames, headers } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import {
  GetTermsOfUseResponse, InternalAuthResponse,
  IntrospectResponse,
  MemberSummarySoaResponse,
  RevokeResponse
} from '../models/internalRequestModel';

@Service()
export class InternalGateway {
  constructor(private _http: RestClient) {}

  getTermsOfUse(username: string): Promise<GetTermsOfUseResponse> {
    return this._http.invoke<GetTermsOfUseResponse>({
      allowExceptions: true,
      url: APP.config.restApi.internal.termsofuse,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: true,
          name: 'toutype',
          value: 'COMMUNITYTOU'
        },
        {
          isQueryParam: true,
          name: 'usernm',
          value: username
        }
      ],
      headers: [
        {
          name: 'apikey',
          value: APP.config.restApi.internal.apiKey
        },
        {
          name: 'senderApp',
          value: APP.config.restApi.internal.metaSender
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'GetMemberTermOfUseRequest'
    });
  }

  updateAcceptedTOU(userNm: string) {
    return this._http.invoke({
      url: APP.config.restApi.internal.termsofuse,
      method: HttpMethod.Put,
      data: {
        userNm: userNm,
        touType: 'COMMUNITYTOU'
      },
      headers: [
        {
          name: 'apikey',
          value: APP.config.restApi.internal.apiKey
        },
        {
          name: 'senderApp',
          value: APP.config.restApi.internal.metaSender
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'UpdateAcceptedTOURequest'
    });
  }

  getAuth(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: `${APP.config.restApi.internal.authenticate}`,
      method: HttpMethod.Post,
      headers: [
        {
          name: 'Content-Type',
          value: 'application/x-www-form-urlencoded'
        },
        {
          name: 'apikey',
          value: APP.config.restApi.internal.apiKey
        },
        {
          name: 'Authorization',
          value: `Basic ${APP.config.restApi.internal.basicTokenForAuth}`
        }
      ],
      data: headers.BODY_VALUE,
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: functionNames.GET_AUTH_REQUEST
    });
  }

  getMemberInfo(
    token: string,
    username: string
  ): Promise<MemberSummarySoaResponse> {
    return this._http.invoke<MemberSummarySoaResponse>({
      url: APP.config.restApi.sydneyMemberTenant.memberSummary,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: true,
          name: 'usernm',
          value: username
        }
      ],
      headers: [
        {
          name: 'apikey',
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: 'GetMemberInfoRequest'
    });
  }

  validateAccessToken(token: string): Promise<IntrospectResponse> {
    return this._http.invoke({
      url: `${APP.config.restApi.internal.tokenValidationUrlForAuth}`,
      method: HttpMethod.Post,
      headers: [
        {
          name: 'Content-Type',
          value: 'application/x-www-form-urlencoded'
        },
        {
          name: 'Authorization',
          value: `Basic ${APP.config.restApi.internal.basicTokenForAuth}`
        }
      ],
      data: `token_type_hint=access_token&token=${token}`,
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: 'validateAccessTokenRequest'
    });
  }

  revokeAccessToken(token: string): Promise<RevokeResponse> {
    return this._http.invoke({
      url: `${APP.config.restApi.internal.tokenRevokeUrl}`,
      method: HttpMethod.Post,
      headers: [
        {
          name: 'Content-Type',
          value: 'application/x-www-form-urlencoded'
        }
      ],
      data: `token_type_hint=access_token&token=${token}&client_id=${APP.config.restApi.internal.clientId}`,
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: 'revokeAccessTokenRequest'
    });
  }
}
