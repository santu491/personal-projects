import { AdminRole, collections, mongoDbTables, noCommunity, schedulePNStatus, scheduledPushNotification } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectID } from 'mongodb';
import { Service } from 'typedi';
import { Admin } from '../models/adminUserModel';
import { PushNotification, PushNotificationRequest, ViewPNRequest } from '../models/pushNotificationModel';
import { AdminUser } from '../models/userModel';

@Service()
export class PushNotificationHelper {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async createPushNotificationData(payload: PushNotificationRequest, admin: Admin, editor?: string) {
    try {
      const author = new AdminUser();
      author.displayName = admin.displayName;
      author.firstName = admin.firstName;
      author.lastName = admin.lastName;
      author.id = admin.id;

      const pnData = new PushNotification();
      pnData.createdAt = pnData.updatedAt = new Date();
      pnData.removed = false;
      pnData.isSent = false;
      pnData.author = author;
      if (payload.id) {
        delete payload.id;
      }
      pnData.updatedBy = (editor !== null) ? editor : null;
      const pushNotification: PushNotification = { ...payload, ...pnData };

      return pushNotification;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  public async getFilter(filter: ViewPNRequest, admin) {
    try {
      let query;
      if (admin.role === AdminRole.scadvocate) {
        query = {
          [mongoDbTables.scheduledJobs.authorId]: admin.id,
          [mongoDbTables.scheduledJobs.communities]: {
            $in: filter.communities
          }
        };
      } else {
        if (filter.communities.includes(noCommunity) && filter.communities.length > 1) {
          filter.communities = filter.communities.filter((value) => value !== noCommunity);
          query = {
            $or: [
              { [mongoDbTables.scheduledJobs.communities]: [] },
              { [mongoDbTables.scheduledJobs.communities]: { $in: filter.communities } }
            ]
          };
        } else if (filter.communities.includes(noCommunity) && filter.communities.length === 1) {
          query = { [mongoDbTables.scheduledJobs.communities]: [] };
        } else {
          query = {
            [mongoDbTables.scheduledJobs.communities]: { $in: filter.communities }
          };
        }
      }

      if (filter.status.length > 0) {
        if (filter.status.includes(schedulePNStatus.CANCELLED)) {
          query[mongoDbTables.scheduledJobs.removed] = true;
          query[mongoDbTables.scheduledJobs.disabled] = true;
        }
        if (filter.status.includes(schedulePNStatus.SCHEDULED)) {
          query[mongoDbTables.scheduledJobs.isSent] = false;
          query[mongoDbTables.scheduledJobs.removed] = false;
        }
        if (filter.status.includes(schedulePNStatus.SENT)) {
          query[mongoDbTables.scheduledJobs.isSent] = true;
          query[mongoDbTables.scheduledJobs.removed] = false;
        }
      }

      query[mongoDbTables.scheduledJobs.name] = scheduledPushNotification;

      return query;

    } catch(error) {
      return false;
    }
  }

  public async getNoRecentLoginCount(numberOfLoginDays: number, communities, demoUsers?: RegExp[]) {
    const numOfDays = numberOfLoginDays === null || numberOfLoginDays === undefined ?
      31 :
      numberOfLoginDays + 1;
    const lastLogin = new Date();
    lastLogin.setDate(lastLogin.getDate() - numOfDays);
    let count;
    if (communities.length > 0) {
      count = this.getCountData({
        [mongoDbTables.users.lastLoginAt]: { $lt: lastLogin },
        [mongoDbTables.users.active]: true,
        [mongoDbTables.users.username]: { $nin: demoUsers },
        [mongoDbTables.users.myCommunities]: { $in: communities }
      });
    } else {
      count = this.getCountData({
        [mongoDbTables.users.lastLoginAt]: { $lt: lastLogin },
        [mongoDbTables.users.active]: true,
        [mongoDbTables.users.username]: { $nin: demoUsers }
      });
    }
    return count;
  }

  public async getUsersWithNoStoryCount(communities: string[], demoUsers?: RegExp[]) {
    const storyFilter = communities.length > 0
      ? { [mongoDbTables.story.communityId]: { $in: communities } }
      : {};
    const stories = await this._mongoSvc.readAllByValue(
      collections.STORY,
      storyFilter,
      {},
      null,
      null,
      {
        'projection': {
          [mongoDbTables.story.authorId]: 1
        }
      }
    );
    const userId = stories.map((story) => new ObjectID(story.authorId));
    const search = {
      [mongoDbTables.users.id]: { $nin: userId },
      [mongoDbTables.users.active]: true,
      [mongoDbTables.users.myCommunities]: { $in: communities },
      [mongoDbTables.users.username]: { $nin: demoUsers }
    };

    if (communities.length === 0) {
      delete search[mongoDbTables.users.myCommunities];
    }
    return this.getCountData(search);
  }

  public async getUsersWithDraftStoryCount(communities: string[], demoUsers?: RegExp[]) {
    const storiesSearch = {
      published: false,
      removed: false
    };

    const userSearch = {
      active: true
    };
    if (communities.length > 0) {
      userSearch[mongoDbTables.users.myCommunities] = { $in: communities };
      storiesSearch[mongoDbTables.story.communityId] = { $in: communities };
    }
    const stories = await this._mongoSvc.readAllByValue(collections.STORY, storiesSearch);
    const userId = stories.map((story) => new ObjectID(story.authorId));
    userSearch[mongoDbTables.users.id] = { $in: userId };
    userSearch[mongoDbTables.users.username] = { $nin: demoUsers };
    return this.getCountData(userSearch);
  }

  public async getNonCommunityUsersCount(communities: string[], demoUsers?: RegExp[]) {
    const communityFilter = [
      { [mongoDbTables.users.myCommunities]: null },
      { [mongoDbTables.users.myCommunities]: [] },
      { [mongoDbTables.users.myCommunities]: { $nin: communities } }
    ];

    if (communities.length === 0) {
      communityFilter.pop();
    }
    const search = {
      $or: communityFilter,
      active: true,
      [mongoDbTables.users.username]: { $nin: demoUsers }
    };

    return this.getCountData(search);
  }

  public async getCountData(query) {
    const allUsers = await this._mongoSvc.readAllByValue(
      collections.USERS,
      query,
      {},
      null,
      null,
      {
        'projection': {
          [mongoDbTables.users.id]: true
        }
      }
    );
    const userIds = allUsers.map((user) => user.id);
    const pnActiveUsers = await this._mongoSvc.getDocumentCount(
      collections.INSTALLATIONS,
      {
        [mongoDbTables.installations.userId]: {
          $in: userIds
        },
        [mongoDbTables.installations.devices]: {
          $exists: true,
          $not: { $size: 0 }
        }
      }
    );
    return {
      totalCount: userIds.length,
      pnActiveUsers: pnActiveUsers
    };
  }
}
