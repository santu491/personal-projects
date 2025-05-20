import {AxiosError} from 'axios';
import {
  APIResponseCodes,
  APIResponseConstants,
  AuditTypes,
  DB_TABLE_NAMES,
  DynamoDbConstants,
  HeaderKeys,
  ReplaceStringKeyWords,
  ServiceConstants,
} from '../constants';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  ChangePasswordRequest,
  CreateUserRequest,
  ForgotUserNameOrPasswordRequest,
  MemberPreferences,
  SendOtpRequest,
  UpdateUserRequest,
  ValidateOtpRequest,
} from '../types/eapMemberProfileModel';
import {APP} from '../utils/app';
import {axiosGet, axiosPost} from '../utils/httpUtil';
import {DynamoDBGateway} from './dynamoDBGateway';

export class EAPMemberProfileGateway {
  private host = APP.config.memberAuth.eap.host;
  private publicBasePath = APP.config.memberAuth.eap.basePath.public;
  private secureBasePath = APP.config.memberAuth.eap.basePath.secure;
  dynamoDBGateway: DynamoDBGateway = new DynamoDBGateway();

  // Function to get the EAP access token
  async getEAPAccessToken() {
    try {
      const url = `${this.host}${APP.config.memberAuth.eap.accessToken.url}`;
      // Construct the data to be sent in the request body
      const data = new URLSearchParams({
        scope: APP.config.memberAuth.eap.accessToken.scope,
        grant_type: APP.config.memberAuth.eap.accessToken.grantType,
      }).toString();

      const headers = {
        [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
        [HeaderKeys.AUTHORIZATION]:
          APP.config.memberAuth.eap.accessToken.authorization,
        [HeaderKeys.CONTENT_TYPE]:
          APP.config.memberAuth.eap.accessToken.contentType,
      };

      const response = await axiosPost(url, data, headers);
      // If the response status is SUCCESS, return the access token
      if (response.status === APIResponseCodes.SUCCESS) {
        return response.data.access_token;
      }
      // If the response status is not SUCCESS, return null
      return null;
    } catch (error) {
      // If an error occurs, log the error and return null
      return null;
    }
  }

  /**
   * Looks up a user in the database.
   *
   * @param {string} username - The username of the user to look up.
   * @returns {Promise<User>} A promise that resolves to the User object if found, or null if not found.
   * @throws {Error} If there is an error during the database operation.
   */
  async userLookup(userName: string, accessToken: string) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.userLookup}`;

    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };

    const response = await axiosPost(url, {username: userName}, headers);

    return response.data;
  }

  /**
   * Registers a new member in the system.
   *
   * @param {CreateUserRequest} registerRequest - The request object containing the details of the user to be registered.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves to the response data from the registration API.
   * @throws {Error} If there is an error during the registration process.
   */
  async postMemberRegistration(
    registerRequest: CreateUserRequest,
    accessToken: string,
  ) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.registerMember.replace(ReplaceStringKeyWords.client, registerRequest.employerType.toLocaleLowerCase())}`;
    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.APPSOURCE]: ServiceConstants.CBHM_APPLICATION_NAME,
    };

    const response = await axiosPost(url, registerRequest, headers);

    return response.data;
  }

  /**
   * Disable the member account by updating the account status to 'deleted'.
   *
   * @param {string} iamguid - The IAM GUID of the member.
   * @returns {Promise<EapUser | null>} - The updated member document or null if the member is not found.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  async setMemberAccountStatus(
    iamguid: string,
    clientName: string,
    status: string,
  ) {
    // Find the user by iamguid and update the status field to 'deleted'
    const updateStatusQuery = {
      [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
      [DynamoDbConstants.KEY]: {
        iamguid,
        clientName,
      },
      [DynamoDbConstants.UPDATE_EXPRESSION]: `${DynamoDbConstants.SET} #status = :statusValue`,
      [DynamoDbConstants.EXPRESSION_ATTRBUTE_NAMES]: {
        '#status': 'status',
      },
      [DynamoDbConstants.EXPRESSION_ATTRIBUTE_VALUES]: {
        ':statusValue': status,
      },
      [DynamoDbConstants.RETURN_VALUES]: DynamoDbConstants.UPDATED_NEW,
    };

    const response = await this.dynamoDBGateway.updateRecord(updateStatusQuery);

    if (response?.data?.isSuccess) {
      return response.data.value;
    }
    return null;
  }

  /**
   * Retrieves the account status for a user identified by iamguid.
   * If the user does not exist or does not have a status, it returns null.
   *
   * @param {string} iamguid - The IAM GUID of the user.
   * @param {string} clientName - The client name of the user.
   */
  async getMemberDbData(iamguid: string, clientName: string) {
    try {
      // Find the user by iamguid and return only the 'status' field
      const query = {
        [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
        [DynamoDbConstants.KEY]: {
          iamguid,
          clientName,
        },
      };
      const memberInfo = await this.dynamoDBGateway.getRecords(query);

      if (memberInfo?.data?.isSuccess) {
        return memberInfo.data?.value;
      }

      return null;
    } catch (exception) {
      // Rethrow the caught exception
      if (
        exception instanceof AxiosError &&
        exception.response?.status === APIResponseCodes.BAD_REQUEST
      ) {
        return null;
      }
      throw exception;
    }
  }

  /**
   * Authenticates a member with the EAP service.
   * @param authenticationRequest The request object containing authentication details.
   * @param accessToken The access token for authentication.
   * @returns A promise that resolves to the authentication result or null in case of failure.
   */
  async authenticateMember(
    authenticationRequest: AuthenticationRequest,
    accessToken: string,
    deviceCookie: string = '',
  ): Promise<AuthenticationResponse> {
    // Construct the URL for the member authentication endpoint.
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.loginMember}`;

    // Prepare the headers for the authentication request.
    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.COOKIE]: deviceCookie,
    };

    // Perform the POST request to authenticate the member.
    const response = await axiosPost(url, authenticationRequest, headers);

    // Check if the response status indicates success and return the data, otherwise return null.
    return response.data;
  }

  /**
   * Handles the process when a member forgets their username.
   * This could involve sending an email to the member with their username, or providing a way for them to retrieve it.
   *
   * @param {ForgotUserNameOrPasswordRequest} forgotUserNameRequest - The email address of the member who forgot their username.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves when the process has been successfully handled.
   * @throws {Error} If there is an error during the process.
   */
  async forgotUserName(
    forgotUserNameRequest: ForgotUserNameOrPasswordRequest,
    accessToken: string,
  ) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.forgotUserName}`;
    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
    };

    const response = await axiosPost(url, forgotUserNameRequest, headers);

    if (
      response.status === APIResponseCodes.SUCCESS &&
      Object.keys(response.data).length !== 0
    ) {
      return response.data;
    }
    throw response;
  }

  /**
   * Validates the details of a member. This method is typically used in processes like password recovery,
   * where validating the member's details is a necessary step.
   *
   * @param {ForgotUserNameOrPasswordRequest} forgotPasswordRequest - The request object containing the details of the member to be validated.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves when the member's details have been successfully validated.
   * @throws {Error} If there is an error during the validation process.
   */
  async validateMemberDetails(
    forgotPasswordRequest: ForgotUserNameOrPasswordRequest,
    accessToken: string,
  ) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.checkDetails}`;
    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
    };

    const response = await axiosPost(url, forgotPasswordRequest, headers);

    if (
      response.status === APIResponseCodes.SUCCESS &&
      Object.keys(response.data).length !== 0
    ) {
      return response.data;
    }

    throw response;
  }

  /**
   * Changes the password of a member in the EAP system.
   *
   * @param {ChangePasswordRequest} changePasswordRequest - The request object containing the details of the password change.
   * @param {string} accessToken - The access token for the API.
   * @param {string} cookie - The cookie for the session.
   * @returns {Promise} A promise that resolves when the member's password has been successfully changed.
   * @throws {Error} If there is an error during the password change process.
   */
  async postEAPMemberChangePassword(
    changePasswordRequest: ChangePasswordRequest,
    accessToken: string,
    cookie: string,
  ) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.changeSecret}`;
    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.COOKIE]: cookie,
    };

    const response = await axiosPost(url, changePasswordRequest, headers);

    if (
      response.status === APIResponseCodes.SUCCESS &&
      response?.data?.status?.toUpperCase() === APIResponseConstants.success
    ) {
      return response.data;
    }
    throw response;
  }

  /**
   * Sends a OTP to a member. This method is typically used in processes like two-factor authentication or password recovery.
   *
   * @param {SendOtpRequest} sendOtpRequest - The request object containing the details of the OTP to be sent.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves when the OTP has been successfully sent.
   * @throws {Error} If there is an error during the OTP sending process.
   */
  async sendOtp(sendOtpRequest: SendOtpRequest, accessToken: string) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.sendOtp}`;
    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };

    const response = await axiosPost(url, sendOtpRequest, headers);
    return response.data;
  }

  /**
   * Validates the OTP sent to a member. This method is typically used in processes like two-factor authentication or password recovery.
   *
   * @param {ValidateOtpRequest} validateOtpRequest - The request object containing the OTP to be validated.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves when the OTP has been successfully validated.
   * @throws {Error} If there is an error during the OTP validation process.
   */
  async validateOtp(
    validateOtpRequest: ValidateOtpRequest,
    accessToken: string,
  ) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.validateOtp}`;
    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };

    const response = await axiosPost(url, validateOtpRequest, headers);

    if (response.headers[HeaderKeys.SET_COOKIE]) {
      /* let cookie = response.headers[HeaderKeys.SET_COOKIE][0];
        if (!/;\s*HttpOnly/i.test(cookie)) {
          cookie += '; HttpOnly';
        }
        response.data.cookie = cookie; */
      response.data.cookie = response.headers[HeaderKeys.SET_COOKIE][0];
    }

    return response.data;
  }

  /**
   * Retrieves the contact details of a user.
   *
   * @param {string} userName - The username of the user whose contact details are to be retrieved.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves to the contact details of the user.
   * @throws {Error} If there is an error during the retrieval process.
   */
  async getUserContactDetailsData(userName: string, accessToken: string) {
    const url = `${this.host}${this.publicBasePath}${APP.config.memberAuth.eap.contactDetails}`;
    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };

    const response = await axiosPost(url, {userName}, headers);
    return response.data;
  }

  /**
   * Retrieves the profile details of a user.
   *
   * @param {string} userName - The username of the user whose profile details are to be retrieved.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves to the profile details of the user.
   * @throws {Error} If there is an error during the retrieval process.
   */
  async getUserProfileDetails(userName: string, accessToken: string) {
    const url = `${this.host}${this.secureBasePath}${APP.config.memberAuth.eap.profileDetails}`;
    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.SMUNIVERSALID]: userName,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
    };
    const response = await axiosGet(url, headers);

    if (response.status === APIResponseCodes.SUCCESS) {
      return {...response.data, secureToken: response.data.token};
    }
    return null;
  }

  /**
   * Updates the audit timestamps with the current timestamp for the user identified by iamguid.
   *
   * @param iamguid - The IAM GUID of the user.
   * @param clientName - The client name of the user.
   * @param auditType - The type of audit timestamp to update.
   * @returns A promise that resolves with the update status.
   * @returns null if the update operation fails.
   */
  async updateAuditTimeStamp(
    iamguid: string,
    clientName: string,
    auditType: string,
  ) {
    // Set the current timestamp
    const currentTimestamp = new Date().toISOString();

    const updateTsQuery = {
      [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
      [DynamoDbConstants.KEY]: {
        iamguid,
        clientName,
      },
      [DynamoDbConstants.UPDATE_EXPRESSION]: `${DynamoDbConstants.SET} ${auditType} = ${AuditTypes.TIME_STAMP}`,
      [DynamoDbConstants.EXPRESSION_ATTRIBUTE_VALUES]: {
        [AuditTypes.TIME_STAMP]: currentTimestamp,
      },
      [DynamoDbConstants.RETURN_VALUES]: DynamoDbConstants.UPDATED_NEW,
    };

    const response = await this.dynamoDBGateway.updateRecord(updateTsQuery);

    if (response?.data?.isSuccess) {
      return response.data.value;
    }
    return null;
  }

  /**
   * Updates the profile details of a user in the EAP system.(phone number only)
   *
   * @param {UpdateUserRequest} updateUserRequest - The request object containing the new details of the user.
   * @param {string} userName - The username of the user whose profile details are to be updated.
   * @param {string} accessToken - The access token for the API.
   * @param {string} secureToken - The secure token for the session.
   * @returns {Promise} A promise that resolves when the user's profile details have been successfully updated.
   * @throws {Error} If there is an error during the update process.
   */
  async putEAPUserProfileDetails(
    updateUserRequest: UpdateUserRequest,
    userName: string,
    accessToken: string,
    secureToken: string,
  ) {
    const url = `${this.host}${this.secureBasePath}${APP.config.memberAuth.eap.updateProfile.replace(ReplaceStringKeyWords.client, updateUserRequest.employerType.toLocaleLowerCase())}`;
    const headers = {
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.SMUNIVERSALID]: userName,
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.SECURETOKEN]: secureToken,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
    };
    const response = await axiosPost(url, updateUserRequest, headers);

    if (response.status === APIResponseCodes.SUCCESS) {
      return response.data;
    }
    return null;
  }

  /**
   * Stores information about a member's device for future reference.
   *
   * @param {string} userName - The username of the member.
   * @param {string} secureToken - The secure token for the session.
   * @param {string} accessToken - The access token for the API.
   * @returns {Promise} A promise that resolves when the device information has been successfully stored.
   * @throws {Error} If there is an error during the storage process.
   */
  async rememberDevice(
    userName: string,
    secureToken: string,
    accessToken: string,
  ) {
    const url = `${this.host}${this.secureBasePath}${APP.config.memberAuth.eap.rememberDevice}`;
    const headers = {
      [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
      [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
      [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
      [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
      [HeaderKeys.SMUNIVERSALID]: userName,
    };

    const response = await axiosGet(url, headers);

    if (response.headers[HeaderKeys.SET_COOKIE]) {
      response.data.deviceCookie = response.headers[HeaderKeys.SET_COOKIE][0];
    }

    return response.data;
  }

  /**
   * Updates the member preferences for a user identified by iamguid.
   * If the user does not exist, a new user document will be created with the provided preferences.
   *
   * @param {string} iamguid - The IAM GUID of the user.
   * @param {MemberPreferences} preferences - The preferences to be updated for the user.
   * @returns {Promise<UpdateWriteOpResult>} - The result of the update operation.
   */
  async putMemberPreferences(
    iamguid: string,
    clientName: string,
    preferences: MemberPreferences,
  ) {
    // Find the user by iamguid and update the preferences field
    const updatePreferencesQuery = {
      [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
      [DynamoDbConstants.KEY]: {
        iamguid,
        clientName,
      },
      [DynamoDbConstants.UPDATE_EXPRESSION]: `${DynamoDbConstants.SET} preferences = :preferencesValue`,
      [DynamoDbConstants.EXPRESSION_ATTRIBUTE_VALUES]: {
        ':preferencesValue': preferences,
      },
      [DynamoDbConstants.RETURN_VALUES]: DynamoDbConstants.UPDATED_NEW,
    };

    const response = await this.dynamoDBGateway.updateRecord(
      updatePreferencesQuery,
    );

    if (response?.data?.isSuccess) {
      return response.data.value;
    }
    return null;
  }

  async disableUserAccount(
    userName: string,
    accessToken: string,
    secureToken: string,
  ) {
    try {
      const url = `${this.host}${this.secureBasePath}${APP.config.memberAuth.eap.disableAccount}`;
      const headers = {
        [HeaderKeys.DFD_ORIGIN]: APP.config.memberAuth.eap.dfdOrigin,
        [HeaderKeys.SMUNIVERSALID]: userName,
        [HeaderKeys.API_KEY]: APP.config.memberAuth.eap.apiKey,
        [HeaderKeys.AUTHORIZATION]: `${HeaderKeys.BEARER} ${accessToken}`,
        [HeaderKeys.COOKIE]: `${ServiceConstants.SECURE_TOKEN}${secureToken}`,
        [HeaderKeys.APPSOURCE]: ServiceConstants.CBHM_APPLICATION_NAME,
      };

      const response = await axiosPost(url, {}, headers);

      if (response.status === APIResponseCodes.SUCCESS) {
        return response.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}
