import {APP} from '../../utils/app';
import {axiosGet} from '../../utils/httpUtil';
import {decrypt} from '../../utils/security/encryptionHandler';
import {WellnessContentGateway} from '../wellnessContentGateway';

jest.mock('../../utils/httpUtil', () => ({
  axiosGet: jest.fn(),
}));

jest.mock('../../utils/security/encryptionHandler', () => ({
  decrypt: jest.fn(),
}));

describe('WellnessContentGateway', () => {
  let gateway: WellnessContentGateway;
  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.credibleMindDetails = {
      host: 'https://api.crediblemind.com',
      monthlyResources: '',
      topics: '',
      xApiKey: '12i7y2782',
    };
    gateway = new WellnessContentGateway();
    (decrypt as jest.Mock).mockReturnValue('12i7y2782');
  });

  describe('getMonthlyResources', () => {
    it('Should return monthly resoucrce data', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        data: [],
      });
      const month = '8';
      const response = await gateway.getMonthlyResources(month);
      expect(response).toEqual([]);
    });

    it('Should throw error when response is not there', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({isSuccess: false});
      const month = '8';
      await gateway
        .getMonthlyResources(month)
        .catch(e => expect(e).toEqual({isSuccess: false}));
    });

    it('Should return error while fecthing monthly resoucrce data', async () => {
      const error = new Error('Failed to get Monthly resources data');
      (axiosGet as jest.Mock).mockRejectedValue(error);
      const month = '8';
      await gateway
        .getMonthlyResources(month)
        .catch(e => expect(e).toEqual(error));
    });
  });

  describe('getTopics', () => {
    it('Should return topics data', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        data: [],
      });
      const response = await gateway.getTopics();
      expect(response).toEqual([]);
    });

    it('Should throw error when response is not there', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({isSuccess: false});
      await gateway
        .getTopics()
        .catch(e => expect(e).toEqual({isSuccess: false}));
    });

    it('Should return error while fecthing topics data', async () => {
      const error = new Error('Failed to get topics data');
      (axiosGet as jest.Mock).mockRejectedValue(error);
      await gateway.getTopics().catch(e => expect(e).toEqual(error));
    });
  });
});
