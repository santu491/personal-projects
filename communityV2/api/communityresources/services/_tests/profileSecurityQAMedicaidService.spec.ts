import { mockAccessTokenHelperSvc, mockMemberHelperSvc, mockResult } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ProfileSecurityQAGateway } from 'api/communityresources/gateways/profileSecurityQAGateway';
import { ProfileSecurityQAMedicaidService } from '../profileSecurityQAMedicaidService';

describe('ProfileSecurityQAMedicaidService', () => {
  let svc: ProfileSecurityQAMedicaidService;
  const mockGateway: Mockify<ProfileSecurityQAGateway> = {
    commercialSecurityQuestions: jest.fn(),
    medicaidSecretQuestionsApi: jest.fn(),
    medicaidSecretQAUpdateApi: jest.fn(),
    medicaidUserSecretQAPopulateApi: jest.fn()
  };

  beforeEach(() => {
    svc = new ProfileSecurityQAMedicaidService(
      <any>mockResult,
      <any>mockAccessTokenHelperSvc,
      <any>mockMemberHelperSvc,
      <any>mockGateway,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should get the security questions for medicaid users', async () => {
    const expRes = {
          'responseContext': {
            'confirmationNumber': '172017000079nullf86H6joVRCUk'
          },
          'secretQuestions': [
            'what school did you attend for the third grade?',
            `what is your maternal grandmother's maiden name?`,
            `what is your paternal grandfather's first name?`,
            'in what city or town was your first job?',
            'what is the first name of your favorite childhood friend?',
            'what is the name of the place your wedding reception was held?',
            'what was the name of your first pet?',
            `on your mother's side of the family, what is your grandfather's first name?`,
            `on your father's side of the family, what is your grandfather's first name?`,
            'what is the name of the hospital in which you were born?',
            'in what city was your mother born?',
            'in what city was your father born?',
            'what was your high school mascot?',
            'what was your favorite place to visit as a child?',
            'what is the name of your first employer?',
            'what street did you grow up on?',
            'what is the last name of your favorite teacher?'
          ]
        }
    const resp = await svc.getMedicaidSecretQuestionsList('test');
    try {
      mockGateway.medicaidSecretQuestionsApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });

  it('Should update the security question answers for commercial users', async () => {
    const request = {
      'usernm': '~LUCY46213',
      'memberType': 'CN=gbdMSS',
      'dn': 'CN=~LUCY46213,OU=eMembers,OU=webUsers,OU=usersAndGroups,DC=webstagead,DC=wellpoint,DC=com',
      'secretQuestions': [
        {
          'questionNo': '1',
          'question': 'what school did you attend for the third grade?',
          'isAnswered': 'true',
          'answer': 'grade'
        },
        {
          'questionNo': '2',
          'question': `what is your maternal grandmother's maiden name?`,
          'isAnswered': 'true',
          'answer': 'name'
        }
      ]
    };
    const expRes ={
      'responseContext': {
          'confirmationNumber': '172017000079nullv86H6dGyzI9r'
      },
      'user': {
          'emailAddress': 'ashwini.poonacha@anthem.com',
          'username': '~LUCY46213',
          'iamGuid': '964e6402-dc78-4ffb-8fa5-4c98294302aa',
          'repositoryEnum': 'IAM',
          'userRoleEnum': 'MEMBER',
          'secretQuestion': null,
          'secretAnswer': null,
          'firstName': 'LUCY',
          'lastName': 'PHILLIPS',
          'dn': 'CN=~LUCY46213,OU=eMembers,OU=webUsers,OU=usersAndGroups,DC=webstagead,DC=wellpoint,DC=com',
          'userAccountStatus': {
              'comments': null,
              'disabled': false,
              'locked': false,
              'forceChangePassword': false,
              'badSecretAnsCount': 0,
              'badPasswordCount': 0,
              'lastLoginTime': null,
              'isUserNameValid': true,
              'isSecretQuestionValid': true
          },
          'memberOf': [
              'CN=gbdMss,OU=identityMinder,OU=Application Groups,OU=Wellpoint,OU=Groups,OU=usersAndGroups,DC=webstagead,DC=wellpoint,DC=com',
              'CN=eMember,OU=identityMinder,OU=Application Groups,OU=Wellpoint,OU=Groups,OU=usersAndGroups,DC=webstagead,DC=wellpoint,DC=com'
          ],
          'dateOfBirth': null,
          'ssoID': [],
          'secretQuestionAnswers': [
              {
                  'question': 'what school did you attend for the third grade?',
                  'answer': 'Oaa9Q162MvgC2AaytBuTJvGxa1E=',
                  'encrypted': true,
                  'questionValid': true
              },
              {
                  'question': `what is your maternal grandmother's maiden name?`,
                  'answer': 'aumZVSoNLcoU1i4ryLdk03ex3Ww=',
                  'encrypted': true,
                  'questionValid': true
              },
              {
                  'question': 'what is the first name of your favorite childhood friend?',
                  'answer': '5phnyn1aewq2Ciph57eRwQb3v2Q=',
                  'encrypted': true,
                  'questionValid': true
              }
          ],
          'memberId': null,
          'ssoUniqueId': null,
          'ssoClientId': null
      }
    };
    const resp = await svc.updateMedicaidSecretQuestions(request);
    try {
      mockGateway.medicaidSecretQAUpdateApi.mockReturnValue(expRes);
      expect(resp).toEqual(expRes);
    } catch (err) {
      mockResult.createException.mockReturnValue(err);
    }
  });
});
