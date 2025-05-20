import {APP} from '../../utils/app';
import {mockclientConfigurationService} from '../../utils/baseTest';
import {appConfig} from '../../utils/mockData';
import {ClientConfigurationController} from '../clientConfigurationController';

jest.mock('../../services/eap/clientConfigurationService', () => ({
  ClientConfigurationService: jest.fn(() => mockclientConfigurationService),
}));

describe('clientConfigurationController', () => {
  let controller: ClientConfigurationController;

  beforeEach(() => {
    APP.config.env = appConfig.env;
    controller = new ClientConfigurationController();
  });

  describe('fetchClientResources', () => {
    it('should fetch client resources', async () => {
      mockclientConfigurationService.getClientResources.mockResolvedValue(
        'testData',
      );

      const result = await controller.fetchClientResources(
        'testClient',
        'testItem',
      );

      expect(
        controller.clientConfigurationService.getClientResources,
      ).toHaveBeenCalledWith('testclient', 'testItem');
      expect(result).toBe('testData');
    });

    it('should return an error if an error occurs', async () => {
      mockclientConfigurationService.getClientResources.mockRejectedValue(
        'error',
      );

      const result = await controller.fetchClientResources(
        'testClient demo',
        'testItem',
      );

      expect(result).toBe('error');
    });
  });

  describe('fetchClientArticles', () => {
    it('should fetch client articles', async () => {
      mockclientConfigurationService.getClientArticles.mockResolvedValue(
        'testData',
      );

      const result = await controller.fetchClientArticles(
        {path: 'testPath'},
        'testItem',
      );

      expect(
        controller.clientConfigurationService.getClientArticles,
      ).toHaveBeenCalledWith({path: 'testPath'}, 'testItem');

      expect(result).toBe('testData');
    });

    it('should return an error if an error occurs', async () => {
      mockclientConfigurationService.getClientArticles.mockRejectedValue(
        'error',
      );

      const result = await controller.fetchClientArticles(
        {path: 'testPath'},
        'testItem',
      );

      expect(result).toBe('error');
    });
  });

  describe('fetchClientCards', () => {
    it('should fetch client cards', async () => {
      mockclientConfigurationService.getClientCards.mockResolvedValue(
        'testData',
      );

      const result = await controller.fetchClientCards(
        {path: 'testPath'},
        'testItem',
      );

      expect(result).toBe('testData');
    });

    it('should return error', async () => {
      mockclientConfigurationService.getClientCards.mockRejectedValue('error');

      const result = await controller.fetchClientCards(
        {path: 'testPath'},
        'testItem',
      );

      expect(result).toBe('error');
    });
  });
});
