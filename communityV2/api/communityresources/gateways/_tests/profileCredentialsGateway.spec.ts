import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { ProfileCredentialsGateway } from '../profileCredentialsGateway';

describe('ProfileCredentialsGateway', () => {
  let gateway: ProfileCredentialsGateway;
  beforeEach(() => {
    gateway = new ProfileCredentialsGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Should update user profile password', () => {
    const request = {
      memberId: '318339267',
      currentUsernm: '~SIT3SB457T97639',
      newUsernm: '~SIT3SB457T97639',
      currentPassword: 'support1',
      confirmPassword: 'support2',
      newPassword: 'support2'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialCredentialUpdate,
      method: HttpMethod.Put,
      data: request,
      urlParams: [
        {
          isQueryParam: true,
          name: headers.USER_NAME,
          value: request.currentUsernm
        },
        {
          isQueryParam: false,
          name: headers.MEMBERID,
          value: request.memberId
        }
      ],
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.MBRUID,
          value: request.memberId
        }
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.UPDATE_PROFILE_PASSWORD
    };
    gateway.commercialProfileCredentialUpdateApi('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
