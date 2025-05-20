import {
  ContentKey,
  Result,
  Validation,
  collections,
  mongoDbTables
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ISecureJwtClaims, SecureJwtToken } from '@anthem/communityapi/filters';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP, getArgument } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { AuntBerthaGateway } from '../gateways/auntBerthaGateway';
import { HealthwiseGateway } from '../gateways/healthwiseGateway';
import { ConnectedService } from '../models/adminModel';
import { ContentModel } from '../models/contentModel';
import { BaseResponse } from '../models/resultModel';
import { RequestToken } from '../models/searchTermModel';
import { StoryResponse } from '../models/storyModel';
import {
  AuthenticatedUser, DevAuthModel, User
} from '../models/userModel';
import { AccessTokenHelper } from './helpers/accessTokenHelper';
import { StoryHelper } from './helpers/storyHelper';

@Service()
export class PublicService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private secureJwtToken: SecureJwtToken,
    private validate: Validation,
    private storyHelper: StoryHelper,
    private accessTokenHelper: AccessTokenHelper,
    private auntBerthaGateway: AuntBerthaGateway,
    private healthWiseGateway: HealthwiseGateway,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getAppVersion(): Promise<string> {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      return appVersion.apiVersion + '-' + getArgument('env');
    } catch (error) {
      this._log.error(error as Error);
      return '';
    }
  }

  public async getAppMinVersion(): Promise<BaseResponse> {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      return this.result.createSuccess(appVersion);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getFlagged(): Promise<BaseResponse> {
    try {
      const value = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.flagged]: true
      };
      const sort = { [mongoDbTables.question.createdDate]: -1 };
      const stories = await this._mongoSvc.readAllByValue(
        collections.STORY,
        value,
        sort
      );
      stories.forEach((story) => {
        if (story.answer !== null) {
          story.answer = this.validate.sort(
            story.answer,
            -1,
            mongoDbTables.story.createdAt
          );
        }
      });
      const storyResponseList: StoryResponse[] = [];
      for (const story of stories) {
        const storyResponse = await this.storyHelper.buildStoryResponse(
          story,
          null
        );
        storyResponseList.push(storyResponse);
      }
      return this.result.createSuccess(storyResponseList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async devAuthenticate(model: DevAuthModel) {
    try {
      const userName = model.username;
      /* Query to ignore the case */
      const query = { $regex: userName, $options: 'i' };
      const user = await this._mongoSvc.readByValue(collections.USERS, {
        [mongoDbTables.users.username]: query
      });
      const claims: ISecureJwtClaims = {
        name: { value: userName, encrypt: true },
        id: { value: user.id.toString(), encrypt: true },
        active: { value: user.active, encrypt: false },
        isDevLogin: { value: true, encrypt: false }
      };
      const token = this.secureJwtToken.generateToken(
        userName,
        userName,
        claims
      );
      user.token = token;
      const resp: AuthenticatedUser = await this.buildAuthenticatedUser(user);
      return this.result.createSuccess(resp);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async checkHealth(): Promise<BaseResponse> {
    try {
      const healthReport: ConnectedService[] = await this.getHealth();
      return this.result.createSuccess(healthReport);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAppTranslations(
    language: string,
    contentType: string
  ): Promise<BaseResponse> {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const version = appVersion.content[contentType];
      const translations: ContentModel = await this._mongoSvc.readByValue(
        collections.CONTENT,
        {
          language: language,
          contentType: contentType,
          version: version
        }
      );
      return this.result.createSuccess(translations);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAppData(language: string): Promise<BaseResponse> {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const publicVersion = appVersion.content[ContentKey.PUBLIC];
      const touVersion = appVersion[ContentKey.TOU];
      const search = {
        language: language,
        $or: [
          {
            [mongoDbTables.content.contentType]: ContentKey.TOU,
            [mongoDbTables.content.version]: touVersion
          },
          {
            [mongoDbTables.content.contentType]: ContentKey.PUBLIC,
            [mongoDbTables.content.version]: publicVersion
          }
        ]
      };

      const translations: ContentModel[] = await this._mongoSvc.readAllByValue(
        collections.CONTENT,
        search
      );
      return this.result.createSuccess(translations);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async buildAuthenticatedUser(
    user: User
  ) {
    const authUser = new AuthenticatedUser();
    authUser.id = user.id.toString();
    authUser.firstName = user.firstName;
    authUser.lastName = user.lastName;
    authUser.username = user.username;
    authUser.meTabHelpCardBanner = user.attributes.meTabHelpCardBanner
      ? user.attributes.meTabHelpCardBanner
      : false;
    authUser.localServiceHelpCardBanner = user.attributes.localServiceHelpCardBanner
      ? user.attributes.localServiceHelpCardBanner
      : false;
    authUser.communityHelpCardBanner = user.attributes.communityHelpCardBanner
      ? user.attributes.communityHelpCardBanner
      : false;
    authUser.localCategoryHelpCardBanner = user.attributes.localCategoryHelpCardBanner
      ? user.attributes.localCategoryHelpCardBanner
      : false;
    authUser.token = user.token;
    authUser.displayName = user.displayName;
    authUser.age = user.age;
    authUser.profilePicture = user.profilePicture;
    authUser.myCommunities = user.myCommunities;
    authUser.active = user.active;
    authUser.personId = user.personId;
    authUser.hasAgreedToTerms = user.hasAgreedToTerms;
    authUser.memberData = user.memberData;
    authUser.onBoardingState = user.onBoardingState;
    /* Adding Notification flags to User Object */
    authUser.communityNotificationFlag = user.attributes.communityNotificationFlag ?? true;
    authUser.questionNotificationFlag = user.attributes.questionNotificationFlag ?? true;
    authUser.answerNotificationFlag = user.attributes.answerNotificationFlag ?? true;
    authUser.reactionNotificationFlag = user.attributes.reactionNotificationFlag ?? true;
    authUser.dueDateBasedNotificationFlag = user.attributes.dueDateBasedNotificationFlag ?? true;
    authUser.commentReactionNotificationFlag = user.attributes.commentReactionNotificationFlag ?? true;
    authUser.replyNotificationFlag = user.attributes.replyNotificationFlag ?? true;
    authUser.dueDateBasedNotificationFlag = user.attributes.dueDateBasedNotificationFlag ?? true;

    return authUser;
  }

  private async getHealth(): Promise<ConnectedService[]> {
    try {
      const services: ConnectedService[] = [];

      // DB Health - Grab a community to check connectivity
      const dbService: ConnectedService = {
        serviceName: 'MongoDB',
        status: null,
        error: null
      };

      try {
        const communityList = await this._mongoSvc.readAll(
          collections.COMMUNITY
        );
        if (communityList.length > 0) {
          dbService.status = 'Healthy';
        } else {
          dbService.status = 'No Data, Connection success';
        }
      } catch (error) {
        dbService.status = 'Error!';
        dbService.error = error.toString();
      }
      services.push(dbService);

      //API Gateway health
      const apiService: ConnectedService = {
        serviceName: 'API Gateway',
        status: null,
        error: null
      };
      try {
        const requestData: RequestToken = {
          username: APP.config.restApi.auntBertha.username,
          password: APP.config.restApi.auntBertha.password,
          api_key: APP.config.restApi.auntBertha.apiKeys[0].apiKey
        };
        const findHelpTenantToken= await this.accessTokenHelper.getFindhelpMemberOAuthToken(
          requestData.api_key, requestData
        );
        if (findHelpTenantToken.data.token && findHelpTenantToken.data.token.length > 0) {
          const taxonomy = await this.auntBerthaGateway.getServiceTags(
            findHelpTenantToken.data.token
          );
          if (taxonomy) {
            apiService.status = 'Healthy';
          } else {
            apiService.status = 'Gateway error!';
          }
        } else {
          apiService.status = 'Can hit service but unable to get token';
        }
      } catch (error) {
        apiService.status = 'Error!';
        apiService.error = (error as Error).message;
      }
      services.push(apiService);

      //Healthwise health
      const hwService: ConnectedService = {
        serviceName: 'Healthwise',
        status: null,
        error: null
      };

      try {
        const healthWiseToken = await this.healthWiseGateway.postAuth();
        if (
          healthWiseToken.access_token &&
          healthWiseToken.access_token.length > 8
        ) {
          hwService.status = 'Healthy';
        } else {
          hwService.status = 'Unable to hit service';
        }
      } catch (error) {
        hwService.status = 'Error!';
        hwService.error = error.toString();
      }
      services.push(hwService);

      return services;
    } catch (error) {
      this._log.error(error as Error);
      return [];
    }
  }
}
