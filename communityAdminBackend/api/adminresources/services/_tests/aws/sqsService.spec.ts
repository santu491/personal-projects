import { Result } from '@anthem/communityadminapi/common';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { SqsService } from '../../aws/sqsService';

jest.mock('aws-sdk/clients/sqs', () => {
  const SQSMocked = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    SQS: jest.fn(() => SQSMocked),
  };
});

const data = {
  body: 'A new post has been shared to your community.',
  communities: ['5f245386aa271e24b0c6fd88'],
  createdDate: new Date(),
  deepLink: 'activity',
  env: 'default',
  type: 'post',
  senderId: '6197d6364b8aa1e7702a13e3',
  title: 'New post available',
  postId: '619bbcaa5c1162280413b9de',
  receiverId: '',
  activityObjId: '',
};

let service: SqsService;

const mockResult: Mockify<Result> = {
  createSuccess: jest.fn(),
  createException: jest.fn(),
  createError: jest.fn(),
  createErrorMessage: jest.fn(),
  createExceptionWithValue: jest.fn(),
  createGuid: jest.fn(),
  errorInfo: jest.fn(),
};

describe.only('Test case for SQS SendMessage', () => {
  beforeEach(() => {
    service = new SqsService(<any>mockILogger, <any>mockResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the UserEvent', async () => {
    const expRes = '34021096-d6f3-4feb-8a0f-ab16ef9a28ed';
    const actualValue = await service.addToNotificationQueue(data, '', '');
    mockResult.createSuccess(expRes);
    expect(actualValue).toEqual(null);
  });
});
