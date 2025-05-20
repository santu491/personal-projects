import {
  ProviderDetailRequest,
  SendEmailRequest,
} from '../../types/providersRequest';
import {APP} from '../../utils/app';
import {axiosPost} from '../../utils/httpUtil';
import {eapMemberAuthConfigData} from '../../utils/mockData';
import {ProviderSearchGateway} from '../providerSearchGateway';

jest.mock('../../utils/httpUtil', () => ({
  axiosPost: jest.fn(),
}));

describe('providerSearchGateway', () => {
  let gateway: ProviderSearchGateway;

  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.memberAuth = eapMemberAuthConfigData;
    APP.config.providerSearchDetails = {
      getAccessToken:
        'https://www.carelonwellbeing.com/dfd/public/api/accesstoken',
      sendEmail: 'https://providersearch.carelonbehavioralhealth.com/api/email',
    };
    gateway = new ProviderSearchGateway();
  });

  describe('getProviderAddressesData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should return Provider Search data - Success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {data: 'data'},
      });
      const response = await gateway.getProviderAddressesData('', '');
      expect(response).toEqual({data: 'data'});
    });

    it('Should return Provider Search data - Failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 401,
      });
      const response = await gateway.getProviderAddressesData('', '');
      expect(response).toEqual(null);
    });

    it('Should return Provider Search data - Exception', async () => {
      const error = new Error('Failed to get Provider Search data');
      (axiosPost as jest.Mock).mockRejectedValue(error);
      gateway
        .getProviderAddressesData('', '')
        .catch(e => expect(e).toBeTruthy());
    });
  });

  describe('getGeoCodeAddressInfo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should return Provider Search data - Success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {data: 'data'},
      });
      const response = await gateway.getGeoCodeAddressInfo('', '');
      expect(response).toEqual({data: 'data'});
    });

    it('Should return Provider Search data - Failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 401,
      });
      const response = await gateway.getGeoCodeAddressInfo('', '');
      expect(response).toEqual(null);
    });

    it('Should return Provider Search data - Exception', async () => {
      const error = new Error('Failed to get Provider Search data');
      (axiosPost as jest.Mock).mockRejectedValue(error);
      gateway.getGeoCodeAddressInfo('', '').catch(e => expect(e).toBeTruthy());
    });
  });

  describe('getProviderDetailsData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('Should return Provider Search data - Success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {data: 'data'},
      });
      const response = await gateway.getProviderDetailsData('', '');
      expect(response).toEqual({data: 'data'});
    });

    it('Should return Provider Search data - Failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 401,
      });
      const response = await gateway.getProviderDetailsData('', '');
      expect(response).toEqual(null);
    });

    it('Should return Provider Search data - Exception', async () => {
      const error = new Error('Failed to get Provider Search data');
      (axiosPost as jest.Mock).mockRejectedValue(error);
      gateway.getProviderDetailsData('', '').catch(e => expect(e).toBeTruthy());
    });
  });

  describe('getProvidersListData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const payload: ProviderDetailRequest = {
      track_total_hits: true,
      track_scores: true,
      min_score: 0.5,
      query: {},
      stored_fields: [],
      script_fields: {},
      sort: [],
      size: 5,
      from: 0,
      aggs: {},
    };
    it('Should return Provider Search data - Success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {data: 'data'},
      });
      const response = await gateway.getProvidersListData(payload, '');
      expect(response).toEqual({data: 'data'});
    });

    it('Should return Provider Search data - Failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 401,
      });
      const response = await gateway.getProvidersListData(payload, '');
      expect(response).toEqual(null);
    });

    it('Should return Provider Search data - Exception', async () => {
      const error = new Error('Failed to get Provider Search data');
      (axiosPost as jest.Mock).mockRejectedValue(error);
      gateway
        .getProvidersListData(payload, '')
        .catch(e => expect(e).toBeTruthy());
    });
  });

  describe('getAccessToken', () => {
    it('requests and returns access token when request is successful', async () => {
      const mockToken = '123456';
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {access_token: mockToken},
      });

      const response = await gateway.getAccessToken();

      expect(response).toBe(mockToken);
    });

    it('returns null when request is not successful', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 400,
        data: {access_token: '123456'},
      });

      const response = await gateway.getAccessToken();

      expect(response).toBeNull();
    });

    it('returns null when an error occurs', async () => {
      const error = new Error('Failed to get Provider Search access token');
      (axiosPost as jest.Mock).mockRejectedValue(error);

      await gateway.getAccessToken().catch(e => expect(e).toBeTruthy());

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('getProvidersListData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const payload: SendEmailRequest = {
      type: '',
      criteria: '',
      recipient: '',
      disclaimer: '',
      token: '',
      txtValue: '',
      timestamp: '',
    };
    it('Should return Provider Search data - Success', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {data: 'data'},
      });
      const response = await gateway.sendEmail(payload, '');
      expect(response).toEqual(true);
    });

    it('Should return Provider Search data - Failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 401,
      });
      const response = await gateway.sendEmail(payload, '');
      expect(response).toEqual(null);
    });

    it('Should return Provider Search data - Exception', async () => {
      const error = new Error('Failed to get Provider Search data');
      (axiosPost as jest.Mock).mockRejectedValue(error);
      gateway.sendEmail(payload, '').catch(e => expect(e).toBeTruthy());
    });
  });
});
