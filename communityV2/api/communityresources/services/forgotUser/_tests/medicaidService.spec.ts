import {
  mockAccessTokenHelperSvc,
  mockLoginHelperSvc,
  mockLoginMedicaidSvc,
  mockMemberHelperSvc,
  mockMemberSvc,
  mockOnPremTokenGateway,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { ForgotUserMedicaidService } from '../medicaidService';

describe('ForgotUserMedicaidService', () => {
  let service: ForgotUserMedicaidService;
  beforeEach(() => {
    service = new ForgotUserMedicaidService(
      <any>mockResult,
      mockMemberSvc as any,
      mockMemberHelperSvc as any,
      mockLoginHelperSvc as any,
      mockValidation as any,
      mockLoginMedicaidSvc as any,
      mockAccessTokenHelperSvc as any,
      mockOnPremTokenGateway as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('medicaidForgotUser', async () => {
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
    mockRestClient.invoke.mockResolvedValue({
      access_token: "accessToken"
    });

    try {
      mockMemberSvc.searchMemberByWebguid.mockReturnValue(expRes);
      const resp = await service.medicaidForgotUser(forgotUserModel, 'token');
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
