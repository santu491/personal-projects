import {StatusCodes} from 'http-status-codes';
import {Messages} from '../../../constants';
import {getEAPClientInfo} from '../../../gateway/clientSearchGateway';
import {getCache, setCache} from '../../../utils/cacheUtil';
import {ResponseUtil} from '../../../utils/responseUtil';
import {
  getEAPMemberProfileAccessToken,
  searchEAPClient,
} from '../clientSearchService';
import {getAppConfig} from '../../../utils/common';
import {
  mockclientConfigurationService,
  mockEapMemberProfileGateway,
} from '../../../utils/baseTest';
import {clientResoursesMockResponse} from '../../../mocks/eap/clientConfigurationMockResponses';

const result = new ResponseUtil();

jest.mock('../../../utils/cacheUtil', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
}));
jest.mock('../../../utils/common');

jest.mock('../../../gateway/clientSearchGateway', () => ({
  getEAPAccessToken: jest.fn(),
  getEAPClientInfo: jest.fn(),
}));

jest.mock('../../../gateway/eapMemberProfileGateway', () => ({
  EAPMemberProfileGateway: jest.fn(() => mockEapMemberProfileGateway),
}));

jest.mock('../clientConfigurationService', () => ({
  ClientConfigurationService: jest.fn(() => mockclientConfigurationService),
}));

describe('clientSearchService', () => {
  const mockClient = 'testClient';
  const mockSearchData = 'testSearchData';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchEAPClient', () => {
    it('Should return Auth error message if no access token', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);
      mockclientConfigurationService.getClientResources.mockReturnValue({
        data: clientResoursesMockResponse,
      });

      const response = await searchEAPClient(mockClient, mockSearchData);

      expect(response).toEqual(
        result.createException(
          Messages.memberEAPauthorizationError,
          StatusCodes.UNAUTHORIZED,
        ),
      );
    });

    it('Should return client info', async () => {
      (getCache as jest.Mock).mockReturnValue('accessToken');
      (getEAPClientInfo as jest.Mock).mockResolvedValue({
        clients: [
          {
            clientName: 'The Home Depot Inc',
            userName: 'The Home Depot Inc',
          },
          {
            clientName: 'Company Demo',
            userName: 'company-demo',
          },
          {
            clientName: 'Department of Homeland Security',
            userName: 'Department of Homeland Security',
          },
        ],
      });
      (getAppConfig as jest.Mock).mockReturnValue({
        clients: [{userName: 'company-demo', enabled: true}],
      });

      const response = await searchEAPClient(mockClient, mockSearchData);

      expect(response).toBeDefined();
    });

    it('should return error if db clients are empty', async () => {
      (getCache as jest.Mock).mockReturnValue('accessToken');
      (getEAPClientInfo as jest.Mock).mockResolvedValue({
        clients: [
          {
            clientName: 'The Home Depot Inc',
            userName: 'The Home Depot Inc',
          },
          {
            clientName: 'Company Demo',
            userName: 'company-demo',
          },
          {
            clientName: 'Department of Homeland Security',
            userName: 'Department of Homeland Security',
          },
        ],
      });
      (getAppConfig as jest.Mock).mockReturnValue({});

      const response = await searchEAPClient(mockClient, mockSearchData);

      expect(response).toEqual(
        result.createException(
          Messages.allowedClientsError,
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should return clients only if enabled', async () => {
      (getCache as jest.Mock).mockReturnValue('accessToken');
      (getEAPClientInfo as jest.Mock).mockResolvedValue({
        clients: [
          {
            clientName: 'The Home Depot Inc',
            userName: 'The Home Depot Inc',
          },
          {
            clientName: 'Company Demo',
            userName: 'company-demo',
          },
          {
            clientName: 'Department of Homeland Security',
            userName: 'Department of Homeland Security',
          },
        ],
      });
      (getAppConfig as jest.Mock).mockReturnValue({
        clients: [{userName: 'company-demo', enabled: false}],
      });

      const response = await searchEAPClient(mockClient, mockSearchData);

      expect(response).toEqual({data: {clients: []}, statusCode: 200});
    });

    it('Should return error when there is no response', async () => {
      (getCache as jest.Mock).mockReturnValue('accessToken');
      (getEAPClientInfo as jest.Mock).mockResolvedValue(null);

      const response = await searchEAPClient(mockClient, mockSearchData);

      expect(response).toEqual(
        result.createException(
          Messages.clientSearchError,
          StatusCodes.BAD_REQUEST,
        ),
      );
    });

    it('Should throw exception', async () => {
      (getCache as jest.Mock).mockReturnValue('accessToken');
      (getEAPClientInfo as jest.Mock).mockRejectedValue('Error');

      const response = await searchEAPClient(mockClient, mockSearchData);

      expect(response).toEqual(
        result.createException(Messages.clientSearchError),
      );
    });
  });

  describe('getEAPMemberProfileAccessToken', () => {
    const mockAccessToken = 'accessToken';
    it('Should return access token from the cache', async () => {
      (getCache as jest.Mock).mockReturnValue(mockAccessToken);

      const response = await getEAPMemberProfileAccessToken();

      expect(response).toEqual(mockAccessToken);
    });

    it('Should return access token by generating new token, Cache dont have access token', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      jest
        .spyOn(mockEapMemberProfileGateway, 'getEAPAccessToken')
        .mockResolvedValue(mockAccessToken);
      (setCache as jest.Mock).mockReturnValue(null);

      const response = await getEAPMemberProfileAccessToken();

      expect(response).toEqual(mockAccessToken);
    });

    it('Should return null if any exception cases', async () => {
      const error = new Error('Failed to get access token');
      (getCache as jest.Mock).mockReturnValue(null);
      jest
        .spyOn(mockEapMemberProfileGateway, 'getEAPAccessToken')
        .mockRejectedValue(error);

      const response = await getEAPMemberProfileAccessToken();

      expect(response).toEqual(null);
    });
  });
});
