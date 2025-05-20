import {
  API_RESPONSE, collections, memberInfo, mongoDbTables, OnboardingState, requestName,
  Result
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { User } from 'api/communityresources/models/userModel';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { MemberContactsGateway } from '../../gateways/memberContactsGateway';
import { MemberDetailsGateway } from '../../gateways/memberDetailsGateway';
import {
  ICommercialAuthenticateRequest,
  IGbdMemberContactRequest,
  IGbdSummaryRequest,
  IMemberAuthenticateRequest,
  IMemberPasswordRequest,
  IMemberTwoFAParameters,
  IRequestContext,
  LoginModel,
  WebUserRequestData
} from '../../models/memberModel';
import { BaseResponse } from '../../models/resultModel';
import { AccessTokenHelper } from './accessTokenHelper';

@Service()
export class MemberServiceHelper {
  constructor(
    private result: Result,
    private accessTokenHelper: AccessTokenHelper,
    private memberContactsGateway: MemberContactsGateway,
    private memberDetailsGateway: MemberDetailsGateway,
    private _mongoService: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  async generateUpdatePasswordObject(passwordDetails: IMemberPasswordRequest) {
    const updateRequest: IMemberPasswordRequest = {
      requestContext: this.generateRequestContext(),
      username: passwordDetails.username,
      currentPassword: passwordDetails.currentPassword,
      newPassword: passwordDetails.newPassword,
      repositoryEnum: memberInfo.REPOSITORY_ENUM
    };
    return updateRequest;
  }

  async cumulateWebUserData(
    memberType: string,
    onPremToken: string,
    sydneyMemberToken: string
  ) {
    const webUserRequest = new WebUserRequestData();
    webUserRequest.apiKey = APP.config.restApi.onPrem.apiKey;

    if (memberType === memberInfo.GBD_MEMBER) {
      webUserRequest.token = onPremToken;
      webUserRequest.header = APP.config.restApi.webUserGbdHeader;
    } else {
      webUserRequest.token = sydneyMemberToken;
      webUserRequest.header = APP.config.restApi.webUserCommercialHeader;
    }
    return webUserRequest;
  }

  async getGBDContactDetails(
    token: string,
    hcId: string,
    isDummy: boolean
  ): Promise<BaseResponse> {
    try {
      const request: IGbdMemberContactRequest = { activeInd: true, hcId };
      token = isDummy
        ? await this.accessTokenHelper.getSyntheticToken()
        : token;
      const contactDetail = isDummy
        ? await this.memberContactsGateway.getGbdMemberContactsSynthetic(
          token,
          this.result.createGuid(),
          request
        )
        : await this.memberContactsGateway.getGbdMemberContacts(
          token,
          this.result.createGuid(),
          request
        );
      if (!contactDetail.contactDetails) {
        this.result.errorInfo.title = API_RESPONSE.messages.internalServerError;
        this.result.errorInfo.detail = API_RESPONSE.messages.contactAPIFailure;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[500];
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(contactDetail);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  async getGbdMemberSummary(
    userRequest: string,
    token: string,
    medicaidFup: boolean
  ) {
    const summaryRequest: IGbdSummaryRequest = medicaidFup
      ? {
        hcids: [userRequest],
        migrationEligible: true
      }
      : {
        username: userRequest,
        migrationEligible: true
      };
    const summary = await this.memberDetailsGateway.gbdMemberSummary(
      token,
      summaryRequest
    );
    if (!summary?.userAccountSummaries) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.gbdSummaryFailure;
      return this.result.createError([this.result.errorInfo]);
    }
    if (!summary?.userAccountSummaries[0]) {
      this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
      this.result.errorInfo.detail = API_RESPONSE.messages.userNotFound;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.result.createSuccess(summary.userAccountSummaries[0]);
  }

  public generateRequestContext(): IRequestContext {
    return {
      application: memberInfo.APPLICATION,
      requestId: this.result.createGuid(),
      username: memberInfo.APPLICATION
    };
  }

  public formatMemberRequest(
    username: string,
    firstName: string,
    lastName: string,
    hcid: string,
    dateOfBirth: string,
    snappreferred: string,
    commercialInfo: boolean
  ) {
    const memberRequest: IMemberTwoFAParameters = commercialInfo
      ? {
        firstNm: firstName,
        lastNm: lastName,
        dob: dateOfBirth,
        hcId: hcid
      }
      : {
        usernm: username,
        firstNm: firstName,
        lastNm: lastName,
        dob: dateOfBirth,
        hcid: hcid,
        metaPersonType:
            snappreferred === memberInfo.SNAP ? memberInfo.SNAPUSER : undefined
      };
    return memberRequest;
  }

  public generateSearchRequest(userIdentifier: string, isWebGuid: boolean) {
    const user = isWebGuid
      ? { iamGuid: userIdentifier }
      : { username: userIdentifier };
    return {
      searchUserFilter: {
        ...user,
        repositoryEnum: [memberInfo.REPOSITORY_ENUM],
        userRoleEnum: [memberInfo.USER_ROLE_ENUM]
      },
      requestContext: this.generateRequestContext()
    };
  }

  public generateUserRequestObject(
    loginModel: LoginModel,
    medicaidUser: boolean,
    name: string
  ) {
    const searchRequest = this.generateSearchRequest(
      loginModel.username,
      false
    );
    const authenticateRequest:
    | IMemberAuthenticateRequest
    | ICommercialAuthenticateRequest = new Object();
    if (medicaidUser) {
      authenticateRequest['requestContext'] = this.generateRequestContext();
      authenticateRequest['repositoryEnum'] = memberInfo.REPOSITORY_ENUM;
      authenticateRequest['userRoleEnum'] = memberInfo.USER_ROLE_ENUM;
      authenticateRequest['username'] = loginModel.username;
      authenticateRequest['password'] = loginModel.password;
    } else {
      authenticateRequest.userNm = loginModel.username;
      authenticateRequest.password = loginModel.password;
    }
    return name === requestName.WEB_USER_SEARCH
      ? searchRequest
      : authenticateRequest;
  }

  public async manageStoryPromotion(user: User) {
    let promotionValue;
    if (user?.attributes?.storyPromotion) {
      if (
        !user.attributes.storyPromotion.remindUser ||
        user.attributes.storyPromotion?.loginsAfterOnboarding > 5
      ) {
        user.attributes.storyPromotion.loginsAfterOnboarding = 6;
        return user;
      }

      if (user.onBoardingState === OnboardingState.COMPLETED) {
        const loginCount = user?.attributes?.storyPromotion?.loginsAfterOnboarding !== undefined ? user.attributes.storyPromotion.loginsAfterOnboarding + 1 : 0;
        promotionValue = {
          remindUser: user?.attributes?.storyPromotion?.remindUser,
          nextPromotionDate: user?.attributes?.storyPromotion?.nextPromotionDate,
          loginsAfterOnboarding: loginCount
        };
        user.attributes.storyPromotion.loginsAfterOnboarding = loginCount;
      }
    }
    else {
      //New User
      promotionValue = {
        remindUser: true,
        nextPromotionDate: null,
        loginsAfterOnboarding: 0
      };
      user.attributes = {
        storyPromotion: {
          remindUser: true,
          nextPromotionDate: null,
          loginsAfterOnboarding: 0
        }
      };
    }

    if (promotionValue) {
      this._mongoService.updateByQuery(
        collections.USERS,
        { [mongoDbTables.users.id]: new ObjectId(user.id) },
        {
          $set: {
            [mongoDbTables.users.storyPromotion]: promotionValue
          }
        }
      );
    }
    return user;
  }
}
