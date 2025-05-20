import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { InternalAuthResponse } from '../models/internalRequestModel';

@Service()
export class TokenGateway {
  constructor(private _http: RestClient) {}

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
          value: `${headers.BASIC} ${APP.config.restApi.onPrem.basicTokenForSyntheticAuth}`
        }
      ],
      data: headers.BODY_VALUE,
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: requestName.ON_PREM_SYNTHETIC_TOKEN
    });
  }

  onPremAwsToken(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: APP.config.restApi.sydneyMemberTenant.oauthAccessToken,
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

  sydneyMemberTenantToken(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: APP.config.restApi.sydneyMemberTenant.oauthAccessToken,
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
      requestName: requestName.SYDNEY_MEMBER_TENANT_TOKEN
    });
  }

  psgbdTenantToken(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: APP.config.restApi.psgbdTenant.oauthAccessToken,
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
      requestName: requestName.PSGBD_MEMBER_TENANT_TOKEN
    });
  }

  // To-Do remove this function
  findHelpToken(): Promise<InternalAuthResponse> {
    return this._http.invoke<InternalAuthResponse>({
      url: APP.config.restApi.auntBertha.accesstoken,
      method: HttpMethod.Post,
      headers: [
        {
          name: headers.CONTENT_TYPE,
          value: headers.CONTENT_VALUE
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.auntBertha.apiKeys[0].apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BASIC} ${APP.config.restApi.internal.basicTokenForAuth}`
        }
      ],
      data: headers.BODY_VALUE,
      isFormData: true,
      responseType: ResponseType.JSON,
      requestName: requestName.FIND_HELP_TENANT_TOKEN
    });
  }

}
