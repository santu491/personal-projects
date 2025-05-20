import axios from 'axios';
import {
  APIResponseCodes,
  APIResponseConstants,
  AllowedMemberAccountStatus,
  AuditTypes,
  CacheAuthTokenKeys,
  DB_TABLE_NAMES,
  MemberAccountStatus,
  Messages,
  ServiceConstants,
} from '../../constants';
import {DynamoDBGateway} from '../../gateway/dynamoDBGateway';
import {EAPMemberProfileGateway} from '../../gateway/eapMemberProfileGateway';
import {MemberOAuthPayload} from '../../types/customRequest';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  ChangePasswordRequest,
  CreateUserRequest,
  ForgotUserNameOrPasswordRequest,
  MemberPreferences,
  NotificationsPreference,
  SendOtpRequest,
  ServiceResponse,
  UpdateUserRequest,
  UserProfileResponse,
  ValidateOtpRequest,
} from '../../types/eapMemberProfileModel';
import {generateToken} from '../../utils/auth';

import {getCache, setCache} from '../../utils/cacheUtil';
import {getAccessToken, getAppConfig} from '../../utils/common';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {AuditHelper} from '../helpers/auditHelper';

export class EAPMemberProfileService {
  private className = this.constructor.name;
  private Logger = logger();
  result: ResponseUtil = new ResponseUtil();
  memberProfileGateway = new EAPMemberProfileGateway();
  dynamoDBGateway = new DynamoDBGateway();
  auditHelper = new AuditHelper();

  /**
   * Get the member lookup status
   *
   * @param userName - User Name of the member
   * @returns the result of the member lookup
   */
  async getMemberLookupStatus(userName: string) {
    try {
      const accessToken = await getAccessToken();
      await this.memberProfileGateway.userLookup(userName, accessToken);
      return this.result.createSuccess({
        message: Messages.memberExists,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        error = error.response?.data;
      }
      this.Logger.error(
        `${this.className} - getMemberLookupStatus :: ${JSON.stringify(error)}`,
      );
      if (error?.status == APIResponseCodes.NOT_FOUND) {
        return this.result.createException(
          Messages.userNotFound,
          APIResponseCodes.NOT_FOUND,
        );
      } else if (
        error?.status === APIResponseConstants.failed &&
        `${error?.errorType}.${error?.statusCode}`.includes(
          APIResponseConstants.memberDisabled,
        )
      ) {
        return this.result.createSuccess({
          message: Messages.memberDisabled,
        });
      }
      return this.result.createException(
        error,
        error?.status,
        Messages.userLookupError,
      );
    }
  }

  /**
   * Register new user service.
   *
   * @param {CreateUserRequest} createUserRequest - The request object containing the user details to be created.
   * @returns {Promise<Result>} - A promise that resolves to a result object indicating success or failure.
   *
   * @returns {Error} - returns an error if the user creation process fails.
   */
  async createUserService(createUserRequest: CreateUserRequest) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.postMemberRegistration(
        createUserRequest,
        accessToken,
      );

      if (response?.success === true) {
        const insertUserRecord = {
          TableName: DB_TABLE_NAMES.USERS,
          Item: {
            iamguid: response.DFD_id, // Set the IAM GUID from the response
            clientName: createUserRequest.clientName, // Set the client name from the request
            employerType: createUserRequest.employerType, // Set the employer type from the request
            status: MemberAccountStatus.ACTIVE, // Set the status to active
            audit: {
              createdTS: new Date(), // Set the created timestamp to the current date and time
            },
            preferences: {
              pushNotifications: {
                enabled: false,
              },
            },
          },
        };

        await this.dynamoDBGateway.upsertRecord(insertUserRecord);

        return this.result.createSuccess(response, APIResponseCodes.CREATED);
      }
      return this.result.createException(
        response,
        APIResponseCodes.INTERNAL_SERVER_ERROR,
      );
    } catch (error: any) {
      this.Logger.error(`${this.className} - createUserService :: ${error}`);

      return this.result.createException(
        error,
        error?.response?.status,
        Messages.registerError,
      );
    }
  }

  /**
   * Updates the user profile details for an EAP member.
   *
   * @param {UpdateUserRequest} updateUserRequest - The request object containing the user details to be updated.
   * @param {string} username - The username of the EAP member whose profile is to be updated.
   * @param {string} secureToken - A secure token for authentication.
   * @returns {Promise<Result>} - A promise that resolves to a result object indicating success or failure.
   *
   * @throws {Error} - Throws an error if the update process fails.
   */
  async updateUserService(
    updateUserRequest: UpdateUserRequest,
    username: string,
    secureToken: string,
  ) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.putEAPUserProfileDetails(
        updateUserRequest,
        username,
        accessToken,
        secureToken,
      );
      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(`${this.className} - updateUserService :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.updateUserProfileError,
      );
    }
  }

  /**
   * Authenticates a user service.
   * @param authenticateUserRequest The request object containing authentication details.
   * @returns A promise that resolves to the generic service response.
   */
  public async authenticateUserService(
    authenticateUserRequest: AuthenticationRequest,
    userIdentity: MemberOAuthPayload,
    deviceCookie: string = '',
  ): Promise<ServiceResponse> {
    try {
      // Attempt to retrieve the access token for EAP member authentication.
      const accessToken = await getAccessToken();
      // Authenticate the member with the provided credentials and access token.
      const response: AuthenticationResponse =
        await this.memberProfileGateway.authenticateMember(
          authenticateUserRequest,
          accessToken,
          deviceCookie,
        );

      const profileData = await this.memberProfileGateway.getUserProfileDetails(
        authenticateUserRequest.username,
        accessToken,
      );

      response.profile = profileData.data;
      response.status = response.status || response.mfaStatus;
      response.authenticated = response.authenticated || true;
      const iamguid = response.profile.iamguid;
      const clientName = response.profile.clientName;

      const memberInfo = await this.memberProfileGateway.getMemberDbData(
        iamguid,
        clientName,
      );

      if (!memberInfo) {
        const insertUserRecord = {
          TableName: DB_TABLE_NAMES.USERS,
          Item: {
            iamguid: iamguid, // Set the IAM GUID from the response
            clientName: response.profile.clientName, // Set the client name from the request
            employerType: response.profile.employerType, // Set the employer type from the request
            status: MemberAccountStatus.ACTIVE, // Set the status to active
            audit: {
              createdTS: response.profile.createdDate, // Set the created timestamp to the current date and time
            },
            preferences: {
              pushNotifications: {
                enabled: false,
              },
            },
          },
        };
        await this.dynamoDBGateway.upsertRecord(insertUserRecord);
      } else if (memberInfo.status === MemberAccountStatus.DELETED) {
        // If the member is disabled (deleted), return an error message.
        return this.result.createException(
          {
            errorType: APIResponseConstants.authFailed,
            message: Messages.userAuthError,
            statusCode: APIResponseConstants.user401,
            status: APIResponseConstants.failed,
          },
          APIResponseCodes.UNAUTHORIZED,
        );
      }

      response.profile.notificationCount =
        memberInfo?.notifications?.filter((n: any) => !n?.viewedTS).length || 0;

      // update loginTS in the user table
      await this.memberProfileGateway.updateAuditTimeStamp(
        iamguid,
        clientName,
        `${AuditTypes.AUDIT}.${AuditTypes.LAST_LOGIN_TS}`,
      );

      response.createdAt = new Date();
      response.expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000);
      response.expiresIn = ServiceConstants.JWT_EXPIRY_60M;

      // If the user is Demo User then, skip the MFA flow.
      let appConfig = null;
      try {
        appConfig = await getAppConfig();
      } catch (error) {
        this.Logger.error(
          `${this.className} - authenticateUserService :: ${error}`,
        );
      }

      if (
        response.status === ServiceConstants.SKIP_MFA ||
        (memberInfo && memberInfo.isDemoUser && appConfig?.isDemoEnabled)
      ) {
        response.status = ServiceConstants.SKIP_MFA;
        response.secureToken = profileData.secureToken;
        response.token = generateToken({
          clientId: ServiceConstants.CBHM_AUTH_CLIENT_NAME,
          userName: authenticateUserRequest.username?.toLowerCase(),
          iamguid,
          clientName,
          permissions: ['*'], // Added as a placeholder for permissions
          installationId: userIdentity?.installationId,
          sessionId: userIdentity?.sessionId,
        });
      } else {
        response.profile = this.refineMemberProfilePayload(profileData.data);
      }

      // Return a success result with the response data if authentication is successful,
      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - authenticateUserService :: ${error}`,
      );

      if (error?.response?.data?.statusCode === 'MEMBER_DISABLED') {
        error.response.data.message = Messages.userDisabledError;
      }
      // Return a generic login error message in case of any exceptions.
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.loginError,
      );
    }
  }

  /**
   * Invalidate the session of a member service(logout)
   *
   * @param iamguid - IAM GUID of the member
   * @param clientName - Client name of the member
   * @returns - A promise that resolves to a generic service response
   */
  async invalidateMemberSessionService(iamguid: string, clientName: string) {
    try {
      const response = await this.memberProfileGateway.updateAuditTimeStamp(
        iamguid,
        clientName,
        `${AuditTypes.AUDIT}.${AuditTypes.LAST_LOGOUT_TS}`,
      );

      if (
        response &&
        response['$metadata'].httpStatusCode === APIResponseCodes.SUCCESS
      ) {
        return this.result.createSuccess(Messages.memberSessionInvalidated);
      }
      return this.result.createException(Messages.invalidateSessionError);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - invalidateMemberSessionService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.invalidateSessionError,
      );
    }
  }

  /**
   * Disable a member account service
   * @param iamguid - IAM GUID of the member
   * @param clientName - Client name of the member
   * @returns - A promise that resolves to a generic service response
   */
  async removeMemberAccountService(
    iamguid: string,
    userName: string,
    clientName: string,
  ) {
    try {
      const response = await this.memberProfileGateway.setMemberAccountStatus(
        iamguid,
        clientName,
        MemberAccountStatus.DELETED,
      );
      if (
        response &&
        response['$metadata'].httpStatusCode === APIResponseCodes.SUCCESS
      ) {
        const accessToken = await getAccessToken();

        const profileData =
          await this.memberProfileGateway.getUserProfileDetails(
            userName,
            accessToken,
          );
        await this.memberProfileGateway.disableUserAccount(
          userName,
          accessToken,
          profileData.secureToken,
        );
        return this.result.createSuccess(Messages.memberAccountDeleted);
      }
      return this.result.createException(Messages.disableMemberAccountError);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - removeMemberAccountService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.disableMemberAccountError,
      );
    }
  }

  /**
   * Setting the member account status service in database
   * @param iamguid - IAM GUID of the member
   * @param clientName - Client name of the member
   * @returns - A promise that resolves to a generic service response
   */
  async setMemberAccountStatusService(
    iamguid: string,
    clientName: string,
    status: string,
  ) {
    try {
      if (!AllowedMemberAccountStatus.includes(status)) {
        throw `${Messages.invalidMemberStatus} '${status}'`;
      }

      const response = await this.memberProfileGateway.setMemberAccountStatus(
        iamguid,
        clientName,
        status,
      );
      if (
        response &&
        response['$metadata'].httpStatusCode === APIResponseCodes.SUCCESS
      ) {
        return this.result.createSuccess(Messages.setMemberAccountStatus);
      }
      return this.result.createException(Messages.setMemberAccountStatusError);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - setMemberAccountStatusService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.setMemberAccountStatusError,
      );
    }
  }

  /**
   * Get the contact details of the member service
   *
   * @param userName - The username of the member
   * @param isEmailVerified - The email verification status of the member
   * @returns - A promise that resolves to a generic service response
   */
  async getUserContactDetailsService(
    userName: string,
    isEmailVerified: boolean,
  ) {
    try {
      const accessToken = await getAccessToken();
      const response =
        await this.memberProfileGateway.getUserContactDetailsData(
          userName,
          accessToken,
        );

      // Filter the contact details based on the email verification status
      const contactData: {contactValue: string; channel: string}[] =
        isEmailVerified
          ? response?.contacts
          : response?.contacts.filter(
              (contact: {contactValue: string; channel: string}) =>
                contact.channel === ServiceConstants.EMAIL,
            );
      response.contacts = contactData;

      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - getUserContactDetailsService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.userFetchError,
      );
    }
  }

  /**
   * Send OTP to the member service
   *
   * @param sendOtpRequest - The request object containing the details to send the OTP
   * @returns - A promise that resolves to a generic service response
   * @returns - An error if the OTP cannot be sent
   */
  async sendOtpService(sendOtpRequest: SendOtpRequest) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.sendOtp(
        sendOtpRequest,
        accessToken,
      );

      return this.result.createSuccess(response, APIResponseCodes.CREATED);
    } catch (error: any) {
      this.Logger.error(`${this.className} - sendOtpService :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.sendOtpError,
      );
    }
  }

  /**
   * Validate OTP service
   *
   * @param validateOtpRequest - The request object containing the details to validate the OTP
   * @returns - A promise that resolves to a generic service response
   * @returns - An error if the OTP cannot be validated
   */
  async validateOtpService(
    validateOtpRequest: ValidateOtpRequest,
    memberOAuth: MemberOAuthPayload,
  ) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.validateOtp(
        validateOtpRequest,
        accessToken,
      );

      const profileData = await this.memberProfileGateway.getUserProfileDetails(
        validateOtpRequest.userName,
        accessToken,
      );

      if (!profileData) {
        return this.result.createException(Messages.authorizationError);
      }

      const token = generateToken({
        clientId: ServiceConstants.CBHM_AUTH_CLIENT_NAME,
        userName: validateOtpRequest.userName?.toLowerCase(),
        iamguid: profileData.data.iamguid,
        clientName: profileData.data.clientName,
        permissions: ['*'], // Added as a placeholder for permissions
        installationId: memberOAuth?.installationId,
        sessionId: memberOAuth?.sessionId,
      });

      response.token = token;
      response.secureToken = profileData.secureToken;

      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(`${this.className} - validateOtpService :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.validateOtpError,
      );
    }
  }

  /**
   * Get the user details service
   * @param userName - The username of the member
   * @returns - A promise that resolves to a generic service response
   * @returns - An error if the user details cannot be fetched
   */
  async getUserDetailsService(memberOAuth: MemberOAuthPayload) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.getUserProfileDetails(
        memberOAuth.userName!,
        accessToken,
      );

      if (response) {
        delete response.secureToken;
        delete response.token;
      }

      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - getUserDetailsService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.userFetchError,
      );
    }
  }

  /**
   * Get the EAP member authentication access token
   * @returns - The EAP member authentication access token
   * @returns - Null if the access token cannot be fetched
   */
  async getEAPMemberAuthAccessToken() {
    try {
      // Try to get the access token from the cache
      let accessToken = getCache(CacheAuthTokenKeys.eapMemberAuthAccessToken);
      // If there is no access token in the cache
      if (!accessToken) {
        // Get the access token from the EAP service
        accessToken = await this.memberProfileGateway.getEAPAccessToken();
        // If an access token was received
        if (accessToken) {
          // Store the access token in the cache for 899 seconds
          setCache(
            CacheAuthTokenKeys.eapMemberAuthAccessToken,
            accessToken,
            899,
          );
        }
      }
      return accessToken;
    } catch (error) {
      this.Logger.error(
        `${this.className} - getEAPMemberAuthAccessToken :: ${error}`,
      );
      return null;
    }
  }

  /**
   * Get the details of the member based on the FUP request
   * @param request FUP Request with member details
   * @returns Member Details
   * @returns {Error} returns an error if the member details cannot be fetched.
   */
  async forgotMemberPassword(request: ForgotUserNameOrPasswordRequest) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.validateMemberDetails(
        request,
        accessToken,
      );

      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(`${this.className} - forgotMemberPassword :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.userFetchError,
      );
    }
  }

  /**
   * Get the details of the member based on the FUP request
   * @param request FUP Request with member details
   * @returns Member Details
   * @returns Error message if the user name cannot be fetched
   */
  async forgotMemberUserName(request: ForgotUserNameOrPasswordRequest) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.forgotUserName(
        request,
        accessToken,
      );

      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(`${this.className} - forgotMemberUserName :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.userFetchError,
      );
    }
  }

  /**
   * Change member password
   * @param {ChangePasswordRequest} request ChangePasswordRequest
   * @param {string} fupCookie mfafgp cookie
   * @returns Response over update
   */
  async changePassword(request: ChangePasswordRequest, fupCookie: string) {
    try {
      const accessToken = await getAccessToken();
      const response =
        await this.memberProfileGateway.postEAPMemberChangePassword(
          request,
          accessToken,
          fupCookie,
        );
      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(`${this.className} - changePassword :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.changeUserPasswordError,
      );
    }
  }

  /**
   * Get the details of the member based on the FUP request
   * @param {string} userName - The username of the member.
   * @param {string} secureToken - The secure token of the member.
   * @returns An promise that resolves with the response of the remember device request.
   * @returns {Error} returns an error if device cannot be remembered.
   */
  async rememberDeviceService(userName: string, secureToken: string) {
    try {
      const accessToken = await getAccessToken();
      const response = await this.memberProfileGateway.rememberDevice(
        userName,
        secureToken,
        accessToken,
      );
      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - rememberDeviceService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.rememberDeviceError,
      );
    }
  }

  /**
   * Fetch Member Preferences
   *
   * @param {string} iamguid - The IAM GUID of the member.
   * @param {string} clientName - The name of the client.
   *
   * @returns {Promise} Returns a promise that resolves with the preferences of the member.
   *
   * @returns {Error} if the preferences cannot be fetched.
   */
  async fetchMemberPreferencesService(iamguid: string, clientName: string) {
    try {
      const memberinfo = await this.memberProfileGateway.getMemberDbData(
        iamguid,
        clientName,
      );
      if (!memberinfo || memberinfo.status === MemberAccountStatus.DELETED) {
        return this.result.createException(
          {
            errorType: APIResponseConstants.authFailed,
            message: Messages.userAuthError,
            statusCode: APIResponseConstants.user401,
            status: APIResponseConstants.failed,
          },
          APIResponseCodes.UNAUTHORIZED,
        );
      }
      return this.result.createSuccess(memberinfo.preferences);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - fetchMemberPreferencesService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.fetchMemberPreferencesError,
      );
    }
  }

  /**
   * Save Member Preferences
   *
   * @param {string} iamguid - The IAM GUID of the member.
   * @param {string} clientName - The name of the client.
   * @param {MemberPreferences} memberPreferencesRequest - An object containing the preferences to be saved.
   *
   * @returns {Promise} Returns a promise that resolves when the preferences have been successfully saved.
   *
   * @returns {Error} if the preferences cannot be saved.
   */
  async saveMemberPreferencesService(
    iamguid: string,
    clientName: string,
    memberPreferencesRequest: MemberPreferences,
  ) {
    try {
      // Avoid duplicate strings from the topics array.
      memberPreferencesRequest.pushNotifications.topics = [
        ...new Set(memberPreferencesRequest.pushNotifications.topics),
      ];
      const {preferences} = await this.memberProfileGateway.getMemberDbData(
        iamguid,
        clientName,
      );

      const {pushNotifications} = memberPreferencesRequest;

      Object.keys(preferences.pushNotifications).forEach(key => {
        if (!pushNotifications.hasOwnProperty(key)) {
          pushNotifications[key as keyof NotificationsPreference] =
            preferences.pushNotifications[key];
        }
      });

      const response = await this.memberProfileGateway.putMemberPreferences(
        iamguid,
        clientName,
        {pushNotifications},
      );

      if (response?.['$metadata'].httpStatusCode === APIResponseCodes.SUCCESS) {
        return this.result.createSuccess(Messages.memberPreferencesUpdated);
      }
      return this.result.createException(Messages.saveMemberPreferencesError);
    } catch (error: any) {
      this.Logger.error(
        `${this.className} - saveMemberPreferencesService :: ${error}`,
      );
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.saveMemberPreferencesError,
      );
    }
  }

  /**
   * Refreshes the authentication service for a member.
   *
   * @param {MemberOAuthPayload} user - An object containing the member's authentication details.
   *
   * @returns {Promise} Returns a promise that resolves with the updated authentication details for the member.
   *
   * @returns {Error} if the authentication service cannot be refreshed.
   */
  async refreshMemberAuthService(memberOAuth: MemberOAuthPayload) {
    try {
      const createdAt = new Date();
      const authToken = generateToken(memberOAuth);
      return this.result.createSuccess({
        createdAt,
        token: authToken,
        expiresAt: new Date(createdAt.getTime() + 60 * 60 * 1000),
        expiresIn: ServiceConstants.JWT_EXPIRY_60M,
        message: Messages.refreshAuthSuccess,
      });
    } catch (error) {
      this.Logger.error(
        `${this.className} - refreshMemberAuthService :: ${error}`,
      );
      return this.result.createException(Messages.somethingWentWrong);
    }
  }

  private refineMemberProfilePayload(profileData: UserProfileResponse) {
    delete profileData.address;
    delete profileData.firstName;
    delete profileData.lastName;
    delete profileData.emailAddress;
    delete profileData.communication;
    delete profileData.dob;

    return profileData;
  }
}
