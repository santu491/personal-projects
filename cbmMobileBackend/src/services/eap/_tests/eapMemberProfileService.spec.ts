import {
  APIResponseCodes,
  APIResponseConstants,
  MemberAccountStatus,
  Messages,
} from '../../../constants';
import {MemberOAuthPayload} from '../../../types/customRequest';
import {
  AuthenticationRequest,
  ChangePasswordRequest,
  CreateUserRequest,
  ForgotUserNameOrPasswordRequest,
  MemberPreferences,
  SendOtpRequest,
  UpdateUserRequest,
  ValidateOtpRequest,
} from '../../../types/eapMemberProfileModel';
import {generateToken} from '../../../utils/auth';
import {
  mockDynamoDBGateway,
  mockEapMemberProfileGateway,
} from '../../../utils/baseTest';
import {clearCache, getCache, setCache} from '../../../utils/cacheUtil';
import {
  mockEapMemberAuthenticationRequest,
  mockEapMemberRegistrationRequest,
} from '../../../utils/mockData';
import {ResponseUtil} from '../../../utils/responseUtil';
import {EAPMemberProfileService} from '../eapMemberProfileService';

jest.mock('../../../gateway/eapMemberProfileGateway', () => ({
  EAPMemberProfileGateway: jest.fn(() => mockEapMemberProfileGateway),
}));

jest.mock('../../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

jest.mock('../../../utils/cacheUtil', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  clearCache: jest.fn(),
}));

jest.mock('../../../utils/auth', () => ({
  generateToken: jest.fn(),
}));

describe('eapMemberProfileService', () => {
  const accessToken = 'accessToken';
  let service: EAPMemberProfileService;
  let result: ResponseUtil;
  const updateDbSuccess = {
    $metadata: {
      httpStatusCode: 200,
    },
  };

  const updateDbFailed = {
    $metadata: {
      httpStatusCode: 400,
    },
  };

  beforeEach(() => {
    service = new EAPMemberProfileService();
    result = new ResponseUtil();
  });

  describe('getMemberLookupStatus', () => {
    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.getMemberLookupStatus('test');

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should return a success message if user is found', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.userLookup.mockResolvedValue({
        status: 200,
        message: false,
      });

      const response = await service.getMemberLookupStatus('test');

      expect(response).toEqual(
        result.createSuccess({message: Messages.memberExists}),
      );
    });

    it('should return an error if an user not found', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.userLookup.mockRejectedValue({
        response: {status: 404},
        status: 404,
      });

      const response = await service.getMemberLookupStatus('test');

      expect(response).toEqual(
        result.createException(Messages.userNotFound, 404),
      );
    });

    it('should return a success message if an member is found but disabled', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.userLookup.mockRejectedValue({
        response: {status: 404},
        status: 'FAILED',
        errorType: 'MEMBER_DISABLED',
      });

      const response = await service.getMemberLookupStatus('test');

      expect(response).toEqual(
        result.createSuccess({message: Messages.memberDisabled}),
      );
    });

    it('should return an error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      const errorData = {
        status: 500,
        data: {
          status: 401,
          message: true,
        },
      };
      mockEapMemberProfileGateway.userLookup.mockRejectedValue(errorData);

      const response = await service.getMemberLookupStatus('test');

      expect(response).toEqual(
        result.createException(errorData, errorData.status),
      );
    });

    it('should return an error with generic error message if error is null', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.userLookup.mockRejectedValue(null);

      const response = await service.getMemberLookupStatus('test');

      expect(response).toEqual(
        result.createException(Messages.userLookupError),
      );
    });
  });

  describe('createUserService', () => {
    const payload: CreateUserRequest = mockEapMemberRegistrationRequest;

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.createUserService(payload);

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should return success if the user is created', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.postMemberRegistration.mockResolvedValue({
        success: true,
        user_id: '123',
        DFD_id: '456',
      });
      mockDynamoDBGateway.upsertRecord.mockResolvedValue(null);

      const response = await service.createUserService(payload);

      expect(response).toEqual(
        result.createSuccess(
          {success: true, user_id: '123', DFD_id: '456'},
          201,
        ),
      );
    });

    it('should return an error if the user is not created', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.postMemberRegistration.mockResolvedValue(
        null,
      );

      const response = await service.createUserService(payload);

      expect(response).toEqual(result.createException(null));
    });

    it('should return an error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.postMemberRegistration.mockRejectedValue({
        error: 'error',
      });

      const response = await service.createUserService(payload);

      expect(response).toEqual(result.createException({error: 'error'}));
    });

    it('should return error with generic error message if an error is null', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.postMemberRegistration.mockRejectedValue(
        null,
      );

      const response = await service.createUserService(payload);

      expect(response).toEqual(result.createException(Messages.registerError));
    });
  });

  describe('authenticateUserService', () => {
    const authenticationRequest: AuthenticationRequest =
      mockEapMemberAuthenticationRequest;

    it('should return an error message if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.authenticateUserService(
        authenticationRequest,
        {
          clientId: 'client_CBHM',
          installationId: 'install',
          sessionId: 'session',
        },
      );

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should return a success message with response data if authentication is successful', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      (generateToken as jest.Mock).mockReturnValue('token');
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: true,
          value: {
            isDemoEnabled: true,
          },
        },
      });
      mockEapMemberProfileGateway.authenticateMember.mockResolvedValue({
        isAuthenticated: true,
        userDetails: {userId: '123', userName: 'testuser'},
      });
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue({
        status: 'A',
        notifications: [
          {
            title: 'title',
            viewedTS: new Date(),
          },
          {
            title: 'title',
          },
        ],
        isDemoUser: true,
      });
      mockEapMemberProfileGateway.updateAuditTimeStamp.mockResolvedValue(null);

      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue({
        data: {user_id: '123', DFD_id: '456'},
        secureToken: 'secure',
      });

      const response = await service.authenticateUserService(
        authenticationRequest,
        {
          clientId: 'client_CBHM',
          installationId: 'install',
          sessionId: 'session',
        },
      );

      expect(response.data).not.toBeNull();
    });

    it('should return a success response if authentication is successful for the first time in APP', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      (generateToken as jest.Mock).mockReturnValue('token');
      mockEapMemberProfileGateway.authenticateMember.mockResolvedValue({
        isAuthenticated: true,
        userDetails: {userId: '123', userName: 'testuser'},
      });
      mockDynamoDBGateway.getRecords.mockReturnValue({
        data: {
          isSuccess: true,
          value: {
            isDemoEnabled: false,
          },
        },
      });
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue(null);
      mockEapMemberProfileGateway.updateAuditTimeStamp.mockResolvedValue(null);
      mockDynamoDBGateway.upsertRecord.mockResolvedValue(null);

      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue({
        data: {user_id: '123', DFD_id: '456'},
        secureToken: 'secure',
      });

      const response = await service.authenticateUserService(
        authenticationRequest,
        {
          clientId: 'client_CBHM',
          installationId: 'install',
          sessionId: 'session',
        },
      );

      expect(response.data).toBeDefined();
    });

    it('Should return error if member status is deleted', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      (generateToken as jest.Mock).mockReturnValue('token');
      mockEapMemberProfileGateway.authenticateMember.mockResolvedValue({
        isAuthenticated: true,
        userDetails: {userId: '123', userName: 'testuser'},
      });
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue({
        status: MemberAccountStatus.DELETED,
      });
      mockEapMemberProfileGateway.updateAuditTimeStamp.mockResolvedValue(null);

      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue({
        data: {user_id: '123', DFD_id: '456'},
        secureToken: 'secure',
      });

      const response = await service.authenticateUserService(
        authenticationRequest,
        {
          clientId: 'client_CBHM',
          installationId: 'install',
          sessionId: 'session',
        },
      );

      expect(response.data).not.toBeNull();
    });

    it('should return a login error message if authentication fails', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.authenticateMember.mockRejectedValue(null);

      const response = await service.authenticateUserService(
        authenticationRequest,
        {
          clientId: 'client_CBHM',
          installationId: 'install',
          sessionId: 'session',
        },
      );

      expect(response).toEqual(result.createException(Messages.loginError));
    });

    it('should return a generic login error message if an exception occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.authenticateMember.mockRejectedValue({
        error: 'Invalid credentials',
      });

      const response = await service.authenticateUserService(
        authenticationRequest,
        {
          clientId: 'client_CBHM',
          installationId: 'install',
          sessionId: 'session',
        },
      );

      expect(response).toEqual(
        result.createException({error: 'Invalid credentials'}),
      );
    });
  });

  describe('getUserContactDetailsService', () => {
    const isEmailVerified = true;
    const userName = 'test';
    const contactDetails = [
      {
        contactValue: 'test@ex.com',
        channel: 'EMAIL',
      },
      {
        contactValue: '1234567890',
        channel: 'PHONE',
      },
    ];

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.getUserContactDetailsService(
        userName,
        isEmailVerified,
      );

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should return user contact details', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.getUserContactDetailsData.mockResolvedValue({
        contacts: contactDetails,
      });

      const response = await service.getUserContactDetailsService(
        userName,
        false,
      );

      expect(response).toEqual(
        result.createSuccess({
          contacts: [
            {
              contactValue: 'test@ex.com',
              channel: 'EMAIL',
            },
          ],
        }),
      );
    });

    it('should return all of the user contact details', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.getUserContactDetailsData.mockResolvedValue({
        contacts: contactDetails,
      });

      const response = await service.getUserContactDetailsService(
        userName,
        true,
      );

      expect(response).toEqual(
        result.createSuccess({
          contacts: contactDetails,
        }),
      );
    });

    it('should return an error if the user contact details are not found', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.getUserContactDetailsData.mockRejectedValue(
        null,
      );

      const response = await service.getUserContactDetailsService(
        userName,
        isEmailVerified,
      );

      expect(response).toEqual(result.createException(Messages.userFetchError));
    });

    it('should return an error if an exception occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.getUserContactDetailsData.mockRejectedValue({
        error: 'error',
      });

      const response = await service.getUserContactDetailsService(
        userName,
        isEmailVerified,
      );

      expect(response).toEqual(result.createException({error: 'error'}));
    });
  });

  describe('sendOtpService', () => {
    const sendOtpRequest: SendOtpRequest = {
      channel: '',
      userName: '',
      pingRiskId: '',
    };

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.sendOtpService(sendOtpRequest);

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should send an OTP', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.sendOtp.mockResolvedValue(true);

      const response = await service.sendOtpService(sendOtpRequest);

      expect(response).toEqual(result.createSuccess(true, 201));
    });

    it('should return an generic error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.sendOtp.mockRejectedValue(null);

      const response = await service.sendOtpService(sendOtpRequest);

      expect(response).toEqual(result.createException(Messages.sendOtpError));
    });

    it('should return an error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.sendOtp.mockRejectedValue({error: 'error'});

      const response = await service.sendOtpService(sendOtpRequest);

      expect(response).toEqual(result.createException({error: 'error'}));
    });
  });

  describe('validateOtpService', () => {
    const validateOtpRequest: ValidateOtpRequest = {
      otp: '',
      rememberDevice: '',
      pingRiskId: '',
      pingDeviceId: '',
      pingUserId: '',
      userName: '',
      flowName: '',
    };

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.validateOtpService(validateOtpRequest, {
        clientId: 'client_CBHM',
        installationId: 'install',
        sessionId: 'session',
      });

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should validate an OTP', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.validateOtp.mockResolvedValue({
        message: 'Otp validated successfully',
      });

      const response = await service.validateOtpService(validateOtpRequest, {
        clientId: 'client_CBHM',
        installationId: 'install',
        sessionId: 'session',
      });

      expect(response).toEqual(
        result.createSuccess({
          message: 'Otp validated successfully',
          secureToken: 'secure',
          token: 'token',
        }),
      );
    });

    it('should return an generic error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.validateOtp.mockRejectedValue(null);

      const response = await service.validateOtpService(validateOtpRequest, {
        clientId: 'client_CBHM',
        installationId: 'install',
        sessionId: 'session',
      });

      expect(response).toEqual(
        result.createException(Messages.validateOtpError),
      );
    });

    it('should return an error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.validateOtp.mockRejectedValue({
        error: 'error',
      });

      const response = await service.validateOtpService(validateOtpRequest, {
        clientId: 'client_CBHM',
        installationId: 'install',
        sessionId: 'session',
      });

      expect(response).toEqual(result.createException({error: 'error'}));
    });
  });

  describe('getUserDetailsService', () => {
    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.getUserDetailsService({
        installationId: 'id',
        sessionId: 'id',
        clientId: '',
      });

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should get the user details', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue({
        data: {
          iamguid: 'iamguid',
          user_id: '123',
          DFD_id: '456',
        },
      });

      const response = await service.getUserDetailsService({
        installationId: 'id',
        sessionId: 'id',
        clientId: '',
      });

      expect(response).toEqual(
        result.createSuccess({
          data: {
            iamguid: 'iamguid',
            user_id: '123',
            DFD_id: '456',
          },
        }),
      );
    });

    it('should return an generic error if the error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.getUserProfileDetails.mockRejectedValue(null);

      const response = await service.getUserDetailsService({
        installationId: 'id',
        sessionId: 'id',
        clientId: '',
      });

      expect(response).toEqual(result.createException(Messages.userFetchError));
    });

    it('should return an error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.getUserProfileDetails.mockRejectedValue({
        error: 'error',
      });

      const response = await service.getUserDetailsService({
        installationId: 'id',
        sessionId: 'id',
        clientId: '',
      });

      expect(response).toEqual(result.createException({error: 'error'}));
    });
  });

  describe('updateUserService', () => {
    const updateUserRequest: UpdateUserRequest = {
      iamguid: 'dfyu876567890-098ytrfghuiytyuio-tyui987yuiuyhg',
      employerType: 'BEACON',
      communication: {
        mobileNumber: '+19876543210',
        consent: true,
      },
    };
    const username = 'testUser';
    const secureToken = 'secureToken';

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.updateUserService(
        updateUserRequest,
        username,
        secureToken,
      );

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should return success if the user profile is updated', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.putEAPUserProfileDetails.mockResolvedValue({
        success: true,
      });

      const response = await service.updateUserService(
        updateUserRequest,
        username,
        secureToken,
      );

      expect(response).toEqual(result.createSuccess({success: true}));
    });

    it('should return an error if an error occurs during the update process', async () => {
      const error = new Error('Update failed');
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.putEAPUserProfileDetails.mockRejectedValue(
        error,
      );

      const response = await service.updateUserService(
        updateUserRequest,
        username,
        secureToken,
      );

      expect(response).toEqual(result.createException(error.message));
    });

    it('should return an error if an generic error occurs during the update process', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.putEAPUserProfileDetails.mockRejectedValue(
        null,
      );

      const response = await service.updateUserService(
        updateUserRequest,
        username,
        secureToken,
      );

      expect(response).toEqual(
        result.createException(Messages.updateUserProfileError),
      );
    });
  });

  describe('getEAPMemberAuthAccessToken', () => {
    it('should return the access token from the cache', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);

      const response = await service.getEAPMemberAuthAccessToken();

      expect(response).toEqual(accessToken);
    });

    it('should get the access token from the EAP service', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(
        accessToken,
      );
      (setCache as jest.Mock).mockResolvedValue(null);

      const response = await service.getEAPMemberAuthAccessToken();

      expect(response).toEqual(accessToken);
    });

    it('should return an error if an exception occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockRejectedValue(
        new Error(),
      );

      const response = await service.getEAPMemberAuthAccessToken();

      expect(response).toEqual(null);
    });
  });

  describe('forgotMemberPassword', () => {
    const forgotUserNameOrPasswordRequest: ForgotUserNameOrPasswordRequest = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      dob: '',
    };

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.forgotMemberPassword(
        forgotUserNameOrPasswordRequest,
      );

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should return user details on FUP', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.validateMemberDetails.mockResolvedValue({
        message: 'memberdata fetched successfully',
      });

      const response = await service.forgotMemberPassword(
        forgotUserNameOrPasswordRequest,
      );

      expect(response).toEqual(
        result.createSuccess({
          message: 'memberdata fetched successfully',
        }),
      );
    });

    it('should return an exception if an exception occurs', async () => {
      const error = new Error('Error while fetching user data');
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.validateMemberDetails.mockRejectedValue(
        error,
      );

      const response = await service.forgotMemberPassword(
        forgotUserNameOrPasswordRequest,
      );

      expect(response).toEqual(result.createException(error.message));
    });
  });

  describe('forgotMemberUserName', () => {
    const forgotUserNameOrPasswordRequest: ForgotUserNameOrPasswordRequest = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      dob: '',
    };

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.forgotMemberUserName(
        forgotUserNameOrPasswordRequest,
      );

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should return user details on FUP', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.forgotUserName.mockResolvedValue({
        message: 'user data fetched successfully',
      });

      const response = await service.forgotMemberUserName(
        forgotUserNameOrPasswordRequest,
      );

      expect(response).toEqual(
        result.createSuccess({
          message: 'user data fetched successfully',
        }),
      );
    });

    it('should return an exception if an exception occurs', async () => {
      const error = new Error('Error while fetching user data');
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.forgotUserName.mockRejectedValue(error);

      const response = await service.forgotMemberUserName(
        forgotUserNameOrPasswordRequest,
      );

      expect(response).toEqual(result.createException(error.message));
    });
  });

  describe('changePassword', () => {
    const changePasswordRequest: ChangePasswordRequest = {
      userName: '',
      newPassword: '',
    };
    const cookie = 'cookei';

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.changePassword(
        changePasswordRequest,
        cookie,
      );

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should change user password', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.postEAPMemberChangePassword.mockResolvedValue(
        {
          message: 'user data updated successfully',
        },
      );

      const response = await service.changePassword(
        changePasswordRequest,
        cookie,
      );

      expect(response).toEqual(
        result.createSuccess({
          message: 'user data updated successfully',
        }),
      );
    });

    it('should return error if any failure occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.postEAPMemberChangePassword.mockRejectedValue(
        {status: APIResponseConstants.failed},
      );

      const response = await service.changePassword(
        changePasswordRequest,
        cookie,
      );

      expect(response).toEqual(
        result.createException({status: APIResponseConstants.failed}),
      );
    });

    it('should return an exception if an exception occurs', async () => {
      const error = new Error('Error');
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.postEAPMemberChangePassword.mockRejectedValue(
        error,
      );

      const response = await service.changePassword(
        changePasswordRequest,
        cookie,
      );

      expect(response).toEqual(result.createException(error.message));
    });
  });

  describe('rememberDeviceService', () => {
    const userName = 'test';
    const cookie = 'testCookie';

    it('should return an error if the access token is not found', async () => {
      (getCache as jest.Mock).mockReturnValue(null);
      mockEapMemberProfileGateway.getEAPAccessToken.mockResolvedValue(null);

      const response = await service.rememberDeviceService(userName, cookie);

      expect(response).toEqual(
        result.createException(Messages.memberEAPauthorizationError),
      );
    });

    it('should remember the device', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.rememberDevice.mockResolvedValue({
        message: 'device remembered successfully',
      });

      const response = await service.rememberDeviceService(userName, cookie);

      expect(response).toEqual(
        result.createSuccess({
          message: 'device remembered successfully',
        }),
      );
    });

    it('should return an exception if an exception occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.rememberDevice.mockRejectedValue('error');

      const response = await service.rememberDeviceService(userName, cookie);

      expect(response).toEqual(result.createException('error'));
    });

    it('should return an error if an error occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.rememberDevice.mockRejectedValue(null);

      const response = await service.rememberDeviceService(userName, cookie);

      expect(response).toEqual(
        result.createException(Messages.rememberDeviceError),
      );
    });
  });

  describe('fetchMemberPreferencesService', () => {
    const userName = 'test';
    const clientName = 'clientName';

    it('should throw error if member data not found', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue(null);

      const response = await service.fetchMemberPreferencesService(
        userName,
        clientName,
      );

      expect(response).toEqual(
        result.createException(
          {
            errorType: APIResponseConstants.authFailed,
            message: Messages.userAuthError,
            statusCode: APIResponseConstants.user401,
            status: APIResponseConstants.failed,
          },
          APIResponseCodes.UNAUTHORIZED,
        ),
      );
    });

    it('should return member preferences', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue({
        preferences: {
          notifications: {
            enabled: false,
            topics: [],
          },
        },
      });

      const response = await service.fetchMemberPreferencesService(
        userName,
        clientName,
      );

      expect(response).toEqual(
        result.createSuccess({
          notifications: {
            enabled: false,
            topics: [],
          },
        }),
      );
    });

    it('should return an exception if an exception occurs', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockRejectedValue(
        'Error while fetching member preferences',
      );

      const response = await service.fetchMemberPreferencesService(
        userName,
        clientName,
      );

      expect(response).toEqual(
        result.createException('Error while fetching member preferences'),
      );
    });

    it('should return an generic error message if error is null', async () => {
      mockEapMemberProfileGateway.getMemberDbData.mockRejectedValue(null);

      const response = await service.fetchMemberPreferencesService(
        userName,
        clientName,
      );

      expect(response).toEqual(
        result.createException(Messages.fetchMemberPreferencesError),
      );
    });
  });

  describe('invalidateMemberSessionService', () => {
    const iamguid = 'iamguid';
    const clientName = 'test';

    it('should return success message if the session is invalidated', async () => {
      mockEapMemberProfileGateway.updateAuditTimeStamp.mockResolvedValue(
        updateDbSuccess,
      );
      (clearCache as jest.Mock).mockResolvedValue(1);
      const response = await service.invalidateMemberSessionService(
        iamguid,
        clientName,
      );

      expect(response).toEqual(
        result.createSuccess(Messages.memberSessionInvalidated),
      );
    });

    it('should return error message if the session is not invalidated', async () => {
      (clearCache as jest.Mock).mockResolvedValue(1);
      mockEapMemberProfileGateway.updateAuditTimeStamp.mockResolvedValue(
        updateDbFailed,
      );

      const response = await service.invalidateMemberSessionService(
        iamguid,
        clientName,
      );

      expect(response).toEqual(
        result.createException(Messages.invalidateSessionError),
      );
    });

    it('should return an exception if an exception occurs', async () => {
      mockEapMemberProfileGateway.updateAuditTimeStamp.mockRejectedValue(
        'Error while invalidating member session',
      );

      const response = await service.invalidateMemberSessionService(
        iamguid,
        clientName,
      );

      expect(response).toEqual(
        result.createException('Error while invalidating member session'),
      );
    });

    it('should return an generic message', async () => {
      mockEapMemberProfileGateway.updateAuditTimeStamp.mockRejectedValue(null);

      const response = await service.invalidateMemberSessionService(
        iamguid,
        clientName,
      );

      expect(response).toEqual(
        result.createException(Messages.invalidateSessionError),
      );
    });
  });

  describe('saveMemberPreferencesService', () => {
    const iamguid = 'test';
    const clientName = 'clientName';
    const memberPreferencesRequest: MemberPreferences = {
      pushNotifications: {
        enabled: false,
      },
    };

    it('should save member preferences', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.putMemberPreferences.mockResolvedValue(
        updateDbSuccess,
      );
      mockEapMemberProfileGateway.getMemberDbData.mockResolvedValue({
        preferences: {
          pushNotifications: {
            enabled: true,
            topics: ['topic1', 'topic2'],
          },
        },
      });

      const response = await service.saveMemberPreferencesService(
        iamguid,
        clientName,
        memberPreferencesRequest,
      );

      expect(response).toEqual(
        result.createSuccess(Messages.memberPreferencesUpdated),
      );
    });

    it('should return error if no changes are there to modify', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.putMemberPreferences.mockResolvedValue(
        updateDbFailed,
      );

      const response = await service.saveMemberPreferencesService(
        iamguid,
        clientName,
        memberPreferencesRequest,
      );

      expect(response).toEqual(
        result.createException(Messages.saveMemberPreferencesError),
      );
    });

    it('should return an exception if an exception occurs', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.putMemberPreferences.mockRejectedValue(
        'Error while saving member preferences',
      );

      const response = await service.saveMemberPreferencesService(
        iamguid,
        clientName,
        memberPreferencesRequest,
      );

      expect(response).toEqual(
        result.createException('Error while saving member preferences'),
      );
    });

    it('should return an generic error message if error is null', async () => {
      (getCache as jest.Mock).mockReturnValue(accessToken);
      mockEapMemberProfileGateway.putMemberPreferences.mockRejectedValue(null);

      const response = await service.saveMemberPreferencesService(
        iamguid,
        clientName,
        memberPreferencesRequest,
      );

      expect(response).toEqual(
        result.createException(Messages.saveMemberPreferencesError),
      );
    });
  });

  describe('refreshMemberAuthService', () => {
    const user: MemberOAuthPayload = {
      clientId: 'client_CBHM',
      installationId: 'install',
      sessionId: 'session',
    };

    it('should return new generated token', async () => {
      (generateToken as jest.Mock).mockReturnValue('token');

      const response = await service.refreshMemberAuthService(user);

      expect(response.data).not.toBeNull();
    });

    it('should return an error if an exception occurs', async () => {
      (generateToken as jest.Mock).mockImplementation(() => {
        throw new Error('Error while generating token');
      });

      const response = await service.refreshMemberAuthService(user);

      expect(response).toEqual(
        result.createException(Messages.somethingWentWrong),
      );
    });
  });

  describe('removeMemberAccountService', () => {
    const iamguid = 'iamguid';
    const username = 'username';
    const clientName = 'test';

    it('should set the member status to delete', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockResolvedValue(
        updateDbSuccess,
      );
      (getCache as jest.Mock).mockReturnValue('accessToken');
      mockEapMemberProfileGateway.getUserProfileDetails.mockResolvedValue({
        data: {user_id: '123', DFD_id: '456'},
        secureToken: 'secure',
      });
      mockEapMemberProfileGateway.disableUserAccount.mockResolvedValue(
        'disabled',
      );

      const response = await service.removeMemberAccountService(
        iamguid,
        username,
        clientName,
      );

      expect(response).toEqual(
        result.createSuccess(Messages.memberAccountDeleted),
      );
    });

    it('should return error if no modification happened', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockResolvedValue(
        updateDbFailed,
      );

      const response = await service.removeMemberAccountService(
        iamguid,
        username,
        clientName,
      );

      expect(response).toEqual(
        result.createException(Messages.disableMemberAccountError),
      );
    });

    it('should return an error if an error occurs', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockRejectedValue(
        'Error while fetching member account status',
      );

      const response = await service.removeMemberAccountService(
        iamguid,
        username,
        clientName,
      );

      expect(response).toEqual(
        result.createException('Error while fetching member account status'),
      );
    });

    it('should return generic error message', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockRejectedValue(
        null,
      );

      const response = await service.removeMemberAccountService(
        iamguid,
        username,
        clientName,
      );

      expect(response).toEqual(
        result.createException(Messages.disableMemberAccountError),
      );
    });
  });

  describe('setMemberAccountStatusService', () => {
    const iamguid = 'iamguid';
    const clientName = 'test';
    const status = MemberAccountStatus.ACTIVE;

    it('Should return error if invalid status is provided', async () => {
      const response = await service.setMemberAccountStatusService(
        iamguid,
        clientName,
        'NotActive',
      );

      expect(response).toEqual(
        result.createException(`${Messages.invalidMemberStatus} 'NotActive'`),
      );
    });

    it('should set the member status', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockResolvedValue(
        updateDbSuccess,
      );

      const response = await service.setMemberAccountStatusService(
        iamguid,
        clientName,
        status,
      );

      expect(response).toEqual(
        result.createSuccess(Messages.setMemberAccountStatus),
      );
    });

    it('should return error if no modification happened', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockResolvedValue(
        updateDbFailed,
      );

      const response = await service.setMemberAccountStatusService(
        iamguid,
        clientName,
        status,
      );

      expect(response).toEqual(
        result.createException(Messages.setMemberAccountStatusError),
      );
    });

    it('should return an error if an error occurs', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockRejectedValue(
        'Error while fetching member account status',
      );

      const response = await service.setMemberAccountStatusService(
        iamguid,
        clientName,
        status,
      );

      expect(response).toEqual(
        result.createException('Error while fetching member account status'),
      );
    });

    it('should return generic error message', async () => {
      mockEapMemberProfileGateway.setMemberAccountStatus.mockRejectedValue(
        null,
      );

      const response = await service.setMemberAccountStatusService(
        iamguid,
        clientName,
        status,
      );

      expect(response).toEqual(
        result.createException(Messages.setMemberAccountStatusError),
      );
    });
  });
});
