import {
  Authorized,
  Body,
  CookieParam,
  CurrentUser,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
} from 'routing-controllers';
import {AllowedClients, Messages, ServiceConstants} from '../constants';
import {
  AppointmentRequest,
  UpdateAppointmentRequest,
} from '../models/Appointment';
import {API_PATHS, APPOINTMENT_ROUTES} from '../routingConstants';
import {AppointmentService} from '../services/eap/appointmentService';
import {MemberOAuthPayload} from '../types/customRequest';
import {validateMemberOAuthPayload} from '../utils/common';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {ValidationUtil} from '../utils/validationUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {
  CreateAppointmentSpec,
  FetchAppointmentSpec,
  GetAppointmentSpec,
  GetAssessmentRequired,
  GetMemberStatus,
  GetMemeberDashboardData,
  UpdateAppointmentSpec,
} from '../apiDetails/Appointment';

// Controller for handling member authentication related requests
@JsonController(API_PATHS.secure + APPOINTMENT_ROUTES.appointment)
export class AppointmentController {
  result = new ResponseUtil();
  validate = new ValidationUtil();
  appointmentService = new AppointmentService();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Create an appointment for a user
   * @returns Appointment created success object
   */
  @OpenAPI(CreateAppointmentSpec)
  @Post('/')
  @Authorized(AllowedClients)
  async createAppointment(
    @Body() appointmentData: AppointmentRequest,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @CookieParam('secureToken', {required: true}) cookieToken: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (!payload.userName) {
        return this.result.createException(Messages.invalidAuthError);
      }
      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.createAppointment(
          appointmentData,
          payload,
          cookieToken,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - createAppointment :: ${error}`);
      return this.result.createException(error);
    }
  }

  @OpenAPI(GetAssessmentRequired)
  @Get(APPOINTMENT_ROUTES.assessmentRequired)
  async getAssessmentRequired(
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      validateMemberOAuthPayload(payload);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.getAssessmentRequired(
          payload.iamguid!,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(
        `${this.className} - getAssessmentRequired :: ${error}`,
      );
      return error;
    }
  }

  @OpenAPI(GetAppointmentSpec)
  @Get(APPOINTMENT_ROUTES.status)
  @Authorized(AllowedClients)
  async getAppointmentStatus(
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @CookieParam('secureToken', {required: true}) cookieToken: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (!payload.userName) {
        return this.result.createException(Messages.invalidAuthError);
      }

      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.getAppointmentStatus(
          payload.userName,
          cookieToken,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - getAppointmentStatus :: ${error}`);
      return this.result.createException(error);
    }
  }

  @Get(APPOINTMENT_ROUTES.questions)
  async getQuestions(
    @QueryParam('employerType', {required: true}) employerType: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (this.validate.isNullOrEmpty(employerType)) {
        return this.result.createException(Messages.invalidRequest);
      }
      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.getQuestions(employerType);
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - getQuestions :: ${error}`);
      return this.result.createException(error);
    }
  }

  @OpenAPI(GetMemberStatus)
  @Get(APPOINTMENT_ROUTES.memberStatus)
  @Authorized(AllowedClients)
  public async getMemberStatus(
    @CookieParam('secureToken') cookieToken: string,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      validateMemberOAuthPayload(payload);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.getMemberStatus(
          payload.userName!,
          payload.iamguid!,
          cookieToken,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - getMemberStatus :: ${error}`);
      return error;
    }
  }

  @OpenAPI(GetMemeberDashboardData)
  @Get(APPOINTMENT_ROUTES.memberDashboard)
  @Authorized(AllowedClients)
  async getMemberDashboardData(
    @QueryParam('status', {required: true}) status: string,
    @CookieParam('secureToken') cookieToken: string,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      validateMemberOAuthPayload(payload);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.getMemberDashboardData(
          payload.userName!,
          payload.iamguid!,
          status,
          cookieToken,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(
        `${this.className} - getMemberDashboardData :: ${error}`,
      );
      return error;
    }
  }

  @OpenAPI(FetchAppointmentSpec)
  @Get(APPOINTMENT_ROUTES.appointmentDetails)
  @Authorized(AllowedClients)
  async getAppointmentDetails(
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @CookieParam('secureToken', {required: true}) cookieToken: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (!payload.userName) {
        return this.result.createException(Messages.invalidAuthError);
      }

      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.getAppointmentDetails(
          payload.userName,
          cookieToken,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - getAppointmentStatus :: ${error}`);
      return this.result.createException(error);
    }
  }

  @OpenAPI(FetchAppointmentSpec)
  @Get('/:id')
  @Authorized(AllowedClients)
  async fetchAppointment(
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @CookieParam('secureToken', {required: true}) cookieToken: string,
    @Param('id') appointmentId: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (!payload.userName) {
        return this.result.createException(Messages.invalidAuthError);
      }

      if (!this.validate.isHexId(appointmentId)) {
        return this.result.createException(Messages.invalidRequest);
      }
      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.fetchAppointment(
          payload.userName,
          cookieToken,
          appointmentId,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - fetchAppointment :: ${error}`);
      return this.result.createException(error);
    }
  }

  @OpenAPI(UpdateAppointmentSpec)
  @Put('/')
  @Authorized(AllowedClients)
  async updateAppointment(
    @Body() appointmentData: UpdateAppointmentRequest,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @CookieParam('secureToken', {required: true}) cookieToken: string,
    @HeaderParam('source') source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (!payload.userName) {
        return this.result.createException(Messages.invalidAuthError);
      }

      if (
        this.validate.isNullOrEmpty(appointmentData.id) ||
        !this.validate.isHexId(appointmentData.id)
      ) {
        return this.result.createException(Messages.invalidRequest);
      }
      if (source === ServiceConstants.STRING_EAP) {
        return await this.appointmentService.updateAppointment(
          payload.userName,
          cookieToken,
          appointmentData,
        );
      }
      return this.result.createException(Messages.invalidSource);
    } catch (error) {
      this.Logger.error(`${this.className} - updateAppointment :: ${error}`);
      return this.result.createException(error);
    }
  }
}
