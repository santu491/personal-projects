import {
  Authorized,
  Body,
  CookieParam,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
} from 'routing-controllers';
import {CHAT_ROUTES} from '../routingConstants';
import {AllowedClients, Messages} from '../constants';
import {MemberOAuthPayload} from '../types/customRequest';
import {ChatInitRequest} from '../models/Chat';
import {ResponseUtil} from '../utils/responseUtil';
import {StatusCodes} from 'http-status-codes';
import {ChatService} from '../services/eap/chatService';
import logger from '../utils/logger';
import {OpenAPI} from 'routing-controllers-openapi';
import {ChatInit} from '../apiDetails/Chat';

@JsonController(CHAT_ROUTES.chat)
export class ChatController {
  response = new ResponseUtil();
  chatService = new ChatService();
  Logger = logger();
  className = this.constructor.name;

  @OpenAPI(ChatInit)
  @Post(CHAT_ROUTES.initSession)
  @Authorized(AllowedClients)
  async initateChat(
    @Body() payload: ChatInitRequest,
    @CookieParam('secureToken') secureToken: string,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    if (memberOAuth.userName) {
      if (!secureToken) {
        return this.response.createException(
          Messages.secureTokenNotFoundError,
          StatusCodes.BAD_REQUEST,
        );
      }
      return await this.chatService.initChat(payload, {
        username: memberOAuth.userName,
        secureToken,
      });
    }
    return await this.chatService.initChat(payload);
  }

  @Get(CHAT_ROUTES.availability)
  async checkAvailability(
    @QueryParam('clientUserName', {required: true}) clientName: string,
    @CookieParam('secureToken', {required: false}) secureToken?: string,
    @CurrentUser({required: false}) user?: MemberOAuthPayload,
  ) {
    try {
      if (user?.userName) {
        if (!secureToken) {
          return this.response.createException(
            Messages.secureTokenNotFoundError,
            StatusCodes.BAD_REQUEST,
          );
        }
      }
      return await this.chatService.getChatResources(
        clientName,
        user?.userName,
        secureToken,
      );
    } catch (error) {
      this.Logger.error(`${this.className} - getClientResources :: ${error}`);
      return error;
    }
  }
}
