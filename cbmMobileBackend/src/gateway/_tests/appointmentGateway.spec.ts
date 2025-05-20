import {APIResponseCodes, Messages} from '../../constants';
import {UpdateAppointmentRequest} from '../../models/Appointment';
import {APP} from '../../utils/app';
import {createGatewayResponse} from '../../utils/common';
import {axiosGet, axiosPost, axiosPut} from '../../utils/httpUtil';
import {
  eapMemberAuthConfigData,
  mockAppointmentRequest,
} from '../../utils/mockData';
import {AppointmentGateway} from '../appointmentGateway';

jest.mock('../../utils/httpUtil');
jest.mock('../../utils/common');

describe('AppointmentGateway', () => {
  let gateway: AppointmentGateway;

  beforeEach(() => {
    APP.config.memberAuth = eapMemberAuthConfigData;
    gateway = new AppointmentGateway();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('createAppointment', () => {
    it('should return response data on success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue(mockResponse);
      await gateway.createAppointment(
        mockAppointmentRequest,
        'username',
        'secure_token=token',
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(
        200,
        mockResponse.data,
      );
    });

    it('should return error on failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({status: 400});
      await gateway.createAppointment(
        mockAppointmentRequest,
        'username',
        'secure_token=token',
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(
        400,
        Messages.appointmentError,
      );
    });

    it('should return error on exception', async () => {
      (axiosPost as jest.Mock).mockRejectedValue(mockErrorResponse);
      await gateway.createAppointment(
        mockAppointmentRequest,
        'username',
        'secure_token=token',
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(400, 'error');
    });

    it('should return response error on post call failure', async () => {
      (axiosPost as jest.Mock).mockRejectedValue(mockErrorResponse);
      await gateway.createAppointment(
        mockAppointmentRequest,
        'username',
        'secure_token=token',
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(
        400,
        mockErrorResponse.response.data.message,
      );
    });

    it('should return response error on api failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue(mockErrorResponse);
      await gateway.createAppointment(
        mockAppointmentRequest,
        'username',
        'secure_token=token',
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(
        400,
        Messages.appointmentError,
      );
    });
  });

  describe('getAssessmentRequired', () => {
    it('should return response data on success', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockResponse);
      const response = await gateway.getAssessmentRequired(
        'iamguid',
        'acessToken',
      );
      expect(response).toEqual(mockResponse.data);
    });

    it('should return null on failure', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway.getAssessmentRequired(
        'iamguid',
        'acessToken',
      );
      expect(response).toBeNull();
    });

    it('should throw error on exception', async () => {
      (axiosGet as jest.Mock).mockRejectedValue(mockErrorResponse);
      await gateway
        .getAssessmentRequired('iamguid', 'acessToken')
        .catch(error => {
          expect(error).toEqual(mockErrorResponse);
        });
    });
  });

  describe('fetchAppointmentStatus', () => {
    it('should return response data on success', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockResponse);
      const response = await gateway.fetchAppointmentStatus(
        'username',
        'accessToken',
        'cookieToken',
      );
      expect(response).toEqual(mockResponse.data);
    });

    it('should throw error on failed response', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway.fetchAppointmentStatus(
        'username',
        'accessToken',
        'cookieToken',
      );
      expect(response).toBeNull();
    });

    it('should return error on exception', async () => {
      (axiosGet as jest.Mock).mockRejectedValue(mockErrorResponse);
      gateway
        .fetchAppointmentStatus('username', 'accessToken', 'cookieToken')
        .catch(error => {
          expect(error).toEqual(mockErrorResponse);
        });
    });
  });

  describe('fetchAppointment', () => {
    it('should return response data on success', async () => {
      const mockData = {
        status: 200,
        data: {
          data: {
            id: 'id',
          },
        },
      };
      (axiosGet as jest.Mock).mockResolvedValue(mockData);
      const response = await gateway.fetchAppointment(
        'username',
        'accessToken',
        'cookieToken',
        'id',
      );
      expect(response).toEqual(mockData.data.data);
    });

    it('should return null on failed response', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway.fetchAppointment(
        'username',
        'accessToken',
        'cookieToken',
        'id',
      );
      expect(response).toBeNull();
    });

    it('should return error on exception', async () => {
      (axiosGet as jest.Mock).mockRejectedValue(mockErrorResponse);
      gateway
        .fetchAppointment('username', 'accessToken', 'cookieToken', 'id')
        .catch(error => {
          expect(error).toEqual(mockErrorResponse);
        });
    });
  });

  describe('updateAppointment', () => {
    const mockUpdateRequest: UpdateAppointmentRequest = {
      id: '669650d75bebe1bfc5378651',
      status: 'MBRCANCEL',
      _id: '669650d75bebe1bfc5378651',
    };

    it('should return response data on success', async () => {
      (axiosPut as jest.Mock).mockResolvedValue(mockResponse);
      await gateway.updateAppointment(
        'username',
        'secure_token=token',
        mockUpdateRequest,
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(
        200,
        mockResponse.data,
      );
    });

    it('should return error on failed response', async () => {
      (axiosPut as jest.Mock).mockResolvedValue(mockErrorResponse);
      await gateway.updateAppointment(
        'username',
        'secure_token=token',
        mockUpdateRequest,
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(
        400,
        Messages.updateAppointmentError,
      );
    });

    it('should return error on exception', async () => {
      (axiosPut as jest.Mock).mockRejectedValue(mockErrorResponse);
      await gateway.updateAppointment(
        'username',
        'secure_token=token',
        mockUpdateRequest,
        'accessToken',
      );
      expect(createGatewayResponse).toHaveBeenCalledWith(400, 'error');
    });
  });

  describe('fetchQuestions', () => {
    it('should return response data on success', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockResponse);
      const response = await gateway.fetchQuestions('username', 'accessToken');
      expect(response).toEqual(mockResponse.data);
    });

    it('should return an empty object on error', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway.fetchQuestions('username', 'accessToken');
      expect(response).toBeNull();
    });

    it('should return an empty object on exception', async () => {
      (axiosGet as jest.Mock).mockRejectedValue(mockErrorResponse);
      gateway.fetchQuestions('username', 'accessToken').catch(error => {
        expect(error).toEqual(mockErrorResponse);
      });
    });
  });

  describe('fetchMemberStatus', () => {
    it('should return response data on success', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockResponse);
      const response = await gateway.fetchMemberStatus(
        'username',
        'iamguid',
        'secureToken',
        'accessToken',
      );
      expect(response).toEqual(mockResponse.data);
    });

    it('should return null on failed response', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway.fetchMemberStatus(
        'username',
        'iamguid',
        'secureToken',
        'accessToken',
      );
      expect(response).toBeNull();
    });

    it('should return error on exception', async () => {
      (axiosGet as jest.Mock).mockRejectedValue(mockErrorResponse);
      gateway
        .fetchMemberStatus('username', 'iamguid', 'secureToken', 'accessToken')
        .catch(e => {
          expect(e).toEqual(mockErrorResponse);
        });
    });
  });

  describe('fetchMemberDashboard', () => {
    it('should return response data on success', async () => {
      const mockDashboard = {
        status: APIResponseCodes.SUCCESS,
        data: {
          data: [{_id: 'data'}],
        },
      };
      const mockExpected = {
        data: [
          {
            id: 'data',
          },
        ],
      };
      (axiosGet as jest.Mock).mockResolvedValue(mockDashboard);
      const response = await gateway.fetchMemberDashboardData(
        'username',
        'iamguid',
        'CANCELED',
        'secureToken',
        'accessToken',
      );
      expect(response).toEqual(mockExpected);
    });

    it('should return null on failed response', async () => {
      (axiosGet as jest.Mock).mockResolvedValue(mockErrorResponse);
      const response = await gateway.fetchMemberDashboardData(
        'username',
        'iamguid',
        'CANCELED',
        'secureToken',
        'accessToken',
      );
      expect(response).toBeNull();
    });

    it('should return null on exception', async () => {
      (axiosGet as jest.Mock).mockRejectedValue(mockErrorResponse);
      await gateway
        .fetchMemberDashboardData(
          'username',
          'iamguid',
          'CANCELED',
          'secureToken',
          'accessToken',
        )
        .catch(e => {
          expect(e).toEqual(mockErrorResponse);
        });
    });
  });
});
