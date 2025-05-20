import {Body, CurrentUser, JsonController, Put} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {ResetBadCountSpec} from '../apiDetails/Users';
import {API_PATHS, SECURE_ROUTES} from '../routingConstants';
import {UserService} from '../services/eap/userService';
import {MemberOAuthPayload} from '../types/customRequest';
import {InstallationTokenModel} from '../types/userRequest';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';

@JsonController(API_PATHS.secure)
export class UserController {
  result = new ResponseUtil();
  private Logger = logger();
  private className = this.constructor.name;
  service = new UserService();

  /**
   * This API will handle the PN badge count reset
   * @param model
   * @returns
   */
  @OpenAPI(ResetBadCountSpec)
  @Put(SECURE_ROUTES.userResetBadge)
  public async resetBadgeCount(
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
    @Body() model: InstallationTokenModel,
  ) {
    try {
      const response = await this.service.badgeReset(model, memberOAuth);
      return response;
    } catch (error) {
      this.Logger.error(`${this.className} - resetBadgeCount :: ${error}`);
      this.result.createException(error);
    }
  }
}
