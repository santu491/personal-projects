import { API_RESPONSE, memberInfo } from '@anthem/communityapi/common';
import {
  mockAccessTokenHelperSvc,
  mockLoginCommercialSvc,
  mockLoginHelperSvc,
  mockLoginMedicaidSvc,
  mockMemberGateway,
  mockMemberHelperSvc,
  mockMongo,
  mockOnPremTokenGateway,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import {
  ForgotUserModel,
  IMemberTwoFALoginThreatRequest,
  LoginModel,
  QAValidationModel,
  SaveCookieModel,
  UpdatePasswordModel
} from 'api/communityresources/models/memberModel';
import { MemberService } from '../memberService';

describe('MemberService', () => {
  let svc: MemberService;

  beforeEach(() => {
    svc = new MemberService(
      <any>mockResult,
      mockLoginMedicaidSvc as any,
      mockLoginCommercialSvc as any,
      <any>mockMemberHelperSvc,
      <any>mockLoginHelperSvc,
      <any>mockAccessTokenHelperSvc,
      mockMemberGateway as any,
      mockMongo as any,
      mockValidation as any,
      mockOnPremTokenGateway as any,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const oAuthResponse = {
    access_token: 'accessToken'
  };

  // Create Success Implementation
  mockResult.createSuccess.mockImplementation((data) => {
    return {
      data: {
        isSuccess: true,
        isException: false,
        value: data
      }
    };
  });

  // Create Error Implementation
  mockResult.createError.mockImplementation((data) => {
    return {
      data: {
        isSuccess: false,
        isException: true,
        error: data
      }
    };
  });

  describe('memberLogin', () => {
    describe('Commercial user', () => {
      const loginInput: LoginModel = {
        acceptedTouVersion: '1.0',
        username: '~TESTUSER',
        password: 'password',
        memberType: memberInfo.COMMERCIAL_MEMBER_TYPE,
        metaIpaddress: '127.0.0.1',
        market: [],
        cookie: ''
      };

      it('should return login success', async () => {
        mockMongo.readByValue
          .mockReturnValueOnce({ demoUserAccess: true })
          .mockReturnValue({
            username: 'test',
            firstName: 'test',
            lastName: 'lastName',
            deleteRequested: false
          });
        mockMongo.updateByQuery.mockReturnValue(1);
        mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
        mockAccessTokenHelperSvc.getEKSOauthToken.mockReturnValue(
          oAuthResponse
        );
        mockMemberHelperSvc.generateUserRequestObject.mockReturnValue({
          request: 'test'
        });
        mockMemberGateway.webUserAuthenticate.mockReturnValue({
          authenticated: true,
          cntrctTermDt: new Date(),
          username: 'test'
        });
        mockMemberGateway.webUserSearch.mockReturnValue({
          status: 200,
          user: [
            {
              userAccountStatus: {
                disabled: false,
                locked: false
              },
              secretQuestionAnswers: {}
            }
          ]
        });
        mockLoginCommercialSvc.getCommercialMemberData.mockReturnValue({
          firstName: 'test',
          lastName: 'test',
          mcid: 'testMCID',
          memberData: {
            snappreferred: 'SNAP'
          }
        });
        mockMemberGateway.memberLoginThreatApi.mockReturnValue({
          headers: {
            'set-cookie': ['cookies;are tested']
          },
          body: {
            status: true,
            suggestedAction: 'Continue',
            suggestedActionDesc: 'test action desc',
            promptForDeviceUpdate: 'update',
            fingerprintId: 'id',
            pingRiskId: 'risk it'
          }
        });
        mockLoginCommercialSvc.memberGetContacts.mockReturnValue({
          data: {
            value: {}
          }
        });
        mockAccessTokenHelperSvc.getPSGBDTenantOAuthToken.mockReturnValue(
          oAuthResponse
        );
        mockAccessTokenHelperSvc.getSydneyMemberTenantOAuthToken.mockReturnValue(
          oAuthResponse
        );
        mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
        mockMemberHelperSvc.formatMemberRequest.mockReturnValue({});
        mockMemberHelperSvc.cumulateWebUserData.mockReturnValue({});
        const response = await svc.memberLogin(loginInput);
        expect(response).not.toBeNull();
      });

      it('should return incorrect password', async () => {
        mockMongo.readByValue.mockReturnValue({ demoUserAccess: true });
        mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
        mockAccessTokenHelperSvc.getEKSOauthToken.mockReturnValue(
          oAuthResponse
        );
        mockMemberHelperSvc.generateUserRequestObject.mockReturnValue({
          request: 'test'
        });
        mockMemberGateway.webUserAuthenticate.mockReturnValue({
          authenticated: false,
          cntrctTermDt: new Date(),
          username: 'test',
          status: 404
        });
        mockAccessTokenHelperSvc.getPSGBDTenantOAuthToken.mockReturnValue(
          oAuthResponse
        );
        mockAccessTokenHelperSvc.getSydneyMemberTenantOAuthToken.mockReturnValue(
          oAuthResponse
        );
        mockMemberGateway.authToken.mockReturnValue(oAuthResponse);

        const response = await svc.memberLogin(loginInput);
        expect(response).not.toBeNull();
        expect(response.data.errors).not.toBeNull();
      });

      it('should return incorrect password and remove user', async () => {
        mockMongo.readByValue
          .mockReturnValueOnce({ demoUserAccess: true })
          .mockReturnValue({
            username: 'test',
            firstName: 'test',
            lastName: 'lastName',
            memberType: loginInput.memberType
          });
        mockMongo.updateByQuery.mockReturnValue(1);
        mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
        mockAccessTokenHelperSvc.getEKSOauthToken.mockReturnValue(
          oAuthResponse
        );
        mockMemberHelperSvc.generateUserRequestObject.mockReturnValue({
          request: 'test'
        });
        mockMemberGateway.webUserAuthenticate.mockReturnValue({
          authenticated: false,
          cntrctTermDt: new Date(),
          body: {
            exceptions: [
              {
                code: '1001'
              }
            ]
          },
          status: 404
        });
        mockAccessTokenHelperSvc.getPSGBDTenantOAuthToken.mockReturnValue(
          oAuthResponse
        );
        mockAccessTokenHelperSvc.getSydneyMemberTenantOAuthToken.mockReturnValue(
          oAuthResponse
        );
        mockMemberGateway.authToken.mockReturnValue(oAuthResponse);

        const response = await svc.memberLogin(loginInput);
        expect(response).not.toBeNull();
        expect(response.data.errors).not.toBeNull();
      });

      it('should return user not allowed', async () => {
        mockMongo.readByValue.mockReturnValue({ demoUserAccess: false });
        mockLoginHelperSvc.isDemoUser.mockReturnValue({});
        await svc.memberLogin(loginInput);
        expect(mockResult.createError.mock.calls.length).toBe(1);
      });
    });

    describe('GBD Member', () => {
      const loginInput: LoginModel = {
        acceptedTouVersion: '1.0',
        username: '~TESTUSER',
        password: 'password',
        memberType: memberInfo.GBD_MEMBER,
        metaIpaddress: '127.0.0.1',
        market: ['IN'],
        marketingBrand: 'ABCBS',
        cookie: ''
      };

      it('should return login success', async () => {
        mockMongo.readByValue
          .mockReturnValueOnce({ demoUserAccess: true })
          .mockReturnValue(null);
        mockMongo.insertValue.mockReturnValue({ _id: 'newUserId' });
        mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
        mockAccessTokenHelperSvc.getEKSOauthToken.mockReturnValue(
          oAuthResponse
        );
        mockMemberHelperSvc.generateUserRequestObject.mockReturnValue({
          request: 'test'
        });
        mockMemberGateway.webUserAuthenticate.mockReturnValue({
          authenticated: true,
          cntrctTermDt: new Date(),
          username: 'test',
          user: {
            username: 'test'
          }
        });
        mockMemberHelperSvc.generateUserRequestObject.mockReturnValue({
          request: 'test'
        });
        mockMemberHelperSvc.getGbdMemberSummary.mockReturnValue({
          data: {
            isSuccess: true,
            value: {
              hcid: 'HCID Value',
              type: 'Test'
            }
          }
        });
        mockMemberGateway.webUserSearch.mockReturnValue({
          status: 200,
          user: [
            {
              userAccountStatus: {
                disabled: false,
                locked: false
              },
              secretQuestionAnswers: {}
            }
          ]
        });
        mockLoginMedicaidSvc.getMemberEligibility.mockReturnValue({
          data: {
            isSuccess: true,
            value: {
              eligibilities: [
                {
                  firstName: 'FirstName',
                  lastName: 'LastName',
                  mcid: 'TESTID',
                  marketingBrand: 'ABCBS',
                  market: 'IN'
                }
              ]
            }
          }
        });
        mockLoginMedicaidSvc.createMemberDataForGbd.mockReturnValue({
          dn: 'some value'
        });
        mockMemberGateway.memberLoginThreatApi.mockReturnValue({
          headers: {
            'set-cookie': ['cookies;are tested']
          },
          body: {
            status: true,
            suggestedAction: 'Continue',
            suggestedActionDesc: 'test action desc',
            promptForDeviceUpdate: 'update',
            fingerprintId: 'id',
            pingRiskId: 'risk it'
          }
        });
        mockMemberHelperSvc.getGBDContactDetails.mockReturnValue({
          data: {
            isSuccess: true,
            value: {
              contactDetails: [
                {
                  contactSubType: 'ph',
                  contactValue: '3454522',
                  contactType: 'PH'
                }
              ]
            }
          }
        });
        mockValidation.maskEmailAndPhone.mockReturnValue('');
        mockMongo.updateByQuery.mockReturnValue(1);
        const response = await svc.memberLogin(loginInput);
        expect(response).not.toBeNull();
      });
    });
  });

  describe('updateSecret', () => {
    const secretInput: UpdatePasswordModel = {
      memberType: memberInfo.COMMERCIAL_MEMBER_TYPE,
      username: 'test',
      newPassword: 'latest',
      iamGuid: '',
      dn: '',
      currentPassword: 'current'
    };

    it('should successfully update secret', async () => {
      mockMemberHelperSvc.generateUpdatePasswordObject.mockReturnValue({
        currentPassword: 'current'
      });
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberHelperSvc.cumulateWebUserData.mockReturnValue({});
      mockMemberGateway.generatePasswordApi.mockReturnValue({
        password: 'current'
      });
      mockMemberGateway.updateNewPasswordApi.mockReturnValue({
        responseContext: {
          confirmationNumber: '123'
        }
      });
      mockOnPremTokenGateway.onPremToken.mockReturnValue(oAuthResponse);
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      const response = await svc.updateSecret(secretInput);
      expect(response).not.toBeNull();
    });

    it('should return error', async () => {
      mockMemberHelperSvc.generateUpdatePasswordObject.mockReturnValue({
        currentPassword: 'current'
      });
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberHelperSvc.cumulateWebUserData.mockReturnValue({});
      mockMemberGateway.generatePasswordApi.mockReturnValue(null);
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      mockOnPremTokenGateway.onPremToken.mockReturnValue(oAuthResponse);
      await svc.updateSecret(secretInput);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.internalServerError
      );
    });

    it('should return FUP Update issue', async () => {
      mockMemberHelperSvc.generateUpdatePasswordObject.mockReturnValue({
        currentPassword: 'current'
      });
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberHelperSvc.cumulateWebUserData.mockReturnValue({});
      mockMemberGateway.generatePasswordApi.mockReturnValue({
        password: 'current'
      });
      mockMemberGateway.updateNewPasswordApi.mockReturnValue({
        responseContext: {}
      });
      mockOnPremTokenGateway.onPremToken.mockReturnValue(oAuthResponse);
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      await svc.updateSecret(secretInput);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.fupUpdateIssue
      );
    });
  });

  describe('searchMemberByWebguid', () => {
    it('should return success', async () => {
      mockResult.createGuid.mockReturnValue('guid');
      mockMemberGateway.webUserSearch.mockReturnValue({
        status: 200,
        user: [
          {
            userAccountStatus: 'great',
            disabled: false,
            locked: false
          }
        ]
      });
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      await svc.searchMemberByWebguid('token', 'webGUid', false);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return account disabled error', async () => {
      mockResult.createGuid.mockReturnValue('guid');
      mockMemberGateway.webUserSearch.mockReturnValue({
        status: 200,
        user: [
          {
            userAccountStatus: {
              disabled: true,
              locked: false
            }
          }
        ]
      });
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      await svc.searchMemberByWebguid('token', 'webGUid', true);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.accountDisabled
      );
    });

    it('should return account locked error', async () => {
      mockResult.createGuid.mockReturnValue('guid');
      mockMemberGateway.webUserSearch.mockReturnValue({
        status: 200,
        user: [
          {
            userAccountStatus: {
              disabled: false,
              locked: true
            }
          }
        ]
      });
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      await svc.searchMemberByWebguid('token', 'webGUid', false);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.accountLocked
      );
    });

    it('should return user does not exist error', async () => {
      mockResult.createGuid.mockReturnValue('guid');
      mockMemberGateway.webUserSearch.mockReturnValue({
        status: 404,
        user: [
          {
            userAccountStatus: {
              disabled: false,
              locked: false
            }
          }
        ]
      });
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      await svc.searchMemberByWebguid('token', 'webGUid', false);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });
  });

  describe('getRecoveryContact', () => {
    it('should return success', async () => {
      mockMemberGateway.memberRecoveryContactApi.mockReturnValue({
        phoneNbrDetails: {
          number: '82399923'
        }
      });
      await svc.getRecoveryContact('token', 'testUser');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockMemberGateway.memberRecoveryContactApi.mockReturnValue({
        phoneNbrDetails: null
      });
      await svc.getRecoveryContact('token', 'testUser');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockMemberGateway.memberRecoveryContactApi.mockRejectedValue({
        message: 'error'
      });
      await svc.getRecoveryContact('token', 'testUser');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('formatFupMemberRequest', () => {
    const formatInput: ForgotUserModel = {
      fname: 'test',
      lname: 'test',
      dob: '',
      memberType: memberInfo.COMMERCIAL_MEMBER_TYPE,
      cookie: '',
      hcid: 'hcid',
      email: 'test@developer.com',
      employeeId: 'TEST'
    };

    it('should return data for non member', async () => {
      const result = svc.formatFupMemberRequest(formatInput, false);
      expect(result).not.toHaveProperty('email');
    });

    it('should return data for member', async () => {
      const result = svc.formatFupMemberRequest(formatInput, true);
      expect(result).toHaveProperty('email');
    });
  });

  describe('memberLoginTreat', () => {
    it('should return error', async () => {
      const input: IMemberTwoFALoginThreatRequest = {
        model: '',
        usernm: 'TEST',
        metaIpaddress: '',
        memberType: memberInfo.COMMERCIAL_MEMBER_TYPE
      };
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberGateway.memberLoginThreatApi.mockReturnValue({
        body: {
          status: null
        }
      });
      mockAccessTokenHelperSvc.getSydneyMemberTenantOAuthToken.mockReturnValue(
        oAuthResponse
      );
      await svc.memberLoginTreat(input);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.noSufficientDataLoginTreatDetail
      );
    });
  });

  describe('memberRecoveryThreat', () => {
    const recoveryInput: IMemberTwoFALoginThreatRequest = {
      model: '',
      usernm: 'TEST',
      metaIpaddress: '',
      memberType: memberInfo.COMMERCIAL_MEMBER_TYPE
    };

    it('should return success', async () => {
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberGateway.memberRecoveryThreatApi.mockReturnValue({
        body: {
          status: 200
        }
      });
      mockAccessTokenHelperSvc.getSydneyMemberTenantOAuthToken.mockReturnValue(
        oAuthResponse
      );
      await svc.memberRecoveryTreat(recoveryInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberGateway.memberRecoveryThreatApi.mockReturnValue({
        body: {
          status: null
        }
      });
      recoveryInput.memberType = memberInfo.GBD_MEMBER;
      await svc.memberRecoveryTreat(recoveryInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });

  describe('loginSaveCookie', () => {
    const cookieInput: SaveCookieModel = {
      usernm: 'TEST',
      saveDeviceOrCookieFlag: '',
      memberType: memberInfo.COMMERCIAL_MEMBER_TYPE,
      cookieValue: '',
      transientUserNm: '',
      fingerprintId: '',
      fingerprint: undefined,
      metaIpaddress: '',
      metaPersonType: 'test'
    };

    it('should return success', async () => {
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockAccessTokenHelperSvc.getSydneyMemberTenantOAuthToken.mockReturnValue(
        oAuthResponse
      );
      mockMemberGateway.loginSaveCookieApi.mockReturnValue({
        cookieValue: {}
      });
      await svc.loginSaveCookie(cookieInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberGateway.loginSaveCookieApi.mockReturnValue({
        cookieValue: null
      });
      cookieInput.memberType = memberInfo.GBD_MEMBER;
      await svc.loginSaveCookie(cookieInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });

  describe('loginAnswerValidate', () => {
    const answerInput: QAValidationModel = {
      memberType: '',
      username: 'TEST',
      secretAnswerText1: 'securityAnswer',
      isPNLogin: false
    };

    it('should return success', async () => {
      mockResult.createGuid.mockReturnValue('resultguid');
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberHelperSvc.cumulateWebUserData.mockReturnValue({});
      mockMemberGateway.loginValidateQaApi.mockReturnValue({
        secretAnswerMatched: true
      });
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      mockMongo.readByValue.mockReturnValue({
        username: 'TEST'
      });
      mockMemberHelperSvc.manageStoryPromotion.mockReturnValue(null);
      await svc.loginAnswerValidate(answerInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockResult.createGuid.mockReturnValue('resultguid');
      mockAccessTokenHelperSvc.getOauthToken.mockReturnValue(oAuthResponse);
      mockMemberHelperSvc.cumulateWebUserData.mockReturnValue({});
      mockMemberGateway.loginValidateQaApi.mockReturnValue({
        secretAnswerMatched: false
      });
      mockMemberGateway.authToken.mockReturnValue(oAuthResponse);
      mockMongo.readByValue.mockReturnValue({
        username: 'TEST'
      });
      mockMemberHelperSvc.manageStoryPromotion.mockReturnValue(null);
      await svc.loginAnswerValidate(answerInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });
});
