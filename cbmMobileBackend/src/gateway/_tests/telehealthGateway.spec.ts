import {MemberOAuthPayload} from '../../types/customRequest';
import {ClinicalQuestionsRequest} from '../../types/telehealthModel';
import {APP} from '../../utils/app';
import {axiosPost} from '../../utils/httpUtil';
import {
  eapMemberAuthConfigData,
  mockClinicalQuestions,
  mockUserProfileData,
} from '../../utils/mockData';
import {TelehealthGateway} from '../telehealthGateway';

jest.mock('../../utils/httpUtil');

describe('TelehealthGateway', () => {
  let gateway: TelehealthGateway;

  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.memberAuth = eapMemberAuthConfigData;
    gateway = new TelehealthGateway();
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

  describe('createMdLiveAppointment', () => {
    const memberPayload: MemberOAuthPayload = {
      iamguid: 'iamguid',
      userName: 'username',
      clientId: '',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    const userDetails = {
      data: mockUserProfileData,
      secureToken: 'secureToken',
    };

    it('should return response data on success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue(mockResponse);
      const response = await gateway.createMdLiveAppointment(
        memberPayload,
        mockClinicalQuestions,
        userDetails,
        'accessToken',
      );
      expect(response).toEqual(mockResponse.data);
    });

    it('should return response data on success if clinical Questions is null', async () => {
      (axiosPost as jest.Mock).mockResolvedValue(mockResponse);
      const response = await gateway.createMdLiveAppointment(
        memberPayload,
        {} as ClinicalQuestionsRequest,
        userDetails,
        'accessToken',
      );
      expect(response).toEqual(mockResponse.data);
    });

    it('should return an empty object on error', async () => {
      (axiosPost as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway.createMdLiveAppointment(
        memberPayload,
        mockClinicalQuestions,
        userDetails,
        'accessToken',
      );
      expect(response).toEqual(undefined);
    });
  });
});
