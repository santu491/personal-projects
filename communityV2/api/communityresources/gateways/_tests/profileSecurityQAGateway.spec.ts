import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { ResponseType } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { ProfileSecurityQAGateway } from '../profileSecurityQAGateway';

describe('ProfileGateway', () => {
  let gateway: ProfileSecurityQAGateway;
  beforeEach(() => {
    gateway = new ProfileSecurityQAGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Should return user secret questions', () => {
    const method = 'Get';
    const isGetMethod = true;
    const request = {
      headers: [
        {
          name: 'apikey',
          value: 'E0OAnvjKZ6J3ihrUieBVv3RS5JVKY6Ax'
        },
        {
          name: 'webguid',
          value: 'f1836021-4ead-4f81-ad65-aa99620db8bf'
        }
      ],
      urlParams: [
        {
          isQueryParam: false,
          name: 'memberId',
          value: '318339267'
        }
      ]
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialSecurityQuestions,
      method: HttpMethod[method],
      ...request,
      responseType: ResponseType.JSON,
      requestName: isGetMethod
        ? requestName.GET_SECURITY_QUESTIONS
        : requestName.UPDATE_SECURITY_QUESTIONS
    };
    gateway.commercialSecurityQuestions(request, method, isGetMethod);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return update secret questions', () => {
    const method = 'Put';
    const isGetMethod = false;
    const request = {
      headers: [
        {
          name: 'apikey',
          value: 'E0OAnvjKZ6J3ihrUieBVv3RS5JVKY6Ax'
        },
        {
          name: 'webguid',
          value: 'f1836021-4ead-4f81-ad65-aa99620db8bf'
        }
      ],
      urlParams: [
        {
          isQueryParam: false,
          name: 'memberId',
          value: '318339267'
        }
      ],
      usernm: '~SIT3SB457T97639',
      webguid: 'f1836021-4ead-4f81-ad65-aa99620db8bf',
      secretQuestions: [
        {
          questionNo: '1',
          question: `What is your maternal grandmother's maiden name?`,
          isAnswered: 'true',
          answer: 'father'
        }
      ]
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.commercialSecurityQuestions,
      method: HttpMethod[method],
      ...request,
      responseType: ResponseType.JSON,
      requestName: isGetMethod
        ? requestName.GET_SECURITY_QUESTIONS
        : requestName.UPDATE_SECURITY_QUESTIONS
    };
    gateway.commercialSecurityQuestions(request, method, isGetMethod);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return all list of secret questions for medicaid', () => {
    const requestHeader = {
      name: 'meta-src-envrmt',
      value: 'WEBSTAGEAD'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.awsEndpoints.medicaidSecretQuestions,
      method: HttpMethod.Get,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `Bearer token`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        requestHeader
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_SECRET_QUESTIONS
    };
    gateway.medicaidSecretQuestionsApi('token', requestHeader);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

it('Should return medicaid user secret questions', () => {
    const requestObject = {
      requestContext: {
        application: 'SYDCOM',
        requestId: '9aa55eae-9ecb-7da2-b177-2fa699ca40f4',
        username: 'SYDCOM'
      },
      dn: 'CN=~LUCY46213,OU=eMembers,OU=webUsers,OU=usersAndGroups,DC=webstagead,DC=wellpoint,DC=com',
      repositoryEnum: 'IAM',
      header: {
        name: 'meta-src-envrmt',
        value: 'WEBSTAGEAD'
      }
    };
    const http = {
      allowExceptions: true,
      url: APP.config.awsEndpoints.medicaidUserSecretQA,
      method: HttpMethod.Post,
      data: requestObject,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: `Bearer token`
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        requestObject.header
      ],
      responseType: ResponseType.JSON,
      requestName: requestName.GET_USER_SECRET_QUESTIONS
    };
    gateway.medicaidUserSecretQAPopulateApi('token', requestObject);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
