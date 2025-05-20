import {
  Authorized,
  Body,
  CurrentUser,
  HeaderParam,
  JsonController,
  Post,
} from 'routing-controllers';
import {AllowedClients, Messages, ServiceConstants} from '../constants';
import {API_PATHS, TELEHEALTH_ROUTES} from '../routingConstants';
import {TelehealthService} from '../services/eap/telehealthService';
import {MemberOAuthPayload} from '../types/customRequest';
import {ClinicalQuestionsRequest} from '../types/telehealthModel';
import {validateMemberOAuthPayload} from '../utils/common';
import {OpenAPI} from 'routing-controllers-openapi';
import {TelehealthSpec} from '../apiDetails/Telehealth';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';

@JsonController(API_PATHS.secure + TELEHEALTH_ROUTES.telehealth)
export class TelehealthController {
  telehealthService = new TelehealthService();
  result = new ResponseUtil();
  private Logger = logger();
  private className = this.constructor.name;

  @OpenAPI(TelehealthSpec)
  @Post(TELEHEALTH_ROUTES.mdLiveAppointment)
  @Authorized(AllowedClients)
  async createMdLiveAppointment(
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @Body() clinicalQuestions: ClinicalQuestionsRequest,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      validateMemberOAuthPayload(payload);

      if (source === ServiceConstants.STRING_EAP) {
        return await this.telehealthService.createMdliveAppointmentService(
          payload,
          clinicalQuestions,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(
        `${this.className} - createMdLiveAppointment :: ${error}`,
      );
      return error;
    }
  }
}
