import {Body, CurrentUser, JsonController, Post} from 'routing-controllers';
import {Messages} from '../constants';
import {API_PATHS, SECURE_ROUTES} from '../routingConstants';
import {InstallationService} from '../services/eap/installationService';
import {MemberOAuthPayload} from '../types/customRequest';
import {
  InstallationDeleteRequest,
  InstallationRequest,
} from '../types/installationRequest';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {
  DeleteInstallationSpec,
  SaveInstallationSpec,
} from '../apiDetails/Installation';

@JsonController(API_PATHS.secure)
export class InstallationController {
  private responseUtil = new ResponseUtil();
  private installationService = new InstallationService();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Create a new installation details for user
   * @route POST /installations
   * @access Secure
   * @param DeviceDetails - device details of the user
   * @returns back success/failure
   */
  @OpenAPI(SaveInstallationSpec)
  @Post(SECURE_ROUTES.installations)
  async saveInstallation(
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
    @Body() payload: InstallationRequest,
  ) {
    try {
      if (memberOAuth.iamguid && memberOAuth.clientName) {
        const response = await this.installationService.saveInstallation(
          payload,
          memberOAuth.iamguid,
          memberOAuth.clientName,
        );
        return response;
      }
      return this.responseUtil.createException(Messages.userNotFound);
    } catch (error) {
      this.Logger.error(`${this.className} - saveInstallation :: ${error}`);
      return this.responseUtil.createException(error);
    }
  }

  /**
   * Delete a device installation for a user.
   * @route POST /installations/delete
   * @access Secure
   * @returns back all installation data
   */
  @OpenAPI(DeleteInstallationSpec)
  @Post(SECURE_ROUTES.installationsDelete)
  async deleteInstallationDevice(
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
    @Body() payload: InstallationDeleteRequest,
  ) {
    try {
      if (memberOAuth.iamguid && memberOAuth.clientName) {
        const response = await this.installationService.deleteInstallation(
          payload.deviceToken,
          memberOAuth.iamguid,
          memberOAuth.clientName,
        );
        return response;
      }
    } catch (error) {
      this.Logger.error(
        `${this.className} - deleteInstallationDevice :: ${error}`,
      );
      return error;
    }
  }
}
