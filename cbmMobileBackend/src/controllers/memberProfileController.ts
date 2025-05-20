import {
  Authorized,
  Body,
  CookieParam,
  CurrentUser,
  Get,
  HeaderParam,
  JsonController,
  Patch,
  Post,
  Put,
  QueryParam,
} from 'routing-controllers';
import {
  APIResponseCodes,
  AllowedClients,
  Messages,
  ServiceConstants,
} from '../constants';
import {API_PATHS, AUTH_ROUTES} from '../routingConstants';

import {EAPMemberProfileService} from '../services/eap/eapMemberProfileService';
import {MemberOAuthPayload} from '../types/customRequest';
import {
  AuthenticationRequest,
  ChangePasswordRequest,
  CreateUserRequest,
  ForgotUserNameOrPasswordRequest,
  MemberPreferences,
  SendOtpRequest,
  UpdateUserRequest,
  ValidateOtpRequest,
} from '../types/eapMemberProfileModel';
import {validateMemberOAuthPayload} from '../utils/common';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {OpenAPI} from 'routing-controllers-openapi';
import {
  AuthenticateMemberProfileSpec,
  FetchMemberPreferences,
  forgotPassword,
  forgotUserName,
  GetMemberContactDetails,
  GetMemberProfile,
  InvalidateMemberSession,
  MemberLookupSpec,
  MemberProfileSpec,
  RefreshAuthSpec,
  RememberDeviceSpec,
  RemoveMemberProfile,
  SendOTP,
  SetMemberProfileStatus,
  UpdateMemberProfile,
  UpdatePassword,
  ValidateMemberOAuthPayloadSpec,
  ValidateOTP,
} from '../apiDetails/MemberProfile';

// Controller for handling member authentication related requests
@JsonController(API_PATHS.auth)
export class MemberProfileController {
  private memberAuthService: EAPMemberProfileService =
    new EAPMemberProfileService();

  private responseUtil = new ResponseUtil();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * Endpoint for member lookup
   * @route GET /members/lookup
   * @access Public
   * @returns Client details
   * @param source - The source of the request
   * @param client - The client to be searched
   * @param memberId - The data to be searched
   * @param clientDetails - The details of the client making the request
   * @throws Error
   */
  @OpenAPI(MemberLookupSpec)
  @Get(AUTH_ROUTES.memberLookup)
  @Authorized(AllowedClients)
  async memberLookup(
    @HeaderParam('source', {required: true}) source: string,
    @HeaderParam('userName', {required: true}) userName: string,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.getMemberLookupStatus(userName);
      }
    } catch (error) {
      this.Logger.error(`${this.className} - memberLookup :: ${error}`);
      return error;
    }
  }

  /**
   * Register a user
   * @route POST /members/profile
   * @access Public
   * @returns confirmation details
   * @param source - The source of the request
   * @param createUserRequest - The request body
   * @throws Error
   */
  @OpenAPI(MemberProfileSpec)
  @Post(AUTH_ROUTES.memberProfile)
  @Authorized(AllowedClients)
  async createMemberProfile(
    @HeaderParam('source', {required: true}) source: string,
    @Body() createUserRequest: CreateUserRequest,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.createUserService(
          createUserRequest,
        );
      }
    } catch (error) {
      this.Logger.error(`${this.className} - createMemberProfile :: ${error}`);
      return error;
    }
  }

  /**
   * Endpoint to login/authenticate a member
   * @route POST /members/authentication
   * @access Public
   * @returns User details
   * @param source - The source of the request
   * @param authenticateMemberRequest - The request body
   * @throws Error
   */
  @OpenAPI(AuthenticateMemberProfileSpec)
  @Post(AUTH_ROUTES.memberAuthentication)
  @Authorized(AllowedClients)
  async authenticateMemberProfile(
    @HeaderParam('source', {required: true}) source: string,
    @HeaderParam('cookie') deviceCookie: string,
    @Body() authenticationRequest: AuthenticationRequest,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.authenticateUserService(
          authenticationRequest,
          memberOAuth,
          deviceCookie,
        );
      }
    } catch (error) {
      this.Logger.error(
        `${this.className} - authenticateMemberProfile :: ${error}`,
      );
      return error;
    }
  }

  /**
   * Endpoint to logout a member
   * @route POST /members/authentication
   * @access Public
   * @returns User details
   * @param source - The source of the request
   * @param authenticateMemberRequest - The request body
   * @throws Error
   */
  @OpenAPI(InvalidateMemberSession)
  @Put(AUTH_ROUTES.memberSession)
  @Authorized(AllowedClients)
  async invalidateMemberSession(
    @HeaderParam('source', {required: true}) source: string,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
  ) {
    try {
      validateMemberOAuthPayload(payload);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.invalidateMemberSessionService(
          payload.iamguid!,
          payload.clientName!,
        );
      }
    } catch (error) {
      this.Logger.error(
        `${this.className} - invalidateMemberSession :: ${error}`,
      );
      return error;
    }
  }

  /**
   * Delete a user
   * @route DELETE /members/account
   * @access Public
   * @returns confirmation details
   * @param source - The source of the request
   * @throws Error
   */
  @OpenAPI(RemoveMemberProfile)
  @Post(AUTH_ROUTES.memberAccount)
  @Authorized(AllowedClients)
  async removeMemberProfile(
    @HeaderParam('source', {required: true}) source: string,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
  ) {
    try {
      validateMemberOAuthPayload(payload);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.removeMemberAccountService(
          payload.iamguid!,
          payload.userName!,
          payload.clientName!,
        );
      }
    } catch (error) {
      this.Logger.error(`${this.className} - removeMemberProfile :: ${error}`);
      return error;
    }
  }

  /**
   * Set the status of a user
   * @route PATCH /members/account
   * @access Public
   * @returns confirmation details
   * @param source - The source of the request
   * @param iamguid - The iamguid of the user
   * @param status - The status to be set
   * @param clientName - The client name
   * @returns error
   */
  @OpenAPI(SetMemberProfileStatus)
  @Patch(AUTH_ROUTES.memberProfile)
  @Authorized(AllowedClients)
  async setMemberProfileStatus(
    @HeaderParam('source', {required: true}) source: string,
    @HeaderParam('iamguid', {required: true}) iamguid: string,
    @HeaderParam('status', {required: true}) status: string,
    @HeaderParam('clientName', {required: true}) clientName: string,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.setMemberAccountStatusService(
          iamguid,
          clientName,
          status.toUpperCase(),
        );
      }
    } catch (error) {
      this.Logger.error(
        `${this.className} - setMemberProfileStatus :: ${error}`,
      );
      return error;
    }
  }

  /**
   * Endpoint for getting user contact details
   * @route GET /members/contacts
   * @access Public
   * @returns User contact details
   * @param source - The source of the request
   * @param userName - The username of the user
   * @param isEmailVerified - The email verification status of the user
   * @throws Error
   */
  @OpenAPI(GetMemberContactDetails)
  @Get(AUTH_ROUTES.memberContacts)
  @Authorized(AllowedClients)
  async getMemberContactDetails(
    @HeaderParam('source', {required: true}) source: string,
    @HeaderParam('userName', {required: true}) userName: string,
    @QueryParam('isEmailVerified') isEmailVerified: boolean = true,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.getUserContactDetailsService(
          userName,
          isEmailVerified,
        );
      }
    } catch (error) {
      this.Logger.error(
        `${this.className} - getMemberContactDetails :: ${error}`,
      );
      return error;
    }
  }

  /**
   * Endpoint for getting user details
   * @route GET /members/profile
   * @access Public
   * @returns User details
   * @param source - The source of the request
   * @param userName - The username of the user
   * @throws Error
   */
  @OpenAPI(GetMemberProfile)
  @Get(AUTH_ROUTES.memberProfile)
  @Authorized(AllowedClients)
  async getMemberProfile(
    @HeaderParam('source', {required: true}) source: string,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
  ) {
    try {
      validateMemberOAuthPayload(payload);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.getUserDetailsService(payload);
      }
    } catch (error) {
      this.Logger.error(`${this.className} - getMemberProfile :: ${error}`);
      return error;
    }
  }

  /**
   * Endpoint to update a user profile details
   * @route PUT /members/profile
   * @access Public
   * @returns User details
   * @param source - The source of the request
   * @param updateUserRequest - The request body
   * @throws Error
   */
  @OpenAPI(UpdateMemberProfile)
  @Put(AUTH_ROUTES.memberProfile)
  @Authorized(AllowedClients)
  async updateMemberProfile(
    @HeaderParam('source', {required: true}) source: string,
    @CookieParam('secureToken', {required: true}) secureToken: string,
    @CurrentUser({required: true}) payload: MemberOAuthPayload,
    @Body() updateUserRequest: UpdateUserRequest,
  ) {
    try {
      validateMemberOAuthPayload(payload);
      if (source === ServiceConstants.STRING_EAP) {
        updateUserRequest.iamguid = payload.iamguid!;
        return await this.memberAuthService.updateUserService(
          updateUserRequest,
          payload.userName!,
          secureToken,
        );
      }
    } catch (error) {
      this.Logger.error(`${this.className} - updateMemberProfile :: ${error}`);
      return error;
    }
  }

  /**
   * Endpoint for sending OTP to the user
   * @route PUT /mfa/otp
   * @access Public
   * @returns OTP details
   * @param source - The source of the request
   * @param sendOtpRequest - The request body
   * @throws Error
   */
  @OpenAPI(SendOTP)
  @Put(AUTH_ROUTES.sendOrValidateOTP)
  @Authorized(AllowedClients)
  async sendOtp(
    @HeaderParam('source', {required: true}) source: string,
    @Body() sendOtpRequest: SendOtpRequest,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.sendOtpService(sendOtpRequest);
      }
    } catch (error) {
      this.Logger.error(`${this.className} - sendOtp :: ${error}`);
      return error;
    }
  }

  /**
   * Endpoint for validating OTP
   * @route POST /mfa/otp
   * @access Public
   * @returns OTP validation details
   * @param source - The source of the request
   * @param validateOtpRequest - The request body
   * @throws Error
   */
  @OpenAPI(ValidateOTP)
  @Post(AUTH_ROUTES.sendOrValidateOTP)
  @Authorized(AllowedClients)
  async validateOtp(
    @HeaderParam('source', {required: true}) source: string,
    @Body() validateOtpRequest: ValidateOtpRequest,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    try {
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.validateOtpService(
          validateOtpRequest,
          memberOAuth,
        );
      }
    } catch (error) {
      this.Logger.error(`${this.className} - validateOtp :: ${error}`);
      return error;
    }
  }

  /**
   * Function to fetch the member details on FUP
   * @param payload member basic details
   * @returns member details
   */
  @OpenAPI(forgotPassword)
  @Post(AUTH_ROUTES.forgotPdsw)
  @Authorized(AllowedClients)
  async forgotPassword(
    @HeaderParam('source', {required: true}) source: string,
    @Body() payload: ForgotUserNameOrPasswordRequest,
  ) {
    try {
      if (source !== ServiceConstants.STRING_EAP) {
        return this.responseUtil.createException(
          Messages.invalidSource,
          APIResponseCodes.BAD_REQUEST,
        );
      }
      return await this.memberAuthService.forgotMemberPassword(payload);
    } catch (error) {
      this.Logger.error(`${this.className} - forgotPassword :: ${error}`);
      return error;
    }
  }

  /**
   * Function to Change the Password
   * @param payload member basic details
   * @returns member details
   */
  @OpenAPI(UpdatePassword)
  @Put(AUTH_ROUTES.memberAccount)
  @Authorized(AllowedClients)
  async updatePassword(
    @HeaderParam('source', {required: true}) source: string,
    @HeaderParam('cookie', {required: true}) mfafgpCookie: string,
    @Body() payload: ChangePasswordRequest,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    try {
      if (!memberOAuth.userName) {
        return this.responseUtil.createException(Messages.invalidAuthError);
      }
      if (memberOAuth.userName !== payload.userName) {
        return this.responseUtil.createException(Messages.badRequest);
      }
      if (source !== ServiceConstants.STRING_EAP) {
        return this.responseUtil.createException(
          Messages.invalidSource,
          APIResponseCodes.BAD_REQUEST,
        );
      }
      return await this.memberAuthService.changePassword(payload, mfafgpCookie);
    } catch (error) {
      this.Logger.error(`${this.className} - updatePassword :: ${error}`);
      return error;
    }
  }

  /**
   * Function to fetch the member details on FUP
   * @param payload member basic details
   * @returns member details
   */
  @OpenAPI(forgotUserName)
  @Post(AUTH_ROUTES.forgotUserName)
  @Authorized(AllowedClients)
  async forgotUserName(
    @HeaderParam('source', {required: true}) source: string,
    @Body() payload: ForgotUserNameOrPasswordRequest,
  ) {
    try {
      if (source !== ServiceConstants.STRING_EAP) {
        return this.responseUtil.createException(
          Messages.invalidSource,
          APIResponseCodes.BAD_REQUEST,
        );
      }
      return await this.memberAuthService.forgotMemberUserName(payload);
    } catch (error) {
      this.Logger.error(`${this.className} - forgotUserName :: ${error}`);
      return error;
    }
  }

  /**
   * Function to remember the device
   * @param source source of the request
   * @param secureToken secure token
   * @param user user details
   * @returns response
   * @throws error
   */
  @OpenAPI(RememberDeviceSpec)
  @Get(AUTH_ROUTES.rememberDevice)
  @Authorized(AllowedClients)
  async rememberDevice(
    @HeaderParam('source', {required: true}) source: string,
    @CookieParam('secureToken', {required: true}) secureToken: string,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    try {
      validateMemberOAuthPayload(memberOAuth);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.rememberDeviceService(
          memberOAuth.userName!,
          secureToken,
        );
      }
    } catch (error) {
      this.Logger.error(`${this.className} - rememberDevice :: ${error}`);
      return error;
    }
  }

  /**
   * Function to fetch the member details.
   * @param source source of the request
   * @param user user details
   * @returns Member details
   * @returns Error
   */
  @OpenAPI(FetchMemberPreferences)
  @Get(AUTH_ROUTES.memberPreferences)
  @Authorized(AllowedClients)
  async fetchMemberPreferences(
    @HeaderParam('source', {required: true}) source: string,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    try {
      validateMemberOAuthPayload(memberOAuth);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.fetchMemberPreferencesService(
          memberOAuth.iamguid!,
          memberOAuth.clientName!,
        );
      }
    } catch (error) {
      this.Logger.error(
        `${this.className} - fetchMemberPreferences :: ${error}`,
      );
      return error;
    }
  }

  /**
   * Function to save the member preferences.
   * @param source source of the request
   * @param memberPreferencesRequest member preferences
   * @param user user details
   * @returns Member details
   * @returns Error
   */
  @OpenAPI(ValidateMemberOAuthPayloadSpec)
  @Put(AUTH_ROUTES.memberPreferences)
  @Authorized(AllowedClients)
  async saveMemberPreferences(
    @HeaderParam('source', {required: true}) source: string,
    @Body() memberPreferencesRequest: MemberPreferences,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    try {
      validateMemberOAuthPayload(memberOAuth);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.saveMemberPreferencesService(
          memberOAuth.iamguid!,
          memberOAuth.clientName!,
          memberPreferencesRequest,
        );
      }
    } catch (error) {
      this.Logger.error(
        `${this.className} - saveMemberPreferences :: ${error}`,
      );
      return error;
    }
  }

  /**
   * Function to refresh the member authentication.
   * @param source source of the request
   * @param user user details
   * @returns Member details
   * @returns Error
   */
  @OpenAPI(RefreshAuthSpec)
  @Get(AUTH_ROUTES.refreshMemberAuth)
  @Authorized(AllowedClients)
  async refreshMemberAuth(
    @HeaderParam('source', {required: true}) source: string,
    @CurrentUser({required: true}) memberOAuth: MemberOAuthPayload,
  ) {
    try {
      validateMemberOAuthPayload(memberOAuth);
      if (source === ServiceConstants.STRING_EAP) {
        return await this.memberAuthService.refreshMemberAuthService(
          memberOAuth,
        );
      }
    } catch (error) {
      this.Logger.error(`${this.className} - refreshMemberAuth :: ${error}`);
      return error;
    }
  }
}
