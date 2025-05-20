import {Messages} from '../../../constants';
import {AppointmentGateway} from '../../../gateway/appointmentGateway';
import {UpdateAppointmentRequest} from '../../../models/Appointment';
import {
  mockAppointmentGateway,
  mockAuditHelper,
  mockEapMemberProfileService,
  mockResult,
} from '../../../utils/baseTest';
import {getAccessToken} from '../../../utils/common';
import {
  mockAppointmentRequest,
  mockUserProfileData,
} from '../../../utils/mockData';
import {AuditHelper} from '../../helpers/auditHelper';
import {AppointmentService} from '../appointmentService';
import {EAPMemberProfileService} from '../eapMemberProfileService';

jest.mock('../eapMemberProfileService', () => ({
  EAPMemberProfileService: jest.fn(() => mockEapMemberProfileService),
}));
jest.mock('../../../gateway/appointmentGateway', () => ({
  AppointmentGateway: jest.fn(() => mockAppointmentGateway),
}));
jest.mock('../../helpers/auditHelper', () => ({
  AuditHelper: jest.fn(() => mockAuditHelper),
}));
jest.mock('../../../utils/common');

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    service = new AppointmentService();
    service.result = mockResult;
    service.appointmentGateway = new AppointmentGateway();
    service.memberService = new EAPMemberProfileService();
    service.auditHelper = new AuditHelper();
    (getAccessToken as jest.Mock).mockReturnValue('accessToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create an appointment for a user', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'createAppointment')
        .mockResolvedValue({
          status: 200,
          data: {data: 'data'},
        });
      jest
        .spyOn(mockEapMemberProfileService, 'getUserDetailsService')
        .mockResolvedValue({
          data: {data: mockUserProfileData},
          statusCode: 200,
        });
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );
      expect(mockResult.createSuccess).toHaveBeenCalledWith(
        {
          status: 200,
          data: {data: 'data'},
        },
        201,
      );
    });

    it('should return exception if appointment creation failed', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'createAppointment')
        .mockResolvedValue({
          status: 400,
          message: 'Error',
        });
      jest
        .spyOn(mockEapMemberProfileService, 'getUserDetailsService')
        .mockResolvedValue({data: mockUserProfileData, statusCode: 200});
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );
      expect(mockResult.createException).toHaveBeenCalledWith('Error', 400);
    });

    it('should return exception when status code is not 200', async () => {
      jest
        .spyOn(mockEapMemberProfileService, 'getUserDetailsService')
        .mockResolvedValue({data: mockUserProfileData, status: 201});
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );
      expect(mockResult.createException).toHaveBeenCalledWith(
        Messages.userNotFound,
        400,
      );
    });

    it('should return exception when status code is not 200', async () => {
      jest
        .spyOn(mockEapMemberProfileService, 'getUserDetailsService')
        .mockResolvedValue(null);
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );
      expect(mockResult.createException).toHaveBeenCalledWith(
        Messages.userNotFound,
        400,
      );
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'createAppointment')
        .mockResolvedValue({
          status: 400,
          message: 'error',
        });
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'createAppointment')
        .mockRejectedValue({
          status: 400,
          message: 'error',
        });
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return user not found error', async () => {
      jest
        .spyOn(mockEapMemberProfileService, 'getUserDetailsService')
        .mockResolvedValue({data: null});
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockEapMemberProfileService, 'getUserDetailsService')
        .mockRejectedValue(null);
      await service.createAppointment(
        mockAppointmentRequest,
        {
          installationId: 'id',
          sessionId: 'id',
          clientId: '',
        },
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('getAssessmentRequired', () => {
    it('should get assessment required', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'getAssessmentRequired')
        .mockResolvedValue({data: 'data'});
      await service.getAssessmentRequired('guid');

      expect(mockResult.createSuccess).toHaveBeenCalled();
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'getAssessmentRequired')
        .mockResolvedValue(null);
      await service.getAssessmentRequired('guid');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'getAssessmentRequired')
        .mockRejectedValue(new Error('error'));
      await service.getAssessmentRequired('guid');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'getAssessmentRequired')
        .mockRejectedValue(null);
      await service.getAssessmentRequired('guid');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'getAssessmentRequired')
        .mockRejectedValue({
          response: '',
        });
      await service.getAssessmentRequired('guid');

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('getAppointmentStatus', () => {
    it('should get appointment status', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockResolvedValue({data: 'data'});
      await service.getAppointmentStatus('username', 'token');

      expect(mockResult.createSuccess).toHaveBeenCalled();
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockResolvedValue(null);
      await service.getAppointmentStatus('username', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockRejectedValue(new Error('error'));
      await service.getAppointmentStatus('username', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockRejectedValue(null);
      await service.getAppointmentStatus('username', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockRejectedValue({
          response: '',
        });
      await service.getAppointmentStatus('username', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('fetchAppointment', () => {
    it('should fetch an appointment', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointment')
        .mockResolvedValue({data: 'data'});
      await service.fetchAppointment('username', 'token', 'id');

      expect(mockResult.createSuccess).toHaveBeenCalled();
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointment')
        .mockResolvedValue(null);
      await service.fetchAppointment('username', 'token', 'id');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointment')
        .mockRejectedValue(new Error('error'));
      await service.fetchAppointment('username', 'token', 'id');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointment')
        .mockRejectedValue(null);
      await service.fetchAppointment('username', 'token', 'id');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest.spyOn(mockAppointmentGateway, 'fetchAppointment').mockRejectedValue({
        response: '',
      });
      await service.fetchAppointment('username', 'token', 'id');

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('getAppointmentDetails', () => {
    it('should get appointment details', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockResolvedValue({id: 'data'});
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointment')
        .mockResolvedValue({data: 'data'});
      await service.getAppointmentDetails('username', 'token');

      expect(mockResult.createSuccess).toHaveBeenCalled();
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointment')
        .mockReturnValue(null);
      await service.getAppointmentDetails('username', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointment')
        .mockImplementation(() => {
          throw new Error('error');
        });
      await service.getAppointmentDetails('username', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('updateAppointment', () => {
    const updateRequest: UpdateAppointmentRequest = {
      id: 'test_id',
      status: 'CANCEL',
      _id: 'test_id',
    };
    it('should update an appointment', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'updateAppointment')
        .mockResolvedValue({status: 200, data: {data: 'data'}});
      await service.updateAppointment('username', 'token', updateRequest);

      expect(mockResult.createSuccess).toHaveBeenCalled();
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'updateAppointment')
        .mockResolvedValue({
          status: 400,
          message: 'error',
        });
      await service.updateAppointment('username', 'token', updateRequest);
      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'updateAppointment')
        .mockRejectedValue(new Error('error'));
      await service.updateAppointment('username', 'token', updateRequest);

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'updateAppointment')
        .mockRejectedValue(null);
      await service.updateAppointment('username', 'token', updateRequest);

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'updateAppointment')
        .mockRejectedValue({
          response: '',
        });
      await service.updateAppointment('username', 'token', updateRequest);

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('getQuestions', () => {
    it('should get questions', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchQuestions')
        .mockResolvedValue({data: 'data'});
      await service.getQuestions('employerType');

      expect(mockResult.createSuccess).toHaveBeenCalled();
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchQuestions')
        .mockResolvedValue(null);
      await service.getQuestions('employerType');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchQuestions')
        .mockRejectedValue(new Error('error'));
      await service.getQuestions('employerType');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchQuestions')
        .mockRejectedValue(null);
      await service.getQuestions('employerType');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest.spyOn(mockAppointmentGateway, 'fetchQuestions').mockRejectedValue({
        response: '',
      });
      await service.getQuestions('employerType');

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('getMemberStatus', () => {
    it('should get member status successfully', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberStatus')
        .mockResolvedValue({success: true, data: 'data'});

      await service.getMemberStatus('username', 'iamguid', 'token');

      expect(mockResult.createSuccess).toHaveBeenCalledWith({
        success: true,
        data: 'data',
      });
    });

    it('should return an error when member status is null', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberStatus')
        .mockResolvedValue(null);
      await service.getMemberStatus('username', 'iamguid', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberStatus')
        .mockRejectedValue(new Error('error'));

      await service.getMemberStatus('username', 'iamguid', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should check appointment status when member status success is false', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberStatus')
        .mockResolvedValue({success: false});

      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockResolvedValue({isApproved: true, _id: 'appointmentId'});

      jest.spyOn(mockAppointmentGateway, 'fetchAppointment').mockResolvedValue({
        data: {appointmentScheduledDateAndTime: {date: '2023-10-10'}},
      });

      await service.getMemberStatus('username', 'iamguid', 'token');

      expect(mockResult.createSuccess).toHaveBeenCalledWith({
        success: false,
        appointmentStatus: {isApproved: true, _id: 'appointmentId'},
        // appointmentScheduledDateAndTime: '2023-10-10',
      });
    });

    it('should handle fetchAppointmentStatus returning null', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberStatus')
        .mockResolvedValue({success: false});

      jest
        .spyOn(mockAppointmentGateway, 'fetchAppointmentStatus')
        .mockResolvedValue(null);

      await service.getMemberStatus('username', 'iamguid', 'token');

      expect(mockResult.createSuccess).toHaveBeenCalledWith({
        success: false,
      });
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberStatus')
        .mockRejectedValue(null);

      await service.getMemberStatus('username', 'iamguid', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberStatus')
        .mockRejectedValue({
          response: '',
        });

      await service.getMemberStatus('username', 'iamguid', 'token');

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });

  describe('getMemberDashboardData', () => {
    it('should get member dashboard data', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberDashboardData')
        .mockResolvedValue({data: 'data'});

      await service.getMemberDashboardData(
        'username',
        'iamguid',
        'status',
        'token',
      );

      expect(mockResult.createSuccess).toHaveBeenCalled();
    });

    it('should return an error', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberDashboardData')
        .mockResolvedValue(null);
      await service.getMemberDashboardData(
        'username',
        'iamguid',
        'status',
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should throw a generic error on exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberDashboardData')
        .mockRejectedValue(new Error('error'));
      await service.getMemberDashboardData(
        'username',
        'iamguid',
        'status',
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberDashboardData')
        .mockRejectedValue(null);
      await service.getMemberDashboardData(
        'username',
        'iamguid',
        'status',
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });

    it('should return an exception', async () => {
      jest
        .spyOn(mockAppointmentGateway, 'fetchMemberDashboardData')
        .mockRejectedValue({
          response: '',
        });
      await service.getMemberDashboardData(
        'username',
        'iamguid',
        'status',
        'token',
      );

      expect(mockResult.createException).toHaveBeenCalled();
    });
  });
});
