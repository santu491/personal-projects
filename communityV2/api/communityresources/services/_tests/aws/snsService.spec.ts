import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { SnsService } from '../../aws/snsService';

jest.mock('@aws-sdk/client-sns', () => {
  const SNSMocked = {
    createPlatformEndpoint: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    SNS: jest.fn(() => SNSMocked),
  };
});

let service: SnsService;
describe.only('Test case for Sns create platform endpoint', () => {
  beforeEach(() => {
    service = new SnsService(<any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add endpoint', async () => {
    const actualValue = await service.addEndpoint({
      userName: '',
      appVersion: '',
      locale: '',
      osVersion: '',
      platform: '',
      timeZoneOffset: 0,
      deviceToken: '',
    });
    expect(actualValue).toEqual(null);
  });
});
