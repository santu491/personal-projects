import {ChatController} from '../chatController';
import {ResponseUtil} from '../../utils/responseUtil';
import {StatusCodes} from 'http-status-codes';
import {Messages} from '../../constants';
import {ChatInitRequest} from '../../models/Chat';
import {mockChatService} from '../../utils/baseTest';
import {MemberOAuthPayload} from '../../types/customRequest';

jest.mock('../../services/eap/chatService', () => ({
  ChatService: jest.fn(() => mockChatService),
}));
jest.mock('../../utils/responseUtil');

describe('ChatController', () => {
  let chatController: ChatController;
  let responseUtil: jest.Mocked<ResponseUtil>;

  beforeEach(() => {
    responseUtil = new ResponseUtil() as jest.Mocked<ResponseUtil>;
    chatController = new ChatController();
    chatController.chatService.initChat = mockChatService.initChat;
    chatController.response = responseUtil;
  });

  describe('initateChat', () => {
    const payload: ChatInitRequest = {
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '778877223',
      lob: 'company-demo',
    };
    const secureToken = 'secureToken123';
    const user = {
      userName: 'testUser',
      installationId: 'installationId',
      sessionId: 'sessionId',
    } as MemberOAuthPayload;

    it('should return an exception if secureToken is not provided', async () => {
      const result = {
        message: Messages.secureTokenNotFoundError,
        statusCode: StatusCodes.BAD_REQUEST,
      };
      responseUtil.createException.mockReturnValue(result);

      const response = await chatController.initateChat(payload, '', user);

      expect(responseUtil.createException).toHaveBeenCalledWith(
        Messages.secureTokenNotFoundError,
        StatusCodes.BAD_REQUEST,
      );
      expect(response).toEqual(result);
    });

    it('should call initChat with correct parameters when secureToken is provided', async () => {
      const initChatResponse = {success: true};
      jest
        .spyOn(mockChatService, 'initChat')
        .mockResolvedValue(initChatResponse);

      const response = await chatController.initateChat(
        payload,
        secureToken,
        user,
      );
      expect(response).toEqual(initChatResponse);
    });

    it('should call initChat without secureToken when user does not have a userName', async () => {
      const initChatResponse = {success: true};
      jest
        .spyOn(mockChatService, 'initChat')
        .mockResolvedValue(initChatResponse);
      const userWithoutUserName = {} as MemberOAuthPayload;

      const response = await chatController.initateChat(
        payload,
        secureToken,
        userWithoutUserName,
      );

      expect(response).toEqual(initChatResponse);
    });
  });

  describe('checkAvailability', () => {
    const clientName = 'testClient';
    const secureToken = 'secureToken';
    const user = {userName: 'testUser'} as MemberOAuthPayload;

    it('should return an exception if secureToken is not provided', async () => {
      const result = {
        message: Messages.secureTokenNotFoundError,
        statusCode: StatusCodes.BAD_REQUEST,
      };
      responseUtil.createException.mockReturnValue(result);

      const response = await chatController.checkAvailability(
        clientName,
        '',
        user,
      );
      expect(response).toEqual(result);
    });

    it('should call getChatResources with correct parameters when secureToken is provided', async () => {
      const getClientResourcesResponse = {success: true};
      jest
        .spyOn(mockChatService, 'getChatResources')
        .mockResolvedValue(getClientResourcesResponse);

      const response = await chatController.checkAvailability(
        clientName,
        secureToken,
        user,
      );
      expect(response).toEqual(getClientResourcesResponse);
    });

    it('should call getChatResources without secureToken when user does not have a userName', async () => {
      const getClientResourcesResponse = {success: true};
      jest
        .spyOn(mockChatService, 'getChatResources')
        .mockResolvedValue(getClientResourcesResponse);
      const userWithoutUserName = {} as MemberOAuthPayload;

      const response = await chatController.checkAvailability(
        clientName,
        secureToken,
        userWithoutUserName,
      );

      expect(response).toEqual(getClientResourcesResponse);
    });

    it('should return an error when getChatResources throws an error', async () => {
      const error = new Error('Error occurred');
      jest.spyOn(mockChatService, 'getChatResources').mockRejectedValue(error);

      const response = await chatController.checkAvailability(
        clientName,
        secureToken,
        user,
      );

      expect(response).toEqual(error);
    });
  });
});
