import { memberInfo, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { MemberCredentialGateway } from '../memberCredentialGateway';

describe('MemberCredentialGateway', () => {
  let gateway: MemberCredentialGateway;
  const webUserRequest = {
    token: 'token',
    apiKey: APP.config.restApi.internal.apiKey,
    header: APP.config.restApi.webUserCommercialHeader,
    isMedicaidUser: false
  };

  beforeEach(() => {
    gateway = new MemberCredentialGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Generate temporary password for user', () => {
    const request = {
      requestContext: {
        application: memberInfo.APPLICATION,
        requestId: 'c6e57b45-39b4-4517-a6e0-f49a28cbc4cf',
        username: memberInfo.APPLICATION
      },
      username: '~SIT3GQH812584146'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.member.commercialGeneratePassword,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: 'apikey',
          value: APP.config.restApi.internal.apiKey
        },
        {
          name: 'Authorization',
          value: `Bearer token`
        },
        APP.config.restApi.webUserCommercialHeader
      ],
      responseType: 1,
      requestName: requestName.GENERATE_PASSWORD
    };

    gateway.generatePasswordApi(
      APP.config.restApi.member.commercialGeneratePassword,
      webUserRequest,
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Update new password by temporary password', () => {
    const request = {
      requestContext: {
        application: memberInfo.APPLICATION,
        requestId: 'c6e57b45-39b4-4517-a6e0-f49a28cbc4cf',
        username: memberInfo.APPLICATION
      },
      username: '~SIT3GQH812584146',
      currentPassword: 's34md9ns',
      newPassword: 'support1'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.member.commercialUpdatePassword,
      method: HttpMethod.Put,
      data: request,
      headers: [
        {
          name: 'apikey',
          value: APP.config.restApi.internal.apiKey
        },
        {
          name: 'Authorization',
          value: `Bearer token`
        },
        APP.config.restApi.webUserCommercialHeader
      ],
      responseType: 1,
      requestName: requestName.UPDATE_PASSWORD
    };

    gateway.updateNewPasswordApi(
      APP.config.restApi.member.commercialUpdatePassword,
      webUserRequest,
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
