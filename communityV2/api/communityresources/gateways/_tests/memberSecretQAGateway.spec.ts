import { headers, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { MemberSecretQAGateway } from '../memberSecretQAGateway';

describe('MemberSecretQAGateway', () => {
  let gateway: MemberSecretQAGateway;
  const webUserRequest = {
    token: 'token',
    apiKey: APP.config.restApi.internal.apiKey,
    header: APP.config.restApi.webUserCommercialHeader,
    isMedicaidUser: false
  };

  beforeEach(() => {
    gateway = new MemberSecretQAGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('Should be able to validate the security answers', () => {
    const request = {
      requestContext: {
        application: 'SYDCOM',
        requestId: 'c6e57b45-39b4-4517-a6e0-f49a28cbc4cf',
        username: 'SYDCOM'
      },
      username: '~SIT3SBB000008AB',
      secretAnswerText1: 'father',
      secretAnswerText2: 'father'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.member.commercialQnAValidate,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.internal.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `Bearer token`
        },
        APP.config.restApi.webUserCommercialHeader
      ],
      responseType: 1,
      requestName: requestName.VALIDATE_SECURITY_ANSWERS
    };

    gateway.loginValidateQaApi(
      APP.config.restApi.member.commercialQnAValidate,
      webUserRequest,
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should verify and save cookie and return the status commercial users', () => {
    const request = {
      usernm: '~pingsbxtest11',
      cookieValue:
        'TdhA+Vvll6dN35HkhVXlr7gNuwktup0UC6ynOI87PQpY7NFdvPhiFybEYI9FW8dlm3U1POm+e3jAyEm5M63SUJt5ZhjOh1GeeJjlRZBfbwQvx+XxrAJkuvNMBbQe91X/MSUevEMNyX9MJnqB4x8LwH8pN2HbT9vlTF9dKr4I80SU0n73R6kNf0iE5P6Wm8E0dQD7caVsgeRJYsYMdymCU8LsvN7AD3++So5j/EzKe2E=',
      metaIpaddress: '11.22.33.44',
      saveDeviceOrCookieFlag: 'true',
      transientUserNm: '~pingsbxtest11',
      fingerprintId: null,
      fingerprint: null,
      metaPersonType: 'Preferred',
      memberType: 'CN=eMember'
    };
    const savecookiePathParameters = {
      url: APP.config.restApi.sydneyMemberTenant.commercialSaveCookie,
      requestName: requestName.COMMERCIAL_SAVE_DEVICE,
      header: [
        {
          name: headers.AUTHORIZATION,
          value: 'token'
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        }
      ]
    };
    const http = {
      allowExceptions: true,
      url: savecookiePathParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        {
          name: headers.COOKIE,
          value: request.cookieValue
        },
        ...savecookiePathParameters.header
      ],
      responseType: 1,
      requestName: requestName.COMMERCIAL_SAVE_DEVICE
    };
    gateway.loginSaveCookieApi(savecookiePathParameters, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should verify and save cookie and return the status medicaid users', () => {
    const request = {
      usernm: '~TAJUANA46204',
      cookieValue:
        'bgHY/Vy/YUVhBTmXqQP1QnwNEY6hy52E7bVWvTGyeOQkNByEwNADc/1ENCuGLRwlMNcwxEA3zvITOC2QNlQ1LG0grRQsh9oahxd1EwyEhjcmDZuua5XPpaWIdm9x/0rv',
      metaIpaddress: '11.22.33.44',
      saveDeviceOrCookieFlag: 'true',
      transientUserNm: '~TAJUANA46204',
      fingerprintId: null,
      fingerprint: null,
      memberType: 'CN=gbdMSS'
    };
    const savecookiePathParameters = {
      url: APP.config.restApi.onPrem.medicaidSaveCookie,
      requestName: requestName.MEDICAID_SAVE_DEVICE,
      header: []
    };
    const http = {
      allowExceptions: true,
      url: savecookiePathParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        {
          name: headers.COOKIE,
          value: request.cookieValue
        },
        ...savecookiePathParameters.header
      ],
      responseType: 1,
      requestName: savecookiePathParameters.requestName
    };
    gateway.loginSaveCookieApi(savecookiePathParameters, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
