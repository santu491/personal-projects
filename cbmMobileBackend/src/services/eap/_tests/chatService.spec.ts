import {ChatService} from '../chatService';
import {ResponseUtil} from '../../../utils/responseUtil';
import {getAccessToken} from '../../../utils/common';
import {Messages} from '../../../constants';
import {ChatInitRequest} from '../../../models/Chat';
import {mockAuditHelper, mockChatGateway} from '../../../utils/baseTest';
import {APP} from '../../../utils/app';
import {appConfig} from '../../../utils/mockData';

jest.mock('../../../gateway/chatGateway', () => ({
  ChatGateway: jest.fn(() => mockChatGateway),
}));
jest.mock('../../../utils/responseUtil');
jest.mock('../../../utils/common');
jest.mock('../../helpers/auditHelper', () => ({
  AuditHelper: jest.fn(() => mockAuditHelper),
}));

describe('ChatService', () => {
  let chatService: ChatService;
  let responseUtilMock: jest.Mocked<ResponseUtil>;

  beforeEach(() => {
    responseUtilMock = new ResponseUtil() as jest.Mocked<ResponseUtil>;
    APP.config.clientConfiguration = appConfig.clientConfiguration;
    APP.config.env = appConfig.env;
    chatService = new ChatService();
    chatService.response = responseUtilMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initChat', () => {
    it('should initialize chat successfully', async () => {
      const payload: ChatInitRequest = {
        email: 'test@example.com',
        lob: 'testLOB',
        firstName: 'Test',
        lastName: 'User',
        phone: '123',
      };

      const chatInitResponse = {chatId: 'abc123'};

      APP.config.env = 'PROD';
      jest
        .spyOn(mockChatGateway, 'initChat')
        .mockResolvedValue(chatInitResponse);
      (getAccessToken as jest.Mock).mockResolvedValue('mockAccessToken');
      responseUtilMock.createSuccess.mockReturnValue({
        data: chatInitResponse,
      });

      const result = await chatService.initChat(payload);
      expect(result).toEqual({data: chatInitResponse});
    });

    it('should handle chat initialization failure', async () => {
      const payload: ChatInitRequest = {
        email: 'test@example.com',
        lob: 'testLOB',
        firstName: 'Test',
        lastName: 'User',
        phone: '123',
      };

      jest.spyOn(mockChatGateway, 'initChat').mockResolvedValue(null);
      (getAccessToken as jest.Mock).mockResolvedValue('mockAccessToken');
      responseUtilMock.createException.mockReturnValue({
        errors: [{message: Messages.chatInitError}],
        statusCode: 500,
      });

      const result = await chatService.initChat(payload);
      expect(result).toEqual({
        errors: [{message: Messages.chatInitError}],
        statusCode: 500,
      });
    });

    it('should handle exceptions during chat initialization', async () => {
      const payload: ChatInitRequest = {
        email: 'test@example.com',
        lob: 'testLOB',
        firstName: 'Test',
        lastName: 'User',
        phone: '123',
      };

      const error = new Error('Network Error');
      (getAccessToken as jest.Mock).mockResolvedValue('mockAccessToken');
      jest.spyOn(mockChatGateway, 'initChat').mockRejectedValue(error);
      responseUtilMock.createException.mockReturnValue({
        errors: [{message: 'Error initiating chat'}],
        statusCode: undefined,
      });

      const result = await chatService.initChat(payload);
      expect(result).toEqual({
        errors: [{message: 'Error initiating chat'}],
        statusCode: undefined,
      });
    });
  });

  describe('getClientResources', () => {
    it('should get chat resources successfully', async () => {
      const clientName = 'testClient';
      const userName = 'testUser';
      const secure = 'secureToken';
      const chatResources = {status: 'online'};

      jest
        .spyOn(mockChatGateway, 'getChatResources')
        .mockResolvedValue(chatResources);

      (getAccessToken as jest.Mock).mockResolvedValue('mockAccessToken');
      responseUtilMock.createSuccess.mockReturnValue({
        data: chatResources,
      });

      const result = await chatService.getChatResources(
        clientName,
        userName,
        secure,
      );
      expect(result).toEqual({data: chatResources});
    });

    it('should handle chat resources failure', async () => {
      const clientName = 'testClient';
      const userName = 'testUser';
      const secure = 'secureToken';

      jest.spyOn(mockChatGateway, 'getChatResources').mockResolvedValue(null);
      (getAccessToken as jest.Mock).mockResolvedValue('mockAccessToken');
      responseUtilMock.createException.mockReturnValue({
        errors: [{message: Messages.chatStatusError}],
        statusCode: 500,
      });

      const result = await chatService.getChatResources(
        clientName,
        userName,
        secure,
      );
      expect(result).toEqual({
        errors: [{message: Messages.chatStatusError}],
        statusCode: 500,
      });
    });

    it('should handle exceptions during chat resources retrieval', async () => {
      const clientName = 'testClient';
      const userName = 'testUser';
      const secure = 'secureToken';

      const error = new Error('Network Error');
      (getAccessToken as jest.Mock).mockResolvedValue('mockAccessToken');
      jest.spyOn(mockChatGateway, 'getChatResources').mockRejectedValue(error);
      responseUtilMock.createException.mockReturnValue({
        errors: [{message: Messages.chatStatusError}],
      });

      const result = await chatService.getChatResources(
        clientName,
        userName,
        secure,
      );
      expect(result).toEqual({
        errors: [{message: Messages.chatStatusError}],
      });
    });
  });
});
