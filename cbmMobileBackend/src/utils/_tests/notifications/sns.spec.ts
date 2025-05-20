import {
  addDeviceToken,
  disableDeviceToken,
  sendPushNotification,
} from '../../notifications/sns';
import {Platform} from '../../../constants';
import {APP} from '../../app';
import {SNS} from '@aws-sdk/client-sns';

jest.mock('@aws-sdk/client-sns');

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
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

describe('addDeviceToken', () => {
  it('should add device token', async () => {
    jest
      .spyOn(SNS.prototype, 'createPlatformEndpoint')
      .mockImplementationOnce(() => ({
        EndpointArn:
          'arn:aws:sns:us-east-1:XXX:endpoint/APNS/carelon-mobile-ios-dev1/dfaf1927-d324-3163-a500-2ad626e8aae6',
      }));

    const request = {
      platform: Platform.ios,
      deviceToken: 'deviceToken',
    };

    await addDeviceToken(request);
  });

  it('should return null on error', async () => {
    jest.mock('@aws-sdk/client-sns', () => ({
      SNS: jest.fn().mockImplementationOnce(() => ({
        createPlatformEndpoint: jest.fn().mockImplementationOnce(() => {
          throw new Error();
        }),
      })),
    }));

    const request = {
      platform: Platform.ios,
      deviceToken: 'deviceToken',
    };

    const resp = await addDeviceToken(request);
    expect(resp).toBeNull();
  });
});

describe('disableDeviceToken', () => {
  it('should disable device token', async () => {
    jest.mock('@aws-sdk/client-sns', () => ({
      SNSClient: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockResolvedValue({}),
      })),
      DeleteEndpointCommand: jest.fn().mockImplementation(input => input),
    }));
    const response = await disableDeviceToken('endpointArn');

    expect(response).toBeUndefined();
  });

  it('should return null', async () => {
    jest.spyOn(SNS.prototype, 'send').mockImplementationOnce(() => {
      throw new Error('error');
    });
    const response = await disableDeviceToken('endpointArn');

    expect(response).toBeNull();
  });
});

describe('sendPushNotification', () => {
  it('should return true when the message is sent successfully', async () => {
    const mockResponse = {MessageId: '123456'};
    jest.mock('@aws-sdk/client-sns', () => {
      return {
        SNSClient: jest.fn().mockImplementationOnce(() => {
          return {send: jest.fn(() => Promise.resolve({mockResponse}))};
        }),
        PublishCommand: jest.fn().mockImplementationOnce(() => {
          return {};
        }),
      };
    });
    const result = await sendPushNotification(
      'title',
      'body',
      'mockDevice',
      'notificationId',
    );
    expect(result).toBe(false);
  });

  it('should return false when there is an error', async () => {
    jest.spyOn(SNS.prototype, 'send').mockImplementationOnce(() => {
      throw new Error('error');
    });

    const result = await sendPushNotification(
      'title',
      'body',
      'mockDevice',
      'notificationId',
      3,
    );
    expect(result).toBe(false);
  });
});
