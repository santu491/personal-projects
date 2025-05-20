import {Messages} from '../../constants';
import {UpdateAppointmentRequest} from '../../models/Appointment';
import {MemberOAuthPayload} from '../../types/customRequest';
import {mockAppointmentService} from '../../utils/baseTest';
import {mockAppointmentRequest} from '../../utils/mockData';
import {ResponseUtil} from '../../utils/responseUtil';
import {AppointmentController} from '../appointmentController';

jest.mock('../../services/eap/appointmentService', () => ({
  AppointmentService: jest.fn(() => mockAppointmentService),
}));

describe('Appointment Controller', () => {
  let controller: AppointmentController;
  const result = new ResponseUtil();

  const mockException = result.createException({message: 'Error'});

  const invalidAuthData = result.createException(Messages.invalidAuthError);

  const payload: MemberOAuthPayload = {
    clientId: '',
    userName: 'testUser',
    iamguid: 'iamguid',
    clientName: 'clientName',
    installationId: 'installationId',
    sessionId: 'sessionId',
  };

  beforeEach(() => {
    controller = new AppointmentController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should return error when username is missing', async () => {
      const response = await controller.createAppointment(
        mockAppointmentRequest,
        {
          clientId: '',
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
        'token',
      );
      expect(response).toEqual(invalidAuthData);
    });

    it('should create an appointment for a user', async () => {
      mockAppointmentService.createAppointment.mockResolvedValue({
        data: {isSuccess: true},
      });
      await controller.createAppointment(
        mockAppointmentRequest,
        payload,
        'token',
      );
      expect(mockAppointmentService.createAppointment).toHaveBeenCalledWith(
        mockAppointmentRequest,
        payload,
        'token',
      );
    });

    it('should return an error on exception', async () => {
      (mockAppointmentService.createAppointment as jest.Mock).mockRejectedValue(
        {message: 'Error'},
      );
      const response = await controller.createAppointment(
        mockAppointmentRequest,
        payload,
        'token',
      );
      expect(response).toStrictEqual(mockException);
    });
  });

  describe('getAssessmentRequired', () => {
    it('should get the assessment required for a user', async () => {
      const expected = {
        data: {isSuccess: true},
      };
      await controller.getAssessmentRequired(payload);
      mockAppointmentService.getAssessmentRequired.mockReturnValue(expected);
      expect(mockAppointmentService.getAssessmentRequired).toHaveBeenCalledWith(
        payload.iamguid,
      );
    });

    it('should throw an error if invalid auth token is sent', async () => {
      const response = await controller.getAssessmentRequired({
        clientId: '',
        installationId: 'installationId',
        sessionId: 'sessionId',
      });
      expect(response).toEqual(
        result.createException(Messages.invalidAuthError, 400),
      );
    });

    it('should return an error on exception', async () => {
      (
        mockAppointmentService.getAssessmentRequired as jest.Mock
      ).mockRejectedValue({message: 'Error'});

      const response = await controller.getAssessmentRequired(payload);

      expect(response).toStrictEqual({message: 'Error'});
    });
  });

  describe('getAppointmentStatus', () => {
    it('should return the appointment status for a user', async () => {
      await controller.getAppointmentStatus(payload, 'token');
      mockAppointmentService.getAppointmentStatus.mockResolvedValue({
        data: {isSuccess: true},
      });
      expect(mockAppointmentService.getAppointmentStatus).toHaveBeenCalledWith(
        payload.userName,
        'token',
      );
    });

    it('should throw an error if username is invalid', async () => {
      (
        mockAppointmentService.getAppointmentStatus as jest.Mock
      ).mockRejectedValue({message: Messages.invalidAuthError});

      const response = await controller.getAppointmentStatus(
        {
          clientId: '',
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
        'token',
      );

      expect(response).toEqual(invalidAuthData);
    });

    it('should return an error on exception', async () => {
      (
        mockAppointmentService.getAppointmentStatus as jest.Mock
      ).mockRejectedValue({message: 'Error'});

      const response = await controller.getAppointmentStatus(payload, 'token');

      expect(response).toStrictEqual(mockException);
    });
  });

  describe('getQuestions', () => {
    const mockResponse = {
      data: {isSuccess: true},
    };

    it('should return the questions for a user', async () => {
      mockAppointmentService.getQuestions.mockResolvedValue(mockResponse);
      const response = await controller.getQuestions('employerType');
      expect(response).toBe(mockResponse);
    });

    it('should return an invalid request error', async () => {
      const response = await controller.getQuestions('   ');
      expect(JSON.stringify(response).includes(Messages.invalidRequest)).toBe(
        true,
      );
    });

    it('should return an error on exception', async () => {
      (mockAppointmentService.getQuestions as jest.Mock).mockRejectedValue({
        message: 'Error',
      });
      const response = await controller.getQuestions('employerType');
      expect(response).toStrictEqual(mockException);
    });
  });

  describe('fetchAppointment', () => {
    it('should return error if userName is not present', async () => {
      const response = await controller.fetchAppointment(
        {
          clientId: '',
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
        'token',
        '669650d75bebe1bfc5378651',
      );

      expect(response).toEqual(invalidAuthData);
    });

    it('should return successfully', async () => {
      const expected = {
        data: {isSuccess: true},
      };
      mockAppointmentService.fetchAppointment.mockReturnValue(expected);
      const response = await controller.fetchAppointment(
        payload,
        'token',
        '669650d75bebe1bfc5378651',
      );
      expect(response).toBe(expected);
    });

    it('should return an error', async () => {
      const expected = result.createException(Messages.invalidRequest);
      const response = await controller.fetchAppointment(
        payload,
        'token',
        '  ',
      );
      expect(response).toEqual(expected);
    });

    it('should return an error on exception', async () => {
      (mockAppointmentService.fetchAppointment as jest.Mock).mockRejectedValue({
        message: 'Error',
      });
      const response = await controller.fetchAppointment(
        payload,
        'token',
        '669650d75bebe1bfc5378651',
      );
      expect(response).toStrictEqual(mockException);
    });
  });

  describe('updateAppointment', () => {
    const updateReq: UpdateAppointmentRequest = {
      id: '669650d75bebe1bfc5378651',
      status: 'status',
      _id: '669650d75bebe1bfc5378651',
    };

    it('should return error if userName is not present', async () => {
      const response = await controller.updateAppointment(
        updateReq,
        {
          clientId: '',
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
        'token',
      );

      expect(response).toEqual(invalidAuthData);
    });

    it('should return successfully', async () => {
      const expected = {
        data: {isSuccess: true},
      };
      mockAppointmentService.updateAppointment.mockReturnValue(expected);
      const response = await controller.updateAppointment(
        updateReq,
        payload,
        'token',
      );
      expect(response).toBe(expected);
    });

    it('should return an excpetion', async () => {
      (mockAppointmentService.updateAppointment as jest.Mock).mockRejectedValue(
        {message: 'Error'},
      );
      const response = await controller.updateAppointment(
        updateReq,
        payload,
        'token',
      );
      expect(response).toStrictEqual(mockException);
    });

    it('should return error for non hex id', async () => {
      const expected = result.createException(Messages.invalidRequest);
      const response = await controller.updateAppointment(
        {...updateReq, id: 'hfue'},
        payload,
        'token',
      );
      expect(response).toEqual(expected);
    });
  });

  describe('getMemberStatus', () => {
    it('should return the member status for a user', async () => {
      mockAppointmentService.getMemberStatus.mockResolvedValue({
        data: {isSuccess: true},
      });

      const response = await controller.getMemberStatus('token', payload);

      expect(response).toEqual({data: {isSuccess: true}});
    });

    it('should return invalid Auth error if userName is misssing in auth token', async () => {
      const response = await controller.getMemberStatus('token', {
        userName: '',
        clientId: '',
        installationId: 'installationId',
        sessionId: 'sessionId',
      });

      expect(response).toEqual(
        result.createException(Messages.invalidAuthError, 400),
      );
    });

    it('should handle exception', async () => {
      (mockAppointmentService.getMemberStatus as jest.Mock).mockRejectedValue({
        message: 'Error',
      });

      const response = await controller.getMemberStatus('token', payload);

      expect(response).toEqual({message: 'Error'});
    });
  });

  describe('getMemberDashboardData', () => {
    it('should return the member dashboard info for a user', async () => {
      mockAppointmentService.getMemberDashboardData.mockResolvedValue({
        data: {isSuccess: true},
      });

      const response = await controller.getMemberDashboardData(
        'status',
        'token',
        payload,
      );

      expect(response).toEqual({data: {isSuccess: true}});
    });

    it('should return invalid Auth error if userName is misssing in auth token', async () => {
      const response = await controller.getMemberDashboardData(
        'status',
        'token',
        {
          userName: '',
          clientId: '',
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
      );

      expect(response).toEqual(
        result.createException(Messages.invalidAuthError, 400),
      );
    });

    it('should handle exception', async () => {
      (
        mockAppointmentService.getMemberDashboardData as jest.Mock
      ).mockRejectedValue({message: 'Error'});

      const response = await controller.getMemberDashboardData(
        'status',
        'token',
        payload,
      );

      expect(response).toEqual({message: 'Error'});
    });
  });

  describe('getAppointmentDetails', () => {
    it('should return the appointment details for a user', async () => {
      mockAppointmentService.getAppointmentDetails.mockResolvedValue({
        data: {isSuccess: true},
      });

      const response = await controller.getAppointmentDetails(payload, 'token');

      expect(response).toEqual({data: {isSuccess: true}});
    });

    it('should return invalid Auth error if userName is misssing in auth token', async () => {
      const response = await controller.getAppointmentDetails(
        {
          userName: '',
          clientId: '',
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
        'token',
      );

      expect(response).toEqual(invalidAuthData);
    });

    it('should handle exception', async () => {
      (
        mockAppointmentService.getAppointmentDetails as jest.Mock
      ).mockRejectedValue({message: 'Error'});

      const response = await controller.getAppointmentDetails(payload, 'token');

      expect(response).toEqual(mockException);
    });
  });
});
