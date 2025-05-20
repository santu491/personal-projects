import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  QueryParam,
} from 'routing-controllers';
import {
  AllowedClients,
  Messages,
  APIResponseCodes,
  ServiceConstants,
} from '../constants';
import {ClientArticlesRequest, ClientCardsRequest} from '../models/AppConfig';
import {
  API_PATHS,
  CLIENT_RESOURCES_ROUTES as CLIENT_CONFIG_ROUTES,
} from '../routingConstants';
import {ClientConfigurationService} from '../services/eap/clientConfigurationService';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {MemberOAuthPayload} from '../types/customRequest';

@JsonController(API_PATHS.clientConfiguration)
export class ClientConfigurationController {
  clientConfigurationService = new ClientConfigurationService();
  response = new ResponseUtil();
  result = new ResponseUtil();
  Logger = logger();
  className = this.constructor.name;

  @Get(CLIENT_CONFIG_ROUTES.clientResources)
  @Authorized(AllowedClients)
  async fetchClientResources(
    @Param('clientUri') clientUri: string,
    @QueryParam('item') item: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      clientUri = clientUri.trim();
      if (!clientUri) {
        throw this.response.createException(
          Messages.clientUserNameNotFoundError,
          APIResponseCodes.BAD_REQUEST,
        );
      }
      if (source === ServiceConstants.STRING_EAP) {
        return await this.clientConfigurationService.getClientResources(
          clientUri.toLowerCase(),
          item,
        );
      }
      return this.result.createException(
        Messages.invalidSource,
        APIResponseCodes.BAD_REQUEST,
      );
    } catch (error) {
      this.Logger.error(`${this.className} - getClientResources :: ${error}`);
      return error;
    }
  }

  @Post(CLIENT_CONFIG_ROUTES.clientArticles)
  @Authorized(AllowedClients)
  async fetchClientArticles(
    @Body() request: ClientArticlesRequest,
    @QueryParam('item') item: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.clientConfigurationService.getClientArticles(
          request,
          item,
        );
      }
      return this.result.createException(
        Messages.invalidSource,
        APIResponseCodes.BAD_REQUEST,
      );
    } catch (error) {
      this.Logger.error(`${this.className} - getClientArticles :: ${error}`);
      return error;
    }
  }

  @Post(CLIENT_CONFIG_ROUTES.clientCards)
  @Authorized(AllowedClients)
  async fetchClientCards(
    @Body() request: ClientCardsRequest,
    @QueryParam('item') item: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.clientConfigurationService.getClientCards(
          request,
          item,
        );
      }
      return this.result.createException(
        Messages.invalidSource,
        APIResponseCodes.BAD_REQUEST,
      );
    } catch (error) {
      this.Logger.error(`${this.className} - getClientCards :: ${error}`);
      return error;
    }
  }
}
