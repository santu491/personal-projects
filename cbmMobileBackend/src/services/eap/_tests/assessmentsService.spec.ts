import {Messages} from '../../../constants';
import {AssessmentsGateway} from '../../../gateway/assessmentsGateway';
import {
  AssessmentRequest,
  ClientAssessmentConfig,
} from '../../../models/Assessments';
import {MemberOAuthPayload} from '../../../types/customRequest';
import {APP} from '../../../utils/app';
import {
  mockAssessmentsGateway,
  mockEapMemberProfileService,
} from '../../../utils/baseTest';
import {appConfig} from '../../../utils/mockData';
import {ResponseUtil} from '../../../utils/responseUtil';
import {AssessmentsService} from '../assessmentsService';
import {
  getEAPMemberProfileAccessToken,
  searchEAPClient,
} from '../clientSearchService';

jest.mock('../../../gateway/assessmentsGateway.ts', () => ({
  AssessmentsGateway: jest.fn(() => mockAssessmentsGateway),
}));
jest.mock('../eapMemberProfileService', () => ({
  EAPMemberProfileService: jest.fn(() => mockEapMemberProfileService),
}));
jest.mock('../clientSearchService');

describe('AssessmentsService', () => {
  let service: AssessmentsService;
  const responseUtil = new ResponseUtil();

  beforeEach(() => {
    service = new AssessmentsService();
    APP.config.assessmentsSurvey = appConfig.assessmentsSurvey;
    service.assessmentsGateway = new AssessmentsGateway();
    mockEapMemberProfileService.getEAPMemberAuthAccessToken.mockReturnValue(
      'accessToken',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AssessmentsService - getSurveyLink', () => {
    let service: AssessmentsService;
    let surveyData: AssessmentRequest;
    let secureToken: string;
    let username: string;

    beforeEach(() => {
      service = new AssessmentsService();
      service.assessmentsGateway = new AssessmentsGateway();
      mockEapMemberProfileService.getEAPMemberAuthAccessToken.mockReturnValue(
        'accessToken',
      );
      surveyData = {
        iamguid: '',
        surveyId: '',
        calibrateHostName: '',
        clientURI: '',
        domainName: '',
        clientLogoFileName: '',
        parentLogoFileName: '',
        favIconFileName: '',
        assistantPhoneNumber: '',
        bannerText: [
          {
            text: '',
            value: '',
          },
        ],
        programName: '',
      };
      secureToken = 'secureToken';
      username = 'username';
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return success with survey link when fetchSurveyLink returns a valid survey assessment', async () => {
      const surveyAssessment = {surveyParticipantId: '12345'};
      mockAssessmentsGateway.generateCalibrateParticipantId.mockResolvedValue(
        surveyAssessment,
      );

      const result = await service.getSurveyLink(
        surveyData,
        secureToken,
        username,
      );

      expect(result).toEqual(
        responseUtil.createSuccess(
          `${APP.config.assessmentsSurvey.link}/12345`,
        ),
      );
      expect(
        service.assessmentsGateway.generateCalibrateParticipantId,
      ).toHaveBeenCalledWith(
        {
          ...surveyData,
          domainName: APP.config.assessmentsSurvey.domainName,
          calibrateHostName: APP.config.assessmentsSurvey.calibrateHost,
        },
        secureToken,
        username,
        'accessToken',
      );
    });

    it('should return error message when fetchSurveyLink returns null', async () => {
      mockAssessmentsGateway.generateCalibrateParticipantId.mockResolvedValue(
        null,
      );

      const result = await service.getSurveyLink(
        surveyData,
        secureToken,
        username,
      );

      expect(result).toEqual(
        responseUtil.createException(Messages.generateAssessmentError),
      );
    });

    it('should return error when fetchSurveyLink throws an error', async () => {
      const error = new Error('Test Error');
      mockAssessmentsGateway.generateCalibrateParticipantId.mockRejectedValue(
        error,
      );

      const result = await service.getSurveyLink(
        surveyData,
        secureToken,
        username,
      );

      expect(result).toEqual(responseUtil.createException(error.message));
    });
  });

  describe('generateAssessment', () => {
    const member: MemberOAuthPayload = {
      clientId: 'client',
      iamguid: 'iam',
      userName: 'user',
      clientName: 'company-demo',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    const user: MemberOAuthPayload = {
      clientId: 'client',
      clientName: 'company-demo',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    const clientConfig: ClientAssessmentConfig = {
      assistantPhoneNumber: '888-888-8888',
      bannerText: [],
      calibrateHostName: 'sit.assessment.carelonwellbeing.com',
      clientLogoFileName: 'clientLogoFileName',
      clientURI: 'clientUserName',
      domainName: 'www.carelonwellbeing.com',
      favIconFileName: 'careloneap-favicon.png',
      memberAssessmentBasePath: 'https://sit.assessment.carelonwellbeing.com',
      parentLogoFileName: 'Carelon_New_Svg.svg',
      programName: 'your Employee Assistance Program (EAP)',
      surveyId: 'surveyId',
      userAssessmentBasePath: 'https://sit.assessment.carelonwellbeing.com',
      userAssessmentConfig: 'domainName=www.carelonwellbeing.com',
    };

    beforeEach(() => {
      service = new AssessmentsService();
      APP.config.assessmentsSurvey = appConfig.assessmentsSurvey;
      service.assessmentsGateway = new AssessmentsGateway();
      // (replaceAll as jest.Mock).mockReturnValue('{}');
      mockEapMemberProfileService.getEAPMemberAuthAccessToken.mockReturnValue(
        'accessToken',
      );
      (getEAPMemberProfileAccessToken as jest.Mock).mockResolvedValue(
        'accessToken',
      );
      (searchEAPClient as jest.Mock).mockResolvedValue({
        data: {
          clients: [
            {
              userName: 'company-demo',
              clientName: 'Company Demo',
              alias: ['Company Demo'],
              benefitPackage: 'DEMO',
              mdLiveOU: 'DEMO1',
              onboardType: 'DFDBEACON',
              organizationName: 'BeaconEAP',
              groupId: 'DEMO1',
              groupName: 'Company Demo',
              planId: '1140',
              brandCode: 'AEAP',
              subGroupName: 'Not Applicable',
              brandName: 'Anthem EAP',
              sessionsProvide: '5',
              parentCode: 'ZDEMO1',
              livePersonChat: false,
              updatedBy: 'AI04891',
              createdDate: '2023-04-13T10:22:15.864Z',
              updatedDate: '2024-03-13T07:26:18.824Z',
              createdBy: 'AH99976',
              isSameParentCode: false,
              footerDisclosureNote:
                'EAP products are offered by Anthem Life Insurance Company. In New York, Anthem EAP products are offered by Anthem Life & Disability Insurance Company. In California, Anthem EAP products are offered by Blue Cross of California using the trade name Anthem Blue Cross. Anthem is a registered trademark. Use of the Anthem EAP website constitutes your agreement with our Terms of Use.',
              clientId: '6437d7d71e9e2fd670664005',
              logoUrl:
                'https://images.squarespace-cdn.com/content/v1/5daa874aef72120123a899b4/0fc9028d-673b-410a-a19f-601ac50a8e20/crl_sm_v_rgb_c.png',
              supportNumber: '888-888-8888',
            },
          ],
        },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return success with assessment URL for user (anonymous)', async () => {
      mockAssessmentsGateway.fetchClientAssessmentConfig.mockResolvedValue(
        clientConfig,
      );
      mockAssessmentsGateway.generateCalibrateParticipantId.mockResolvedValue({
        surveyParticipantId: 'test',
      });

      const response = await service.generateAssessment(user, 'surveyId');

      expect(response).toEqual(
        responseUtil.createSuccess({
          assessmentUrl: 'https://sit.assessment.carelonwellbeing.com',
        }),
      );
    });

    it('should return success with assessment URL for member', async () => {
      mockAssessmentsGateway.fetchClientAssessmentConfig.mockResolvedValue(
        clientConfig,
      );
      mockAssessmentsGateway.generateCalibrateParticipantId.mockResolvedValue({
        surveyParticipantId: 'test',
      });

      const response = await service.generateAssessment(
        member,
        'surveyId',
        'secureToken',
      );

      expect(response).toEqual(
        responseUtil.createSuccess({
          assessmentUrl: 'https://sit.assessment.carelonwellbeing.com',
        }),
      );
    });

    it('should throw error if generateCalibrateParticipantId is null', async () => {
      mockAssessmentsGateway.fetchClientAssessmentConfig.mockResolvedValue(
        clientConfig,
      );
      mockAssessmentsGateway.generateCalibrateParticipantId.mockResolvedValue(
        null,
      );

      const response = await service.generateAssessment(
        member,
        'surveyId',
        'secureToken',
      );

      expect(response).toEqual(
        responseUtil.createException(
          Messages.generateCalibrateParticipantIdError,
        ),
      );
    });
  });
});
