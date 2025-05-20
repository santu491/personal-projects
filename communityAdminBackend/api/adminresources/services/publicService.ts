import { API_RESPONSE, collections, mongoDbTables, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { Service } from 'typedi';
import { MetricsHelper } from '../helpers/metricsHelper';
import { UserHelperService } from '../helpers/userHelper';
import { LoginModel } from '../models/adminUserModel';
import { FindQuery } from '../models/commonModel';
import { Metrics } from '../models/metricsModel';
import { BaseResponse } from '../models/resultModel';
import { AuthorizedAdminUser } from '../models/userModel';
import { UserService } from './userService';

@Service()
export class PublicService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private userService: UserService,
    private _metricsHelper: MetricsHelper,
    private _userHelper: UserHelperService
  ) { }

  public async login(login: LoginModel): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.adminUser.username]: {
          $regex: login.username,
          $options: 'i'
        },
        [mongoDbTables.adminUser.active]: true
      };
      const result: AuthorizedAdminUser = await this._mongoSvc.readByValue(collections.ADMINUSERS, query);
      if (result == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidUserNameTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserNameDetail;
        return this.result.createError(this.result.errorInfo);
      }

      /* Get the autherization for the Admin from SOA API */
      return await this.userService.adminAuth(login, result);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getData(fromDate?: string, toDate?: string): Promise<Metrics> {
    const metrics = new Metrics();
    // get all demousers
    const demoUsers = await this._userHelper.getDemoUsers();

    const userIds = await this.getMetricUsers(demoUsers, fromDate, toDate);
    // count users excluding the demo users
    metrics.usersCount = await this._metricsHelper.getUsersCount(demoUsers, fromDate, toDate);
    // Users by community - revisit --- this is the valid query using $all
    metrics.usersByCommunity = await this._mongoSvc.getUsersPerCommunity(demoUsers, fromDate, toDate);
    // count users who joined more than one community
    metrics.usersJoinedMoreThanOneCommunity = await this._metricsHelper.getUsersWhoJoinedMoreThanOneCommunity(demoUsers, fromDate, toDate);
    // Total number of Stories
    metrics.storiesCount = await this._mongoSvc.getDocumentCount(collections.STORY, { [mongoDbTables.story.authorId]: { $in: userIds } });
    // Total number of Stories Published
    metrics.publishedStoriesCount = await this._mongoSvc.getDocumentCount(collections.STORY, { [mongoDbTables.story.published]: true, [mongoDbTables.story.authorId]: { $in: userIds } });
    // Total number of Stories Un Published
    metrics.unPublishedStoriesCount = await this._mongoSvc.getDocumentCount(collections.STORY, { [mongoDbTables.story.published]: false, [mongoDbTables.story.authorId]: { $in: userIds } });
    // Number of Stories by community
    metrics.storiesPerCommunity = await this._mongoSvc.getStoriesPerCommunity(true, userIds);
    // Number of Unpublished Stories by community
    metrics.unPublishedStoriesPerCommunity = await this._mongoSvc.getStoriesPerCommunity(false, userIds);
    // Total number of User who opted PN
    metrics.usersOptedForPn = await this._metricsHelper.getPNEnabledUserCount(userIds);

    return metrics;
  }

  public async getMemberData(market: string, fromDate?: string, toDate?: string) {
    const metrics = new Metrics();
    // get all demousers
    const demoUsers = await this._userHelper.getDemoUsers();

    const userIds = await this.getMetricUsers(demoUsers, fromDate, toDate, market);
    metrics.usersCount = {
      totalCount: userIds.length
    };

    // Users by community - revisit --- this is the valid query using $all
    metrics.usersByCommunity = await this._mongoSvc.getUsersPerCommunity(demoUsers, fromDate, toDate, market);
    // count users who joined more than one community
    metrics.usersJoinedMoreThanOneCommunity = await this._metricsHelper.getUsersWhoJoinedMoreThanOneCommunity(demoUsers, fromDate, toDate, market);
    // Total number of Stories
    metrics.storiesCount = await this._mongoSvc.getDocumentCount(collections.STORY, {
      [mongoDbTables.story.authorId]: { $in: userIds }
    });
    // Total number of Stories Published
    metrics.publishedStoriesCount = await this._mongoSvc.getDocumentCount(collections.STORY, {
      [mongoDbTables.story.authorId]: { $in: userIds }, [mongoDbTables.story.published]: true
    });
    // Total number of Stories Un Published
    metrics.unPublishedStoriesCount = await this._mongoSvc.getDocumentCount(collections.STORY, {
      [mongoDbTables.story.authorId]: { $in: userIds }, [mongoDbTables.story.published]: false
    });
    // Number of Stories by community
    metrics.storiesPerCommunity= await this._mongoSvc.getStoriesPerCommunity(true, userIds);
    // Number of Unpublished Stories by community
    metrics.unPublishedStoriesPerCommunity = await this._mongoSvc.getStoriesPerCommunity(false, userIds);

    metrics.usersOptedForPn = await this._metricsHelper.getPNEnabledUserCount(userIds);
    return metrics;
  }

  private async getMetricUsers(demoUsers: RegExp[], fromDate?: string, toDate?: string, market?: string) {
    const searchQuery: FindQuery = {
      [mongoDbTables.users.username]: { $nin: demoUsers }
    };

    if (market) {
      searchQuery[mongoDbTables.users.memberType] = market;
    }

    if (fromDate && toDate) {
      searchQuery[mongoDbTables.users.createdAt] = {
        $gte: new Date(fromDate),
        $lt: new Date(toDate)
      };
    }

    const users = await this._mongoSvc.readAllByValue(
      collections.USERS,
      searchQuery,
      {},
      null,
      null,
      {
        'projection': {
          [mongoDbTables.users.id]: true
        }
      }
    );

    return users.map((user) => user.id);
  }
}
