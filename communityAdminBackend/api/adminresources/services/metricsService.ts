import {
  API_RESPONSE,
  Result, collections, genericQueryValue, mongoDbTables
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { Service } from 'typedi';
import { MetricsHelper } from '../helpers/metricsHelper';
import { UserHelperService } from '../helpers/userHelper';
import { Admin } from '../models/adminUserModel';
import { CommunityMetrics, CommunityUserCount, PostsCount, StoriesCount } from '../models/metricsModel';
import { User } from '../models/userModel';

@Service()
export class MetricsService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private userHelper: UserHelperService,
    private metricsHelper: MetricsHelper
  ) { }

  public async getCommunityMetrics(communityId: string, adminId: string) {
    const admin: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminId);
    if (!admin.communities.includes(communityId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidAdminCommunity;
      return this.result.createError([this.result.errorInfo]);
    }

    const communityMetrics = new CommunityMetrics();
    const demoUsers = await this.userHelper.getDemoUsers();
    const communityUsers: User[] = await this._mongoSvc.readAllByValue(collections.USERS, {
      [mongoDbTables.users.username]: { $nin: demoUsers },
      [mongoDbTables.users.myCommunities]: { [genericQueryValue.all]: [communityId] }
    });
    const userIds = communityUsers.map((c) => c.id);
    communityMetrics.pnEnabledUsers = await this.metricsHelper.getPNEnabledUserCount(userIds);
    await Promise.all([this.getUserData(communityUsers, communityMetrics.usersCount),
      this.getStoryData(communityId, userIds, communityMetrics.storiesCount),
      this.getPostsData(communityId, communityMetrics.postsCount)]);

    return this.result.createSuccess(communityMetrics);
  }

  private async getUserData(users: User[], userCount: CommunityUserCount) {
    userCount.totalUsers = users.length;
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    const firstDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0);
    userCount.usersThisMonth = users.filter((user) => user.createdAt >= firstDayOfMonth && user.createdAt < firstDayOfNextMonth).length;
  }

  private async getStoryData(communityId: string, userIds: string[], storyData: StoriesCount) {
    const stories = await this._mongoSvc.readAllByValue(collections.STORY, {
      [mongoDbTables.story.authorId]: { $in: userIds },
      [mongoDbTables.story.communityId]: communityId
    });
    storyData.total = stories.length;
    storyData.totalShared = stories.filter((s) => s.published).length;
    storyData.totalDraft = stories.filter((s) => !s.published).length;
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    const firstDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0);
    storyData.publishedThisMonth = stories.filter((s) => s.publishedAt >= firstDayOfMonth && s.publishedAt < firstDayOfNextMonth).length;
  }

  private async getPostsData(communityId: string, postData: PostsCount) {
    postData.totalShared = await this._mongoSvc.getRowCount(collections.POSTS, {
      [mongoDbTables.posts.communities]: { $in: [communityId] }
    });
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    const firstDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0);
    postData.postedThisMonth = await this._mongoSvc.getRowCount(collections.POSTS, {
      [mongoDbTables.posts.communities]: { $in: [communityId] },
      [mongoDbTables.posts.publishedAt]: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    });
  }
}
