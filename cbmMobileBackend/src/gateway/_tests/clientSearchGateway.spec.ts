import {APP} from '../../utils/app';
import {eapMemberAuthConfigData} from '../../utils/mockData';
import {axiosGet} from '../../utils/httpUtil';
import {getEAPClientInfo} from '../clientSearchGateway';

jest.mock('../../utils/httpUtil');

describe('clientSearchGateway', () => {
  const mockAccessToken = 'testAccessToken';
  const mockClient = 'testClient';
  const mockSearchData = 'testSearchData';

  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.memberAuth = eapMemberAuthConfigData;
  });

  describe('getEAPClientInfo', () => {
    it('should get EAP client info', async () => {
      const expectedResponse = {
        status: 200,
        data: {
          clients: [
            {
              userName: 'Company Demo',
              clientName: 'Company Demo',
            },
          ],
        },
      };
      (axiosGet as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await getEAPClientInfo(
        mockClient,
        mockSearchData,
        mockAccessToken,
      );

      expect(result).toBe(expectedResponse.data);
      expect(axiosGet).toHaveBeenCalled();
    });

    it('should return null if status is not 200', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        status: 404,
      });

      const result = await getEAPClientInfo(
        mockClient,
        mockSearchData,
        mockAccessToken,
      );

      expect(result).toBeNull();
      expect(axiosGet).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosGet as jest.Mock).mockRejectedValue('error');

      getEAPClientInfo(mockClient, mockSearchData, mockAccessToken).catch(e =>
        expect(e).toBeTruthy(),
      );

      expect(axiosGet).toHaveBeenCalled();
    });
  });
});
