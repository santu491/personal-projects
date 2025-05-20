import {ChatGateway} from '../chatGateway';
import {axiosPost} from '../../utils/httpUtil';
import {APIResponseCodes, HeaderKeys, ServiceConstants} from '../../constants';
import {APP} from '../../utils/app';
import {ChatInitPayload, UserBaseData} from '../../models/Chat';
import {eapMemberAuthConfigData} from '../../utils/mockData';

jest.mock('../../utils/httpUtil');

describe('ChatGateway', () => {
  let chatGateway: ChatGateway;
  const mockPayload: ChatInitPayload = {
    Email: 'test@email.com',
    firstName: 'Test',
    lastName: 'User',
    phone: '123',
    lob: 'company-demo',
    latitude: null,
    longitude: null,
    ip: '0.0.0.0',
    browser: '',
    region: '',
    timezone: '',
    websiteorgin: '',
    websitetitle: '',
    gc_route: '',
  };
  const mockAccessToken = 'mockAccessToken';
  const mockUserData: UserBaseData = {
    secureToken: 'mockSecureToken',
    username: 'mockUsername',
  };

  beforeEach(() => {
    APP.config.memberAuth = eapMemberAuthConfigData;
    chatGateway = new ChatGateway();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize chat with secure path when userData is provided', async () => {
    const mockResponse = {
      status: APIResponseCodes.SUCCESS,
      data: {
        key: 'abc123',
      },
    };
    (axiosPost as jest.Mock).mockResolvedValue(mockResponse);

    const result = await chatGateway.initChat(
      mockPayload,
      mockAccessToken,
      mockUserData,
    );

    expect(axiosPost).toHaveBeenCalledWith(
      `${APP.config.memberAuth.eap.host}${APP.config.memberAuth.eap.basePath.secure}${APP.config.memberAuth.eap.genesysChat.init}`,
      mockPayload,
      {
        [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
        [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${mockAccessToken}`,
        [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${mockUserData.secureToken}`,
        [HeaderKeys.SMUNIVERSALID]: mockUserData.username,
      },
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should initialize chat with public path when userData is not provided', async () => {
    const mockResponse = {
      status: APIResponseCodes.SUCCESS,
      data: {
        key: 'abc123',
      },
    };
    (axiosPost as jest.Mock).mockResolvedValue(mockResponse);

    const result = await chatGateway.initChat(mockPayload, mockAccessToken);

    expect(axiosPost).toHaveBeenCalledWith(
      `${APP.config.memberAuth.eap.host}${APP.config.memberAuth.eap.basePath.public}${APP.config.memberAuth.eap.genesysChat.init}`,
      mockPayload,
      {
        [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
        [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${mockAccessToken}`,
      },
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should return null if response status is not SUCCESS', async () => {
    const mockResponse = {status: 400, data: null};
    (axiosPost as jest.Mock).mockResolvedValue(mockResponse);

    const result = await chatGateway.initChat(
      mockPayload,
      mockAccessToken,
      mockUserData,
    );

    expect(result).toBeNull();
  });
});
