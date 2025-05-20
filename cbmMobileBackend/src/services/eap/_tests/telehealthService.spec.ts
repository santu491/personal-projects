import {Messages} from '../../../constants';
import {MemberOAuthPayload} from '../../../types/customRequest';
import {UserProfileResponse} from '../../../types/eapMemberProfileModel';
import {MdLiveAppointmentResponse} from '../../../types/telehealthModel';
import {
  mockEapMemberProfileGateway,
  mockTelehealthGateway,
} from '../../../utils/baseTest';
import {getAccessToken} from '../../../utils/common';
import {
  mockClinicalQuestions,
  mockUserProfileData,
} from '../../../utils/mockData';
import {ResponseUtil} from '../../../utils/responseUtil';
import {TelehealthService} from '../telehealthService';

jest.mock('../../../gateway/telehealthGateway', () => ({
  TelehealthGateway: jest.fn(() => mockTelehealthGateway),
}));

jest.mock('../../../gateway/eapMemberProfileGateway', () => ({
  EAPMemberProfileGateway: jest.fn(() => mockEapMemberProfileGateway),
}));

jest.mock('../../../utils/common');

describe('TelehealthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TelehealthService - createMdLiveAppointmentService', () => {
    let service: TelehealthService;
    let memberPayload: MemberOAuthPayload;
    let userDetails: {data: UserProfileResponse; secureToken: string};
    let responseUtil: ResponseUtil;

    beforeEach(() => {
      service = new TelehealthService();
      responseUtil = new ResponseUtil();

      (getAccessToken as jest.Mock).mockReturnValue('accessToken');

      memberPayload = {
        iamguid: 'iamguid',
        userName: 'username',
        clientId: '',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      userDetails = {
        data: mockUserProfileData,
        secureToken: 'secureToken',
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return response data on success', async () => {
      const mockResponse: MdLiveAppointmentResponse = {
        redirectURl: 'test',
        cw_auth_token: 'auth_token',
      };

      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue(
        userDetails,
      );
      mockTelehealthGateway.createMdLiveAppointment.mockResolvedValue(
        mockResponse,
      );

      const response = await service.createMdliveAppointmentService(
        memberPayload,
        mockClinicalQuestions,
      );

      expect(response).toEqual(
        responseUtil.createSuccess({
          uri: `https://${mockResponse.redirectURl}`,
          serviceToken: 'auth_token',
        }),
      );
    });

    it('should return response data on success - https url send', async () => {
      const mockResponse: MdLiveAppointmentResponse = {
        redirectURl: 'https://test',
        cw_auth_token: 'auth_token',
      };

      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue(
        userDetails,
      );

      mockTelehealthGateway.createMdLiveAppointment.mockResolvedValue(
        mockResponse,
      );

      const response = await service.createMdliveAppointmentService(
        memberPayload,
        mockClinicalQuestions,
      );

      expect(response).toEqual(
        responseUtil.createSuccess({
          uri: mockResponse.redirectURl,
          serviceToken: mockResponse.cw_auth_token,
        }),
      );
    });

    it('should return error if appointment is not created', async () => {
      const mockResponse: MdLiveAppointmentResponse = {
        redirectURl: 'url',
        cw_auth_token: '',
      };

      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue(
        userDetails,
      );

      mockTelehealthGateway.createMdLiveAppointment.mockResolvedValue(
        mockResponse,
      );

      const response = await service.createMdliveAppointmentService(
        memberPayload,
        mockClinicalQuestions,
      );

      expect(response).toEqual(
        responseUtil.createException(Messages.appointmentError),
      );
    });

    it('should return error response on error', async () => {
      mockEapMemberProfileGateway.getUserProfileDetails.mockRejectedValue(
        'mockError',
      );

      const response = await service.createMdliveAppointmentService(
        memberPayload,
        mockClinicalQuestions,
      );

      expect(response).toEqual(responseUtil.createException('mockError'));
    });
  });
});
