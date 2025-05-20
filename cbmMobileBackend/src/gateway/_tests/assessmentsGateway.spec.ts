import {
  AssessmentRequest,
  ClientAssessmentConfig,
} from '../../models/Assessments';
import {APP} from '../../utils/app';
import {mockDynamoDBGateway} from '../../utils/baseTest';
import {axiosPost} from '../../utils/httpUtil';
import {eapMemberAuthConfigData} from '../../utils/mockData';
import {AssessmentsGateway} from '../assessmentsGateway';
import {DynamoDBGateway} from '../dynamoDBGateway';

jest.mock('../../utils/httpUtil');
jest.mock('../../utils/common');

jest.mock('../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

describe('AssessmentsGateway', () => {
  let gateway: AssessmentsGateway;
  let dynamoDBGateway: DynamoDBGateway;

  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.memberAuth = eapMemberAuthConfigData;
    gateway = new AssessmentsGateway();
    dynamoDBGateway = new DynamoDBGateway();
  });

  const mockResponse = {
    status: 200,
    data: {data: 'data'},
  };

  const mockErrorResponse = {
    response: {
      status: 400,
      data: {
        message: 'error',
      },
    },
  };

  describe('generateCalibrateParticipantId', () => {
    const inputRequest: AssessmentRequest = {
      iamguid: 'iamguid',
      surveyId: 'surveyId',
      calibrateHostName: 'calibrate',
      domainName: 'qa.carelon',
      assistantPhoneNumber: '930994',
      bannerText: [],
    };
    it('should return response data on success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue(mockResponse);
      const response = await gateway.generateCalibrateParticipantId(
        inputRequest,
        'secureToken',
        'username',
        'accessToken',
      );
      expect(response).toEqual(mockResponse.data);
    });

    it('should return an empty object on error', async () => {
      (axiosPost as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway
        .generateCalibrateParticipantId(
          inputRequest,
          'secureToken',
          'username',
          'accessToken',
        )
        .catch(error => {
          expect(error).toEqual(mockErrorResponse);
        });
    });

    it('should return an empty object on exception', async () => {
      (axiosPost as jest.Mock).mockRejectedValue(mockErrorResponse);
      const response = await gateway
        .generateCalibrateParticipantId(
          inputRequest,
          'secureToken',
          'username',
          'accessToken',
        )
        .catch(error => {
          expect(error).toEqual(mockErrorResponse);
        });
    });
  });

  describe('fetchClientAssessmentConfig', () => {
    const clientAssessmentData: ClientAssessmentConfig = {
      surveyId: '',
      calibrateHostName: '',
      clientURI: '',
      domainName: '',
      clientLogoFileName: '',
      parentLogoFileName: '',
      favIconFileName: '',
      assistantPhoneNumber: '',
      bannerText: [],
      programName: '',
      userAssessmentConfig: '',
      memberAssessmentBasePath: '',
      userAssessmentBasePath: '',
    };
    it('should return response data on success', async () => {
      const mockConfig = {
        status: 200,
        data: {
          isSuccess: true,
          value: {
            content: clientAssessmentData,
          },
        },
      };
      mockDynamoDBGateway.getRecords.mockResolvedValue(mockConfig);
      const response = await gateway.fetchClientAssessmentConfig();
      expect(response).toEqual(clientAssessmentData);
    });

    it('should return response null if data not found', async () => {
      const mockConfig = {
        status: 200,
        data: {
          isSuccess: true,
          value: null,
        },
      };
      mockDynamoDBGateway.getRecords.mockResolvedValue(mockConfig);
      const response = await gateway.fetchClientAssessmentConfig();
      expect(response).toEqual(undefined);
    });

    it('should return an empty object on error', async () => {
      mockDynamoDBGateway.getRecords.mockResolvedValue(mockErrorResponse);
      const response = await gateway
        .fetchClientAssessmentConfig()
        .catch(error => {
          expect(error).toEqual(mockErrorResponse);
        });
    });

    it('should return an empty object on exception', async () => {
      mockDynamoDBGateway.getRecords.mockResolvedValue(mockErrorResponse);
      const response = await gateway
        .fetchClientAssessmentConfig()
        .catch(error => {
          expect(error).toEqual(mockErrorResponse);
        });
    });
  });
});
