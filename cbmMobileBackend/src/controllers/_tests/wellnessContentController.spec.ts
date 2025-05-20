import {APP} from '../../utils/app';
import {mockWellnessContentService} from '../../utils/baseTest';
import {WellnessContentController} from '../wellnessContentController';

jest.mock('../../services/eap/wellnessContentService', () => ({
  WellnessContentService: jest.fn(() => mockWellnessContentService),
}));

describe('WellnessContentService', () => {
  let controller: WellnessContentController;

  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.credibleMindDetails = {
      host: 'https://api.crediblemind.com',
      monthlyResources: '',
      topics: '',
      xApiKey: '12i7y2782',
    };
    controller = new WellnessContentController();
  });

  describe('getMonthlyResourcsesController', () => {
    it('Should return monthly resource data', async () => {
      mockWellnessContentService.getMonthlyResourcesService.mockResolvedValue({
        data: [],
      });

      const response = await controller.getMonthlyResourcesController('8');
      expect(response).toEqual({data: []});
    });

    it('Should return exception while fetching monthly resource data', async () => {
      const error = new Error('Failed to get Monthly resources data');
      mockWellnessContentService.getMonthlyResourcesService.mockRejectedValue(
        error,
      );

      const response = await controller.getMonthlyResourcesController('8');
      expect(response).toEqual(error);
    });
  });

  describe('getTopicsController', () => {
    it('Should return Content data', async () => {
      mockWellnessContentService.getTopicsService.mockResolvedValue({
        data: [],
      });

      const response = await controller.getTopicsController();
      expect(response).toEqual({data: []});
    });

    it('Should return exception while fetching Content data', async () => {
      const error = new Error('Failed to get Content data');
      mockWellnessContentService.getTopicsService.mockRejectedValue(error);

      const response = await controller.getTopicsController();
      expect(response).toEqual(error);
    });
  });
});
