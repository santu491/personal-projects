import {MemberOAuthPayload} from '../../types/customRequest';
import {mockTelehealthService} from '../../utils/baseTest';
import {mockClinicalQuestions} from '../../utils/mockData';
import {TelehealthController} from '../telehealthController';

jest.mock('../../services/eap/telehealthService', () => ({
  TelehealthService: jest.fn(() => mockTelehealthService),
}));

describe('TelehealthController', () => {
  let controller: TelehealthController;
  let payload: MemberOAuthPayload;

  beforeEach(() => {
    controller = new TelehealthController();
    payload = {
      iamguid: 'iamguid',
      userName: 'username',
      clientId: 'clientId',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMdLiveAppointment', () => {
    it('should return response data on success', async () => {
      mockTelehealthService.createMdliveAppointmentService.mockResolvedValue(
        'data',
      );

      const response = await controller.createMdLiveAppointment(
        payload,
        mockClinicalQuestions,
      );

      expect(response).toEqual('data');
    });

    it('should return error on failure', async () => {
      const error = new Error('Test Error');
      mockTelehealthService.createMdliveAppointmentService.mockRejectedValue(
        error,
      );

      const response = await controller.createMdLiveAppointment(
        payload,
        mockClinicalQuestions,
      );

      expect(response).toEqual(error);
    });
  });
});
