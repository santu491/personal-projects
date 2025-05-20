import {
  CHAT_GC_ROUTES,
  chatDefaultPayload,
  DEMO_CLIENT,
  Messages,
  PROD_ENV,
} from '../../constants';
import {ChatGateway} from '../../gateway/chatGateway';
import {
  ChatInitPayload,
  ChatInitRequest,
  UserBaseData,
} from '../../models/Chat';
import {APP} from '../../utils/app';
import {getAccessToken} from '../../utils/common';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {AuditHelper} from '../helpers/auditHelper';

export class ChatService {
  private Logger = logger();
  private className = this.constructor.name;
  response = new ResponseUtil();
  chatGateway = new ChatGateway();
  auditHelper = new AuditHelper();

  async initChat(
    payload: ChatInitRequest,
    userData: UserBaseData | null = null,
  ) {
    try {
      const request: ChatInitPayload = {
        ...payload,
        Email: payload.email,
        websiteorgin: `${APP.config.clientConfiguration.eap.consumerHost}/${payload.lob}`,
        ...chatDefaultPayload,
        gc_route: this.getGCRouteValue(payload.lob),
      };
      const chatInit = await this.chatGateway.initChat(
        request,
        await getAccessToken(),
        userData,
      );

      if (!chatInit)
        return this.response.createException(Messages.chatInitError, 500);

      return this.response.createSuccess(chatInit);
    } catch (error: any) {
      return this.response.createException(
        error,
        error?.response?.status,
        'Error initiating chat',
      );
    }
  }

  public async getChatResources(
    clientName: string,
    userName?: string,
    secureToken?: string,
  ) {
    try {
      const clientStatus = await this.chatGateway.getChatResources(
        clientName,
        await getAccessToken(),
        userName,
        secureToken,
      );
      if (!clientStatus)
        return this.response.createException(Messages.chatStatusError, 500);

      return this.response.createSuccess(clientStatus);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getClientResources : ${error}`);
      return this.response.createException(
        error,
        error?.response?.status,
        Messages.chatStatusError,
      );
    }
  }

  private getGCRouteValue(lob: string) {
    if (PROD_ENV.includes(APP.config.env.toUpperCase())) {
      return lob === DEMO_CLIENT ? CHAT_GC_ROUTES.TEST : CHAT_GC_ROUTES.PROD;
    }
    return CHAT_GC_ROUTES.TEST;
  }
}
