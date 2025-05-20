import {APP} from '../../../utils/app';
import {mockWellnessContentGateway} from '../../../utils/baseTest';
import {ResponseUtil} from '../../../utils/responseUtil';
import {WellnessContentService} from '../wellnessContentService';

jest.mock('../../../gateway/wellnessContentGateway', () => ({
  WellnessContentGateway: jest.fn(() => mockWellnessContentGateway),
}));

describe('WellnessTopicsService', () => {
  let service: WellnessContentService;
  let result: ResponseUtil;
  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.credibleMindDetails = {
      host: 'https://api.crediblemind.com',
      monthlyResources: '',
      topics: '',
      xApiKey: '12i7y2782',
    };
    service = new WellnessContentService();
    result = new ResponseUtil();
  });

  describe('getMonthlyResourcesService', () => {
    it('Should return monthly resource data', async () => {
      mockWellnessContentGateway.getMonthlyResources.mockResolvedValue({
        data: [],
      });

      const response = await service.getMonthlyResourcesService('8');

      expect(response).toEqual(result.createSuccess({data: []}));
    });

    it('Should return monthly resource data - month value not sent', async () => {
      mockWellnessContentGateway.getMonthlyResources.mockResolvedValue({
        data: [],
      });

      const response = await service.getMonthlyResourcesService();

      expect(response).toEqual(result.createSuccess({data: []}));
    });

    it('Should throw error when response is not there', async () => {
      mockWellnessContentGateway.getMonthlyResources.mockResolvedValue(false);

      const response = await service.getMonthlyResourcesService('8');
      expect(response).toEqual(result.createException(false));
    });

    it('Should return exception while fetching monthly resource data', async () => {
      const error = new Error('Failed to get Monthly resources data');
      mockWellnessContentGateway.getMonthlyResources.mockRejectedValue(error);

      const response = await service.getMonthlyResourcesService('8');
      expect(response).toEqual(result.createException(error.message));
    });
  });

  describe('getTopicsService', () => {
    it('Should return topics data', async () => {
      const mockData = {
        numResults: 2,
        results: [
          {
            path: 'path1',
            title: 'title1',
            description: 'description1',
            imageUrl: 'imageUrl1',
          },
          {
            path: 'path2',
            title: 'title2',
            description: 'description2',
            imageUrl: 'imageUrl2',
          },
        ],
      };
      mockWellnessContentGateway.getTopics.mockResolvedValue(mockData);

      const response = await service.getTopicsService();
      expect(response).toEqual(result.createSuccess(mockData));
    });

    it('Should return exception while fetching topics data', async () => {
      const error = new Error('Failed to get topics data');
      mockWellnessContentGateway.getTopics.mockRejectedValue(error);

      const response = await service.getTopicsService();
      expect(response).toEqual(result.createException(error.message));
    });
  });
});
