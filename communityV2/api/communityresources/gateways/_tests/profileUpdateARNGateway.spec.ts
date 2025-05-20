import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { ProfileUpdateARNGateway } from '../profileUpdateARNGateway';

describe('ProfileUpdateARNGateway', () => {
  let gateway: ProfileUpdateARNGateway;
  beforeEach(() => {
    gateway = new ProfileUpdateARNGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Should return user primary phone number', () => {
    const memberId = '318339267';
    const http = {
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
          value: `Bearer token`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_COMMERCIAL_TELEPHONE
    };
    gateway.commercialTelephoneNumberApi('token', memberId);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return user text phone number', () => {
    const memberId = '318339267';
    const http = {
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
          value: `Bearer token`
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_COMMERCIAL_TXTNBR
    };
    gateway.commercialTextNumberApi('token', memberId);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return response bases on method type on recovery contact API', () => {
    const request = {
      method: 'Get',
      usernm: '~SIT3SB457T97639'
    };
    const http = {
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
          value: `Bearer token`
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        }
      ],
      ...request,
      responseType: ResponseType.JSON
    };
    gateway.commercialRecoveryNumberApi('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
