import {Messages} from '../../constants';
import {MemberOAuthPayload} from '../../types/customRequest';
import {mockAssessmentsService} from '../../utils/baseTest';
import {ResponseUtil} from '../../utils/responseUtil';
import {AssessmentsController} from '../assessmentsController';

jest.mock('../../services/eap/assessmentsService', () => ({
  AssessmentsService: jest.fn(() => mockAssessmentsService),
}));

describe('AssessmentsController', () => {
  let controller: AssessmentsController;
  let mockGetSurveyLink: jest.Mock;
  const result = new ResponseUtil();

  const user: MemberOAuthPayload = {
    clientId: 'clientId',
    clientName: 'clientName',
    userName: 'userName',
    iamguid: 'iamguid',
    installationId: 'installationId',
    sessionId: 'sessionId',
  };
  const clientName = 'clientName';
  const secureToken = 'secureToken';
  const surveyId = 'surveyId';

  beforeEach(() => {
    controller = new AssessmentsController();
    mockGetSurveyLink = jest.fn();
    controller.assessmentsService.getSurveyLink = mockGetSurveyLink;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAssesment', () => {
    it('should return survey link for valid user', async () => {
      mockAssessmentsService.generateAssessment.mockResolvedValue(
        'mockResponse',
      );

      const result = await controller.createAssessment(
        'eap',
        clientName,
        surveyId,
        secureToken,
        user,
      );

      expect(result).toEqual('mockResponse');
    });

    it('should retuen error if source is not EAP', async () => {
      mockAssessmentsService.generateAssessment.mockResolvedValue(
        'mockResponse',
      );

      const response = await controller.createAssessment(
        'source',
        clientName,
        surveyId,
        secureToken,
        user,
      );

      expect(response).toEqual(
        result.createException(Messages.invalidSource, 400),
      );
    });

    it('should return error message for invalid user', async () => {
      const response = await controller.createAssessment(
        'eap',
        secureToken,
        '',
        surveyId,
        {
          clientId: '',
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
      );

      expect(response).toEqual(
        result.createException(Messages.clientNameNotFoundError, 400),
      );
    });

    it('should return error message for invalid token', async () => {
      const response = await controller.createAssessment(
        'eap',
        '',
        clientName,
        surveyId,
        user,
      );

      expect(response).toEqual(
        result.createException(Messages.secureTokenNotFoundError, 400),
      );
    });
  });

  describe('getMemberSurvey', () => {
    it('should return survey link for valid user', async () => {
      const surveyData = {
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
      const cookieToken = 'mockCookieToken';
      const user = {
        userName: 'validUser',
        clientName: 'Company Demo',
        clientId: 'CBHM',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      const mockResponse = {link: 'http://example.com/survey'};

      mockGetSurveyLink.mockResolvedValue(mockResponse);

      const result = await controller.getMemberSurvey(
        surveyData,
        cookieToken,
        user,
      );

      expect(mockGetSurveyLink).toHaveBeenCalledWith(
        surveyData,
        cookieToken,
        user.userName,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return error message for invalid user', async () => {
      const surveyData = {
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
      const cookieToken = 'mockCookieToken';
      const user = {
        username: 'validUser',
        clientName: 'Company Demo',
        clientId: 'CBHM',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };

      const result = await controller.getMemberSurvey(
        surveyData,
        cookieToken,
        user,
      );

      expect(result).toEqual(
        controller.result.createException(Messages.invalidAuthError, 400),
      );
      expect(mockGetSurveyLink).not.toHaveBeenCalled();
    });

    it('should handle exceptions', async () => {
      const surveyData = {
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
      const cookieToken = 'mockCookieToken';
      const user = {
        userName: 'validUser',
        clientName: 'Company Demo',
        clientId: 'CBHM',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      const mockError = new Error('Test error');

      mockGetSurveyLink.mockRejectedValue(mockError);

      const result = await controller.getMemberSurvey(
        surveyData,
        cookieToken,
        user,
      );

      expect(result).toEqual(mockError);
      expect(mockGetSurveyLink).toHaveBeenCalledWith(
        surveyData,
        cookieToken,
        user.userName,
      );
    });
  });
});
