import { mockLogger, mockMongo, mockResult, mockSqsService, mockUserHelperService } from '@anthem/communityadminapi/common/baseTest';
import { EmailNotificationService } from '../emailNotificationService';

describe('adminUserService', () => {
  let service: EmailNotificationService;

  beforeEach(() => {
    service = new EmailNotificationService(<any>mockMongo, <any>mockResult, <any>mockSqsService, <any>mockLogger, <any>mockUserHelperService)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const scAdmin = {
    "role": "scadmin"
  };

  const advoate = {
    "role": "scadvocate"
  };

  const expRes = {
    "data": {
      "isSuccess": true,
      "isException": false,
      "value": []
    }
  };

  it('Trigger the group mail: Success', async () => {
    mockMongo.getRowCount.mockReturnValue(50);
    mockResult.createSuccess.mockReturnValue(expRes);
    mockSqsService.addToNotificationQueue.mockReturnValue(true);
    const data = await service.triggerMassEmail(scAdmin);
    expect(data).toEqual(expRes);
  });

  it('Trigger the group mail: Error', async () => {
    mockResult.createError.mockReturnValue(true);
    await service.triggerMassEmail(advoate);
  });

  it('Trigger the group mail: Exception', async () => {
    mockMongo.getRowCount.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await service.triggerMassEmail(scAdmin);
  });
});
