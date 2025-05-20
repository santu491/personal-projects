import {Messages, ServiceConstants} from '../../constants';
import {MemberOAuthPayload} from '../../types/customRequest';
import {
  AuthenticationRequest,
  ChangePasswordRequest,
  CreateUserRequest,
  ForgotUserNameOrPasswordRequest,
  MemberPreferences,
  SendOtpRequest,
  UpdateUserRequest,
  ValidateOtpRequest,
} from '../../types/eapMemberProfileModel';
import {mockEapMemberProfileService, mockResult} from '../../utils/baseTest';
import {mockEapMemberRegistrationRequest} from '../../utils/mockData';
import {ResponseUtil} from '../../utils/responseUtil';
import {MemberProfileController} from '../memberProfileController';

jest.mock('../../services/eap/eapMemberProfileService', () => ({
  EAPMemberProfileService: jest.fn(() => mockEapMemberProfileService),
}));

const userData: MemberOAuthPayload = {
  clientId: 'clientId',
  installationId: 'installationId',
  sessionId: 'sessionId',
};

describe('MemberProfileController', () => {
  const responseUtil = new ResponseUtil();
  let controller: MemberProfileController;

  const invalidAuthError = responseUtil.createException(
    Messages.invalidAuthError,
    400,
  );

  const invalidSourceError = responseUtil.createException(
    Messages.invalidSource,
    400,
  );

  beforeEach(() => {
    controller = new MemberProfileController();
  });

  describe('memberLookUp', () => {
    const source = ServiceConstants.STRING_EAP;
    it('should return client details', async () => {
      mockEapMemberProfileService.getMemberLookupStatus.mockResolvedValue(
        'client details',
      );
      const result = await controller.memberLookup(source, 'test');

      expect(result).toBe('client details');
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.getMemberLookupStatus.mockRejectedValue(
        new Error('error'),
      );
      const result = await controller.memberLookup(source, 'test');

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('registerUser', () => {
    const source = ServiceConstants.STRING_EAP;
    const registrationRequest: CreateUserRequest =
      mockEapMemberRegistrationRequest;

    it('should register a new user', async () => {
      mockEapMemberProfileService.createUserService.mockResolvedValue(
        'success',
      );

      const result = await controller.createMemberProfile(
        source,
        registrationRequest,
      );

      expect(result).toBe('success');
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.createUserService.mockRejectedValue(
        new Error('error'),
      );

      const result = await controller.createMemberProfile(
        source,
        registrationRequest,
      );

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('authenticateMemberProfile', () => {
    const source = ServiceConstants.STRING_EAP;
    const authenticationRequest: AuthenticationRequest = {
      username: 'testUser',
      pdsw: 'testPass',
    };

    it('should authenticate a member profile successfully', async () => {
      mockEapMemberProfileService.authenticateUserService.mockResolvedValue(
        'authenticated',
      );

      const result = await controller.authenticateMemberProfile(
        source,
        '',
        authenticationRequest,
        userData,
      );

      expect(result).toBe('authenticated');
    });

    it('should return an error if an exception occurs during authentication', async () => {
      mockEapMemberProfileService.authenticateUserService.mockRejectedValue(
        new Error('authentication failed'),
      );

      const result = await controller.authenticateMemberProfile(
        source,
        '',
        authenticationRequest,
        userData,
      );

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('sendOtp', () => {
    const source = ServiceConstants.STRING_EAP;
    const sendOtpRequest: SendOtpRequest = {
      channel: 'email',
      userName: 'testUser',
      pingRiskId: '12345',
    };

    it('should send an OTP successfully', async () => {
      mockEapMemberProfileService.sendOtpService.mockResolvedValue('OTP sent');

      const result = await controller.sendOtp(source, sendOtpRequest);

      expect(result).toBe('OTP sent');
    });

    it('should return an error if an exception occurs during sending OTP', async () => {
      mockEapMemberProfileService.sendOtpService.mockRejectedValue(
        new Error('OTP sending failed'),
      );

      const result = await controller.sendOtp(source, sendOtpRequest);

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('validateOtp', () => {
    const source = ServiceConstants.STRING_EAP;
    const validateOtpRequest: ValidateOtpRequest = {
      otp: '123456',
      userName: 'testUser',
      rememberDevice: 'Y',
      pingRiskId: '12345',
      pingDeviceId: '67890',
      pingUserId: '09876',
      flowName: 'login',
    };

    it('should validate OTP successfully', async () => {
      mockEapMemberProfileService.validateOtpService.mockResolvedValue(
        'OTP validated',
      );

      const result = await controller.validateOtp(
        source,
        validateOtpRequest,
        userData,
      );

      expect(result).toBe('OTP validated');
    });

    it('should return an error if an exception occurs during OTP validation', async () => {
      mockEapMemberProfileService.validateOtpService.mockRejectedValue(
        new Error('OTP validation failed'),
      );

      const result = await controller.validateOtp(
        source,
        validateOtpRequest,
        userData,
      );

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('getMemberContactDetails', () => {
    const source = ServiceConstants.STRING_EAP;
    const isEmailVerified = true;
    const userName = 'exampleUserName';

    it('should return masked user data', async () => {
      mockEapMemberProfileService.getUserContactDetailsService.mockResolvedValue(
        'masked user data',
      );

      const result = await controller.getMemberContactDetails(
        source,
        userName,
        isEmailVerified,
      );

      expect(result).toBe('masked user data');
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.getUserContactDetailsService.mockRejectedValue(
        new Error('error'),
      );

      const result = await controller.getMemberContactDetails(
        source,
        userName,
        false,
      );

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('getMemberProfile', () => {
    const source = ServiceConstants.STRING_EAP;
    const user: MemberOAuthPayload = {
      clientId: '',
      userName: 'testUser',
      iamguid: 'iamguid',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    it('should return error if userName not found in user Object', async () => {
      const result = await controller.getMemberProfile(source, userData);

      expect(result).toEqual(invalidAuthError);
    });

    it('should return user details', async () => {
      mockEapMemberProfileService.getUserDetailsService.mockResolvedValue(
        'user details',
      );

      const result = await controller.getMemberProfile(source, user);

      expect(result).toBe('user details');
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.getUserDetailsService.mockRejectedValue(
        new Error('error'),
      );

      const result = await controller.getMemberProfile(source, user);

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('updateMemberProfile', () => {
    const source = ServiceConstants.STRING_EAP;
    const secureToken = 'secureToken';
    const payload: MemberOAuthPayload = {
      clientId: '',
      userName: 'testUser',
      iamguid: 'iamguid',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };
    const updateUserRequest: UpdateUserRequest = {
      iamguid: 'dfyu876567890-098ytrfghuiytyuio-tyui987yuiuyhg',
      employerType: 'BEACON',
      communication: {
        mobileNumber: '+19876543210',
        consent: true,
      },
    };

    it('should update the user profile successfully', async () => {
      mockEapMemberProfileService.updateUserService.mockResolvedValue(
        'updated',
      );

      const result = await controller.updateMemberProfile(
        source,
        secureToken,
        payload,
        updateUserRequest,
      );

      expect(result).toBe('updated');
    });

    it('should return an error if the userName is missing in the payload', async () => {
      const invalidPayload: MemberOAuthPayload = {
        clientId: '',
        userName: '',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };

      const result = await controller.updateMemberProfile(
        source,
        secureToken,
        invalidPayload,
        updateUserRequest,
      );

      expect(result).toEqual(invalidAuthError);
    });

    it('should return an error if an exception occurs during the update process', async () => {
      const error = new Error('update failed');
      mockEapMemberProfileService.updateUserService.mockRejectedValue(error);

      const result = await controller.updateMemberProfile(
        source,
        secureToken,
        payload,
        updateUserRequest,
      );

      expect(result).toEqual(error);
    });
  });

  describe('sendOtp', () => {
    const source = ServiceConstants.STRING_EAP;
    const sendOtpRequest: SendOtpRequest = {
      channel: '',
      userName: '',
      pingRiskId: '',
    };

    it('should send an OTP', async () => {
      mockEapMemberProfileService.sendOtpService.mockResolvedValue('success');

      const result = await controller.sendOtp(source, sendOtpRequest);

      expect(result).toBe('success');
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.sendOtpService.mockRejectedValue(
        new Error('error'),
      );

      const result = await controller.sendOtp(source, sendOtpRequest);

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('validateOtp', () => {
    const source = ServiceConstants.STRING_EAP;
    const validateOtpRequest: ValidateOtpRequest = {
      otp: '',
      rememberDevice: '',
      pingRiskId: '',
      pingDeviceId: '',
      pingUserId: '',
      userName: '',
      flowName: '',
    };

    it('should validate an OTP', async () => {
      mockEapMemberProfileService.validateOtpService.mockResolvedValue(
        'success',
      );

      const result = await controller.validateOtp(
        source,
        validateOtpRequest,
        userData,
      );

      expect(result).toBe('success');
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.validateOtpService.mockRejectedValue(
        new Error('error'),
      );

      const result = await controller.validateOtp(
        source,
        validateOtpRequest,
        userData,
      );

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('forgotPassword', () => {
    const source = ServiceConstants.STRING_EAP;
    const forgotMemberPasswordRequest: ForgotUserNameOrPasswordRequest = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      dob: '',
    };

    it('should validate an OTP', async () => {
      mockEapMemberProfileService.forgotMemberPassword.mockResolvedValue(
        'success',
      );
      const result = await controller.forgotPassword(
        source,
        forgotMemberPasswordRequest,
      );

      expect(result).toBe('success');
    });

    it('should validate an OTP', async () => {
      mockResult.createException.mockReturnValue('error');
      const result = await controller.forgotPassword(
        'source',
        forgotMemberPasswordRequest,
      );

      expect(result).toEqual(invalidSourceError);
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.forgotMemberPassword.mockRejectedValue(
        new Error('error'),
      );
      const result = await controller.forgotPassword(
        source,
        forgotMemberPasswordRequest,
      );

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('updatePassword', () => {
    const source = ServiceConstants.STRING_EAP;
    const cookie = 'testCookie';
    const changePass: ChangePasswordRequest = {
      userName: 'test',
      newPassword: '',
    };
    const user: MemberOAuthPayload = {
      userName: 'test',
      clientId: 'TEST',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    it('should validate an OTP', async () => {
      mockEapMemberProfileService.changePassword.mockResolvedValue('success');
      const result = await controller.updatePassword(
        source,
        cookie,
        changePass,
        user,
      );

      expect(result).toBe('success');
    });

    it('should validate an OTP', async () => {
      mockResult.createException.mockReturnValue('error');
      const result = await controller.updatePassword(
        'source',
        cookie,
        changePass,
        user,
      );

      expect(result).toEqual(invalidSourceError);
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.changePassword.mockRejectedValue(
        new Error('error'),
      );
      const result = await controller.updatePassword(
        source,
        cookie,
        changePass,
        user,
      );

      expect(result).toBeInstanceOf(Error);
    });

    it('should return an error if an not a valid user occurs', async () => {
      user.userName = 'test1';
      const result = await controller.updatePassword(
        source,
        cookie,
        changePass,
        user,
      );

      expect(result).toEqual({
        errors: [{message: Messages.badRequest}],
        statusCode: 500,
      });
    });

    it('should return an error if not valid authorization', async () => {
      user.userName = undefined;
      const result = await controller.updatePassword(
        source,
        cookie,
        changePass,
        user,
      );

      expect(result).toEqual({
        errors: [{message: Messages.invalidAuthError}],
        statusCode: 500,
      });
    });
  });

  describe('forgotUserName', () => {
    const source = ServiceConstants.STRING_EAP;
    const forgotUserName: ForgotUserNameOrPasswordRequest = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      dob: '',
    };

    it('should validate an OTP', async () => {
      mockEapMemberProfileService.forgotMemberUserName.mockResolvedValue(
        'success',
      );
      const result = await controller.forgotUserName(source, forgotUserName);

      expect(result).toBe('success');
    });

    it('should validate an OTP', async () => {
      mockResult.createException.mockReturnValue('error');
      const result = await controller.forgotUserName('source', forgotUserName);

      expect(result).toEqual(invalidSourceError);
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.forgotMemberUserName.mockRejectedValue(
        new Error('error'),
      );
      const result = await controller.forgotUserName(source, forgotUserName);

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('rememberDevice', () => {
    const source = ServiceConstants.STRING_EAP;
    const user: MemberOAuthPayload = {
      clientId: source,
      userName: 'test',
      iamguid: 'test',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };
    const cookie = 'testCookie';

    it('should return error if userName not present', async () => {
      const result = await controller.rememberDevice(source, cookie, {
        clientId: source,
        installationId: 'installationId',
        sessionId: 'sessionId',
      });

      expect(result).toEqual(invalidAuthError);
    });

    it('should remember device', async () => {
      mockEapMemberProfileService.rememberDeviceService.mockResolvedValue(
        'success',
      );
      const result = await controller.rememberDevice(source, cookie, user);

      expect(result).toBe('success');
    });

    it('should return an error if an exception occurs', async () => {
      mockEapMemberProfileService.rememberDeviceService.mockRejectedValue(
        new Error('error'),
      );
      const result = await controller.rememberDevice(source, cookie, user);

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('fetchMemberPreferences', () => {
    const source = ServiceConstants.STRING_EAP;
    const user: MemberOAuthPayload = {
      clientId: source,
      userName: 'test',
      iamguid: 'test',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    it('should return error if userName not present', async () => {
      const result = await controller.fetchMemberPreferences(source, {
        clientId: source,
        installationId: 'installationId',
        sessionId: 'sessionId',
      });

      expect(result).toEqual(invalidAuthError);
    });

    it('should fetch member preferences', async () => {
      mockEapMemberProfileService.fetchMemberPreferencesService.mockResolvedValue(
        'success',
      );
      const result = await controller.fetchMemberPreferences(source, user);

      expect(result).toEqual('success');
    });

    it('should return an error if an exception occurs', async () => {
      const error = new Error('error');
      mockEapMemberProfileService.fetchMemberPreferencesService.mockRejectedValue(
        error,
      );
      const result = await controller.fetchMemberPreferences(source, user);

      expect(result).toEqual(error);
    });
  });

  describe('saveMemberPreferences', () => {
    const source = ServiceConstants.STRING_EAP;
    const user: MemberOAuthPayload = {
      clientId: source,
      userName: 'test',
      iamguid: 'test',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };
    const memberPreferenceRequest: MemberPreferences = {
      pushNotifications: {
        enabled: false,
        topics: [],
      },
    };

    it('should return error if userName not present', async () => {
      const result = await controller.saveMemberPreferences(
        source,
        memberPreferenceRequest,
        {
          clientId: source,
          installationId: 'installationId',
          sessionId: 'sessionId',
        },
      );

      expect(result).toEqual(invalidAuthError);
    });

    it('should save member preferences', async () => {
      mockEapMemberProfileService.saveMemberPreferencesService.mockResolvedValue(
        'success',
      );
      const result = await controller.saveMemberPreferences(
        source,
        memberPreferenceRequest,
        user,
      );

      expect(result).toEqual('success');
    });

    it('should return an error if an exception occurs', async () => {
      const error = new Error('error');
      mockEapMemberProfileService.saveMemberPreferencesService.mockRejectedValue(
        error,
      );
      const result = await controller.saveMemberPreferences(
        source,
        memberPreferenceRequest,
        user,
      );

      expect(result).toEqual(error);
    });
  });

  describe('refreshMemberAuth', () => {
    const source = ServiceConstants.STRING_EAP;
    const user: MemberOAuthPayload = {
      clientId: source,
      userName: 'test',
      iamguid: 'test',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    it('should return error if userName not present', async () => {
      const result = await controller.refreshMemberAuth(source, {
        clientId: source,
        installationId: 'installationId',
        sessionId: 'sessionId',
      });

      expect(result).toEqual(invalidAuthError);
    });

    it('should send new refreshed token', async () => {
      mockEapMemberProfileService.refreshMemberAuthService.mockResolvedValue(
        'success',
      );
      const result = await controller.refreshMemberAuth(source, user);

      expect(result).toEqual('success');
    });

    it('should return an error if an exception occurs', async () => {
      const error = new Error('error');
      mockEapMemberProfileService.refreshMemberAuthService.mockRejectedValue(
        error,
      );
      const result = await controller.refreshMemberAuth(source, user);

      expect(result).toEqual(error);
    });
  });

  describe('invalidateMemberSession', () => {
    const source = ServiceConstants.STRING_EAP;
    const user: MemberOAuthPayload = {
      clientId: source,
      userName: 'test',
      iamguid: 'test',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    it('should return error if userName not present', async () => {
      const result = await controller.invalidateMemberSession(source, {
        clientId: source,
        installationId: 'installationId',
        sessionId: 'sessionId',
      });

      expect(result).toEqual(invalidAuthError);
    });

    it('should invalidate member session', async () => {
      mockEapMemberProfileService.invalidateMemberSessionService.mockResolvedValue(
        'success',
      );
      const result = await controller.invalidateMemberSession(source, user);

      expect(result).toEqual('success');
    });

    it('should return an error if an exception occurs', async () => {
      const error = new Error('error');
      mockEapMemberProfileService.invalidateMemberSessionService.mockRejectedValue(
        error,
      );
      const result = await controller.invalidateMemberSession(source, user);

      expect(result).toEqual(error);
    });
  });

  describe('removeMemberProfile', () => {
    const source = ServiceConstants.STRING_EAP;
    const user: MemberOAuthPayload = {
      clientId: source,
      userName: 'test',
      iamguid: 'test',
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };

    it('should return error if userName not present', async () => {
      const result = await controller.removeMemberProfile(source, {
        clientId: source,
        installationId: 'installationId',
        sessionId: 'sessionId',
      });

      expect(result).toEqual(invalidAuthError);
    });

    it('should remove member profile', async () => {
      mockEapMemberProfileService.removeMemberAccountService.mockResolvedValue(
        'success',
      );
      const result = await controller.removeMemberProfile(source, user);

      expect(result).toEqual('success');
    });

    it('should return an error if an exception occurs', async () => {
      const error = new Error('error');
      mockEapMemberProfileService.removeMemberAccountService.mockRejectedValue(
        error,
      );
      const result = await controller.removeMemberProfile(source, user);

      expect(result).toEqual(error);
    });
  });

  describe('setMemberProfileStatus', () => {
    const source = ServiceConstants.STRING_EAP;

    it('should set member profile status', async () => {
      mockEapMemberProfileService.setMemberAccountStatusService.mockResolvedValue(
        'success',
      );
      const result = await controller.setMemberProfileStatus(
        source,
        'iamguid',
        'active',
        'clientName',
      );

      expect(result).toEqual('success');
    });

    it('should return an error if an exception occurs', async () => {
      const error = new Error('error');
      mockEapMemberProfileService.setMemberAccountStatusService.mockRejectedValue(
        error,
      );
      const result = await controller.setMemberProfileStatus(
        source,
        'iamguid',
        'active',
        'clientName',
      );

      expect(result).toEqual(error);
    });
  });
});
