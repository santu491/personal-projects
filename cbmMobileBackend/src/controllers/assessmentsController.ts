import {
  Authorized,
  Body,
  CookieParam,
  CurrentUser,
  Get,
  HeaderParam,
  JsonController,
  Post,
} from 'routing-controllers';
import {
  APIResponseCodes,
  AllowedClients,
  Messages,
  ServiceConstants,
} from '../constants';
import {AssessmentRequest} from '../models/Assessments';
import {
  API_PATHS,
  APPOINTMENT_ROUTES,
  ASSESSMENT_ROUTES,
} from '../routingConstants';
import {AssessmentsService} from '../services/eap/assessmentsService';
import {MemberOAuthPayload} from '../types/customRequest';
import {ServiceResponse} from '../types/eapMemberProfileModel';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {
  CreateAssessmentSpec,
  GetMemberSurveySpec,
} from '../apiDetails/Assesments';

/**
 * Controller for handling assessment-related operations.
 *
 * This controller provides endpoints for creating and managing assessments.
 * It includes methods for generating assessment URLs, validating request parameters,
 * and interacting with the assessments service to fetch client configurations and handle
 * survey data.
 *
 * The controller uses dependency injection to access the assessments service and other
 * required utilities. It also includes error handling to ensure that any exceptions
 * are caught and appropriate error messages are returned.
 *
 * @class AssessmentsController
 */
@JsonController(API_PATHS.secure + ASSESSMENT_ROUTES.assessments)
export class AssessmentsController {
  result = new ResponseUtil();
  assessmentsService = new AssessmentsService();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Handles the creation of an assessment.
   *
   * @param {string} secureToken - The secure token for authentication.
   * @param {string} clientName - The name of the client.
   * @param {MemberOAuthPayload} payload - The payload containing member information.
   * @returns {Promise<ServiceResponse>} - A promise that resolves to a service response containing the assessment URL.
   */
  @OpenAPI(CreateAssessmentSpec)
  @Get()
  @Authorized(AllowedClients)
  async createAssessment(
    @HeaderParam('source', {required: true}) source: string,
    @CookieParam('secureToken') secureToken: string,
    @HeaderParam('clientName') clientName: string,
    @HeaderParam('surveyId') surveyId: string,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
  ): Promise<ServiceResponse | unknown> {
    try {
      this.validateRequest(payload, clientName, surveyId, secureToken);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.assessmentsService.generateAssessment(
          {...payload, clientName},
          surveyId,
          secureToken,
        );
      }
      return this.result.createException(
        Messages.invalidSource,
        APIResponseCodes.BAD_REQUEST,
      );
    } catch (error) {
      this.Logger.error(`${this.className} - createAssessment :: ${error}`);
      return error;
    }
  }

  /**
   * Validates the request parameters.
   *
   * @param {MemberOAuthPayload} payload - The payload containing member information.
   * @param {string} clientName - The name of the client.
   * @param {string} secureToken - The secure token for authentication.
   * @throws {Error} - Throws an error if validation fails.
   */
  private validateRequest(
    payload: MemberOAuthPayload,
    clientName: string,
    surveyId: string,
    secureToken: string,
  ): void {
    if (!clientName) {
      throw this.result.createException(
        Messages.clientNameNotFoundError,
        APIResponseCodes.BAD_REQUEST,
      );
    }
    if (!surveyId) {
      throw this.result.createException(
        Messages.surveyIdNotFoundError,
        APIResponseCodes.BAD_REQUEST,
      );
    }
    if (payload.iamguid && !secureToken) {
      throw this.result.createException(
        Messages.secureTokenNotFoundError,
        APIResponseCodes.BAD_REQUEST,
      );
    }
  }

  @OpenAPI(GetMemberSurveySpec)
  @Post(APPOINTMENT_ROUTES.survey)
  @Authorized(AllowedClients)
  async getMemberSurvey(
    @Body() surveyData: AssessmentRequest,
    @CookieParam('secureToken') cookieToken: string,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
    @HeaderParam('source', {required: true})
    source: string = ServiceConstants.STRING_EAP,
  ) {
    try {
      if (!memberOAuth.userName) {
        return this.result.createException(
          Messages.invalidAuthError,
          APIResponseCodes.BAD_REQUEST,
        );
      }

      if (source === ServiceConstants.STRING_EAP) {
        return await this.assessmentsService.getSurveyLink(
          surveyData,
          cookieToken,
          memberOAuth.userName,
        );
      }
      return this.result.createException(
        Messages.invalidSource,
        APIResponseCodes.BAD_REQUEST,
      );
    } catch (error) {
      this.Logger.error(`${this.className} - getMemberSurvey :: ${error}`);
      return error;
    }
  }
}
