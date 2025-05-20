import { headers, memberInfo, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { ValidateOtpModel } from 'api/communityresources/models/memberModel';
import { MemberGateway } from '../memberGateway';

describe('MemberGateway', () => {
  let gateway: MemberGateway;
  const webUserRequest = {
    token: 'token',
    apiKey: APP.config.restApi.internal.apiKey,
    header: APP.config.restApi.webUserCommercialHeader,
    isMedicaidUser: false
  };

  beforeEach(() => {
    gateway = new MemberGateway(<any>mockRestClient);
    jest.clearAllMocks();
  });

  it('should return on prem synthetic access token', () => {
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
          value: `${headers.BASIC} ${APP.config.restApi.internal.basicTokenForAuth}`
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

    const webUserRequests = {
      token: 'token',
      apiKey: APP.config.restApi.internal.apiKey,
      header: APP.config.restApi.webUserCommercialHeader,
      isMedicaidUser: false
    };
    gateway.webUserSearch(
      APP.config.restApi.onPrem.commercialSearch,
      webUserRequests,
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Authenticate user when provided correct password', () => {
    const request = {
      requestContext: {
        application: memberInfo.APPLICATION,
        requestId: 'c6e57b45-39b4-4517-a6e0-f49a28cbc4cf',
        username: memberInfo.APPLICATION
      },
      repositoryEnum: memberInfo.REPOSITORY_ENUM,
      userRoleEnum: memberInfo.USER_ROLE_ENUM,
      username: '~user',
      password: 'Test123'
    };
    const webUserRequests = {
      token: 'token',
      apiKey: APP.config.restApi.onPrem.apiKey,
      header: APP.config.restApi.webUserGbdHeader,
      isMedicaidUser: true
    };
    const http = {
      allowExceptions: true,
      url: APP.config.awsEndpoints.gbdAuthenticate,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequests.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequests.token}`
        },
        webUserRequests.header
      ],
      responseType: 1,
      requestName: requestName.MEMBER_AUTHENTICATE
    };
    gateway.webUserAuthenticate(webUserRequests, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
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

  it('Authenticate and get commercial user details when provided correct password', () => {
    const request = {
      userNm: '~user',
      password: 'password'
    };
    const webUserRequests = {
      token: 'token',
      apiKey: APP.config.restApi.onPrem.apiKey,
      header: APP.config.restApi.webUserCommercialHeader,
      isMedicaidUser: true
    };
    const http = {
      allowExceptions: true,
      url: APP.config.awsEndpoints.loginAuthenticate,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: webUserRequests.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${webUserRequest.token}`
        }
      ],
      responseType: 1,
      requestName: requestName.COMMERCIAL_SUMMARY
    };
    gateway.commercialMemberAuthenticate(webUserRequests, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should be able to recover the contact details', () => {
    const username = '~SIT3GQH812584146';
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.onPrem.recoveryContact,
      method: HttpMethod.Get,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.USER_NAME,
          value: username
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_RECOVERY_CONTACT
    };
    gateway.memberRecoveryContactApi('token', username);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
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

  it('Should return GBD member eligibility', async () => {
    await gateway.memberEligibility('token', 'GJNCLD998114');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
  });

  it('Should return GBD member synthetic eligibility', () => {
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.onPrem.eligibilitySynthetic,
      method: HttpMethod.Get,
      urlParams: [
        {
          isQueryParam: true,
          name: headers.HCID,
          value: 'GJNCLD998114'
        },
        {
          isQueryParam: true,
          name: headers.MCID_FLAG,
          value: true.toString()
        }
      ],
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.syntheticAPIKey
        },
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        APP.config.restApi.syntheticHeader
      ],
      responseType: 1,
      requestName: requestName.GBD_ELIGIBILITY_SYNTHETIC
    };

    gateway.memberEligibilitySynthetic('token', 'GJNCLD998114');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return member contact details', () => {
    const request = {
      firstNm: 'GA',
      lastNm: 'JONES',
      dob: '1978-11-02',
      hcid: '750T60596',
      metaPersonType: 'preferred',
      usernm: '~SIT3SB457T97639'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.memberContactsDetails,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_GET_CONTACT_DETAILS
    };

    gateway.memberGetContactsApi('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return member details when forgot username', () => {
    const request = {
      firstNm: 'GUERRERO',
      lastNm: 'HOWELL',
      dob: '1980-01-01',
      hcId: 'GQH812584146'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.awsEndpoints.validateMemberInfo,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_INFO_VALIDATE
    };

    gateway.memberInformationApi('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return deviceId and UserId along with send otp to communication channel to user', () => {
    const payload = {
      channel: 'EMAIL',
      contactUid: 'profile~1574762953519010230011810',
      usernm: '~SIT3GQH812584146'
    };
    const request = {
      userName: '~SIT3GQH812584146',
      model: memberInfo.loginTwoFAModel,
      metaBrandCode: memberInfo.APPLICATION,
      requestName: requestName.COMMERCIAL_SEND_OTP,
      metaPersonType: '',
      cookie: '',
      apiKey: APP.config.restApi.onPrem.apiKey
    };
    const url = APP.config.restApi.sydneyMemberTenant.commercialSendOtp;
    const http = {
      allowExceptions: true,
      url: url,
      method: HttpMethod.Post,
      data: payload,
      headers: [
        {
          name: headers.API_KEY,
          value: request.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} token`
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.userName
        },
        {
          name: headers.META_BRAND_CODE,
          value: request.metaBrandCode
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        },
        {
          name: headers.COOKIE,
          value: request.cookie
        }
      ],
      responseType: 1,
      requestName: request.requestName
    };
    gateway.memberSendOtp('token', url, payload, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should validate the otp and return the status for commercial', () => {
    const request: ValidateOtpModel = {
      otp: '643757',
      pingRiskId: '4ed94f03-12e6-4128-b5a2-a16a46ab41e2',
      pingDeviceId: '15fb8fdb-30a6-4641-96f4-a6a7ab79c774',
      pingUserId: '203ef9e2-70bf-4074-ae9b-56500b035183',
      model: 'Member',
      usernm: '~SIT3GQH812584146',
      cookie:
        'ant=!/UOc87FiVSRjebcQvIA2b9okPoufOhJVwSndAjBdD06AqWHsdOrVV2dCHmhxVvkyaIqXYBwCPJwmKEo=',
      metaBrandCode: 'SYDCOM',
      metaPersonType: 'Preferred',
      memberType: 'CN=eMember',
      isLogin: false
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.sydneyMemberTenant.memberValidateOtp,
      method: HttpMethod.Post,
      data: {
        otp: request.otp
      },
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
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        },
        {
          name: headers.META_PING_RISK_ID,
          value: request.pingRiskId
        },
        {
          name: headers.META_PING_DEVICE_ID,
          value: request.pingDeviceId
        },
        {
          name: headers.META_PING_USER_ID,
          value: request.pingUserId
        },
        {
          name: headers.META_BRAND_CODE,
          value: request.metaBrandCode
        },
        {
          name: headers.COOKIE,
          value: request.cookie
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_LOGIN_VALIDATE_OTP
    };
    gateway.loginValidateOtpApi('token', request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should validate the otp and return the status for medicaid', () => {
    const request: ValidateOtpModel = {
      otp: '447767',
      pingRiskId: '4ed94f03-12e6-4128-b5a2-a16a46ab41e2',
      pingDeviceId: '15fb8fdb-30a6-4641-96f4-a6a7ab79c774',
      pingUserId: '203ef9e2-70bf-4074-ae9b-56500b035183',
      model: 'Member',
      usernm: '~TAJUANA46204',
      cookie:
        'ant=!/UOc87FiVSRjebcQvIA2b9okPoufOhJVwSndAjBdD06AqWHsdOrVV2dCHmhxVvkyaIqXYBwCPJwmKEo=',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=gbdMSS',
      isLogin: false
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.onPrem.medicaidValidateOtp,
      method: HttpMethod.Post,
      data: {
        otp: request.otp
      },
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} token`
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_PING_RISK_ID,
          value: request.pingRiskId
        },
        {
          name: headers.META_PING_DEVICE_ID,
          value: request.pingDeviceId
        },
        {
          name: headers.META_PING_USER_ID,
          value: request.pingUserId
        },
        {
          name: headers.META_BRAND_CODE,
          value: request.metaBrandCode
        },
        {
          name: headers.COOKIE,
          value: request.cookie
        }
      ],
      responseType: 1,
      requestName: requestName.MEMBER_GBD_VALIDATE_OTP
    };
    gateway.medicaidValidateOtpApi('token', request);
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

  it('Should return member login treat API response', () => {
    const request = {
      usernm: '~sit3sub970634126',
      metaIpaddress: '11.22.33.47',
      model: 'Member',
      cookieValue:
        'ugkHOqh3jwiZd0uI/6ca6z3lgCfYC3PGe9ypNHIJ5vHlxbcIaaEKy730uUkHZczmUp95dNXctFxVULgN4DJJbjI7P1uPlQAr116eRw2m1lmTGROE2kHvUlvLzKem//0353lY7ExvjXkBDL1hZhnY2KKV1IMF3ygZOA7YYFl0CqM=',
      hcid: 'CLD400238',
      brand: 'AGP-WCSTX',
      brandCode: 'AGP-WCSTX',
      marketingBrand: 'SYDCOM',
      metaPersonType: 'Preferred'
    };
    const loginTreatRequestParameters = {
      url: APP.config.restApi.sydneyMemberTenant.commercialLoginTreat,
      requestName: requestName.COMMERCIAL_LOGIN_THREAT,
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
      allowRawResponse: true,
      url: loginTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...loginTreatRequestParameters.header
      ],
      responseType: 1,
      requestName: loginTreatRequestParameters.requestName
    };
    gateway.memberLoginThreatApi(loginTreatRequestParameters, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return member recovery treat API response', () => {
    const request = {
      usernm: '~sit3sub970634126',
      metaIpaddress: '11.22.33.47',
      model: 'Member',
      cookieValue:
        'ugkHOqh3jwiZd0uI/6ca6z3lgCfYC3PGe9ypNHIJ5vHlxbcIaaEKy730uUkHZczmUp95dNXctFxVULgN4DJJbjI7P1uPlQAr116eRw2m1lmTGROE2kHvUlvLzKem//0353lY7ExvjXkBDL1hZhnY2KKV1IMF3ygZOA7YYFl0CqM=',
      marketingBrand: 'SYDCOM',
      webguid: '12f7c61d-188d-4b3d-801b-0f3baa0c1ac6',
      metaPersonType: 'SNAP'
    };
    const recoveryTreatRequestParameters = {
      url: APP.config.restApi.sydneyMemberTenant.commercialRecoveryTreat,
      requestName: requestName.COMMERCIAL_RECOVERY_THREAT,
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
      allowRawResponse: true,
      url: recoveryTreatRequestParameters.url,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.MODEL,
          value: request.model
        },
        {
          name: headers.USER_NAME,
          value: request.usernm
        },
        {
          name: headers.META_IP_ADDRESS,
          value: request.metaIpaddress
        },
        ...recoveryTreatRequestParameters.header
      ],
      responseType: 1,
      requestName: recoveryTreatRequestParameters.requestName
    };
    gateway.memberRecoveryThreatApi(recoveryTreatRequestParameters, request);
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });

  it('Should return GBD member contact details', () => {
    const request = {
      activeInd: true,
      hcId: 'YRK788779854'
    };
    const http = {
      allowExceptions: true,
      url: APP.config.restApi.psgbdTenant.gbdContactsDetails,
      method: HttpMethod.Post,
      data: request,
      headers: [
        {
          name: headers.AUTHORIZATION,
          value: 'Bearer token'
        },
        {
          name: headers.API_KEY,
          value: APP.config.restApi.onPrem.apiKey
        },
        {
          name: headers.META_TRANS_ID,
          value: '432bd2b8-076c-be28-294b-04030368f0be'
        },
        {
          name: headers.META_SENDER_APP,
          value: memberInfo.APPLICATION
        },
        APP.config.restApi.gbdHeader
      ],
      responseType: 1,
      requestName: requestName.GBD_CONTACT_DETAILS
    };

    gateway.getGbdMemberContacts(
      'token',
      '432bd2b8-076c-be28-294b-04030368f0be',
      request
    );
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
    expect(mockRestClient.invoke).toBeCalledWith(http);
  });
});
