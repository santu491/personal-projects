import { API_RESPONSE, AdminRole, Result, collections, mongoDbTables } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectID } from 'bson';
import { Service } from 'typedi';
import { UserHelperService } from '../helpers/userHelper';
import { AdminActivity } from '../models/activityModel';
import { BooleanResponse } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { AdminUser } from '../models/userModel';

@Service()
export class UserActivityService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private userHelper: UserHelperService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getAdminActivity(userId: string): Promise<BaseResponse> {
    try {
      const user: AdminUser = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const activity: AdminActivity = await this._mongoSvc.readByValue(
        collections.ADMINACTIVITY,
        { [mongoDbTables.activity.userId]: userId }
      );

      if (activity !== null) {
        await this.userHelper.activityHandler(activity);
      }
      return this.result.createSuccess(activity);
    }
    catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  public async getSCAdminActivity(userId: string, adminId: string): Promise<BaseResponse> {
    try {
      let activities: AdminActivity[];
      if (adminId) {
        activities = await this._mongoSvc.readAllByValue(collections.ADMINACTIVITY, {
          [mongoDbTables.adminActivity.userId]: adminId
        });

      } else {
        const users: AdminUser[] = await this._mongoSvc.readAllByValue(
          collections.ADMINUSERS,
          {
            $or: [
              { [mongoDbTables.adminUser.id]: new ObjectID(userId) },
              { [mongoDbTables.adminUser.role]: { $in: [AdminRole.scadvocate] } }
            ],
            [mongoDbTables.adminUser.active]: true
          },
          {},
          null,
          null,
          {
            'projection': {
              [mongoDbTables.adminUser.id]: true
            }
          }
        );
        if (users === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const userIds = users.map((user) => user.id);
        activities = await this._mongoSvc.readAllByValue(
          collections.ADMINACTIVITY,
          { [mongoDbTables.activity.userId]: { $in: userIds } }
        );
      }

      const activityList = [];
      if (activities !== null) {
        for (const activity of activities) {
          await this.userHelper.activityHandler(activity);
          activityList.push(...activity.list);
        }
      }
      return this.result.createSuccess({
        userId: userId,
        list: activityList.sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
      });
    }
    catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateActivityAsRead(activityId: string, userId: string): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.adminActivity.activityId]: new ObjectID(activityId)
      };
      const activity: AdminActivity = await this._mongoSvc.readByValue(
        collections.ADMINACTIVITY,
        query
      );
      if (activity === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.activityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const updateSetValue = {
        $set: {
          [mongoDbTables.adminActivity.activityIsRead]: true,
          [mongoDbTables.adminActivity.activityUpdatedAt]: new Date()
        }
      };
      await this._mongoSvc.updateByQuery(collections.ADMINACTIVITY, query, updateSetValue);
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  /**
   * Get the count of activities for Admin
   * @param userId userId of User
   * @returns an object with a count of activities should be sent
   */
  public async getSCAdminActivityCount(userId: string, readState?: boolean): Promise<BaseResponse> {
    try {
      const users: AdminUser[] = await this._mongoSvc.readAllByValue(
        collections.ADMINUSERS,
        {
          $or: [
            { [mongoDbTables.adminUser.id]: new ObjectID(userId) },
            { [mongoDbTables.adminUser.isPersona]: true }
          ]
        },
        {},
        null,
        null,
        {
          'projection': {
            [mongoDbTables.adminUser.id]: true
          }
        }
      );
      if (users === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const userIds = users.map((user) => user.id);
      const activities: AdminActivity[] = await this._mongoSvc.readAllByValue(
        collections.ADMINACTIVITY,
        { [mongoDbTables.activity.userId]: { $in: userIds } }
      );

      let countObject = 0;
      if (activities !== null) {
        countObject = this.getActivityCount(activities, readState);
      }
      return this.result.createSuccess({ count: countObject });
    }
    catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAdminActivityCount(userId: string, readState?: boolean): Promise<BaseResponse> {
    try {
      const user: AdminUser = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const activity: AdminActivity = await this._mongoSvc.readByValue(
        collections.ADMINACTIVITY,
        { [mongoDbTables.activity.userId]: userId }
      );

      let countObject = 0;
      if (activity !== null) {
        countObject = this.getActivityCount([activity], readState);
      }
      return this.result.createSuccess({ count: countObject });
    }
    catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  private getActivityCount(activities: AdminActivity[], readState?: boolean) {
    let count = 0;
    for (const activity of activities) {
      const activeActivity = activity.list.filter((a) => {
        if (readState === undefined) {
          return !a.isRemoved;
        }
        else {
          return !a.isRemoved && (a.isRead === readState);
        }
      }
      );
      count += activeActivity.length;
    }
    return count;
  }
}
