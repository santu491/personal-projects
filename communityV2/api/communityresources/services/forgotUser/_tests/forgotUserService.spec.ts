import {
  mockAccessTokenHelperSvc,
  mockForgotUserCommercialSvc,
  mockForgotUserMedicaidSvc,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ForgotUserService } from '../forgotUserService';

describe('ForgotUserService', () => {
  let service: ForgotUserService;
  beforeEach(() => {
    service = new ForgotUserService(
      <any>mockResult,
      mockAccessTokenHelperSvc as any,
      mockForgotUserMedicaidSvc as any,
      mockForgotUserCommercialSvc as any,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forgotUser -> commercial', async () => {
    const forgotUserModel = {
      memberType: 'CN=eMember',
      metaIpaddress: '11.22.33.44',
      fname: 'NUNEZ',
      lname: 'FIGURE',
      dob: '1973-07-07',
      hcid: '457T97639',
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
          username: '~SIT3SB457T97639',
          firstName: 'NUNEZ',
          lastName: 'FIGURE',
          secretQuestionAnswers: [
            {
              question: 'In what city or town was your first job?',
              answer: 'Msi7/wnDViZalvuDhc+hQcnZL3Y=',
              encrypted: true,
              questionValid: true
            },
            {
              question: 'What school did you attend for the third grade?',
              answer: 'Msi7/wnDViZalvuDhc+hQcnZL3Y=',
              encrypted: true,
              questionValid: true
            },
            {
              question: `What is your maternal grandmother's maiden name?`,
              answer: 'Msi7/wnDViZalvuDhc+hQcnZL3Y=',
              encrypted: true,
              questionValid: true
            }
          ],
          memberData: {
            userId: 'f1836021-4ead-4f81-ad65-aa99620db8bf',
            brand: 'ABCBS',
            underState: 'CO',
            groupId: '196111',
            subscriber: 'SCRBR',
            sourceSys: 'WGS20',
            lob: 'LG',
            planType: 'MPPO',
            subGroupId: '196111M004'
          },
          recoveryTreatDetails: {
            status: 'TwoFactor',
            suggestedAction: '2ndfactor',
            suggestedActionDesc: 'End-user undergoes additional Multi-Factor Authentication (Failure Action: Step up auth in Web Admin)',
            promptForDeviceUpdate: 'TRUE',
            pingRiskId: '8c031154-4836-4557-8987-74e0b3ffac3e',
            cookieValue: 'YCcan3tSiFdlLAt0rDFeV5ZAJlIr6rfAqIlaZiAVD28cyShP8MlaMUGu6HkeZKk+y3yh0/KDSsaQokgnyPe5dIR6r3CQM/Kc1EsCNvXvq/VZulThC+g0GvUT45fVL/MR'
          },
          contacts: [
            {
              contactUid: 'recovery~28371',
              contactValue: '***-***-2721',
              channel: 'TEXT'
            },
            {
              contactUid: 'recovery~28371',
              contactValue: '***-***-2721',
              channel: 'VOICE'
            },
            {
              contactUid: 'profile~1637810263276001310032110',
              contactValue: 'A**********@ANTHEM.COM',
              channel: 'EMAIL'
            },
            {
              contactUid: 'profile~1614642581359005520031610',
              contactValue: '***-***-9468',
              channel: 'TEXT'
            },
            {
              contactUid: 'profile~1614642581359005520031610',
              contactValue: '***-***-9468',
              channel: 'VOICE'
            }
          ]
        }
      }
    };
    const resp = await service.forgotUser(forgotUserModel);
    try {
      mockForgotUserCommercialSvc.commercialForgotUser.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('forgotUser -> medicaid', async () => {
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
    const resp = await service.forgotUser(forgotUserModel);
    try {
      mockForgotUserMedicaidSvc.medicaidForgotUser.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
