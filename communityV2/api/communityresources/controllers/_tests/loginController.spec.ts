import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockMemberSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { LoginController } from '../loginController';

describe('LoginController', () => {
  let ctrl: LoginController;
  beforeEach(() => {
    ctrl = new LoginController(<any>mockMemberSvc, <any>mockResult, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be able to login successfully and return user details', async () => {
    const loginModel = {
      username: '~TAJUANA46204',
      password: 'Test1234!',
      memberType: 'CN=gbdMSS',
      metaIpaddress: '1.2',
      acceptedTouVersion: '1.0',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      cookie: ''
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          data: {
            isSuccess: true,
            isException: false,
            value: {
              responseContext: {
                confirmationNumber: '172017000068nullZYd1HVBWGIK7'
              },
              user: {
                dn:
                  'CN=~Sasha70062,OU=eMembers,OU=webUsers,OU=usersAndGroups,DC=webdevad,DC=wellpoint,DC=com',
                username: '~Sasha70062',
                iamGuid: '95925c09-31a1-4da7-9848-1f62a42067f0',
                userAccountStatus: {
                  comments: null,
                  disabled: false,
                  locked: false,
                  forceChangePassword: false,
                  badSecretAnsCount: 2,
                  badPasswordCount: 0,
                  isUserNameValid: true,
                  isSecretQuestionValid: true,
                  lastLoginTime: null
                },
                repositoryEnum: 'IAM',
                securityGroupEnum: null,
                secretQuestion: null,
                secretAnswer: null,
                ssoID: [],
                memberId: null,
                userRoleEnum: 'MEMBER',
                secretQuestionAnswers: [
                  {
                    question:
                      'what was your favorite place to visit as a child?',
                    answer: 'n5U04De/4PUWEL/Is9Gt07yOkYE=',
                    encrypted: true,
                    questionValid: true
                  },
                  {
                    question:
                      'what is the name of the hospital in which you were born?',
                    answer: 'n5U04De/4PUWEL/Is9Gt07yOkYE=',
                    encrypted: true,
                    questionValid: true
                  },
                  {
                    question: 'in what city was your father born?',
                    answer: 'n5U04De/4PUWEL/Is9Gt07yOkYE=',
                    encrypted: true,
                    questionValid: true
                  }
                ]
              },
              cookie:
                'GR1UQoSAXh3byfiYc6prS/Y1wskZz26LvkQdjHhkbnxqab9HI5L678QBB7i087Jpc3jTC1FRSqFs+K+FBQeK9UihaYTdbUbeF/8vkgxkP+ztp/FU1V1c5vMVPGu+vRnetUtEqzcwzWDbix8BJWjEu6Qn7mBPQ2UoyLEGcWBxUp27SSTMkEraGBi5qRMcI/xYXy4n7QiW0J3Bf7dhoc33UsbBN+nJ3XZtc6pQDS0pAZ8m5SpSi4esogcwgvBHAcBQtR38vZuSjvs7Uaokkqd123EOoaTFD4iSU7HJNe2o++BMlpTRkk/477TN/z+/amccuYuS36m14+UWuR9OUkZLInVCPGh6ab+3vxp+jwd2n/k50p/lFYqou6gqzJD9pDGnXnlH7tby+pK0PZ5JmVC1M6/Kc2nW2UL8rn5KefwmbdY0CDfzwwwTz3xRBQCCkel2oDSdqf7CnN9WfqHWIzqrUUFfS83wlyd0kM+BcaxxLp4Zvk9BeCGM4RIkbgYOeznM/FKvenh4P0G3aWrpKB9OpPzKJoTRvn/2BhfXGsKeU662LFIUvj+IvvjKemyp6Ej77wcijS4YZs/QSIAEj3VFAGlbA4KX9xhbvl7ZHE2U/JdxOx+NA4dwSFr5L6/+LcL88AXx4Z7Ccmyi2jT2se783JXauRwqKCp5r8l9m4JwfWdk2FmSfiABHtIzjb5SwztoNSWwbpIPeZFmp6drQUwEfL9pq9snRu4AMlfXp/aKE9OvTtEE7Lfp4O5waDroOo+hBHqvUqoj63LD70m/C8cx6HPTpHe+hSdo1FIVxc5aTPgIfU7TbdR/xYh4L26x2JbP96tBk94ps6f6a5mzQ4NYqjnxNalpu23qEPsCvprZfJ6iQrCsgqaX1geFxmE1MbnjaY7q9zmhewoThtD18R8TV26mOcEmw+hdWAOrd80q3OnCiCa1xeeDrLydJEmh0pbx6dykWfFgm/8LDO4rY1ybOwSzdbN6eknH1MT32o5kZOBrVfMMcHq+04aLdpQhBmWdc10s6i0m5NQUwuiohkRpiNday6mx1vdKcqVAz7OPBZcztO+DAsglH4Go/YO3it91QNEaEIsriyPqhUGfCkK288HrsruUj9ELNcMqXOiF+BpPSPnd2G2p3Ok6eOmrfAw2HS01rWbGtF02YY83JOinefqJNmg74ptWrCS0xd2GaccIbb+mUxD3Z8iL/LClTlCrTVSQmXWblmBjYAgJZThAaX55FySi4WxCanVw2LqSBRcTbd9fgl4DFoT/jZ/N6KbZ',
              authenticated: true
            }
          }
        }
      }
    };
    mockMemberSvc.memberLogin.mockReturnValue(expRes);
    const res = await ctrl.memberLogin(loginModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error when user login with empty username', async () => {
    const loginModel = {
      username: '',
      password: 'Test1234!',
      memberType: 'CN=gbdMSS',
      metaIpaddress: '1.2',
      acceptedTouVersion: '1.0',
      market: ['TX'],
      cookie: ''
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[404],
            title: API_RESPONSE.messages.noUserNameTitle,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.memberLogin(loginModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error when user login with empty password', async () => {
    const loginModel = {
      username: 'username',
      password: '',
      memberType: 'CN=gbdMSS',
      metaIpaddress: '1.2',
      acceptedTouVersion: '1.0',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      cookie: ''
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[404],
            title: API_RESPONSE.messages.noPasswordTitle,
            detail: API_RESPONSE.messages.noPasswordDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.memberLogin(loginModel);
    expect(res).toEqual(expRes);
  });

  it('Should be able to save device cookie commercial user', async () => {
    const saveCookieModel = {
      usernm: '~pingsbxtest11',
      cookieValue:
        'TdhA+Vvll6dN35HkhVXlr7gNuwktup0UC6ynOI87PQpY7NFdvPhiFybEYI9FW8dlm3U1POm+e3jAyEm5M63SUJt5ZhjOh1GeeJjlRZBfbwQvx+XxrAJkuvNMBbQe91X/MSUevEMNyX9MJnqB4x8LwH8pN2HbT9vlTF9dKr4I80SU0n73R6kNf0iE5P6Wm8E0dQD7caVsgeRJYsYMdymCU8LsvN7AD3++So5j/EzKe2E=',
      metaIpaddress: '11.22.33.44',
      saveDeviceOrCookieFlag: 'true',
      transientUserNm: '~pingsbxtest11',
      fingerprintId: null,
      fingerprint: null,
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          status: 'verified/found',
          cookieValue:
            'TdhA+Vvll6dN35HkhVXlr7gNuwktup0UC6ynOI87PQpY7NFdvPhiFybEYI9FW8dlm3U1POm+e3jAyEm5M63SUJt5ZhjOh1GeeJjlRZBfbwQvx+XxrAJkuvNMBbQe91X/MSUevEMNyX9MJnqB4x8LwH8pN2HbT9vlTF9dKr4I80SU0n73R6kNf0iE5P6Wm8E0dQD7caVsgeRJYsYMdymCU0yYj55GMXNf1ASgL8cCQA82HOwnBu9zdh1Ohk3/9CPxduFSf3AOOKv2ThzeVIWc4Q=='
        }
      }
    };
    mockMemberSvc.loginSaveCookie.mockReturnValue(expRes);
    const res = await ctrl.loginSaveCookie(saveCookieModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for saveCookie with empty usernm', async () => {
    const saveCookieModel = {
      usernm: '',
      cookieValue:
        'TdhA+Vvll6dN35HkhVXlr7gNuwktup0UC6ynOI87PQpY7NFdvPhiFybEYI9FW8dlm3U1POm+e3jAyEm5M63SUJt5ZhjOh1GeeJjlRZBfbwQvx+XxrAJkuvNMBbQe91X/MSUevEMNyX9MJnqB4x8LwH8pN2HbT9vlTF9dKr4I80SU0n73R6kNf0iE5P6Wm8E0dQD7caVsgeRJYsYMdymCU8LsvN7AD3++So5j/EzKe2E=',
      metaIpaddress: '11.22.33.44',
      saveDeviceOrCookieFlag: 'true',
      transientUserNm: '~pingsbxtest11',
      fingerprintId: null,
      fingerprint: null,
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[404],
            title: API_RESPONSE.messages.noSufficientDataTwoFATitle,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.loginSaveCookie(saveCookieModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for saveCookie with empty usernm', async () => {
    const saveCookieModel = {
      usernm: 'username',
      cookieValue:
        'TdhA+Vvll6dN35HkhVXlr7gNuwktup0UC6ynOI87PQpY7NFdvPhiFybEYI9FW8dlm3U1POm+e3jAyEm5M63SUJt5ZhjOh1GeeJjlRZBfbwQvx+XxrAJkuvNMBbQe91X/MSUevEMNyX9MJnqB4x8LwH8pN2HbT9vlTF9dKr4I80SU0n73R6kNf0iE5P6Wm8E0dQD7caVsgeRJYsYMdymCU8LsvN7AD3++So5j/EzKe2E=',
      metaIpaddress: '11.22.33.44',
      saveDeviceOrCookieFlag: '',
      transientUserNm: '~pingsbxtest11',
      fingerprintId: null,
      fingerprint: null,
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[404],
            title: API_RESPONSE.messages.noSufficientDataTwoFATitle,
            detail: API_RESPONSE.messages.noSaveDeviceFlag
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.loginSaveCookie(saveCookieModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for saveCookie with empty usernm', async () => {
    const saveCookieModel = {
      usernm: 'username',
      cookieValue: '',
      metaIpaddress: '11.22.33.44',
      saveDeviceOrCookieFlag: 'true',
      transientUserNm: '~pingsbxtest11',
      fingerprintId: null,
      fingerprint: null,
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[404],
            title: API_RESPONSE.messages.noSufficientDataTwoFATitle,
            detail: API_RESPONSE.messages.noCookieInRequest
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    await ctrl.loginSaveCookie(saveCookieModel);
  });
});
