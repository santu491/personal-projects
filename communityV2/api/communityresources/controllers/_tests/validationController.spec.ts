import { API_RESPONSE } from '@anthem/communityapi/common';
import {
  mockMemberSvc,
  mockResult,
  mockSendOtpSvc,
  mockValidateOtpSvc
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ValidationController } from '../validationController';

describe('ValidationController', () => {
  let ctrl: ValidationController;
  beforeEach(() => {
    ctrl = new ValidationController(
      <any>mockMemberSvc,
      <any>mockSendOtpSvc,
      <any>mockValidateOtpSvc,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be able to send otp and return user and device Ids for commercial users', async () => {
    const sendOtpModel = {
      channel: 'EMAIL',
      contactUid: 'profile~1574762953519010230011810',
      userName: '~SIT3GQH812584146',
      model: 'Member',
      metaBrandCode: 'AGP-TX',
      memberType: 'CN=eMember'
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          secureAuthResponse: {
            adhocOTPAudit: {
              status: 'ACTIVATION_REQUIRED'
            }
          },
          pingDeviceId: '4f30bfca-43fd-49da-93dc-c9331b417ce8',
          pingUserId: 'ebca6d61-6945-4c28-89a6-bd9e461edbad'
        }
      }
    };
    mockSendOtpSvc.memberSendOtp.mockReturnValue(expRes);
    const res = await ctrl.memberSendOtp(sendOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for send OTP with empty channel', async () => {
    const sendOtpModel = {
      channel: '',
      contactUid:
        '8cb3adc587a88c631073e728227b0f859bd827bdde203dcea3cba0c8afe24b8de93d2c26ed2d5d3f22c98a8c67bc1d7a0324ae696f085d741ef72fd92cc24659',
      userName: '~TAJUANA46204',
      model: 'Member',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=gbdMSS'
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
            detail: API_RESPONSE.messages.noEmailTextChannel
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.memberSendOtp(sendOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for send OTP with empty contactUid', async () => {
    const sendOtpModel = {
      channel: 'EMAIL',
      userName: '~TAJUANA46204',
      model: 'Member',
      metaBrandCode: 'SYDCOM',
      memberType: '',
      contactUid: ''
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
            detail: API_RESPONSE.messages.noContactDetails
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.memberSendOtp(sendOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for updateSecret with empty username', async () => {
    const sendOtpModel = {
      channel: 'EMAIL',
      contactUid:
        '8cb3adc587a88c631073e728227b0f859bd827bdde203dcea3cba0c8afe24b8de93d2c26ed2d5d3f22c98a8c67bc1d7a0324ae696f085d741ef72fd92cc24659',
      userName: '',
      model: 'Member',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=gbdMSS'
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
    const res = await ctrl.memberSendOtp(sendOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for updateSecret with empty encryptedContact', async () => {
    const sendOtpModel = {
      channel: 'EMAIL',
      contactUid: '',
      userName: '~TAJUANA46204',
      model: 'Member',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=gbdMSS'
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
            detail: API_RESPONSE.messages.noContactDetails
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.memberSendOtp(sendOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should be able to validate otp and return the status for commercial users', async () => {
    const validateOtpModel = {
      otp: '643757',
      pingRiskId: '4ed94f03-12e6-4128-b5a2-a16a46ab41e2',
      pingDeviceId: '15fb8fdb-30a6-4641-96f4-a6a7ab79c774',
      pingUserId: '203ef9e2-70bf-4074-ae9b-56500b035183',
      model: 'Member',
      usernm: '~SIT3GQH812584146',
      cookie:
        'ant=!/UOc87FiVSRjebcQvIA2b9okPoufOhJVwSndAjBdD06AqWHsdOrVV2dCHmhxVvkyaIqXYBwCPJwmKEo=',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=eMember',
      isLogin: true
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          secureAuthResponse: {
            _links: {
              self: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb/users/203ef9e2-70bf-4074-ae9b-56500b035183/devices/15fb8fdb-30a6-4641-96f4-a6a7ab79c774'
              },
              environment: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb'
              },
              user: {
                href:
                  'https://api.pingone.com/v1/environments/c669a557-00eb-43c2-8ac1-9080c7dcebfb/users/ebca6d61-6945-4c28-89a6-bd9e461edbad'
              }
            },
            id: '4f30bfca-43fd-49da-93dc-c9331b417ce8',
            environment: {
              id: 'c669a557-00eb-43c2-8ac1-9080c7dcebfb'
            },
            user: {
              id: 'ebca6d61-6945-4c28-89a6-bd9e461edbad'
            },
            type: 'EMAIL',
            status: 'ACTIVE',
            createdAt: '2021-11-03T12:58:13.565Z',
            updatedAt: '2021-11-03T13:00:38.171Z',
            email: 'shyamkumar.nallaguntla@anthem.com'
          },
          valid: 'true'
        }
      }
    };
    mockValidateOtpSvc.commercialValidateOtp.mockReturnValue(expRes);
    const res = await ctrl.loginValidateOtp(validateOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for validate OTP with empty otp', async () => {
    const validateOtpModel = {
      otp: '',
      pingRiskId: '4ed94f03-12e6-4128-b5a2-a16a46ab41e2',
      pingDeviceId: '15fb8fdb-30a6-4641-96f4-a6a7ab79c774',
      pingUserId: '203ef9e2-70bf-4074-ae9b-56500b035183',
      model: 'Member',
      usernm: '~SIT3GQH812584146',
      cookie:
        'ant=!/UOc87FiVSRjebcQvIA2b9okPoufOhJVwSndAjBdD06AqWHsdOrVV2dCHmhxVvkyaIqXYBwCPJwmKEo=',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=eMember',
      isLogin: true
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
            detail: API_RESPONSE.messages.noOtpDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.loginValidateOtp(validateOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for validate OTP with empty usernm', async () => {
    const validateOtpModel = {
      otp: '12345',
      pingRiskId: '4ed94f03-12e6-4128-b5a2-a16a46ab41e2',
      pingDeviceId: '15fb8fdb-30a6-4641-96f4-a6a7ab79c774',
      pingUserId: '203ef9e2-70bf-4074-ae9b-56500b035183',
      model: 'Member',
      usernm: '',
      cookie:
        'ant=!/UOc87FiVSRjebcQvIA2b9okPoufOhJVwSndAjBdD06AqWHsdOrVV2dCHmhxVvkyaIqXYBwCPJwmKEo=',
      metaBrandCode: 'SYDCOM',
      memberType: 'CN=eMember',
      isLogin: true
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
    const res = await ctrl.loginValidateOtp(validateOtpModel);
    expect(res).toEqual(expRes);
  });

  it('Should be able to validate the security answers', async () => {
    const qaValidationModel = {
      memberType: 'CN=eMember',
      username: '~SIT3SBB000008AB',
      secretAnswerText1: 'father',
      secretAnswerText2: 'father'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          responseContext: {
            confirmationNumber: '172017000136null5g5FX7KmPltq'
          },
          secretAnswerMatched: true,
          secretAnswerAttemptsLeft: 6
        }
      }
    };
    mockMemberSvc.loginAnswerValidate.mockReturnValue(expRes);
    const res = await ctrl.loginAnswerValidate(qaValidationModel);
    expect(res).toEqual(expRes);
  });

  it('Should be able to validate the security answers', async () => {
    const qaValidationModel = {
      memberType: 'CN=eMember',
      username: '',
      secretAnswerText1: 'father',
      secretAnswerText2: 'father'
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
    const res = await ctrl.loginAnswerValidate(qaValidationModel);
    expect(res).toEqual(expRes);
  });

  it('Should be able to validate the security answers', async () => {
    const qaValidationModel = {
      memberType: 'CN=eMember',
      username: 'username',
      secretAnswerText1: '',
      secretAnswerText2: ''
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
            detail: API_RESPONSE.messages.noSecurityAnswer
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.loginAnswerValidate(qaValidationModel);
    expect(res).toEqual(expRes);
  });
});
