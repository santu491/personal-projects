import { AdminDisplayTitle, API_RESPONSE, associateInfo, collections, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ISecureJwtClaims, SecureJwtToken } from '@anthem/communityadminapi/filters';
import { APP } from '@anthem/communityadminapi/utils';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { AssociateGateway } from '../gateways/associateGateway';
import { AdminActivity } from '../models/activityModel';
import { CreateProfileRequest } from '../models/adminModel';
import { Admin, LoginModel } from '../models/adminUserModel';
import { IAssociateAuthenticateRequest, IAssociateSearchRequest, IAssociateSearchResponse, IRequestContext, IUser, WebUserRequestData } from '../models/associateModel';
import { Community } from '../models/communitiesModel';
import { DemoUser } from '../models/demoUserModel';
import { AdminUser, ExportStoryData } from '../models/userModel';

@Service()
export class UserHelperService {
  constructor(
    private result: Result,
    private _mongoSvc: MongoDatabaseClient,
    private associateGateway: AssociateGateway,
    private secureJwtToken: SecureJwtToken
  ) { }

  public generateUserRequestObject(username: string) {
    const requestContext: IRequestContext = {
      application: associateInfo.APPLICATION,
      requestId: this.result.createGuid(),
      username: associateInfo.APPLICATION
    };
    const searchRequest: IAssociateSearchRequest = {
      searchUserFilter: {
        username: username,
        repositoryEnum: [associateInfo.REPOSITORY_ENUM],
        userRoleEnum: [associateInfo.USER_ROLE_ASSOCIATE, associateInfo.USER_ROLE_NON_ASSOCIATE]
      },
      requestContext: requestContext
    };

    return searchRequest;
  }

  public generateUserAuthRequest(payload: LoginModel, userRole: string) {
    const requestContext: IRequestContext = {
      application: associateInfo.APPLICATION_NAME,
      requestId: this.result.createGuid(),
      username: associateInfo.APPLICATION
    };

    const authenticateRequest: IAssociateAuthenticateRequest = {
      requestContext: requestContext,
      username: payload.username,
      password: payload.password,
      repositoryEnum: associateInfo.REPOSITORY_ENUM,
      userRoleEnum: userRole
    };

    return authenticateRequest;
  }

  public handleErrorResponse(userSearchRes: IAssociateSearchResponse): boolean {
    let isError = false;
    this.result.errorInfo.title = API_RESPONSE.messages.badData;

    if (userSearchRes?.status === API_RESPONSE.statusCodes[404]) {
      isError = true;
      this.result.errorInfo.detail = API_RESPONSE.messages.associateDetailError;
      return isError;
    }

    if (userSearchRes?.status === API_RESPONSE.statusCodes[500]) {
      isError = true;
      this.result.errorInfo.detail = API_RESPONSE.messages.userSearchFail;
      return isError;
    }

    const accountStatus = userSearchRes.user[0].userAccountStatus;

    // checks if account is disabled
    if (accountStatus.disabled) {
      isError = true;
      this.result.errorInfo.detail = API_RESPONSE.messages.associateAccountDisabled;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[476];
    }

    // checks if account is locked
    if (accountStatus.locked) {
      isError = true;
      this.result.errorInfo.detail = API_RESPONSE.messages.associateAccountLocked;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[475];
    }
    return isError;
  }

  public createAdminObject(payload: CreateProfileRequest, userDetails?: IUser): Admin {
    const admin = new Admin();
    admin.username = payload.username;
    admin.createdAt = new Date();
    admin.updatedAt = new Date();
    admin.role = payload.role;
    admin.firstName = (userDetails) ? userDetails.firstName : payload.firstName;
    admin.lastName = (userDetails) ? userDetails.lastName : payload.lastName;
    admin.displayName = payload.displayName;
    admin.displayTitle = AdminDisplayTitle[payload.role];
    admin.location = payload.location;
    admin.aboutMe = payload.aboutMe;
    admin.active = true;
    admin.isPersona = payload.isPersona;
    admin.communities = payload.communities;
    return admin;
  }

  public async getNewAdminProfile(payload, token: string) {
    const webUserRequest = this.generateWebUserRequest(token);
    const searchRequestData = this.generateUserRequestObject(payload.username);

    return this.associateGateway.webUserSearch(
      APP.config.restApi.member.searchUrl,
      webUserRequest,
      searchRequestData
    );
  }

  public generateWebUserRequest(token: string): WebUserRequestData {
    const webUserRequest = new WebUserRequestData();
    webUserRequest.token = token;
    webUserRequest.apiKey = APP.config.restApi.onPrem.apiKey;
    webUserRequest.header = APP.config.restApi.webUserHeader;

    return webUserRequest;
  }

  public async generateToken(result: AdminUser) {
    const claims: ISecureJwtClaims = {
      id: { value: result.id, encrypt: true },
      name: { value: result.username, encrypt: true },
      active: { value: true, encrypt: false },
      firstName: { value: result.firstName, encrypt: true },
      lastName: { value: result.lastName, encrypt: true },
      role: { value: result.role, encrypt: true }
    };
    return this.secureJwtToken.generateToken(result.username, result.username, claims);
  }

  public async activityHandler(activity: AdminActivity) {
    const userIds = activity.list.map((value) => {
      return new ObjectId(value.author.id);
    });

    if (userIds) {
      const users = await this._mongoSvc.readByIDArray(collections.USERS, userIds);

      activity.list.forEach((list) => {
        const authUser = users.filter((user) => {
          return list.author['id'] === user.id;
        })[0];
        if (!authUser) {
          return;
        }
        list.author.displayName = authUser.displayName ?? null;
        list.author.firstName = authUser.firstName;
        list.author.lastName = authUser.lastName;
      });
    }
  }

  public fetchStoryCountDetails(storiesData: ExportStoryData[], published: boolean, communities: Community[]) {
    const stories = storiesData.filter((story) => story.published === published);
    const requiredStories = [];
    communities.forEach((community) => {
      const publishStateCount = stories.filter((story) => story.communityId === community.id).length;
      if (publishStateCount) {
        requiredStories.push({
          communityId: community.id,
          communityTitle: community.title,
          numberOfStories: publishStateCount
        });
      }
    });
    return requiredStories;
  }

  public async getDemoUsers() {
    const users: DemoUser[] = await this._mongoSvc.readAll(collections.DEMOUSERS);
    const demoUsers = users.map((demoUser) => new RegExp(demoUser.username, 'i'));
    return demoUsers;
  }
}
