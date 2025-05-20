import {
  mockAccessTokenHelperSvc,
  mockLoginCommercialSvc,
  mockMemberGateway,
  mockMemberHelperSvc,
  mockMemberSvc,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ForgotUserCommercialService } from '../commercialService';

describe('ForgotUserCommercialService', () => {
  let service: ForgotUserCommercialService;
  beforeEach(() => {
    service = new ForgotUserCommercialService(
      <any>mockResult,
      mockAccessTokenHelperSvc as any,
      mockMemberSvc as any,
      mockMemberHelperSvc as any,
      mockLoginCommercialSvc as any,
      mockMemberGateway as any,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('commercialForgotUser', async () => {
    const forgotUserModel = {
      memberType: 'CN=eMember',
      metaIpaddress: '11.22.33.44',
      fname: 'JEN',
      lname: 'DENI',
      dob: '1990-06-05',
      hcid: '880T96719',
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
    const resp = await service.commercialForgotUser(forgotUserModel, 'token');
    try {
      mockMemberSvc.searchMemberByWebguid.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
