import {Messages} from '../../../constants';
import {MemberOAuthPayload} from '../../../types/customRequest';
import {InstallationRequest} from '../../../types/installationRequest';
import {APP} from '../../../utils/app';
import {
  mockDynamoDBGateway,
  mockEapMemberProfileGateway,
  mockResult,
} from '../../../utils/baseTest';
import {
  eapMemberAuthConfigData,
  mockAllDBUserData,
  mockUserDBData,
} from '../../../utils/mockData';
import {addDeviceToken} from '../../../utils/notifications/sns';
import {InstallationService} from '../installationService';

jest.mock('../../../utils/notifications/sns', () => ({
  addDeviceToken: jest.fn(),
  disableDeviceToken: jest.fn(),
}));

jest.mock('../../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

jest.mock('../../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../../gateway/eapMemberProfileGateway', () => ({
  EAPMemberProfileGateway: jest.fn(() => mockEapMemberProfileGateway),
}));

describe('InstallationService', () => {
  let service: InstallationService;
  const user: MemberOAuthPayload = {
    clientId: 'clientName',
    iamguid: 'iamguid',
    userName: 'userName',
    permissions: ['*'],
    clientName: 'clientName',
    installationId: 'installationId',
    sessionId: 'sessionId',
  };

  let deviceInput: InstallationRequest;
  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.memberAuth = eapMemberAuthConfigData;
    service = new InstallationService();
    deviceInput = {
      appVersion: '1.0',
      locale: 'en',
      platform: 'android',
      deviceToken: 'tokenabc',
      badge: 0,
    };
  });
  describe('saveInstallation', () => {
    it('should return success on saving installation: android', async () => {
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue([
        deviceInput,
      ]);
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(mockUserDBData);
      (mockResult.createSuccess as jest.Mock).mockResolvedValue(deviceInput);
      (mockDynamoDBGateway.getAllRecords as jest.Mock).mockResolvedValue({
        isSuccess: true,
        value: mockAllDBUserData,
      });
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue(
        deviceInput,
      );
      deviceInput.deviceToken = 'tokenac';
      const response = await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(deviceInput);
    });

    it('should return success on saving installation: ios', async () => {
      deviceInput.platform = 'ios';
      deviceInput.timeZoneOffset = -330;
      deviceInput.osVersion = '17.3.1';
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(mockUserDBData);
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue(
        deviceInput,
      );
      (mockResult.createSuccess as jest.Mock).mockResolvedValue(deviceInput);
      (addDeviceToken as jest.Mock).mockResolvedValue('endpointArn');
      deviceInput.deviceToken = 'tokena';
      await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
    });

    it('should return error if user data not found', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue(null);
      mockResult.createException.mockResolvedValue(Messages.notFoundError);
      const response = await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.notFoundError);
    });

    it('should return device already registered', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue(
        mockUserDBData,
      );
      mockResult.createSuccess.mockResolvedValue(
        Messages.deviceAlreadyRegistered,
      );
      deviceInput.deviceToken = 'tokenabc';
      const response = await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.deviceAlreadyRegistered);
    });

    it('should return error if endpoint not found', async () => {
      deviceInput.platform = 'ios';
      deviceInput.timeZoneOffset = -330;
      deviceInput.osVersion = '17.3.1';
      deviceInput.deviceToken = 'xyz';
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue(
        mockUserDBData,
      );
      (mockDynamoDBGateway.getAllRecords as jest.Mock).mockResolvedValue({
        idSuccess: true,
        value: [mockUserDBData],
      });
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue(
        deviceInput,
      );
      mockDynamoDBGateway.updateRecord.mockResolvedValue(deviceInput);
      mockResult.createSuccess.mockResolvedValue(deviceInput);
      (addDeviceToken as jest.Mock).mockResolvedValue(null);
      mockResult.createException.mockResolvedValue(Messages.endpointNotFound);
      const response = await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.endpointNotFound);
    });

    it('should throw error on exception', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockRejectedValue({
        response: {
          status: 500,
        },
      });
      mockResult.createException.mockResolvedValue(Messages.somethingWentWrong);
      const response = await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.somethingWentWrong);
    });

    it('should throw error on exception', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockRejectedValue(null);
      mockResult.createException.mockResolvedValue(Messages.somethingWentWrong);
      const response = await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.somethingWentWrong);
    });

    it('should delete any existing device token', async () => {
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue([
        deviceInput,
      ]);
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(mockUserDBData);
      (mockResult.createSuccess as jest.Mock).mockResolvedValue(deviceInput);
      (mockDynamoDBGateway.getAllRecords as jest.Mock).mockResolvedValue({
        isSuccess: true,
        value: mockAllDBUserData,
      });
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue(
        deviceInput,
      );
      deviceInput.deviceToken = 'tokentest';
      const response = await service.saveInstallation(
        deviceInput,
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(deviceInput);
    });
  });

  describe('deleteInstallation', () => {
    it('should return success on deleting installation', async () => {
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(mockUserDBData);
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue({
        data: {isSuccess: true},
      });
      (mockResult.createSuccess as jest.Mock).mockResolvedValue(
        Messages.deleteSuccess,
      );
      const response = await service.deleteInstallation(
        'token',
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.deleteSuccess);
    });

    it('should return error if user data not found', async () => {
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(null);
      (mockResult.createException as jest.Mock).mockResolvedValue(
        Messages.notFoundError,
      );
      const response = await service.deleteInstallation(
        'token',
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.notFoundError);
    });

    it('should return device token not found', async () => {
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(mockUserDBData);
      (mockResult.createException as jest.Mock).mockResolvedValue(
        Messages.notFoundError,
      );
      const response = await service.deleteInstallation(
        'tokenksie',
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.notFoundError);
    });

    it('should return error on exception', async () => {
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockRejectedValue(null);
      (mockResult.createException as jest.Mock).mockResolvedValue(
        Messages.deleteError,
      );
      const response = await service.deleteInstallation(
        'tokenksie',
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.deleteError);
    });

    it('should return error when updateRecord fails', async () => {
      (
        mockEapMemberProfileGateway.getMemberDbData as jest.Mock
      ).mockResolvedValue(mockUserDBData);
      (mockDynamoDBGateway.updateRecord as jest.Mock).mockResolvedValue({
        data: {isSuccess: false},
      });
      (mockResult.createException as jest.Mock).mockResolvedValue(
        Messages.apiFailure,
      );
      const response = await service.deleteInstallation(
        'tokenabc',
        user.iamguid || '',
        user.clientName || '',
      );
      expect(response).toBe(Messages.apiFailure);
    });
  });
});
