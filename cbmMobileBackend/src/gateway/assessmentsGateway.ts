import {
  APIResponseCodes,
  DB_TABLE_NAMES,
  DynamoDbConstants,
  HeaderKeys,
  ServiceConstants,
  TemplateConstants,
} from '../constants';
import {
  AssessmentRequest,
  CalibrateParticipantIdResponse,
  ClientAssessmentConfig,
} from '../models/Assessments';
import {APP} from '../utils/app';
import {axiosPost} from '../utils/httpUtil';
import {DynamoDBGateway} from './dynamoDBGateway';

export class AssessmentsGateway {
  private host = APP.config.memberAuth.eap.host;
  private securePath = APP.config.memberAuth.eap.basePath.secure;
  private dynamoDBGateway: DynamoDBGateway = new DynamoDBGateway();

  // Function to return a link for assessments
  /**
   * Generates a Calibrate Participant ID by making a POST request to the Calibrate API.
   *
   * @param {AssessmentRequest} surveyRequest - The survey request data.
   * @param {string} secureToken - The secure token for authentication.
   * @param {string} username - The username of the participant.
   * @param {string} accessToken - The access token for authorization.
   * @returns {Promise<any | null>} - The response data if the request is successful, otherwise null.
   */
  async generateCalibrateParticipantId(
    surveyRequest: AssessmentRequest,
    secureToken: string,
    username: string,
    accessToken: string,
  ): Promise<CalibrateParticipantIdResponse> {
    // Construct the URL for the Calibrate API endpoint
    const url = `${this.host}${this.securePath}${APP.config.memberAuth.eap.assessments.calibrate}`;

    // Set up the headers for the request
    const headers = {
      [HeaderKeys.SMUNIVERSALID]: username,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
    };

    // Make the POST request to the Calibrate API
    const response = await axiosPost(url, surveyRequest, headers);

    // Check if the response status is successful
    if (
      response &&
      response.status === APIResponseCodes.SUCCESS &&
      typeof response.data === 'object'
    ) {
      // Return the response data if successful
      return response.data;
    }
    throw response;
  }

  /**
   * Fetches the client assessment configuration from the DynamoDB.
   *
   * @param {string} clientName - The name of the client for which the assessment configuration is to be fetched.
   * @returns {Promise<unknown>} - A promise that resolves to the assessment configuration if successful, otherwise throws an error.
   * @throws {Error} - Throws an error if the fetch operation fails.
   */
  async fetchClientAssessmentConfig(): Promise<ClientAssessmentConfig> {
    // Construct the query object for DynamoDB
    const query = {
      [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.CONTENT,
      [DynamoDbConstants.KEY]: {
        // Replace the placeholder in CONTENTID_ASSESSMENT with the actual client name
        contentKey: `${TemplateConstants.CONTENT_ID_ASSESSMENTS}`,
        language: `${ServiceConstants.LANGUAGE_EN_US}`,
      },
    };

    // Fetch the records from DynamoDB using the constructed query
    const assessmentContent = await this.dynamoDBGateway.getRecords(query);

    // Check if the fetch operation was successful
    if (assessmentContent?.data?.isSuccess) {
      // Return the fetched assessment configuration
      return assessmentContent.data?.value?.content as ClientAssessmentConfig;
    }

    // Throw an error if the fetch operation was not successful
    throw assessmentContent;
  }
}
