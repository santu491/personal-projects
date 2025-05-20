import {
  API_RESPONSE,
  cacheKey,
  collections,
  headers,
  memberInfo,
  mongoDbTables,
  requestName,
  Result,
  unitOfTime,
  Validation
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { EncryptionUtil } from '@anthem/communityapi/security';
import { APP } from '@anthem/communityapi/utils';
import * as moment from 'moment';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { MemberGateway } from '../gateways/memberGateway';
import { TokenGateway } from '../gateways/onPremTokenGateway';
import {
  ForgotUserModel,
  IContactList,
  IContactsDetail,
  IEligibilityResponse,
  IGbdMemberContactResponse,
  IMemberAuthenticateRequest,
  IMemberAuthenticateResponse,
  IMemberLoginThreatResponse,
  IMemberPasswordRequest,
  IMemberQAValidateRequest,
  IMemberSearchRequest,
  IMemberSearchResponse,
  IMemberTwoFALoginThreatRequest,
  IMemberTwoFALoginThreatResponse,
  IMemberTwoFAParameters,
  IRequestContext,
  IResponseContext,
  IUserAccountStatus,
  IUserAccountSummary,
  LoginModel,
  MemberType,
  QAValidationModel,
  SaveCookieModel,
  SaveCookieRequestDetails,
  TreatRequestDetails,
  UpdatePasswordModel,
  WebUserRequestData
} from '../models/memberModel';
import { BaseResponse } from '../models/resultModel';
import { AppVersion, User } from '../models/userModel';
import { AccessTokenHelper } from './helpers/accessTokenHelper';
import { LoginServiceHelper } from './helpers/loginServiceHelper';
import { MemberServiceHelper } from './helpers/memberServiceHelper';
import { LoginCommercialService } from './login/commercialService';
import { LoginMedicaidService } from './login/medicaidService';

@Service()
export class MemberService {
  constructor(
    private result: Result,
    private medicaidService: LoginMedicaidService,
    private commercialService: LoginCommercialService,
    private memberServiceHelper: MemberServiceHelper,
    private loginServiceHelper: LoginServiceHelper,
    private accessTokenHelper: AccessTokenHelper,
    private memberGateway: MemberGateway,
    private mongoService: MongoDatabaseClient,
    private validation: Validation,
    private onPremTokenGateway: TokenGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  // eslint-disable-next-line complexity
  public async memberLogin(loginModel: LoginModel): Promise<BaseResponse> {
    try {
      const appVersion: AppVersion = await this.mongoService.readByValue(
        collections.APPVERSION,
        {}
      );
      let isDemoUser = false;
      const memberType = new MemberType();
      memberType.isGbdMember = false;
      if (loginModel?.memberType === memberInfo.GBD_MEMBER) {
        memberType.isGbdMember = true;
      }
      /**
       *  If demoUserAccess is set to false in the appversion collection
       *  And logged in user is a demo user
       *  Then Don't allow to login
       */
      if (
        !appVersion.demoUserAccess ||
        (appVersion.demoUserAccess && memberType.isGbdMember)
      ) {
        isDemoUser = await this.loginServiceHelper.isDemoUser(
          loginModel.username
        );
        if (isDemoUser && !appVersion.demoUserAccess) {
          this.result.errorInfo.title = API_RESPONSE.messages.loginFailed;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
          this.result.errorInfo.detail = API_RESPONSE.messages.userNotAllowed;
          return this.result.createError([this.result.errorInfo]);
        }
      }

      let user = new User();
      const onPremToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );
      const sydneyMemberTenantToken =
        await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
          cacheKey.sydneyMemberToken
        );
      const psgbdToken = await this.accessTokenHelper.getPSGBDTenantOAuthToken(
        cacheKey.psgbdToken
      );
      const response = await this.memberAuthentication(
        psgbdToken.access_token,
        onPremToken.access_token,
        memberType.isGbdMember,
        loginModel
      );
      if (!response.data.isSuccess) {
        return response;
      }
      if (memberType.isGbdMember) {
        const authenticate = response.data.value as IMemberAuthenticateResponse;
        const cumulatedObject =
          await this.memberServiceHelper.cumulateWebUserData(
            loginModel.memberType,
            onPremToken.access_token,
            onPremToken.access_token
          );
        const memberTypeSearchUserResponse = await this.checkMemberType(
          cumulatedObject,
          memberType.isGbdMember,
          loginModel
        );
        if (!memberTypeSearchUserResponse.data.isSuccess) {
          return memberTypeSearchUserResponse;
        }
        const summary = await this.memberServiceHelper.getGbdMemberSummary(
          loginModel.username,
          (
            await this.onPremTokenGateway.psgbdTenantToken()
          ).access_token,
          false
        );

        if (!summary.data.isSuccess) {
          return summary;
        }

        const accountSummary = summary.data.value as IUserAccountSummary;

        //if environment is prod and is a demouser, call "synthetic api" instead of "prod api"
        const eligibilityResponse =
          await this.medicaidService.getMemberEligibility(
            onPremToken.access_token,
            accountSummary.hcid,
            loginModel.market,
            loginModel.marketingBrand,
            false,
            isDemoUser
          );

        if (!eligibilityResponse.data.isSuccess) {
          return eligibilityResponse;
        }
        const eligibility = eligibilityResponse?.data
          ?.value as IEligibilityResponse;

        // Store user details in DB
        user = await this.validateMemberInfo(
          eligibility.eligibilities[0].firstName,
          eligibility.eligibilities[0].lastName,
          authenticate.user.username,
          eligibility.eligibilities[0].mcid,
          loginModel,
          eligibility.eligibilities[0].marketingBrand,
          eligibility.eligibilities[0].market
        );
        if (user?.deleteRequested) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.deletedUser;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[417];
          return this.result.createException([this.result.errorInfo]);
        }
        user.memberData = this.medicaidService.createMemberDataForGbd(
          eligibility.eligibilities[0],
          authenticate.user.iamGuid,
          accountSummary.type
        );
        user.memberData.dn = authenticate.user.dn;
        const loginTreatDetails = await this.memberLoginTreat({
          hcid: accountSummary.hcid,
          model: memberInfo.loginTwoFAModel,
          usernm: loginModel.username,
          metaIpaddress: loginModel?.metaIpaddress,
          cookieValue: loginModel?.cookie,
          memberType: loginModel?.memberType,
          marketingBrand: memberInfo.marketingBrand
        });
        const loginThreatData = loginTreatDetails.data
          .value as IMemberTwoFALoginThreatResponse;
        const loginThreatResponse = await this.loginTreatFormat(
          loginThreatData
        );
        user.loginTreatDetails = (loginThreatResponse ??
          {}) as IMemberLoginThreatResponse;

        const contactResponse =
          await this.memberServiceHelper.getGBDContactDetails(
            psgbdToken.access_token,
            accountSummary.hcid,
            isDemoUser
          );
        const contactList: IContactList[] = [];
        user.secretQuestionAnswers =
          authenticate.user.secretQuestionAnswers.map((secretQues) => {
            return { question: secretQues.question };
          });
        if (!contactResponse.data.isSuccess) {
          user.contacts = contactList;
        } else {
          const contacts = contactResponse.data
            .value as IGbdMemberContactResponse;
          contacts.contactDetails.forEach((contact) => {
            contactList.push({
              channel: contact.contactSubType ?? contact.contactType,
              contactUid: EncryptionUtil.encrypt(
                contact.contactValue,
                'aes-symmetric'
              ),
              contactValue: this.validation.maskEmailAndPhone(
                contact.contactValue,
                contact.contactType
              )
            });
          });
          user.contacts = contactList;
        }
      } else {
        // const authenticate = response.data
        //   .value as ICommercialAuthenticateResponse;
        // loginModel.username = authenticate.username;
        const cumulatedObject =
          await this.memberServiceHelper.cumulateWebUserData(
            loginModel.memberType,
            onPremToken.access_token,
            onPremToken.access_token
          );
        const memberTypeSearchUserResponse = await this.checkMemberType(
          cumulatedObject,
          memberType.isGbdMember,
          loginModel
        );
        if (!memberTypeSearchUserResponse.data.isSuccess) {
          return memberTypeSearchUserResponse;
        }
        const checkMemberResponse = memberTypeSearchUserResponse.data
          .value as IMemberSearchResponse;
        const member = await this.commercialService.getCommercialMemberData(
          loginModel.username,
          sydneyMemberTenantToken.access_token
        );
        // Store user details in DB
        user = await this.validateMemberInfo(
          member.firstName,
          member.lastName,
          loginModel.username,
          member.mcid,
          loginModel
        );
        if (user?.deleteRequested) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.deletedUser;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[417];
          return this.result.createException([this.result.errorInfo]);
        }
        user.memberData = member.memberData;
        //  Function for 2FA flow
        const requestData = this.memberServiceHelper.formatMemberRequest(
          loginModel.username,
          member.firstName,
          member.lastName,
          member.hcid,
          member.dateOfBirth,
          member.memberData.snappreferred,
          false
        );
        const loginTreatDetails = await this.memberLoginTreat({
          hcid: member.hcid,
          model: memberInfo.loginTwoFAModel,
          memberType: loginModel?.memberType,
          usernm: loginModel.username,
          metaIpaddress: loginModel?.metaIpaddress,
          cookieValue: loginModel?.cookie,
          marketingBrand: memberInfo.APPLICATION
        });
        const loginThreatData = loginTreatDetails.data
          .value as IMemberTwoFALoginThreatResponse;
        const loginThreatResponse = await this.loginTreatFormat(
          loginThreatData
        );
        user.loginTreatDetails = (loginThreatResponse ??
          {}) as IMemberLoginThreatResponse;
        if (
          !memberInfo.SUGGESTED_ACTION.includes(
            user?.loginTreatDetails?.suggestedAction
          )
        ) {
          this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
          this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
          this.result.errorInfo.detail = API_RESPONSE.messages.userNotFound;
          return this.result.createError([this.result.errorInfo]);
        }
        user.contacts = [] as IContactsDetail[];
        const contactDetails = await this.commercialService.memberGetContacts(
          sydneyMemberTenantToken.access_token,
          requestData
        );
        user.contacts = contactDetails.data.value as IContactsDetail[];
        user.secretQuestionAnswers =
          checkMemberResponse.user[0].secretQuestionAnswers.map(
            (secretQues) => {
              return { question: secretQues.question };
            }
          );
      }
      user.token = await this.accessTokenHelper.generateJwtToken(user);
      if (
        user.loginTreatDetails.suggestedAction === 'Continue' &&
        !loginModel?.isPNLogin
      ) {
        this.memberServiceHelper.manageStoryPromotion(user);
      }
      const userResponse = { ...user, ...user?.attributes };
      delete userResponse?.attributes;
      return this.result.createSuccess(userResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateSecret(
    updatePasswordModel: UpdatePasswordModel
  ): Promise<BaseResponse> {
    try {
      const passwordRequest =
        await this.memberServiceHelper.generateUpdatePasswordObject(
          updatePasswordModel
        );

      const passwordResponse = await this.getPassword(
        updatePasswordModel.memberType,
        passwordRequest
      );
      if (passwordResponse.data.isException) {
        this.result.errorInfo.title = API_RESPONSE.messages.serverError;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.internalServerError;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      const newPasswordRes = passwordResponse.data.value as IResponseContext;
      if (!newPasswordRes?.confirmationNumber) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.fupUpdateIssue;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(newPasswordRes);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPassword(
    memberType: string,
    passwordRequest: IMemberPasswordRequest
  ): Promise<BaseResponse> {
    try {
      const onPremTenant = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );

      const cumulatedObject =
        await this.memberServiceHelper.cumulateWebUserData(
          memberType,
          (
            await this.memberGateway.authToken()
          ).access_token,
          onPremTenant.access_token
        );
      cumulatedObject.token =
        memberType === memberInfo.GBD_MEMBER
          ? cumulatedObject.token
          : (await this.onPremTokenGateway.onPremToken()).access_token;

      const generatePasswordUrl =
        memberType === memberInfo.GBD_MEMBER
          ? APP.config.awsEndpoints.gbdGeneratePassword
          : APP.config.restApi.member.commercialGeneratePassword;

      const generatePassword = await this.memberGateway.generatePasswordApi(
        generatePasswordUrl,
        cumulatedObject,
        passwordRequest
      );
      if (!generatePassword?.password) {
        return this.result.createError(generatePassword);
      }
      passwordRequest.currentPassword = generatePassword?.password ?? '';
      const updatePasswordRequest =
        await this.memberServiceHelper.generateUpdatePasswordObject(
          passwordRequest
        );

      const updatePasswordUrl =
        memberType === memberInfo.GBD_MEMBER
          ? APP.config.awsEndpoints.gbdUpdatePassword
          : APP.config.restApi.member.commercialUpdatePassword;

      const newUpdateRes = await this.updatePassword(
        updatePasswordUrl,
        cumulatedObject,
        updatePasswordRequest
      );
      const passwordUpdateResponse = newUpdateRes.data
        .value as IResponseContext;
      return this.result.createSuccess(passwordUpdateResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updatePassword(
    updatePasswordUrl: string,
    webUserRequest: WebUserRequestData,
    passwordRequest: IMemberPasswordRequest
  ): Promise<BaseResponse> {
    try {
      const updatePassword = await this.memberGateway.updateNewPasswordApi(
        updatePasswordUrl,
        webUserRequest,
        passwordRequest
      );
      if (!updatePassword?.responseContext) {
        return this.result.createError(updatePassword);
      }
      return this.result.createSuccess(updatePassword?.responseContext);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async searchMemberByWebguid(
    token: string,
    webguid: string,
    isMedicaid: boolean
  ): Promise<BaseResponse> {
    try {
      const searchRequest = this.generateUserRequestWebguidObject(webguid);
      const webUserRequest = new WebUserRequestData();
      let searchUrl = '';
      webUserRequest.token = token;
      // if (isMedicaid) {
      webUserRequest.token = (
        await this.memberGateway.authToken()
      ).access_token;
      searchUrl = APP.config.awsEndpoints.gbdSearch;
      webUserRequest.apiKey = APP.config.restApi.onPrem.apiKey;
      webUserRequest.header = APP.config.restApi.webUserGbdHeader;
      // } else {
      //   searchUrl = APP.config.restApi.onPrem.commercialSearch;
      //   webUserRequest.apiKey = APP.config.restApi.onPrem.apiKey;
      //   webUserRequest.header = APP.config.restApi.webUserCommercialHeader;
      // }
      const userSearchRes = await this.memberGateway.webUserSearch(
        searchUrl,
        webUserRequest,
        searchRequest
      );

      // checks if user exist
      if (userSearchRes?.status === API_RESPONSE.statusCodes[404]) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const isError = this.handleErrorResponse(
        userSearchRes.user[0].userAccountStatus
      );

      if (isError) {
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(userSearchRes.user[0]);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async loginTreatFormat(
    loginThreatData: IMemberTwoFALoginThreatResponse
  ) {
    const cookie =
      loginThreatData.headers['set-cookie'] &&
      loginThreatData.headers['set-cookie'][0].split(';')[0]
        ? loginThreatData.headers['set-cookie'][0].split(';')[0]
        : '';
    const encryptedCookie =
      cookie !== '' ? EncryptionUtil.encrypt(cookie, 'aes-bouncy') : '';
    const loginTreatResponse: IMemberLoginThreatResponse = {
      status: loginThreatData.body.status,
      suggestedAction: loginThreatData.body.suggestedAction,
      suggestedActionDesc: loginThreatData.body.suggestedActionDesc,
      promptForDeviceUpdate: loginThreatData.body.promptForDeviceUpdate,
      fingerprintId: loginThreatData.body.fingerprintId,
      pingRiskId: loginThreatData.body.pingRiskId,
      cookieValue: encryptedCookie
    };
    return loginTreatResponse;
  }

  public async getRecoveryContact(
    token: string,
    username: string
  ): Promise<BaseResponse> {
    try {
      const memberContactDetails =
        await this.memberGateway.memberRecoveryContactApi(token, username);
      if (!memberContactDetails.phoneNbrDetails) {
        this.result.createError(memberContactDetails);
      }
      return this.result.createSuccess(memberContactDetails);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public formatFupMemberRequest(
    forgotUserModel: ForgotUserModel,
    isMemberInfo: boolean
  ) {
    const memberRequest: IMemberTwoFAParameters = {
      firstNm: forgotUserModel.fname,
      lastNm: forgotUserModel.lname,
      dob: forgotUserModel.dob
    };
    if (isMemberInfo) {
      memberRequest.hcId = forgotUserModel.hcid ?? forgotUserModel.studentId;
      memberRequest.email = forgotUserModel.email;
      memberRequest.employeeId = forgotUserModel.employeeId;
    } else {
      memberRequest.hcid = forgotUserModel.hcid;
    }
    return memberRequest;
  }

  public async memberLoginTreat(
    request: IMemberTwoFALoginThreatRequest
  ): Promise<BaseResponse> {
    try {
      const loginTreatRequestParameters = await this.loginTreatRequestPath(
        request
      );
      const loginTreatResponse = await this.memberGateway.memberLoginThreatApi(
        loginTreatRequestParameters,
        request
      );

      if (!loginTreatResponse.body.status) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.noSufficientDataLoginTreatDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[472];
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(loginTreatResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async loginTreatRequestPath(request: IMemberTwoFALoginThreatRequest) {
    const gbdMember: boolean = request.memberType === memberInfo.GBD_MEMBER;
    const loginTreatApiRequest = new TreatRequestDetails();
    const sydneyMemberTenantToken =
      await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
        cacheKey.sydneyMemberToken
      );
    const onPremToken = await this.accessTokenHelper.getOauthToken(
      cacheKey.onPremToken,
      true
    );
    if (gbdMember) {
      loginTreatApiRequest.url = APP.config.restApi.onPrem.medicaidLoginTreat;
      loginTreatApiRequest.requestName = requestName.MEDICAID_LOGIN_THREAT;
      loginTreatApiRequest.header = [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${onPremToken.access_token}`
        }
      ];
    } else {
      loginTreatApiRequest.url =
        APP.config.restApi.sydneyMemberTenant.commercialLoginTreat;
      loginTreatApiRequest.requestName = requestName.COMMERCIAL_LOGIN_THREAT;
      loginTreatApiRequest.header = [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${sydneyMemberTenantToken.access_token}`
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType ?? ''
        }
      ];
    }
    return loginTreatApiRequest;
  }

  public async memberRecoveryTreat(
    request: IMemberTwoFALoginThreatRequest
  ): Promise<BaseResponse> {
    try {
      const recoveryTreatRequestParameters =
        await this.recoveryTreatRequestPath(request);
      const recoveryTreatResponse =
        await this.memberGateway.memberRecoveryThreatApi(
          recoveryTreatRequestParameters,
          request
        );

      if (!recoveryTreatResponse.body.status) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.noSufficientDataLoginTreatDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(recoveryTreatResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async recoveryTreatRequestPath(
    request: IMemberTwoFALoginThreatRequest
  ) {
    const gbdMember: boolean = request.memberType === memberInfo.GBD_MEMBER;
    const recoveryTreatApiRequest = new TreatRequestDetails();
    const sydneyMemberTenantToken =
      await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
        cacheKey.sydneyMemberToken
      );
    const onPremToken = await this.accessTokenHelper.getOauthToken(
      cacheKey.onPremToken,
      true
    );
    if (gbdMember) {
      recoveryTreatApiRequest.url =
        APP.config.restApi.onPrem.medicaidRecoveryTreat;
      recoveryTreatApiRequest.requestName =
        requestName.MEDICAID_RECOVERY_THREAT;
      recoveryTreatApiRequest.header = [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${onPremToken.access_token}`
        }
      ];
    } else {
      recoveryTreatApiRequest.url =
        APP.config.restApi.sydneyMemberTenant.commercialRecoveryTreat;
      recoveryTreatApiRequest.requestName =
        requestName.COMMERCIAL_RECOVERY_THREAT;
      recoveryTreatApiRequest.header = [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${sydneyMemberTenantToken.access_token}`
        },
        {
          name: headers.WEBGUID,
          value: request.webguid
        },
        {
          name: headers.PERSON_TYPE,
          value: request.metaPersonType
        }
      ];
    }
    return recoveryTreatApiRequest;
  }

  public async loginSaveCookie(
    saveCookieModel: SaveCookieModel
  ): Promise<BaseResponse> {
    try {
      const savecookieRequestParameters = await this.saveCookieRequestPath(
        saveCookieModel
      );
      const saveCookieModelResponse =
        await this.memberGateway.loginSaveCookieApi(
          savecookieRequestParameters,
          saveCookieModel
        );

      if (!saveCookieModelResponse.cookieValue) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.noSufficientDataTwoFATitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noCookieInRequest;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(saveCookieModelResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async saveCookieRequestPath(saveCookieModel: SaveCookieModel) {
    const gbdMember: boolean =
      saveCookieModel.memberType === memberInfo.GBD_MEMBER;
    const saveCookieApiRequest = new SaveCookieRequestDetails();
    if (gbdMember) {
      saveCookieApiRequest.url = APP.config.restApi.onPrem.medicaidSaveCookie;
      saveCookieApiRequest.requestName = requestName.MEDICAID_SAVE_DEVICE;
      saveCookieApiRequest.header = [];
    } else {
      const sydneyMemberTenantToken =
        await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
          cacheKey.sydneyMemberToken
        );
      saveCookieApiRequest.url =
        APP.config.restApi.sydneyMemberTenant.commercialSaveCookie;
      saveCookieApiRequest.requestName = requestName.COMMERCIAL_SAVE_DEVICE;
      saveCookieApiRequest.header = [
        {
          name: headers.AUTHORIZATION,
          value: `${headers.BEARER} ${sydneyMemberTenantToken.access_token}`
        },
        {
          name: headers.PERSON_TYPE,
          value: saveCookieModel.metaPersonType
        }
      ];
    }
    return saveCookieApiRequest;
  }

  public async loginAnswerValidate(
    qaValidationModel: QAValidationModel
  ): Promise<BaseResponse> {
    try {
      const qaAnswers = this.generateQAValidateRequest(qaValidationModel);

      // const sydneyMemberTenantToken = await this.accessTokenHelper.getSydneyMemberTenantOAuthToken(
      //   cacheKey.sydneyMemberToken
      // );

      const onPremAccessToken = await this.accessTokenHelper.getOauthToken(
        cacheKey.onPremToken,
        true
      );

      const cumulatedObject =
        await this.memberServiceHelper.cumulateWebUserData(
          qaValidationModel.memberType,
          (
            await this.memberGateway.authToken()
          ).access_token,
          onPremAccessToken.access_token
        );

      const validateAnswerUrl = APP.config.awsEndpoints.gbdQnAValidate;
      cumulatedObject.token = (
        await this.memberGateway.authToken()
      ).access_token;

      const qaValidationResponse = await this.memberGateway.loginValidateQaApi(
        validateAnswerUrl,
        cumulatedObject,
        qaAnswers
      );
      if (!qaValidationResponse.secretAnswerMatched) {
        this.result.errorInfo.title = API_RESPONSE.messages.customErrorTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.validateQA;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[474];
        return this.result.createError([this.result.errorInfo]);
      }
      const currentUser = await this.mongoService.readByValue(
        collections.USERS,
        { [mongoDbTables.users.username]: qaValidationModel.username }
      );
      if (!qaValidationModel?.isPNLogin) {
        this.memberServiceHelper.manageStoryPromotion(currentUser);
      }

      return this.result.createSuccess({
        ...qaValidationResponse,
        ...currentUser.attributes
      });
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async checkMemberType(
    webUserData: WebUserRequestData,
    isMedicaidUser: boolean,
    loginModel: LoginModel
  ): Promise<BaseResponse> {
    try {
      const memberType = new MemberType();
      memberType.isGbdMember = false;
      // let searchUrl = APP.config.restApi.onPrem.commercialSearch;
      // if () {
      memberType.isGbdMember = isMedicaidUser;
      const searchUrl = APP.config.awsEndpoints.gbdSearch;
      webUserData.token = (await this.memberGateway.authToken()).access_token;
      // }
      const searchRequest = this.memberServiceHelper.generateUserRequestObject(
        loginModel,
        isMedicaidUser,
        requestName.WEB_USER_SEARCH
      ) as IMemberSearchRequest;

      const userSearchRes = await this.memberGateway.webUserSearch(
        searchUrl,
        webUserData,
        searchRequest
      );

      // checks if user exist
      if (userSearchRes?.status === API_RESPONSE.statusCodes[404]) {
        this.result.createError(userSearchRes);
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const isError = this.handleErrorResponse(
        userSearchRes.user[0].userAccountStatus
      );

      if (isError) {
        return this.result.createError([this.result.errorInfo]);
      }
      if (!loginModel.memberType) {
        // To Find out if user is commercial or GBD member
        userSearchRes.user[0].memberOf.forEach((ele) => {
          if (ele.includes(memberInfo.GBD_MEMBER)) {
            memberType.isGbdMember = true;
          }
        });
      }
      const userSearchResponse = userSearchRes;
      userSearchResponse.memberType = memberType;
      return this.result.createSuccess(userSearchResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async memberAuthentication(
    psgbdToken: string,
    onPremToken: string,
    isMedicaidUser: boolean,
    loginModel: LoginModel
  ): Promise<BaseResponse> {
    try {
      const webUserRequest = new WebUserRequestData();
      webUserRequest.apiKey = APP.config.restApi.onPrem.apiKey;
      // if (isMedicaidUser) {
      //   webUserRequest.token = onPremToken;
      //   webUserRequest.header = APP.config.restApi.webUserGbdHeader;
      // } else {
      webUserRequest.token = (
        await this.memberGateway.authToken()
      ).access_token;
      webUserRequest.header = APP.config.restApi.webUserCommercialHeader;
      // }
      const authenticateRequest = this.generateUserLoginRequestObject(
        loginModel.username,
        loginModel.password
      );

      // const authenticate = isMedicaidUser
      //   ? await this.memberGateway.webUserAuthenticate(
      //     webUserRequest,
      //     authenticateRequest
      //   )
      //   : await this.memberGateway.commercialMemberAuthenticate(
      //     webUserRequest,
      //     authenticateRequest
      //   );

      const authenticate = await this.memberGateway.webUserAuthenticate(
        webUserRequest,
        authenticateRequest
      );

      if (!authenticate.authenticated) {
        const errCode = authenticate.hasOwnProperty('body')
          ? authenticate['body']['exceptions'][0]['code']
          : '';
        loginModel.memberType = isMedicaidUser
          ? memberInfo.MEDICAID_MEMBER_TYPE
          : memberInfo.COMMERCIAL_MEMBER_TYPE;
        if (
          (errCode === '1001' || errCode === 'USERNOTFOUND') &&
          authenticate.status === 404
        ) {
          this.removeUser(loginModel);
        }
        this.result.createError(authenticate);
        this.result.errorInfo.title =
          API_RESPONSE.messages.incorrectPasswordTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.incorrectPasswordDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
        return this.result.createError([this.result.errorInfo]);
      }

      const terminationDate = moment(authenticate.cntrctTermDt)
        .add(2, unitOfTime.years)
        .format(memberInfo.DATE_FORMAT);
      if (
        !isMedicaidUser &&
        new Date(moment().format(memberInfo.DATE_FORMAT)) >
          new Date(terminationDate)
      ) {
        this.result.errorInfo.title =
          API_RESPONSE.messages.invalidOperationTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.invalidOperationDetail;
        return this.result.createError(this.result.errorInfo);
      }

      return this.result.createSuccess(authenticate);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async validateMemberInfo(
    firstName: string,
    lastName: string,
    userName: string,
    mcid: string,
    loginModel: LoginModel,
    marketingBrand?: string,
    market?: string
  ) {
    /* Query to ignore the case */
    const query = { $regex: userName, $options: 'i' };

    const user: User = await this.mongoService.readByValue(collections.USERS, {
      [mongoDbTables.users.username]: query
    });

    if (!user) {
      // Add new user to DB
      const userObject = new User();
      userObject.username = userName;
      userObject.active = true;
      userObject.cancerCommunityCard = true;
      userObject.lastLoginAt = new Date();
      userObject.memberType =
        loginModel.memberType === memberInfo.GBD_MEMBER
          ? memberInfo.MEDICAID_MEMBER_TYPE + `-${marketingBrand}-${market}`
          : memberInfo.COMMERCIAL_MEMBER_TYPE;
      userObject.displayName = firstName;
      userObject.createdAt = new Date();
      userObject.updatedAt = new Date();
      const newUser: User = await this.mongoService.insertValue(
        collections.USERS,
        userObject
      );
      newUser.personId = mcid;
      newUser.id = newUser[mongoDbTables.users.id];
      delete newUser[mongoDbTables.users.id];
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      return newUser;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    if (user?.deleteRequested) {
      return user;
    }
    if (!user.tou) {
      user.tou = [];
    }
    const isTouVersionAccepted = user.tou.find(
      (tou) =>
        tou.version === loginModel.acceptedTouVersion &&
        tou.hasOwnProperty('acceptedAt')
    );
    user.hasAgreedToTerms = isTouVersionAccepted ? true : false;
    let updateQuery = {
      $set: {
        [mongoDbTables.users.lastLoginAt]: new Date(),
        [mongoDbTables.users.memberType]:
          loginModel.memberType === memberInfo.GBD_MEMBER
            ? memberInfo.MEDICAID_MEMBER_TYPE + `-${marketingBrand}-${market}`
            : memberInfo.COMMERCIAL_MEMBER_TYPE
      }
    };
    // check for personId and update user collection
    if (user.personId !== mcid) {
      user.personId = mcid;
      updateQuery = {
        $set: {
          [mongoDbTables.users.lastLoginAt]: new Date(),
          [mongoDbTables.users.memberType]:
            loginModel.memberType === memberInfo.GBD_MEMBER
              ? memberInfo.MEDICAID_MEMBER_TYPE + `-${marketingBrand}-${market}`
              : memberInfo.COMMERCIAL_MEMBER_TYPE
        }
      };
    }
    const userIdObj = { [mongoDbTables.users.id]: new ObjectId(user.id) };
    this.mongoService.updateByQuery(collections.USERS, userIdObj, updateQuery);
    return user;
  }

  private generateRequestContext(): IRequestContext {
    return {
      application: memberInfo.APPLICATION,
      requestId: this.result.createGuid(),
      username: memberInfo.APPLICATION
    };
  }

  private handleErrorResponse(accountStatus: IUserAccountStatus): boolean {
    let isError = false;
    this.result.errorInfo.title = API_RESPONSE.messages.badData;

    // checks if account is disabled
    if (accountStatus.disabled) {
      isError = true;
      this.result.errorInfo.detail = API_RESPONSE.messages.accountDisabled;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[476];
    }

    // checks if account is locked
    if (accountStatus.locked) {
      isError = true;
      this.result.errorInfo.detail = API_RESPONSE.messages.accountLocked;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[475];
    }
    return isError;
  }

  private generateQAValidateRequest(qaValidationModel: QAValidationModel) {
    const validateQaRequest: IMemberQAValidateRequest = {
      requestContext: this.generateRequestContext(),
      username: qaValidationModel.username,
      secretAnswerText1: qaValidationModel.secretAnswerText1,
      secretAnswerText2: qaValidationModel.secretAnswerText2 ?? null,
      secretAnswerText3: qaValidationModel.secretAnswerText3 ?? null
    };
    return validateQaRequest;
  }

  private generateUserRequestWebguidObject(webguid: string) {
    const searchRequest: IMemberSearchRequest = {
      requestContext: this.generateRequestContext(),
      searchUserFilter: {
        iamGuid: webguid,
        repositoryEnum: [memberInfo.REPOSITORY_ENUM],
        userRoleEnum: [memberInfo.USER_ROLE_ENUM]
      }
    };
    return searchRequest;
  }

  private generateUserLoginRequestObject(username: string, password: string) {
    const searchRequest: IMemberAuthenticateRequest = {
      requestContext: this.generateRequestContext(),
      username,
      password,
      repositoryEnum: memberInfo.REPOSITORY_ENUM,
      userRoleEnum: memberInfo.USER_ROLE_ENUM
    };
    return searchRequest;
  }

  private async removeUser(loginModel: LoginModel) {
    try {
      const query = {
        [mongoDbTables.users.username]: {
          $regex: `^${loginModel.username}$`,
          $options: 'i'
        }
      };
      const projection = {
        projection: {
          [mongoDbTables.users.id]: true,
          [mongoDbTables.users.memberType]: true
        }
      };
      const userInfo: User = await this.mongoService.readByValue(
        collections.USERS,
        query,
        projection
      );
      if (userInfo && userInfo.memberType.includes(loginModel.memberType)) {
        const setValue = {
          $set: {
            [mongoDbTables.users.deleteRequested]: true
          }
        };
        const search = {
          [mongoDbTables.users.id]: new ObjectId(userInfo.id)
        };
        await this.mongoService.updateByQuery(
          collections.USERS,
          search,
          setValue
        );
      }
    } catch (error) {
      this._log.error(error as Error);
    }
  }
}
