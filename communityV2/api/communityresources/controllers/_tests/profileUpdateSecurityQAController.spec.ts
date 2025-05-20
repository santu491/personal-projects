import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockCommercialSvc, mockMedicaidSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ProfileUpdateSecurityQAController } from '../profileUpdateSecurityQAController';

describe('ProfileUpdateSecurityQAController', () => {
  let ctrl: ProfileUpdateSecurityQAController;
  beforeEach(() => {
    ctrl = new ProfileUpdateSecurityQAController(
      <any>mockCommercialSvc,
      <any>mockMedicaidSvc,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be able to get the security questions for commercial users', async () => {
    const memberId = '318339267';
    const webguid = 'f1836021-4ead-4f81-ad65-aa99620db8bf';
    const memberType = 'CN=eMember';
    const dn = '';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          usernm: '~SIT3SB457T97639',
          secretQuestions: [
            {
              questionNo: '1',
              question: `What is your maternal grandmother's maiden name?`,
              isAnswered: 'true',
              answer: 'ENCRYPTED'
            },
            {
              questionNo: '2',
              question: 'In what city or town was your first job?',
              isAnswered: 'true',
              answer: 'ENCRYPTED'
            },
            {
              question: 'What school did you attend for the third grade?'
            },
            {
              question: `What is your paternal grandfather's first name?`
            },
            {
              question:
                'What is the first name of your favorite childhood friend?'
            },
            {
              question: `On your mother's side of the family, what is your grandfather's first name?`
            }
          ]
        }
      }
    };
    const res = await ctrl.getSecurityQuestions(memberId, webguid, memberType, dn);
    try {
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error while user memberType not there', async () => {
    const memberId = '318339267';
    const webguid = 'f1836021-4ead-4f81-ad65-aa99620db8bf';
    const memberType = '';
    const dn = '';

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.memberTypeMissing
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getSecurityQuestions(memberId, webguid, memberType, dn);
    expect(res).toEqual(expRes);
  });

  it('Should return error while webguid not there for commercial users', async () => {
    const memberId = '318339267';
    const webguid = '';
    const memberType = 'CN=eMember';
    const dn = '';

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.webGuidMissing
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getSecurityQuestions(memberId, webguid, memberType, dn);
    expect(res).toEqual(expRes);
  });

  it('Should return error while memberId not there for commercial users', async () => {
    const memberId = '';
    const webguid = 'f1836021-4ead-4f81-ad65-aa99620db8bf';
    const memberType = 'CN=eMember';
    const dn = '';

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.mbrUidMissing
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getSecurityQuestions(memberId, webguid, memberType, dn);
    expect(res).toEqual(expRes);
  });

  it('Should be able to get the security questions for medicaid users', async () => {
    const memberId = '';
    const webguid = '';
    const memberType = 'CN=gdbMSS';
    const dn = 'CN=~LUCY46213,OU=eMembers,OU=webUsers,OU=usersAndGroups,DC=webstagead,DC=wellpoint,DC=com';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          usernm: '~LUCY46213',
          secretQuestions: [
            {
              questionNo: '1',
              question: `What is your maternal grandmother's maiden name?`,
              isAnswered: 'true',
              answer: 'ENCRYPTED'
            },
            {
              questionNo: '2',
              question: 'In what city or town was your first job?',
              isAnswered: 'true',
              answer: 'ENCRYPTED'
            },
            {
              question: 'What school did you attend for the third grade?'
            },
            {
              question: `What is your paternal grandfather's first name?`
            },
            {
              question:
                'What is the first name of your favorite childhood friend?'
            },
            {
              question: `On your mother's side of the family, what is your grandfather's first name?`
            }
          ]
        }
      }
    };
    const res = await ctrl.getSecurityQuestions(memberId, webguid, memberType, dn);
    try {
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error while dn not there for medicaid user', async () => {
    const memberId = '';
    const webguid = '';
    const memberType = 'CN=gbdMSS';
    const dn = '';

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.noDnDetails
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getSecurityQuestions(memberId, webguid, memberType, dn);
    expect(res).toEqual(expRes);
  });

  it('Should be able to update the security question answers', async () => {
    const request = {
      usernm: '~SIT3SB457T97639',
      webguid: 'f1836021-4ead-4f81-ad65-aa99620db8bf',
      memberType: 'CN=eMember',
      memberId: '318339267',
      secretQuestions: [
        {
          questionNo: '1',
          question: `What is your maternal grandmother's maiden name?`,
          isAnswered: 'true',
          answer: 'father'
        }
      ]
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          usernm: '~SIT3SB457T97639',
          secretQuestions: [
            {
              questionNo: '1',
              question: `What is your maternal grandmother's maiden name?`,
              answer: 'father'
            },
            {
              question: 'What school did you attend for the third grade?'
            },
            {
              question: `What is your paternal grandfather's first name?`
            },
            {
              question:
                'What is the first name of your favorite childhood friend?'
            },
            {
              question:
                'What is the name of the place your wedding reception was held?'
            },
            {
              question: 'What was the name of your first pet?'
            },
            {
              question: `On your mother's side of the family, what is your grandfather's first name?`
            }
          ]
        }
      }
    };
    const res = await ctrl.updateSecurityQuestions(request);
    try {
      expect(res).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should return error while usernm not there while', async () => {
    const request = {
      usernm: '',
      webguid: 'f1836021-4ead-4f81-ad65-aa99620db8bf',
      memberId: '318339267',
      memberType: 'CN=eMember',
      secretQuestions: [
        {
          questionNo: '1',
          question: `What is your maternal grandmother's maiden name?`,
          isAnswered: 'true',
          answer: 'father'
        }
      ]
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'fcb1036f-f737-fbac-bf25-603fec447549',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.noUserNameTitle,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateSecurityQuestions(request);
    expect(res).toEqual(expRes);
  });

  it('Should return error while webguid not there while', async () => {
    const request = {
      usernm: '~SIT3SB457T97639',
      webguid: '',
      memberId: '318339267',
      memberType: 'CN=eMember',
      secretQuestions: [
        {
          questionNo: '1',
          question: `What is your maternal grandmother's maiden name?`,
          isAnswered: 'true',
          answer: 'father'
        }
      ]
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.missingRequiredParameters,
            detail: API_RESPONSE.messages.webGuidMissing
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateSecurityQuestions(request);
    expect(res).toEqual(expRes);
  });
});
