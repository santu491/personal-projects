import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { TokenGateway } from '../onPremTokenGateway';

describe('TokenGateway', () => {
  let gateway: TokenGateway;
  beforeEach(() => {
    gateway = new TokenGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('should return on prem access token', () => {
    const http = {
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
      responseType: 1,
      requestName: requestName.ON_PREM_TOKEN
    };

    gateway.onPremToken();
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('should return on prem aws access token', () => {
    const http = {
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
      responseType: 1,
      requestName: requestName.ON_PREM_TOKEN
    };

    gateway.onPremAwsToken();
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('should get the psgbdTenantToken', () => {
    const http = {
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
      responseType: 1,
      requestName: requestName.ON_PREM_SYNTHETIC_TOKEN
    };

    gateway.onPremSyntheticToken();
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
