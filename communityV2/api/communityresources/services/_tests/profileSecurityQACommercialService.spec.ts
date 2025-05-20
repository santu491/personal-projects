import { mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ProfileSecurityQAGateway } from 'api/communityresources/gateways/profileSecurityQAGateway';
import { ProfileSecurityQACommercialService } from '../profileSecurityQACommercialService';

describe('ProfileSecurityQACommercialService', () => {
  let svc: ProfileSecurityQACommercialService;
  const mockGateway: Mockify<ProfileSecurityQAGateway> = {
    commercialSecurityQuestions: jest.fn(),
    medicaidSecretQuestionsApi: jest.fn(),
    medicaidSecretQAUpdateApi: jest.fn(),
    medicaidUserSecretQAPopulateApi: jest.fn()
  };

  beforeEach(() => {
    svc = new ProfileSecurityQACommercialService(
      <any>mockResult,
      <any>mockGateway,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should get the security questions for commercial users', async () => {
    const memberId = '318339267';
    const webguid = 'f1836021-4ead-4f81-ad65-aa99620db8bf';
    const expRes = {
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
          question: 'What is the first name of your favorite childhood friend?'
        },
        {
          question: `On your mother's side of the family, what is your grandfather's first name?`
        }
      ]
    };
    const resp = await svc.getSecurityQuestions(memberId, webguid);
    try {
      mockGateway.commercialSecurityQuestions.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should update the security question answers for commercial users', async () => {
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
          question: 'What is the first name of your favorite childhood friend?'
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
    };
    const resp = await svc.updateSecurityQuestions(request);
    try {
      mockGateway.commercialSecurityQuestions.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
