import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from "@anthem/communityapi/utils/mocks/mockRestClient";
import { InternalGateway } from '../internalGateway';



describe('InternalGateway', () => {
  let gateway: InternalGateway;

  beforeEach(() => {
    gateway = new InternalGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('should get terms of use', () => {
    let http = {
      allowExceptions: true,
      url: APP.config.restApi.internal.termsofuse,
      method: 'GET',
      urlParams: [
        {
          isQueryParam: true,
          name: 'toutype',
          value: 'COMMUNITYTOU'
        },
        {
          isQueryParam: true,
          name: 'usernm',
          value: 'username'
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
      responseType: 1,
      requestName: 'GetMemberTermOfUseRequest'
    }
    gateway.getTermsOfUse('username');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('should update terms of use', () => {
    let http = {
      url: APP.config.restApi.internal.termsofuse,
      method: 'PUT',
      data: {
        'userNm': 'username',
        'touType': 'COMMUNITYTOU'
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
      responseType: 1,
      requestName: 'UpdateAcceptedTOURequest'
    }
    gateway.updateAcceptedTOU('username');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('should get access token', () => {
    let http = {
      url: APP.config.restApi.internal.authenticate,
      method: 'POST',
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
      data: 'grant_type=client_credentials&scope=public',
      isFormData: true,
      responseType: 1,
      requestName: 'getAuthRequest'
    }
    gateway.getAuth();
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('should get member info', () => {
    let http = {
      url: APP.config.restApi.sydneyMemberTenant.memberSummary,
      method: 'GET',
      urlParams: [
        {
          isQueryParam: true,
          name: 'usernm',
          value: 'username'
        }
      ],
      headers: [
        {
          name: 'apikey',
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: 'Authorization',
          value: 'Bearer token'
        }
      ],
      responseType: 1,
      requestName: 'GetMemberInfoRequest'
    }
    gateway.getMemberInfo('token', 'username');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
