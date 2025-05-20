/* eslint-disable @typescript-eslint/no-explicit-any */
import {Messages, TemplateConstants, ServiceConstants} from '../../constants';
import {AssessmentsGateway} from '../../gateway/assessmentsGateway';
import {} from '../../models/Appointment';
import {
  AssessmentRequest,
  ClientAssessmentConfig,
} from '../../models/Assessments';
import {MemberOAuthPayload} from '../../types/customRequest';
import {ServiceResponse} from '../../types/eapMemberProfileModel';
import {APP} from '../../utils/app';
import {getAccessToken, replaceAll} from '../../utils/common';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {searchEAPClient} from './clientSearchService';

export class AssessmentsService {
  result = new ResponseUtil();
  assessmentsGateway = new AssessmentsGateway();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Generates an assessment URL for the member based on the provided payload and secure token.
   *
   * @param {MemberOAuthPayload} memberPayload - The payload containing member information.
   * @param {string} secureToken - The secure token for authentication.
   * @returns {Promise<ServiceResponse>} - A promise that resolves to a service response containing the assessment URL.
   */
  async generateAssessment(
    memberPayload: MemberOAuthPayload,
    surveyId: string,
    secureToken?: string,
  ): Promise<ServiceResponse> {
    try {
      const accessToken = await getAccessToken();
      const clientConfig = await this.fetchClientConfig();
      const clientUserName = memberPayload.clientName!;

      await this.handleClientConfigReplacements(
        clientConfig,
        clientUserName,
        surveyId,
      );

      if (memberPayload.iamguid && memberPayload.userName && secureToken) {
        // Signed-in assessments flow
        const surveyData = this.createSurveyData(memberPayload, clientConfig);
        return await this.handleCalibrateParticipantId(
          surveyData,
          secureToken,
          memberPayload.userName,
          accessToken,
          clientConfig,
        );
      } else {
        // Anonymous assessments flow
        return this.handleUserAssessmentConfig(clientConfig);
      }
    } catch (error: any) {
      this.Logger.error(`${this.className} - generateAssessment :: ${error}`);
      return this.result.createException(
        error,
        error.response?.status,
        Messages.generateAssessmentError,
      );
    }
  }

  /**
   * Handles client configuration replacements by fetching client demographics
   * and replacing placeholders in the client configuration with actual values.
   *
   * @param clientConfig - The client configuration object containing placeholders.
   * @param clientUserName - The username of the client.
   * @param surveyId - The survey ID to be used for replacements.
   * @returns The updated client configuration object with placeholders replaced.
   * @throws Will throw an error if client demographics cannot be fetched or are invalid.
   */
  private async handleClientConfigReplacements(
    clientConfig: any,
    clientUserName: string,
    surveyId: string,
  ): Promise<any> {
    // Fetch client demographics from client search service
    const clientDemographicsResponse = await searchEAPClient(
      ServiceConstants.STRING_BEACON,
      clientUserName,
    );
    const clientDemographics = clientDemographicsResponse.data as {
      clients: any[];
    };

    // Validate client demographics response
    if (!clientDemographicsResponse || !clientDemographics?.clients?.length) {
      throw clientDemographicsResponse;
    }

    // Extract client details
    const clientDetails = clientDemographics.clients[0];

    // Prepare replacements array with patterns and corresponding values
    const replacements = [
      {
        pattern: '{clientLogoFileName}',
        value: clientDetails.logoUrl?.split('/').pop(),
      },
      {pattern: '{surveyId}', value: surveyId},
      {pattern: '{clientUserName}', value: clientDetails.userName},
      {pattern: '{clientParentCode}', value: clientDetails.parentCode},
      {pattern: '{clientGroupName}', value: clientDetails.groupName},
      {pattern: '{clientGroupId}', value: clientDetails.groupId},
      {pattern: '{clientSupportPhone}', value: clientDetails.supportNumber},
      {pattern: '{clientName}', value: clientDetails.clientName},
    ];

    // Function to replace placeholders in a given field
    const replacePlaceholders = (field: any) =>
      JSON.parse(replaceAll(JSON.stringify(field), replacements));

    // Replace placeholders in client configuration fields
    clientConfig.assistantPhoneNumber = replacePlaceholders(
      clientConfig.assistantPhoneNumber,
    );
    clientConfig.bannerText = replacePlaceholders(clientConfig.bannerText);
    clientConfig.clientLogoFileName = replacePlaceholders(
      clientConfig.clientLogoFileName,
    );
    clientConfig.clientURI = replacePlaceholders(clientConfig.clientURI);
    clientConfig.surveyId = replacePlaceholders(clientConfig.surveyId);
    clientConfig.userAssessmentBasePath = replacePlaceholders(
      clientConfig.userAssessmentBasePath,
    );
    clientConfig.userAssessmentConfig = replacePlaceholders(
      clientConfig.userAssessmentConfig,
    );

    // Return the updated client configuration
    return clientConfig;
  }

  /**
   * Fetches the client assessment configuration.
   *
   * @param {string} clientName - The name of the client.
   * @returns {Promise<ClientAssessmentConfig>} - A promise that resolves to the client assessment configuration.
   */
  private async fetchClientConfig(): Promise<ClientAssessmentConfig> {
    return await this.assessmentsGateway.fetchClientAssessmentConfig();
  }

  /**
   * Creates the survey data required for generating the assessment.
   *
   * @param {MemberOAuthPayload} memberPayload - The payload containing member information.
   * @param {ClientAssessmentConfig} clientConfig - The client assessment configuration.
   * @returns {AssessmentRequest} - The survey data.
   */
  private createSurveyData(
    memberPayload: MemberOAuthPayload,
    clientConfig: ClientAssessmentConfig,
  ): AssessmentRequest {
    return {
      iamguid: memberPayload.iamguid!,
      surveyId: clientConfig.surveyId,
      calibrateHostName: clientConfig.calibrateHostName,
      clientURI: clientConfig.clientURI,
      domainName: clientConfig.domainName,
      clientLogoFileName: clientConfig.clientLogoFileName,
      parentLogoFileName: clientConfig.parentLogoFileName,
      favIconFileName: clientConfig.favIconFileName,
      assistantPhoneNumber: clientConfig.assistantPhoneNumber,
      bannerText: clientConfig.bannerText,
      programName: clientConfig.programName,
    };
  }

  /**
   * Handles the generation of the calibrate participant ID and returns the assessment URL.
   *
   * @param {AssessmentRequest} surveyData - The survey data.
   * @param {string} secureToken - The secure token for authentication.
   * @param {string} userName - The username of the member.
   * @param {string} accessToken - The access token for authorization.
   * @param {ClientAssessmentConfig} clientConfig - The client assessment configuration.
   * @returns {Promise<ServiceResponse>} - A promise that resolves to a service response containing the assessment URL.
   */
  private async handleCalibrateParticipantId(
    surveyData: AssessmentRequest,
    secureToken: string,
    userName: string,
    accessToken: string,
    clientConfig: ClientAssessmentConfig,
  ): Promise<ServiceResponse> {
    try {
      const calibrateParticipantIdResponse =
        await this.assessmentsGateway.generateCalibrateParticipantId(
          surveyData,
          secureToken,
          userName,
          accessToken,
        );

      if (
        calibrateParticipantIdResponse &&
        calibrateParticipantIdResponse.surveyParticipantId
      ) {
        const assessmentUrl = clientConfig.memberAssessmentBasePath.replace(
          TemplateConstants.SURVEY_PARTICIPANT_ID,
          calibrateParticipantIdResponse.surveyParticipantId,
        );
        return this.result.createSuccess({assessmentUrl});
      }
      throw new Error(Messages.generateCalibrateParticipantIdError);
    } catch (exception) {
      this.Logger.error(
        `${this.className} - handleCalibrateParticipantId :: ${exception}`,
      );
      throw exception;
    }
  }

  /**
   * Handles the user assessment configuration and returns the assessment URL.
   *
   * @param {ClientAssessmentConfig} clientConfig - The client assessment configuration.
   * @returns {ServiceResponse} - A service response containing the assessment URL.
   */
  private handleUserAssessmentConfig(
    clientConfig: ClientAssessmentConfig,
  ): ServiceResponse {
    const encodedClientConfig = Buffer.from(
      clientConfig.userAssessmentConfig,
    ).toString('base64');
    const assessmentUrl = clientConfig.userAssessmentBasePath.replace(
      TemplateConstants.ENCODED_CLIENT_ASSESSMENT_CONFIG,
      encodedClientConfig,
    );
    return this.result.createSuccess({assessmentUrl});
  }

  /**
   * Generates a survey link for the member based on the provided survey data, secure token, and username.
   *
   * @param {AssessmentRequest} surveyData - The survey data.
   * @param {string} secureToken - The secure token for authentication.
   * @param {string} username - The username of the member.
   * @returns {Promise<ServiceResponse>} - A promise that resolves to a service response containing the survey link.
   */
  async getSurveyLink(
    surveyData: AssessmentRequest,
    secureToken: string,
    username: string,
  ) {
    try {
      const accessToken = await getAccessToken();
      surveyData = {
        ...surveyData,
        domainName: APP.config.assessmentsSurvey.domainName,
        calibrateHostName: APP.config.assessmentsSurvey.calibrateHost,
      };
      const surveyAssessment =
        await this.assessmentsGateway.generateCalibrateParticipantId(
          surveyData,
          secureToken,
          username,
          accessToken,
        );

      if (surveyAssessment) {
        const surveyUrl = `${APP.config.assessmentsSurvey.link}/${surveyAssessment.surveyParticipantId}`;
        return this.result.createSuccess(surveyUrl);
      }
      return this.result.createException(Messages.generateAssessmentError);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getSurveyLink :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.generateAssessmentError,
      );
    }
  }
}
