import * as SQS from '@aws-sdk/client-sqs';
import {MessageSQS} from '../../../types/notificationRequest';
import {APP} from '../../app';
import {randomString} from '../../common';
import {addToNotificationQueue} from '../../notifications/sqs';

jest.mock('@aws-sdk/client-sqs', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-sqs');
  return {
    ...originalModule,
    SQSClient: jest.fn(),
    SendMessageCommand: jest.fn(),
  };
});

jest.mock('../../common', () => ({
  randomString: jest.fn(),
}));

jest.mock('../../logger', () => ({
  logger: jest.fn().mockReturnValue('errror'),
}));

describe('addToNotificationQueue', () => {
  const mockSend = jest.fn();
  (SQS.SQSClient as jest.Mock).mockImplementation(() => ({
    send: mockSend,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    (randomString as jest.Mock).mockReturnValue('randomId');
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

  const data: MessageSQS = {
    body: 'A new post has been shared to your community.',
    title: 'New post available',
    notificationId: '',
    env: '',
  };

  it('should push the message to SQS', async () => {
    addToNotificationQueue(data, 'arn', 'groupId');
  });
});
