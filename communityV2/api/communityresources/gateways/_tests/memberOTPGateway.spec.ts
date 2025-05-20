import { headers, memberInfo, requestName } from '@anthem/communityapi/common';
import { HttpMethod } from '@anthem/communityapi/http';
import { APP } from '@anthem/communityapi/utils';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { MemberOTPGateway } from '../memberOTPGateway';

describe('MemberOTPGateway', () => {
  let gateway: MemberOTPGateway;
  beforeEach(() => {
    gateway = new MemberOTPGateway(<any>mockRestClient);
    jest.clearAllMocks();
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
    const request = {
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
});
