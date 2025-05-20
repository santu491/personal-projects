import {Messages} from '../../constants';
import {NotificationActionReq} from '../../models/Notification';
import {MemberOAuthPayload} from '../../types/customRequest';
import {mockNotificationService, mockResult} from '../../utils/baseTest';
import {NotificationController} from '../notificationController';

jest.mock('../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../services/eap/notificationService', () => ({
  NotificationService: jest.fn(() => mockNotificationService),
}));
let controller: NotificationController;

describe('NotificationController', () => {
  beforeEach(() => {
    controller = new NotificationController();
  });

  describe('PUT notification', () => {
    it('Get list of Notifications of the user', async () => {
      const user: MemberOAuthPayload = {
        clientId: '',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      const payload: NotificationActionReq = {
        notificationId: '123',
        isRemove: false,
      };
      mockNotificationService.notificationActions.mockReturnValue(true);
      const response = await controller.notification(user, payload);
      expect(response).toEqual(true);
    });

    it('Get list of Notifications of the user: Error', async () => {
      const user: MemberOAuthPayload = {
        clientId: '',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      const payload: NotificationActionReq = {
        notificationId: '123',
        isRemove: false,
      };
      mockNotificationService.notificationActions.mockImplementation(() => {
        throw new Error();
      });
      const response = await controller.notification(user, payload);
      expect(response).toEqual(mockResult.createException(undefined));
    });
  });

  describe('getNotifications', () => {
    const user: MemberOAuthPayload = {
      clientId: '',
      userName: 'name',
      iamguid: '123',
      clientName: 'Demo',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    it('Get list of Notifications of the user', async () => {
      mockNotificationService.getAllNotifications.mockReturnValue(true);
      const response = await controller.getNotifications(user, 10, 0);
      expect(response).toEqual(true);
    });

    it('should handle invalid size and from value', async () => {
      mockNotificationService.getAllNotifications.mockReturnValue(true);
      const response = await controller.getNotifications(user, 0, -2);
      expect(response).toEqual(true);
    });

    it('should return invalid user error', async () => {
      user.userName = '';
      const response = await controller.getNotifications(user, 10, 0);
      expect(response).toEqual(
        mockResult.createException(Messages.invalidAuthError),
      );
    });
  });
});
