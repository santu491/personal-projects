import {Messages} from '../../../constants';
import {
  ProvidersListRequest,
  SendEmailRequest,
} from '../../../types/providersRequest';
import {APP} from '../../../utils/app';
import {
  mockAuditHelper,
  mockProviderSearchGateway,
} from '../../../utils/baseTest';
import {getCache, setCache} from '../../../utils/cacheUtil';
import {getAccessToken, handleErrorMessage} from '../../../utils/common';
import {ResponseUtil} from '../../../utils/responseUtil';
import {ProviderService} from '../providerService';

jest.mock('../../../gateway/providerSearchGateway', () => ({
  ProviderSearchGateway: jest.fn(() => mockProviderSearchGateway),
}));

jest.mock('../../helpers/auditHelper', () => ({
  AuditHelper: jest.fn(() => mockAuditHelper),
}));

jest.mock('../../../utils/cacheUtil', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
}));
jest.mock('../../../utils/common');

const result = new ResponseUtil();
describe('providerService', () => {
  const service = new ProviderService();

  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.providerSearchDetails = {
      getAccessToken:
        'https://www.carelonwellbeing.com/dfd/public/api/accesstoken',
      sendEmail: 'https://providersearch.carelonbehavioralhealth.com/api/email',
    };
    (getAccessToken as jest.Mock).mockReturnValue('accessToken');
    (handleErrorMessage as jest.Mock).mockImplementation((error, message) => {
      return message;
    });
  });

  describe('getProviderPublicAccessToken', () => {
    it('should get the token from Cookie', async () => {
      const accessToken = 'testAccessToken';
      (getCache as jest.Mock).mockReturnValue(accessToken);

      const result = await service.getProviderPublicAccessToken();

      expect(result).toBe(accessToken);
    });

    it('should get the token from getAccessToken', async () => {
      const accessToken = 'testAccessToken';
      (getCache as jest.Mock).mockReturnValue(null);
      jest
        .spyOn(mockProviderSearchGateway, 'getAccessToken')
        .mockResolvedValue(accessToken);
      (setCache as jest.Mock).mockResolvedValue(null);

      const result = await service.getProviderPublicAccessToken();

      expect(result).toBe(accessToken);
    });

    it('should get the token from Cookie - Exception', async () => {
      const error = new Error('Failed to get access token');
      (getCache as jest.Mock).mockReturnValue(null);
      jest
        .spyOn(mockProviderSearchGateway, 'getAccessToken')
        .mockRejectedValue(error);

      const result = await service.getProviderPublicAccessToken();

      expect(result).toBe(null);
    });
  });

  describe('getProviderAddresses', () => {
    it('should get the provider addresses - success', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProviderAddressesData')
        .mockResolvedValue([{address: 'test'}]);

      const response = await service.getProviderAddresses('');
      const expected = result.createSuccess([{address: 'test'}]);

      expect(response).toEqual(expected);
    });

    it('should get the provider addresses - fail', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProviderAddressesData')
        .mockResolvedValue(null);

      const response = await service.getProviderAddresses('');
      const expected = result.createException(Messages.addressError);

      expect(response).toEqual(expected);
    });

    it('should get the provider addresses - Exception', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProviderAddressesData')
        .mockRejectedValue({message: Messages.addressError});

      const response = await service.getProviderAddresses('');

      const expected = result.createException(Messages.addressError);

      expect(response).toEqual(expected);
    });
  });

  describe('getGeoCodeAddress', () => {
    it('should get the geoCode details of the provider - success', async () => {
      const geoCodeResponse = {
        geoCoordinates: {
          latitude: '40.7127753',
          longitude: '-74.0059728',
          matchQuality: 'APPROXIMATE',
        },
        formatedAddress: 'New York, NY, USA',
        streetNumber: null,
        streetName: null,
        city: 'New York',
        state: 'NY',
        zip: null,
      };
      jest
        .spyOn(mockProviderSearchGateway, 'getGeoCodeAddressInfo')
        .mockResolvedValue(geoCodeResponse);

      const response = await service.getGeoCodeAddress('');
      const expected = result.createSuccess(geoCodeResponse);

      expect(response).toEqual(expected);
    });

    it('should get the geoCode details of the provider - fail', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getGeoCodeAddressInfo')
        .mockResolvedValue(null);

      const response = await service.getGeoCodeAddress('');
      const expected = result.createException(Messages.addressError);

      expect(response).toEqual(expected);
    });

    it('should get the geoCode details of the provider - Exception', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getGeoCodeAddressInfo')
        .mockRejectedValue({message: Messages.addressError});

      const response = await service.getGeoCodeAddress('');

      const expected = result.createException(Messages.addressError);

      expect(response).toEqual(expected);
    });
  });

  describe('getProvidersDetails', () => {
    it('should get the details of the provider - success', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProviderDetailsData')
        .mockResolvedValue({id: 1, name: 'test'});

      const response = await service.getProviderDetails('');

      expect(response).not.toBeFalsy();
    });

    it('should get the details of the provider - fail', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProviderDetailsData')
        .mockResolvedValue(null);

      const response = await service.getProviderDetails('');
      const expected = result.createException(Messages.providersError);

      expect(response).toEqual(expected);
    });

    it('should get the details of the provider - Exception', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProviderDetailsData')
        .mockRejectedValue({message: Messages.providersError});

      const response = await service.getProviderDetails('');

      const expected = result.createException(Messages.providersError);

      expect(response).toEqual(expected);
    });
  });

  describe('sendEmailService', () => {
    const payload: SendEmailRequest = {
      type: '',
      criteria: '',
      recipient: '',
      disclaimer: '',
      token: '',
      txtValue: '',
      timestamp: '',
    };
    it('should send email - Token is null', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      jest
        .spyOn(mockProviderSearchGateway, 'getAccessToken')
        .mockResolvedValue(null);

      const response = await service.sendEmailService(payload);
      const expected = result.createException(Messages.authorizationError);

      expect(response).toEqual(expected);
    });

    it('should send email  - success', async () => {
      const accessToken = 'testAccessToken';
      (getCache as jest.Mock).mockResolvedValue(accessToken);
      jest
        .spyOn(mockProviderSearchGateway, 'sendEmail')
        .mockResolvedValue(Messages.sendEmailSuccess);

      const response = await service.sendEmailService(payload);
      const expected = result.createSuccess(Messages.sendEmailSuccess);

      expect(response).toEqual(expected);
    });

    it('should send email  - fail', async () => {
      (getCache as jest.Mock).mockResolvedValue('accessToken');
      jest
        .spyOn(mockProviderSearchGateway, 'sendEmail')
        .mockResolvedValue(null);

      const response = await service.sendEmailService(payload);
      const expected = result.createException(Messages.sendEmailError);

      expect(response).toEqual(expected);
    });

    it('should send email  - Exception', async () => {
      (getCache as jest.Mock).mockReturnValue('testAccessToken');
      jest
        .spyOn(mockProviderSearchGateway, 'sendEmail')
        .mockRejectedValue(new Error(Messages.authorizationError));

      const response = await service.sendEmailService(payload);

      const expected = result.createException(Messages.authorizationError);

      expect(response).toEqual(expected);
    });
  });

  describe('fetchProvidersList', () => {
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

    it('should get the List of providers - success', async () => {
      const providersResponse = {
        id: 1,
        name: 'test',
        hits: {hits: [], total: {value: 10}},
        aggregations: {},
      };

      jest
        .spyOn(mockProviderSearchGateway, 'getProvidersListData')
        .mockResolvedValue(providersResponse);

      const response = await service.fetchProvidersList(payload);
      const expected = result.createSuccess({
        providers: [],
        filters: [],
        total: 10,
      });

      expect(response).toEqual(expected);
    });

    it('should get the List of providers - fail', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProvidersListData')
        .mockResolvedValue(null);

      const response = await service.fetchProvidersList(payload);
      const expected = result.createException(Messages.providersError);

      expect(response).toEqual(expected);
    });

    it('should get the List of providers - Exception', async () => {
      jest
        .spyOn(mockProviderSearchGateway, 'getProvidersListData')
        .mockRejectedValue(new Error(Messages.providersError));

      const response = await service.fetchProvidersList(payload);
      const expected = result.createException(Messages.providersError);

      expect(response).toEqual(expected);
    });
  });
});
