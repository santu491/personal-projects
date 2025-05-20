import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockForgotUserSvc, mockMemberSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ForgotUserController } from '../forgotUserController';

describe('ForgotUserController', () => {
  let ctrl: ForgotUserController;
  beforeEach(() => {
    ctrl = new ForgotUserController(<any>mockMemberSvc,<any>mockForgotUserSvc, <any>mockResult, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // forgotUser
  it('Should successfully find user and return user details', async () => {
    const forgotUserModel = {
      memberType: 'CN=gbdMSS',
      metaIpaddress: '11.22.33.44',
      fname: 'TAJUANA',
      lname: 'HODO',
      dob: '1974-05-01',
      hcid: 'YRK788779854',
      employeeId: '',
      cookie: '',
      email: '',
      mbrGenericId: '',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      digitalAuthenticationCode: ''
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
              username: '~SIT3GQH812584146',
              firstName: 'GUERRERO',
              lastName: 'HOWELL',
              secretQuestionAnswers: [
                {
                  question: 'What street did you grow up on?',
                  answer: 'Msi7/wnDViZalvuDhc+hQcnZL3Y=',
                  encrypted: true,
                  questionValid: true
                },
                {
                  question: 'In what city or town was your first job?',
                  answer: 'Msi7/wnDViZalvuDhc+hQcnZL3Y=',
                  encrypted: true,
                  questionValid: true
                },
                {
                  question: 'In what city or town was your first job?',
                  answer: 'Msi7/wnDViZalvuDhc+hQcnZL3Y=',
                  encrypted: true,
                  questionValid: true
                }
              ],
              recoveryTreatDetails: {
                status: 'TwoFactor',
                suggestedAction: '2ndfactor',
                suggestedActionDesc:
                  'End-user undergoes additional Multi-Factor Authentication (Failure Action: Step up auth in Web Admin)',
                promptForDeviceUpdate: 'TRUE',
                fingerprintId: '',
                pingRiskId: 'e6ee1b5c-d26c-48fb-b0da-099a32fce998',
                cookieValue:
                  'QuToJHCHLgnpgDr7FlGDQq6QtPYlrq6KmJygkiEsqDGJjrgStEMxKDNeUvjib/en1gSl00sAwgv82g3/fMLtTe2hZAJCUKRwypwwwPCpKnKDgW+5cGjWPhyhES8BA2SA'
              },
              twoFAStatus: false,
              contacts: [
                {
                  contactUid: 'recovery~29083',
                  contactValue: '***-***-3810',
                  channel: 'TEXT'
                },
                {
                  contactUid: 'recovery~29083',
                  contactValue: '***-***-3810',
                  channel: 'VOICE'
                },
                {
                  contactUid: 'profile~1574762953519010230011810',
                  contactValue: 'V**********@ANTHEM.COM',
                  channel: 'EMAIL'
                }
              ]
            }
          }
        }
      }
    };
    mockForgotUserSvc.forgotUser.mockReturnValue(expRes);
    const res = await ctrl.forgotUser(forgotUserModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for forgotUser with empty fname', async () => {
    const forgotUserModel = {
      memberType: 'CN=gbdMSS',
      metaIpaddress: '11.22.33.44',
      fname: '',
      lname: 'HODO',
      dob: '1974-05-01',
      hcid: 'YRK788779854',
      employeeId: '',
      cookie: '',
      email: '',
      mbrGenericId: '',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      digitalAuthenticationCode: ''
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
            detail: API_RESPONSE.messages.noSufficientFupDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.forgotUser(forgotUserModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for forgotUser with empty fname', async () => {
    const forgotUserModel = {
      memberType: 'CN=gbdMSS',
      metaIpaddress: '11.22.33.44',
      fname: 'TAJUANA',
      lname: '',
      dob: '1974-05-01',
      hcid: 'YRK788779854',
      employeeId: '',
      cookie: '',
      email: '',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      mbrGenericId: '',
      digitalAuthenticationCode: ''
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
            detail: API_RESPONSE.messages.noSufficientFupDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.forgotUser(forgotUserModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for forgotUser with empty dob', async () => {
    const forgotUserModel = {
      memberType: 'CN=gbdMSS',
      metaIpaddress: '11.22.33.44',
      fname: 'TAJUANA',
      lname: 'HODO',
      dob: '',
      hcid: 'YRK788779854',
      employeeId: '',
      cookie: '',
      email: '',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      mbrGenericId: '',
      digitalAuthenticationCode: ''
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
            detail: API_RESPONSE.messages.noSufficientFupDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.forgotUser(forgotUserModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for forgotUser with empty hcid', async () => {
    const forgotUserModel = {
      memberType: 'CN=gbdMSS',
      metaIpaddress: '11.22.33.44',
      fname: 'TAJUANA',
      lname: 'HODO',
      dob: '1974-05-01',
      hcid: '',
      employeeId: '',
      cookie: '',
      email: '',
      mbrGenericId: '',
      market: ['IN'],
      marketingBrand: 'ABCBS',
      digitalAuthenticationCode: ''
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
            detail: API_RESPONSE.messages.noSufficientFupDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.forgotUser(forgotUserModel);
    expect(res).toEqual(expRes);
  });

  // updateSecret
  it('Should be able to update new password using temporary password', async () => {
    const updatePasswordModel = {
      memberType: 'CN=eMember',
      username: '~SIT3GQH812584146',
      newPassword: 'password',
      iamGuid: '',
      dn: '',
      currentPassword: ''
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          confirmationNumber: '172017000041null3gTxDj8qeWWJ'
        }
      }
    };
    mockMemberSvc.updateSecret.mockReturnValue(expRes);
    mockMemberSvc.getPassword.mockReturnValue({
      data: {
        isException: false,
        value: {
          confirmationNumber: '172017000041null3gTxDj8qeWWJ'
        }
      }
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    const res = await ctrl.updateSecret(updatePasswordModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for updateSecret with empty username', async () => {
    const updatePasswordModel = {
      memberType: 'CN=eMember',
      username: '',
      newPassword: 'password',
      iamGuid: '',
      dn: '',
      currentPassword: ''
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
    const res = await ctrl.updateSecret(updatePasswordModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for updateSecret with empty password', async () => {
    const updatePasswordModel = {
      memberType: 'CN=eMember',
      username: 'username',
      newPassword: '',
      iamGuid: '',
      dn: '',
      currentPassword: ''
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
            detail: API_RESPONSE.messages.noPasswordDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateSecret(updatePasswordModel);
    expect(res).toEqual(expRes);
  });

  it('Should return error for updateSecret with empty password', async () => {
    const updatePasswordModel = {
      memberType: 'CN=eMember',
      username: 'username',
      newPassword: '',
      iamGuid: '',
      dn: '',
      currentPassword: ''
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
            detail: API_RESPONSE.messages.noPasswordDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateSecret(updatePasswordModel);
    expect(res).toEqual(expRes);
  });
});
