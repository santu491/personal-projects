import {Messages} from '../../../constants';
import {NotificationActionReq} from '../../../models/Notification';
import {User} from '../../../models/Users';
import {MemberOAuthPayload} from '../../../types/customRequest';
import {ServiceResponse} from '../../../types/eapMemberProfileModel';
import {
  mockDynamoDBGateway,
  mockEapMemberProfileGateway,
  mockResult,
} from '../../../utils/baseTest';
import {mockTokenPayload} from '../../../utils/mockData';
import {NotificationService} from '../notificationService';

jest.mock('../../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));
jest.mock('../../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../../gateway/eapMemberProfileGateway', () => ({
  EAPMemberProfileGateway: jest.fn(() => mockEapMemberProfileGateway),
}));
const service = new NotificationService();

describe('NotificationService', () => {
  const userInfo: MemberOAuthPayload = {
    iamguid: '123',
    clientName: 'testClient',
    clientId: 'company demo',
    installationId: 'installationId',
    sessionId: 'sessionId',
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('notificationActions', () => {
    it('should return error when user is not found', async () => {
      const notificationReq: NotificationActionReq = {
        notificationId: '',
        isRemove: false,
      };

      const error = {
        data: {errors: 'User not found', isException: false, isSuccess: false},
      } as ServiceResponse;

      mockDynamoDBGateway.getRecords.mockResolvedValue(error);

      mockResult.createException.mockReturnValue(error);

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );
      expect(result).toBe(error);
    });

    it('should return error when user has no notifications', async () => {
      const notificationReq: NotificationActionReq = {
        notificationId: '',
        isRemove: false,
      };
      const error = {
        data: {
          isSuccess: false,
          isException: false,
          errors: Messages.noNotificationNotFound,
        },
      } as ServiceResponse;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: {notifications: []}},
      } as ServiceResponse);

      mockResult.createException.mockReturnValue(error);

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );
      expect(result).toBe(error);
    });

    it('should handle successful notification action', async () => {
      const notificationReq: NotificationActionReq = {
        notificationId: '',
        isRemove: false,
        isClearAll: true,
      };
      const user: User = {notifications: ['notification1']} as unknown as User;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: user},
      } as ServiceResponse);
      mockDynamoDBGateway.updateRecord.mockResolvedValue({
        data: {isSuccess: true},
      } as ServiceResponse);

      mockResult.createSuccess.mockReturnValue({
        data: {
          isSuccess: true,
          isException: false,
          value: Messages.notificationActionSuccess,
          statusCode: 200,
        },
      });

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );

      expect(result).toEqual({
        data: {
          isException: false,
          isSuccess: true,
          statusCode: 200,
          value: 'Notification action performed successfully',
        },
      });
    });

    it('should handle successful notification action', async () => {
      const notificationReq: NotificationActionReq = {
        notificationId: 'notification1',
        isRemove: true,
      };
      const user: User = {
        notifications: [
          {
            notificationId: 'notification1',
            delivered: true,
            primaryTopic: 'Music and Sound Therapy',
            createdTS: '2024-08-08T19:22:48.377Z',
          },
        ],
      } as unknown as User;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: user},
      } as ServiceResponse);
      mockDynamoDBGateway.updateRecord.mockResolvedValue({
        data: {isSuccess: true},
      } as ServiceResponse);

      mockResult.createSuccess.mockReturnValue({
        data: {
          isSuccess: true,
          isException: false,
          value: Messages.notificationActionSuccess,
          statusCode: 200,
        },
      });

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );

      expect(result).toEqual({
        data: {
          isException: false,
          isSuccess: true,
          statusCode: 200,
          value: 'Notification action performed successfully',
        },
      });
    });

    it('should return error when user has no notifications', async () => {
      const error = {
        data: {
          isSuccess: false,
          isException: false,
          errors: Messages.notificationNotFound,
        },
      } as ServiceResponse;

      const notificationReq: NotificationActionReq = {
        notificationId: 'notification1',
        isRemove: true,
      };
      const user: User = {
        notifications: [
          {
            notificationId: 'test1',
            delivered: true,
            primaryTopic: 'Music and Sound Therapy',
            createdTS: '2024-08-08T19:22:48.377Z',
          },
        ],
      } as unknown as User;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: user},
      } as ServiceResponse);

      mockResult.createException.mockReturnValue(error);

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );
      expect(result).toBe(error);
    });

    it('should handle successful notification action', async () => {
      const notificationReq: NotificationActionReq = {
        notificationId: 'notification1',
        isRemove: false,
      };
      const user: User = {
        notifications: [
          {
            notificationId: 'notification1',
            delivered: true,
            primaryTopic: 'Music and Sound Therapy',
            createdTS: '2024-08-08T19:22:48.377Z',
          },
        ],
      } as unknown as User;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: user},
      } as ServiceResponse);
      mockDynamoDBGateway.updateRecord.mockResolvedValue({
        data: {isSuccess: true},
      } as ServiceResponse);

      mockResult.createSuccess.mockReturnValue({
        data: {
          isSuccess: true,
          isException: false,
          value: Messages.notificationActionSuccess,
          statusCode: 200,
        },
      });

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );

      expect(result).toEqual({
        data: {
          isException: false,
          isSuccess: true,
          statusCode: 200,
          value: 'Notification action performed successfully',
        },
      });
    });

    it('should return error when user has no notifications', async () => {
      const error = {
        data: {
          isSuccess: false,
          isException: false,
          errors: Messages.badRequest,
        },
      } as ServiceResponse;

      const notificationReq: NotificationActionReq = {
        notificationId: '',
        isRemove: false,
      };
      const user: User = {
        notifications: [
          {
            notificationId: 'test1',
            delivered: true,
            primaryTopic: 'Music and Sound Therapy',
            createdTS: '2024-08-08T19:22:48.377Z',
          },
        ],
      } as unknown as User;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: user},
      } as ServiceResponse);

      mockResult.createException.mockReturnValue(error);

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );
      expect(result).toBe(error);
    });

    it('should handle successful notification action', async () => {
      const notificationReq: NotificationActionReq = {
        notificationId: 'notification1',
        isRemove: true,
      };
      const user: User = {
        notifications: [
          {
            notificationId: 'notification1',
            delivered: true,
            primaryTopic: 'Music and Sound Therapy',
            createdTS: '2024-08-08T19:22:48.377Z',
          },
        ],
      } as unknown as User;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: user},
      } as ServiceResponse);
      mockDynamoDBGateway.updateRecord.mockResolvedValue({
        data: {isSuccess: false},
      } as ServiceResponse);

      mockResult.createException.mockReturnValue({
        data: {
          isSuccess: false,
          isException: false,
          value: Messages.somethingWentWrong,
        },
      });

      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );

      expect(result).toEqual({
        data: {
          isSuccess: false,
          isException: false,
          value: Messages.somethingWentWrong,
        },
      });
    });

    it('should handle error during database query', async () => {
      const notificationReq: NotificationActionReq = {
        notificationId: '',
        isRemove: false,
        isClearAll: true,
      };
      mockDynamoDBGateway.getRecords.mockRejectedValue(
        new Error('Database error'),
      );

      mockResult.createException.mockReturnValue('Database error');
      const result = await service.notificationActions(
        userInfo,
        notificationReq,
      );

      expect(result).toBe('Database error');
    });
  });

  describe('getAllNotifications', () => {
    it('should return error when user is not found', async () => {
      const error = {
        data: {
          message: Messages.userNotFound,
          isException: false,
          isSuccess: false,
        },
      } as ServiceResponse;
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(null);

      mockResult.createException.mockReturnValue(error);

      const result = await service.getAllNotifications(mockTokenPayload, 5, 0);
      expect(result).toBe(error);
    });

    it('should return notifications', async () => {
      const user: User = {
        notifications: [
          {
            notificationId: 'notification1',
            delivered: true,
            primaryTopic: 'Music and Sound Therapy',
            createdTS: '2024-08-08T19:22:48.377Z',
          },
          {
            notificationId: 'notification2',
            delivered: true,
            primaryTopic: 'Music and Sound Therapy',
            createdTS: '2024-09-08T19:22:48.377Z',
            viewwdTS: '2024-09-08T19:52:48.377Z',
          },
        ],
      } as unknown as User;
      const notifications = [
        {
          notificationId: 'notification1',
          delivered: true,
          primaryTopic: 'Music and Sound Therapy',
          createdTS: '2024-08-08T19:22:48.377Z',
        },
        {
          notificationId: 'notification2',
          delivered: true,
          primaryTopic: 'Music and Sound Therapy',
          createdTS: '2024-09-08T19:22:48.377Z',
        },
        ,
        {
          notificationId: 'notification3',
          delivered: true,
          primaryTopic: 'Music and Sound Therapy',
          createdTS: '2024-09-09T19:22:48.377Z',
        },
      ];
      const response = {
        data: {
          isSuccess: true,
          isException: false,
          value: user.notifications,
          statusCode: 200,
        },
      };

      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue(user);
      mockDynamoDBGateway.getMultipleRecords.mockReturnValue({
        data: {
          isSuccess: true,
          value: {Notifications: notifications},
        },
      });
      mockResult.createSuccess.mockReturnValue(response);

      const result = await service.getAllNotifications(mockTokenPayload, 5, 0);

      expect(result).toBe(response);
    });

    it('should return error when user has no notifications', async () => {
      const response = {
        data: {
          isSuccess: false,
          isException: false,
          value: {
            notifications: [],
            count: 0,
          },
        },
      } as ServiceResponse;

      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: true, value: {notifications: []}},
      } as ServiceResponse);

      mockResult.createSuccess.mockReturnValue(response);

      const result = await service.getAllNotifications(mockTokenPayload, 5, 0);
      expect(result).toBe(response);
    });

    it('should return error when user has no notifications', async () => {
      const error = {
        data: {
          isSuccess: false,
          isException: false,
          value: {
            notifications: [],
            count: 0,
          },
        },
      } as ServiceResponse;

      const user: User = {
        notifications: [],
      } as unknown as User;
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue(user);
      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {isSuccess: false, value: null},
      });
      mockResult.createSuccess.mockReturnValue(error);
      const result = await service.getAllNotifications(mockTokenPayload, 5, 0);
      expect(result).toBe(error);
    });
  });
});
