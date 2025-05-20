import { associateInfo, headers, requestName } from '@anthem/communityadminapi/common';
import { HttpMethod } from '@anthem/communityadminapi/http';
import { APP } from '@anthem/communityadminapi/utils';
import { mockRestClient } from '@anthem/communityadminapi/utils/mocks/mockRestClient';
import { AssociateGateway } from '../associateGateway';

describe('AssociateGateway', () => {
  let gateway: AssociateGateway;
  const webUserRequest = {
    token: 'token',
    apiKey: APP.config.restApi.internal.apiKey,
    header: APP.config.restApi.webUserHeader
  };

  beforeEach(() => {
    gateway = new AssociateGateway(<any>mockRestClient);
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

  it('Authenticate user when provided correct password', () => {
    const request = {
      requestContext: {
        application: associateInfo.APPLICATION,
        requestId: 'c6e57b45-39b4-4517-a6e0-f49a28cbc4cf',
        username: associateInfo.APPLICATION
      },
      repositoryEnum: associateInfo.REPOSITORY_ENUM,
      userRoleEnum: associateInfo.USER_ROLE_ASSOCIATE,
      username: '~user',
      password: 'Test123'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.member.authenticationURL,
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
        // webUserRequest.header
      ],
      responseType: 1,
      requestName: requestName.MEMBER_AUTHENTICATE
    };
    gateway.webUserAuthenticate(
      webUserRequest,
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
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
      url: APP.config.restApi.member.searchUrl,
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
        APP.config.restApi.webUserHeader
      ],
      responseType: 1,
      requestName: requestName.WEB_USER_SEARCH
    };

    const webUserRequest = {
      token: 'token',
      apiKey: APP.config.restApi.internal.apiKey,
      header: APP.config.restApi.webUserHeader,
      isMedicaidUser: false
    };
    gateway.webUserSearch(
      APP.config.restApi.member.searchUrl,
      webUserRequest,
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
