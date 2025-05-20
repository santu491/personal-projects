import { API_RESPONSE, Result, collections, genericQueryValue, mongoDbTables } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Service } from 'typedi';
import { MetricsHelper } from '../helpers/metricsHelper';
import { PostHelperService } from '../helpers/postHelper';
import { UserHelperService } from '../helpers/userHelper';
import { Post } from '../models/postsModel';

@Service()
export class DashboardService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private userHelper: UserHelperService,
    private postHelper: PostHelperService,
    private metricsHelper: MetricsHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getActiveUsersCount() {
    try {
      const demoUsers = await this.userHelper.getDemoUsers();
      const totalUsers = await this._mongoSvc.getDocumentCount(collections.USERS, {
        [mongoDbTables.users.username]: {
          $nin: demoUsers
        }
      });

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const monthLoginCount = await this._mongoSvc.getDocumentCount(collections.USERS, {
        [mongoDbTables.users.lastLoginAt]: {
          $gte: firstDay,
          $lt: lastDay
        },
        [mongoDbTables.users.username]: {
          $nin: demoUsers
        }
      });

      const todayLoginCount = await this._mongoSvc.getDocumentCount(collections.USERS, {
        [mongoDbTables.users.lastLoginAt]: {
          $gte: currentDate
        },
        [mongoDbTables.users.username]: {
          $nin: demoUsers
        }
      });

      return this.result.createSuccess({
        totalUsers: totalUsers,
        monthLogin: monthLoginCount,
        todayLogin: todayLoginCount
      });
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  public async getNewUsersCount() {
    try {
      const demoUsers = await this.userHelper.getDemoUsers();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const labels: string[] = [];
      const monthData = [];

      for (let i = 0; i < 6; i++) {
        const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
        if (monthLabel === labels[labels?.length - 1]) {
          i--;
          currentDate.setMonth(currentDate.getMonth() - 1);
        }
        else {
          labels.push(monthLabel);
          const count = await this.getNewUserOnMonth(currentDate, demoUsers);
          monthData.push(count);
          currentDate.setMonth(currentDate.getMonth() - 1);
        }
      }

      return this.result.createSuccess({
        month: labels,
        userCount: monthData
      });
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  public async getLatestPost(adminId: string) {
    try {
      const admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminId);

      if (!admin) {
        this.result.errorInfo.detail = API_RESPONSE.messages.adminUserNotFound;
        this.result.errorInfo.title = API_RESPONSE.messages.dataNotFound;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }

      const posts: Post[] = await this._mongoSvc.readAllByValue(collections.POSTS, {
        [mongoDbTables.posts.communities]: { $in: admin.communities }
      }, { [mongoDbTables.posts.publishedAt]: -1 }, 5, 0, { _id: 1, content: 1, comments: 1, reactions: 1 });

      for (const post of posts) {
        post[mongoDbTables.posts.commentCount] = this.postHelper.getCommentCount(post.comments);
      }

      return this.result.createSuccess(posts);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }

  }

  public async getPostActivities(adminId: string) {
    try {
      const response = [];
      const admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminId);

      if (!admin) {
        this.result.errorInfo.detail = API_RESPONSE.messages.adminUserNotFound;
        this.result.errorInfo.title = API_RESPONSE.messages.dataNotFound;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const previousDate = new Date(new Date().setDate(currentDate.getDate() - 30));
      const getPostIds = [
        {
          $match: {
            [mongoDbTables.posts.createdDate]: {
              $gte: previousDate
            },
            [mongoDbTables.posts.communities]: { $in: admin.communities },
            [mongoDbTables.posts.published]: true
          }
        },
        {
          $unwind: mongoDbTables.posts.communitiesValue
        },
        {
          $group: {
            _id: mongoDbTables.posts.communitiesValue,
            postId: {
              $push: {
                id: genericQueryValue.idValue,
                by: mongoDbTables.posts.createdByValue
              }
            }
          }
        }
      ];

      const communityPostIds = await this._mongoSvc.readByAggregate(collections.POSTS, getPostIds);

      for (const communityData of communityPostIds) {
        const details = await this.getCommunityActivity({
          ...communityData,
          post: communityData.postId.map((p) => {
            return { id: p.id.toString(), by: p.by };
          })
        });
        response.push(details);
      }
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  public async getUserData() {
    const demoUsers = await this.userHelper.getDemoUsers();
    const userIds = await this.metricsHelper.getUsersCount(demoUsers);

    return this.result.createSuccess(userIds);
  }

  private async getNewUserOnMonth(referenceDate: Date, demoUsers: RegExp[]) {
    const firstDay = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const lastDay = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);

    const count = await this._mongoSvc.getDocumentCount(collections.USERS, {
      [mongoDbTables.users.username]: { $nin: demoUsers },
      [mongoDbTables.users.createdAt]: {
        $gte: firstDay,
        $lte: lastDay
      }
    });

    return count;
  }

  private async getCommunityActivity(communityData) {
    const postIds = communityData.post.map((p) => p.id);
    let count = 0;
    const communityDetails = await this._mongoSvc.readByID(collections.COMMUNITY, communityData[mongoDbTables.community.id]);
    const postActivityDetails = {
      communityName: communityDetails.title,
      activityCount: count
    };
    if (communityData[mongoDbTables.pollResponse.postId] && communityData[mongoDbTables.pollResponse.postId].length > 0) {
      const adminActivities = await this._mongoSvc.readAllByValue(collections.ADMINACTIVITY, {
        [mongoDbTables.adminActivity.list]: {
          $elemMatch: {
            [mongoDbTables.pollResponse.postId]: { $in: postIds }
          }
        }
      });

      for (const adminActivity of adminActivities) {
        count += adminActivity.list.filter((activity) => {
          const postData = communityData.post.find((p) => p.id === activity.postId);
          return postIds.includes(activity.postId) && adminActivity.userId === postData.by;
        }).length;
      }
      postActivityDetails.activityCount = count;
    }

    return postActivityDetails;
  }
}
