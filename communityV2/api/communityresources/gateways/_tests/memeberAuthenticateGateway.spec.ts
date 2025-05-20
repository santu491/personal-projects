import { requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { MemberAuthenticateGateway } from '../memberAuthenticateGateway';

describe('MemberAuthenticateGateway', () => {
  let gateway: MemberAuthenticateGateway;

  beforeEach(() => {
    gateway = new MemberAuthenticateGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Get Web User', () => {
    const request = {
      searchUserFilter: {
        username: 'username',
        repositoryEnum: ['IAM'],
        userRoleEnum: ['MEMBER']
      },
      requestContext: {
        application: 'SYDCOM',
        requestId: 'dffd',
        username: 'SYDCOM'
      }
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.onPrem.commercialSearch,
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
      requestName: requestName.WEB_USER_SEARCH
    };

    const webUserRequest = {
      token: 'token',
      apiKey: APP.config.restApi.internal.apiKey,
      header: APP.config.restApi.webUserCommercialHeader,
      isMedicaidUser: false
    };
    gateway.webUserSearch(
      APP.config.restApi.onPrem.commercialSearch,
      webUserRequest,
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  // it('Authenticate user when provided correct password', () => {
  //   const request = {
  //     requestContext: {
  //       application: memberInfo.APPLICATION,
  //       requestId: 'c6e57b45-39b4-4517-a6e0-f49a28cbc4cf',
  //       username: memberInfo.APPLICATION
  //     },
  //     repositoryEnum: memberInfo.REPOSITORY_ENUM,
  //     userRoleEnum: memberInfo.USER_ROLE_ENUM,
  //     username: '~user',
  //     password: 'Test123'
  //   };
  //   const webUserRequest = {
  //     token: 'token',
  //     apiKey: APP.config.restApi.onPrem.apiKey,
  //     header: APP.config.restApi.webUserGbdHeader,
  //     isMedicaidUser: true
  //   };
  //   const http = {
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
  //     responseType: 1,
  //     requestName: requestName.MEMBER_AUTHENTICATE
  //   };
  //   gateway.webUserAuthenticate(
  //     webUserRequest,
  //     request
  //   );
  //   expect(mockRestClient.invoke.mock.calls.length).toBe(1);
  //   expect(mockRestClient.invoke).toBeCalledWith(http);
  // });
});
