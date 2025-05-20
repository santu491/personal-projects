import {Messages} from '../../constants';
import {
  AddressRequest,
  ProvidersListRequest,
  SendEmailRequest,
} from '../../types/providersRequest';
import {mockProviderSearchService} from '../../utils/baseTest';
import {ResponseUtil} from '../../utils/responseUtil';
import {ProviderController} from '../providerController';

jest.mock('../../services/eap/providerService', () => ({
  ProviderService: jest.fn(() => mockProviderSearchService),
}));

describe('ProviderController', () => {
  let providerController: ProviderController;

  beforeEach(() => {
    providerController = new ProviderController();
  });

  describe('getProviderAddresses', () => {
    it('should return list of provider addresses', async () => {
      const payload: AddressRequest = {
        data: 'New ',
      };
      jest
        .spyOn(mockProviderSearchService, 'getProviderAddresses')
        .mockResolvedValue('address list');

      const result = await providerController.getProviderAddresses(payload);

      expect(result).toBe('address list');
    });

    it('should return list of provider addresses Exception', async () => {
      const error = 'Failed to get Addresses';
      jest
        .spyOn(mockProviderSearchService, 'getProviderAddresses')
        .mockRejectedValue(error);

      const payload: AddressRequest = {
        data: 'New ',
      };

      const result = await providerController.getProviderAddresses(payload);

      expect(result).toEqual(new ResponseUtil().createException(error));
    });
  });

  describe('getGeoCodeAddress', () => {
    it('should return geoCode details of selected provider address', async () => {
      const payload: AddressRequest = {
        data: 'New ',
      };
      jest
        .spyOn(mockProviderSearchService, 'getGeoCodeAddress')
        .mockResolvedValue('geocode address details');

      const result = await providerController.getGeoCodeAddress(payload);

      expect(result).toBe('geocode address details');
    });

    it('should return geoCode details of selected provider addresses Exception', async () => {
      const error = new Error('Failed to get geoCode address');
      jest
        .spyOn(mockProviderSearchService, 'getGeoCodeAddress')
        .mockRejectedValueOnce(error);

      const payload: AddressRequest = {
        data: 'New ',
      };

      const result = await providerController.getGeoCodeAddress(payload);

      expect(result).toBe(error);
    });
  });

  describe('getProvidersDetails', () => {
    it('should return providers details', async () => {
      const payload: AddressRequest = {
        data: 'New ',
      };
      jest
        .spyOn(mockProviderSearchService, 'getProviderDetails')
        .mockResolvedValue('get provider list details');

      const result = await providerController.getProvidersDetails(payload);

      expect(result).toBe('get provider list details');
    });

    it('should return providers details - Exception', async () => {
      const error = new Error('Failed to get providers details');
      jest
        .spyOn(mockProviderSearchService, 'getProviderDetails')
        .mockRejectedValue(error);

      const payload: AddressRequest = {
        data: 'New ',
      };

      const result = await providerController.getProvidersDetails(payload);

      expect(result).toBe(error);
    });
  });

  describe('sendEmail', () => {
    const payload: SendEmailRequest = {
      type: '',
      criteria: '',
      recipient: '',
      disclaimer: '',
      token: '',
      txtValue: '',
      timestamp: '',
    };
    it('should send Email - Success', async () => {
      jest
        .spyOn(mockProviderSearchService, 'sendEmailService')
        .mockResolvedValue(Messages.sendEmailSuccess);

      const result = await providerController.sendEmail(payload);

      expect(result).toBe(Messages.sendEmailSuccess);
    });

    it('should send Email - Exception', async () => {
      const error = new Error(Messages.sendEmailError);
      jest
        .spyOn(mockProviderSearchService, 'sendEmailService')
        .mockRejectedValue(error);

      const result = await providerController.sendEmail(payload);

      expect(result).toBe(error);
    });
  });

  describe('fetchProviders', () => {
    it('should return list of providers', async () => {
      const payload: ProvidersListRequest = {
        data: {
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
        },
      };
      jest
        .spyOn(mockProviderSearchService, 'fetchProvidersList')
        .mockResolvedValue('get provider list details');

      const result = await providerController.fetchProviders(payload);

      expect(result).toBe('get provider list details');
    });

    it('should return list of providers - Exception', async () => {
      const error = new Error('Failed to get providers list');
      jest
        .spyOn(mockProviderSearchService, 'fetchProvidersList')
        .mockRejectedValue(error);

      const payload: ProvidersListRequest = {
        data: {
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
        },
      };

      const result = await providerController.fetchProviders(payload);

      expect(result).toBe(error);
    });
  });
});
