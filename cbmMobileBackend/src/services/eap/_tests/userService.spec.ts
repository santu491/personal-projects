import {Messages} from '../../../constants';
import {MemberOAuthPayload} from '../../../types/customRequest';
import {InstallationTokenModel} from '../../../types/userRequest';
import {mockDynamoDBGateway, mockResult} from '../../../utils/baseTest';
import {UserService} from '../userService';

jest.mock('../../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

jest.mock('../../../utils/notifications/sqs', () => ({
  addToNotificationQueue: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userData = {
    employerType: 'BEACON',
    clientName: 'Company Demo',
    status: 'A',
    audit: {
      createdTS: '2024-08-16T14:10:21.659Z',
      lastLoginTS: '2024-08-20T11:54:45.697Z',
    },
    deviceInfo: [
      {
        badge: 0,
        appVersion: '0.2.0',
        osVersion: '14',
        timeZoneOffset: -330,
        updatedTS: '2024-08-20T11:57:21.654Z',
        locale: 'en_US',
        createdTS: '2024-08-20T11:57:21.654Z',
        platform: 'ios',
        deviceToken: 'DeviceToken',
      },
    ],
    iamguid: 'imaguid',
    preferences: {
      pushNotifications: {
        enabled: false,
      },
    },
  };

  const member: MemberOAuthPayload = {
    iamguid: 'imaguid',
    clientName: 'Company Demo',
    clientId: 'id',
    installationId: 'installationId',
    sessionId: 'sessionId',
  };

  const payload: InstallationTokenModel = {
    count: 0,
    deviceToken: 'DeviceToken',
  };

  describe('badgeReset', () => {
    it('should reset badge count: No User', async () => {
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {isSuccess: false},
      });
      mockResult.createException.mockReturnValue(Messages.userNotFound);

      const response = await service.badgeReset(payload, member);
      expect(response).toBe(Messages.userNotFound);
    });

    it('should reset badge count: Success', async () => {
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {isSuccess: true, value: userData},
      });
      mockDynamoDBGateway.updateRecord.mockReturnValue({
        data: {isSuccess: true},
      });
      mockResult.createSuccess.mockReturnValue(Messages.updateSuccess);

      const response = await service.badgeReset(payload, member);
      expect(response).toBe(Messages.updateSuccess);
    });

    it('should reset badge count: Update Error', async () => {
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {isSuccess: true, value: userData},
      });
      mockDynamoDBGateway.updateRecord.mockReturnValue({
        data: {isSuccess: false},
      });
      mockResult.createException.mockReturnValue(Messages.updateError);

      const response = await service.badgeReset(payload, member);
      expect(response).toBe(Messages.updateError);
    });

    it('should reset badge count: Error', async () => {
      mockDynamoDBGateway.getRecords.mockRejectedValue(new Error('Error'));

      const response = await service.badgeReset(payload, member);
      expect(response).toBeInstanceOf;
    });
  });
});
