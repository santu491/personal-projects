import {Messages} from '../../../constants';
import {mockDynamoDBGateway, mockResult} from '../../../utils/baseTest';
import {ContentService} from '../contentService';

jest.mock('../../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

jest.mock('../../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    service = new ContentService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getContentService', () => {
    beforeEach(() => {
      mockResult.createException.mockReturnValue(Messages.contentError);
    });

    it('should get the content: success', async () => {
      mockResult.createSuccess.mockReturnValue({
        content: 'test',
      });
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: true,
          isException: false,
          value: {
            content: 'test',
          },
        },
      });

      const response = await service.getContentService('test', 'en');
      expect(response).not.toBeNull();
    });

    it('should return error when content is missing', async () => {
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: true,
          isException: false,
          value: {},
        },
      });

      const response = await service.getContentService('test', 'en');
      expect(response).toEqual(Messages.contentError);
    });

    it('should return error when value is missing', async () => {
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: true,
          isException: false,
        },
      });

      const response = await service.getContentService('test', 'en');
      expect(response).toEqual(Messages.contentError);
    });

    it('should return error when data is null', async () => {
      mockDynamoDBGateway.getRecords.mockReturnValue(null);

      const response = await service.getContentService('test', 'en');
      expect(response).toEqual(Messages.contentError);
    });

    it('should handle exception when getRecords rejects with null', async () => {
      mockDynamoDBGateway.getRecords.mockRejectedValue(null);

      const response = await service.getContentService('test', 'en');
      expect(response).toEqual(Messages.contentError);
    });

    it('should handle exception when getRecords rejects with status 500', async () => {
      mockDynamoDBGateway.getRecords.mockRejectedValue({
        response: {status: 500},
      });

      const response = await service.getContentService('test', 'en');
      expect(response).toEqual(Messages.contentError);
    });
  });
});
