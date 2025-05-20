import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Put,
  QueryParam,
} from 'routing-controllers';
import {AllowedClients, DEFAULT_NOTIFICATION_SIZE} from '../constants';
import {NotificationActionReq} from '../models/Notification';
import {API_PATHS, SECURE_ROUTES} from '../routingConstants';
import {NotificationService} from '../services/eap/notificationService';
import {MemberOAuthPayload} from '../types/customRequest';
import {validateMemberOAuthPayload} from '../utils/common';
import {RESPONSE, ResponseUtil} from '../utils/responseUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {NotificationSpec} from '../apiDetails/Notification';
import logger from '../utils/logger';

@JsonController(API_PATHS.secure + SECURE_ROUTES.notifications)
export class NotificationController {
  result = new ResponseUtil();
  notificationService = new NotificationService();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Handle notification actions like viewed, read, clearAll
   * @param cookieToken string
   * @param user string
   * @returns results
   */
  @OpenAPI(NotificationSpec)
  @Put('')
  @Authorized(AllowedClients)
  async notification(
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
    @Body() payload: NotificationActionReq,
  ) {
    try {
      const response = await this.notificationService.notificationActions(
        memberOAuth,
        payload,
      );

      return response;
    } catch (error) {
      this.Logger.error(`${this.className} - notification :: ${error}`);
      return this.result.createException(error);
    }
  }

  /**
   * Get list of notifications for user
   * @param user User Data from token
   * @returns list of notifications for user
   */
  @OpenAPI({
    summary: 'Get list of notifications for user',
    description: 'Get list of notifications for user',
    responses: {...RESPONSE},
  })
  @Get('/')
  @Authorized(AllowedClients)
  async getNotifications(
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
    @QueryParam('size') size: number,
    @QueryParam('from') from: number,
  ) {
    try {
      validateMemberOAuthPayload(memberOAuth);

      if (size === undefined || size <= 0) {
        size = DEFAULT_NOTIFICATION_SIZE;
      }
      if (from === undefined || from < 0) {
        from = 0;
      }
      return await this.notificationService.getAllNotifications(
        memberOAuth,
        size,
        from,
      );
    } catch (error) {
      this.Logger.error(`${this.className} - getNotifications :: ${error}`);
      return this.result.createException(error);
    }
  }
}
