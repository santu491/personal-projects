import {HeaderKeys} from '../../constants';
import {
  AuthenticationRequest,
  ChangePasswordRequest,
  CreateUserRequest,
  ForgotUserNameOrPasswordRequest,
  MemberPreferences,
  SendOtpRequest,
  ValidateOtpRequest,
} from '../../types/eapMemberProfileModel';
import {APP} from '../../utils/app';
import {mockDynamoDBGateway} from '../../utils/baseTest';
import {axiosGet, axiosPost} from '../../utils/httpUtil';
import {
  eapMemberAuthConfigData,
  mockEapMemberRegistrationRequest,
} from '../../utils/mockData';
import {EAPMemberProfileGateway} from '../eapMemberProfileGateway';

jest.mock('../../utils/httpUtil');

jest.mock('../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

describe('eapMemberProfileGateway', () => {
  const mockAccessToken = 'testAccessToken';
  const mockClient = 'testClient';
  const mockSearchData = 'testSearchData';
  let gateway: EAPMemberProfileGateway;

  beforeEach(() => {
    jest.clearAllMocks();
    APP.config.memberAuth = eapMemberAuthConfigData;
    gateway = new EAPMemberProfileGateway();
  });

  describe('getEAPAccessToken', () => {
    it('should return access token', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {access_token: mockAccessToken},
      });

      const result = await gateway.getEAPAccessToken();

      expect(result).toBe(mockAccessToken);
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if status is not 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 404,
      });

      const result = await gateway.getEAPAccessToken();

      expect(result).toBe(null);
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      const result = await gateway.getEAPAccessToken();

      expect(result).toBeNull();
      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('userLookup', () => {
    it('should return User found if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {message: false},
      });

      const result = await gateway.userLookup(mockSearchData, mockAccessToken);

      expect(result).toEqual({
        message: false,
      });
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway.userLookup(mockSearchData, mockAccessToken).catch(error => {
        expect(error).toBe('error');
      });

      expect(axiosPost).toHaveBeenCalled;
    });
  });

  describe('postMemberRegistration', () => {
    const registerRequest: CreateUserRequest = mockEapMemberRegistrationRequest;

    it('should return success if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {client: mockClient},
      });

      const result = await gateway.postMemberRegistration(
        registerRequest,
        mockAccessToken,
      );

      expect(result).toEqual({client: mockClient});
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway
        .postMemberRegistration(registerRequest, mockAccessToken)
        .catch(error => {
          expect(error).toBe('error');
        });

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('authenticateMember', () => {
    const mockAuthenticationRequest: AuthenticationRequest = {
      username: 'testUser',
      pdsw: 'testPassword',
    };
    const mockAuthenticationResponse = {
      authenticated: true,
      token: 'authToken',
    };

    it('should authenticate member successfully and return data if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockAuthenticationResponse,
      });

      const result = await gateway.authenticateMember(
        mockAuthenticationRequest,
        mockAccessToken,
      );

      expect(result).toEqual(mockAuthenticationResponse);
      expect(axiosPost).toHaveBeenCalledWith(
        expect.stringContaining(APP.config.memberAuth.eap.loginMember),
        mockAuthenticationRequest,
        expect.objectContaining({
          [HeaderKeys.AUTHORIZATION]: `Bearer ${mockAccessToken}`,
        }),
      );
    });

    it('should return null and log error if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway
        .authenticateMember(mockAuthenticationRequest, mockAccessToken)
        .catch(error => {
          expect(error).toBe('error');
        });

      expect(axiosPost).toHaveBeenCalled();
      // Assuming getLogger().error is mocked somewhere globally or its effect is not being tested here
    });
  });

  describe('forgotUserName', () => {
    const payload: ForgotUserNameOrPasswordRequest = {
      firstName: '',
      lastName: '',
      dob: '',
      emailAddress: '',
    };

    it('should return success if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {client: mockClient},
      });

      const result = await gateway.forgotUserName(payload, mockAccessToken);

      expect(result).toEqual({client: mockClient});
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if status is not 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 404,
      });

      await gateway.forgotUserName(payload, mockAccessToken).catch(error =>
        expect(error).toEqual({
          status: 404,
        }),
      );

      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway.forgotUserName(payload, mockAccessToken).catch(error => {
        expect(error).toBe('error');
      });

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('validateMemberDetails', () => {
    const payload: ForgotUserNameOrPasswordRequest = {
      firstName: '',
      lastName: '',
      dob: '',
      emailAddress: '',
    };

    it('should return success if status is 200', async () => {
      const returnData = {
        status: 200,
        data: {
          client: mockClient,
          status: 'SUCCESS',
        },
      };
      (axiosPost as jest.Mock).mockResolvedValue(returnData);

      const result = await gateway.validateMemberDetails(
        payload,
        mockAccessToken,
      );

      expect(result).toEqual(returnData.data);
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if status is not 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 404,
      });

      await gateway
        .validateMemberDetails(payload, mockAccessToken)
        .catch(error =>
          expect(error).toEqual({
            status: 404,
          }),
        );

      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway
        .validateMemberDetails(payload, mockAccessToken)
        .catch(error => {
          expect(error).toBe('error');
        });

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('postEAPMemberChangePassword', () => {
    const payload: ChangePasswordRequest = {
      userName: '',
      newPassword: '',
    };

    it('should return success if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {client: mockClient, status: 'SUCCESS'},
      });

      const result = await gateway.postEAPMemberChangePassword(
        payload,
        mockAccessToken,
        'testCookie',
      );

      expect(result).toEqual({client: mockClient, status: 'SUCCESS'});
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if status is not 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 404,
      });

      await gateway
        .postEAPMemberChangePassword(payload, mockAccessToken, 'testCookie')
        .catch(error => {
          expect(error).toEqual({
            status: 404,
          });
        });

      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway
        .postEAPMemberChangePassword(payload, mockAccessToken, 'testCookie')
        .catch(error => {
          expect(error).toBe('error');
        });

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('sendOtp', () => {
    const payload: SendOtpRequest = {
      channel: '',
      userName: '',
      pingRiskId: '',
    };

    it('should return success if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {client: mockClient},
      });

      const result = await gateway.sendOtp(payload, mockAccessToken);

      expect(result).toEqual({client: mockClient});
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway.sendOtp(payload, mockAccessToken).catch(error => {
        expect(error).toBe('error');
      });

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('validateOtp', () => {
    const payload: ValidateOtpRequest = {
      otp: '',
      rememberDevice: '',
      pingRiskId: '',
      pingDeviceId: '',
      pingUserId: '',
      userName: '',
      flowName: '',
    };

    it('should return success if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {client: mockClient},
        headers: {'set-cookie': ['set-cookie']},
      });

      const result = await gateway.validateOtp(payload, mockAccessToken);

      expect(result).toEqual({client: mockClient, cookie: 'set-cookie'});
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway.validateOtp(payload, mockAccessToken).catch(error => {
        expect(error).toBe('error');
      });

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('getUserContactDetailsData', () => {
    it('should return success if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: {client: mockClient},
      });

      const result = await gateway.getUserContactDetailsData(
        mockSearchData,
        mockAccessToken,
      );

      expect(result).toEqual({client: mockClient});
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('error');

      await gateway
        .getUserContactDetailsData(mockSearchData, mockAccessToken)
        .catch(error => {
          expect(error).toBe('error');
        });

      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('getUserProfileDetails', () => {
    it('should return success if status is 200', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        status: 200,
        data: {client: mockClient},
      });

      const result = await gateway.getUserProfileDetails(
        mockSearchData,
        mockAccessToken,
      );

      expect(result).toEqual({client: mockClient});
      expect(axiosGet).toHaveBeenCalled();
    });

    it('should return null if status is not 200', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        status: 404,
      });

      const result = await gateway.getUserProfileDetails(
        mockSearchData,
        mockAccessToken,
      );

      expect(result).toBeNull();
      expect(axiosGet).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosGet as jest.Mock).mockRejectedValue('error');

      await gateway
        .getUserProfileDetails(mockSearchData, mockAccessToken)
        .catch(error => {
          expect(error).toBe('error');
        });

      expect(axiosGet).toHaveBeenCalled();
    });
  });

  describe('putEAPUserProfileDetails', () => {
    const mockUserName = 'testUser';
    const mockAccessToken = 'testAccessToken';
    const mockSecureToken = 'testSecureToken';
    const mockUpdateUserRequest = {
      iamguid: 'dfyu876567890-098ytrfghuiytyuio-tyui987yuiuyhg',
      employerType: 'BEACON',
      communication: {
        mobileNumber: '+19876543210',
        consent: true,
      },
    };
    const mockResponseData = {token: 'secureToken', success: true};

    it('should return updated profile details if status is 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockResponseData,
      });

      const result = await gateway.putEAPUserProfileDetails(
        mockUpdateUserRequest,
        mockUserName,
        mockAccessToken,
        mockSecureToken,
      );

      expect(result).toEqual(mockResponseData);
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should return null if status is not 200', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 404,
      });

      const result = await gateway.putEAPUserProfileDetails(
        mockUpdateUserRequest,
        mockUserName,
        mockAccessToken,
        mockSecureToken,
      );

      expect(result).toBeNull();
      expect(axiosPost).toHaveBeenCalled();
    });

    it('should throw an error if request fails', async () => {
      const mockError = new Error('Network Error');
      (axiosPost as jest.Mock).mockRejectedValue(mockError);

      await expect(
        gateway.putEAPUserProfileDetails(
          mockUpdateUserRequest,
          mockUserName,
          mockAccessToken,
          mockSecureToken,
        ),
      ).rejects.toThrow(mockError);
      expect(axiosPost).toHaveBeenCalled();
    });
  });

  describe('rememberDevice', () => {
    it('should return success if status is 200', async () => {
      (axiosGet as jest.Mock).mockResolvedValue({
        status: 200,
        headers: {'set-cookie': ['set-cookie']},
        data: {client: mockClient},
      });

      const result = await gateway.rememberDevice('', '', mockAccessToken);

      expect(result).toEqual({client: mockClient, deviceCookie: 'set-cookie'});
      expect(axiosGet).toHaveBeenCalled();
    });

    it('should return null if request fails', async () => {
      (axiosGet as jest.Mock).mockRejectedValue('error');

      await gateway.rememberDevice('', '', mockAccessToken).catch(error => {
        expect(error).toBe('error');
      });

      expect(axiosGet).toHaveBeenCalled();
    });
  });

  describe('getMemberDbData', () => {
    it('should return member Data', async () => {
      mockDynamoDBGateway.getRecords.mockResolvedValue({
        data: {
          isSuccess: true,
          value: {client: mockClient},
        },
      });

      const result = await gateway.getMemberDbData(mockSearchData, mockClient);

      expect(result).toEqual({client: mockClient});
    });

    it('should return null if get operation fails', async () => {
      mockDynamoDBGateway.getRecords.mockResolvedValue(null);

      const result = await gateway.getMemberDbData(mockSearchData, mockClient);

      expect(result).toBeNull();
    });

    it('should return null if request fails', async () => {
      mockDynamoDBGateway.getRecords.mockRejectedValue('error');

      await gateway.getMemberDbData(mockSearchData, mockClient).catch(error => {
        expect(error).toBe('error');
      });

      expect(mockDynamoDBGateway.getRecords).toHaveBeenCalled();
    });
  });

  describe('updateAuditTimeStamp', () => {
    it('should update timestamp', async () => {
      mockDynamoDBGateway.updateRecord.mockResolvedValue({
        data: {
          isSuccess: true,
          value: {client: mockClient},
        },
      });

      const result = await gateway.updateAuditTimeStamp(
        mockSearchData,
        mockClient,
        mockClient,
      );

      expect(result).toEqual({client: mockClient});
    });

    it('should return null if update fails', async () => {
      mockDynamoDBGateway.updateRecord.mockResolvedValue(null);

      const result = await gateway.updateAuditTimeStamp(
        mockSearchData,
        mockClient,
        mockClient,
      );

      expect(result).toBeNull();
    });

    it('should return null if request fails', async () => {
      mockDynamoDBGateway.updateRecord.mockRejectedValue('error');

      await gateway
        .updateAuditTimeStamp(mockSearchData, mockClient, mockClient)
        .catch(error => {
          expect(error).toBe('error');
        });

      expect(mockDynamoDBGateway.updateRecord).toHaveBeenCalled();
    });
  });

  describe('setMemberAccountStatus', () => {
    it('should update account status', async () => {
      mockDynamoDBGateway.updateRecord.mockResolvedValue({
        data: {
          isSuccess: true,
          value: {client: mockClient},
        },
      });

      const result = await gateway.setMemberAccountStatus(
        mockSearchData,
        mockClient,
        'status',
      );

      expect(result).toEqual({client: mockClient});
    });

    it('should return null if any error while updating', async () => {
      mockDynamoDBGateway.updateRecord.mockResolvedValue(null);

      const result = await gateway.setMemberAccountStatus(
        mockSearchData,
        mockClient,
        'status',
      );

      expect(result).toBeNull();
    });

    it('should throw error while updating member account status', async () => {
      mockDynamoDBGateway.updateRecord.mockRejectedValue({
        data: {
          isSuccess: true,
          value: {client: mockClient},
        },
      });

      await gateway
        .setMemberAccountStatus(mockSearchData, mockClient, 'status')
        .catch(error => {
          expect(error).toBeDefined();
        });
    });
  });

  describe('putMemberPreferences', () => {
    const memberPreferencesRequest: MemberPreferences = {
      pushNotifications: {
        enabled: false,
        topics: [],
      },
    };
    it('should update member preferences', async () => {
      mockDynamoDBGateway.updateRecord.mockResolvedValue({
        data: {
          isSuccess: true,
          value: {client: mockClient},
        },
      });

      const result = await gateway.putMemberPreferences(
        mockSearchData,
        mockClient,
        memberPreferencesRequest,
      );

      expect(result).toEqual({client: mockClient});
    });

    it('should return null if any error while update', async () => {
      mockDynamoDBGateway.updateRecord.mockResolvedValue(null);

      const result = await gateway.putMemberPreferences(
        mockSearchData,
        mockClient,
        memberPreferencesRequest,
      );

      expect(result).toBeNull();
    });
    it('should throw error while updating member preferences', async () => {
      mockDynamoDBGateway.updateRecord.mockRejectedValue({
        data: {
          isSuccess: false,
          value: {client: mockClient},
        },
      });

      await gateway
        .putMemberPreferences(
          mockSearchData,
          mockClient,
          memberPreferencesRequest,
        )
        .catch(error => {
          expect(error).toBeDefined();
        });
    });
  });

  describe('disableUserAccount', () => {
    it('should disable user account and return data', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 200,
        data: 'user disabled',
      });

      const response = await gateway.disableUserAccount(
        'username',
        'access',
        'secure',
      );

      expect(response).toBe('user disabled');
    });

    it('should return null on failure', async () => {
      (axiosPost as jest.Mock).mockResolvedValue({
        status: 400,
        data: 'user not disabled',
      });

      const response = await gateway.disableUserAccount(
        'username',
        'access',
        'secure',
      );

      expect(response).toBeNull();
    });

    it('should return null on exception', async () => {
      (axiosPost as jest.Mock).mockRejectedValue({
        errors: [],
      });

      const response = await gateway.disableUserAccount(
        'username',
        'access',
        'secure',
      );

      expect(response).toBeNull();
    });
  });
});
