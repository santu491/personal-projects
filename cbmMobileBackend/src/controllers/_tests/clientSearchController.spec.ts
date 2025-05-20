import {Messages} from '../../constants';
import {searchEAPClient} from '../../services/eap/clientSearchService';
import {ResponseUtil} from '../../utils/responseUtil';
import {ClientSearchController} from '../clientSearchController';
// import {ClientDetails} from '../../types/customRequest';

jest.mock('../../services/eap/clientSearchService', () => ({
  searchEAPClient: jest.fn(),
}));

describe('ClientSearchController', () => {
  let controller: ClientSearchController;
  const responseUtil = new ResponseUtil();

  beforeEach(() => {
    controller = new ClientSearchController();
  });

  describe('clientSearch', () => {
    it('should search for clients', async () => {
      (searchEAPClient as jest.Mock).mockResolvedValue('testData');

      const result = await controller.clientSearch(
        'eap',
        'testClient',
        'testData',
      );

      expect(searchEAPClient).toHaveBeenCalledWith('testClient', 'testData');
      expect(result).toBe('testData');
    });

    it('should return an error if an error occurs', async () => {
      (searchEAPClient as jest.Mock).mockRejectedValue('error');

      const result = await controller.clientSearch(
        'eap',
        'testClient',
        'testData',
      );

      expect(result).toBe('error');
    });

    it('should return an invalid source error', async () => {
      const result: any = await controller.clientSearch(
        'test',
        'testClient',
        'testData',
      );

      expect(result).toEqual(
        responseUtil.createException(Messages.invalidSource),
      );
    });

    it('should return invalid request error', async () => {
      const result: any = await controller.clientSearch(
        'eap',
        'testClient',
        '',
      );

      expect(result).toEqual(
        responseUtil.createException(Messages.invalidRequest),
      );
    });
  });
});
