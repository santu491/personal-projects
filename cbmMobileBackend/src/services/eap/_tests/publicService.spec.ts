import {Messages} from '../../../constants';
import {ManualPN} from '../../../models/Notification';
import {PublicAuth} from '../../../types/publicRequest';
import {APP} from '../../../utils/app';
import {generateToken} from '../../../utils/auth';
import {mockDynamoDBGateway, mockResult} from '../../../utils/baseTest';
import {addToNotificationQueue} from '../../../utils/notifications/sqs';
import {PublicService} from '../publicService';

jest.mock('../../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

jest.mock('../../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../../utils/notifications/sqs', () => ({
  addToNotificationQueue: jest.fn(),
}));

jest.mock('../../../utils/auth', () => ({
  generateToken: jest.fn(),
}));

describe('PublicService', () => {
  let service: PublicService;

  beforeEach(() => {
    service = new PublicService();
    jest.clearAllMocks();
    APP.config.awsDetails = {
      roleArn: 'arn:aws:iam::xxxxx:role/slvr-sydcom-devrole',
      profile: 'slvr-sydcom',
      roleSessionName: 'session1',
      durationSeconds: 900,
      apiVersion: 'latest',
      region: 'us-east-2',
      iosArn: 'arn:aws:sns:us-east-1:xxxxx:app/APNS/carelon-ios-dev1',
      notificationQueue: '',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('publicAuth', () => {
    it('should generate the token for the user: error', async () => {
      const payload: PublicAuth = {
        clientId: 'test',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      mockResult.createException.mockReturnValue(Messages.invalidClientId);
      const response = await service.publicAuth(payload);
      expect(response).toEqual(Messages.invalidClientId);
    });

    it('should generate the token for the user: success', async () => {
      const payload: PublicAuth = {
        clientId: 'client_CBHM',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      (generateToken as jest.Mock).mockReturnValue('token');
      mockResult.createSuccess.mockReturnValue({
        data: {
          isSuccess: true,
          isException: false,
          value: {
            message: Messages.clientAuthSuccess,
            createdAt: '2024-08-22T14:24:08.213Z',
            expiresAt: '2024-08-22T14:39:08.213Z',
            expiresIn: 15,
          },
        },
      });

      const response = await service.publicAuth(payload);
      expect(response.data).not.toBeNull();
    });

    it('should generate the token for the user: exception', async () => {
      mockResult.createException.mockReturnValue(Messages.somethingWentWrong);

      const payload: PublicAuth = {
        clientId: 'client_CBHM',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      (generateToken as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });
      const response = await service.publicAuth(payload);
      expect(response).toEqual('Something went wrong. Please try again later');
    });
  });

  describe('notify', () => {
    it('should notify the user', async () => {
      (addToNotificationQueue as jest.Mock).mockReturnValue('token');

      const payload: ManualPN = {
        test: false,
        env: 'dev',
      };
      await service.notify(payload);
    });
  });

  describe('forceAppUpdate', () => {
    it('should force the app update: error', async () => {
      mockResult.createException.mockReturnValue(Messages.invalidRequest);

      const response = await service.forceAppUpdate('', 'ios');
      expect(response).toEqual(Messages.invalidRequest);
    });

    it('should force the app update: error', async () => {
      mockResult.createException.mockReturnValue(Messages.appVersionError);
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: false,
          isException: false,
        },
      });

      const response = await service.forceAppUpdate('1.0.0', 'ios');
      expect(response).toEqual(Messages.appVersionError);
    });

    it('should force the app update: error', async () => {
      mockResult.createException.mockReturnValue(Messages.platformError);
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: true,
          value: {
            appInit: {
              cbhm_api: '0.40.17',
              android: {
                version: '0.3.0',
                appUrl:
                  'https://play.google.com/store/apps/details?id=com.caremarket.communitycareexplorer.prod',
              },
            },
          },
        },
      });

      const response = await service.forceAppUpdate('1.0.0', 'ios');
      expect(response).toEqual(Messages.platformError);
    });

    it('should force the app update: success', async () => {
      const appConfig = {
        appInit: {
          ios: {
            version: '1.0.1',
            appUrl: 'test',
          },
        },
      };
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: true,
          value: appConfig,
        },
      });

      const response = await service.forceAppUpdate('1.0.0', 'ios');
      expect(response.data).not.toBeNull();
    });

    it('should force the app update: exception', async () => {
      mockResult.createException.mockReturnValue(Messages.somethingWentWrong);

      mockDynamoDBGateway.getRecords.mockImplementationOnce(() => {
        throw new Error();
      });

      const response = await service.forceAppUpdate('1.0.0', 'ios');
      expect(response).toEqual(Messages.somethingWentWrong);
    });
  });
});
