import { API_RESPONSE, collections, mongoDbTables, queryStrings, Result, TranslationLanguage, Validation } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { Activity } from '../models/activityModel';
import { PageParam } from '../models/pageParamModel';
import { BaseResponse } from '../models/resultModel';
import { BooleanResponse } from '../models/storyModel';
import { BlockUserService } from './blockUserService';
import { ActivityHelper } from './helpers/activityHelper';
import { UserHelper } from './helpers/userHelper';

@Service()
export class ActivityService {
  constructor(
    private mongoService: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    private blockUserService: BlockUserService,
    private activityHelper: ActivityHelper,
    private userHelper: UserHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async markActivityAsRead(
    userId: string,
    activityId: string
  ): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.activity.userId]: userId,
        [mongoDbTables.activity.activityId]: new ObjectId(activityId)
      };
      const activities: Activity = await this.mongoService.readByValue(
        collections.ACTIVITY,
        query
      );

      if (activities == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.activityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const updateValue = {
        $set: {
          [mongoDbTables.activity.activityNotificationRead]: true
        }
      };
      await this.mongoService.updateByQuery(collections.ACTIVITY, query, updateValue);

      const response = new BooleanResponse();
      response.operation = true;

      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getUserActivity(userId: string, language: string, params: PageParam, sort: number = -1): Promise<BaseResponse> {
    try {
      const userActivity: Activity = await this.mongoService.readByValue(collections.ACTIVITY, { [mongoDbTables.activity.userId]: userId });
      if (userActivity === null) {
        return this.result.createSuccess({});
      }

      const blockedUserList = await this.blockUserService.getBlockUserIdList(userId);

      const activityListObject = [];

      if (userActivity.activityList !== null && userActivity.activityList.length > 0) {
        for( const activity of userActivity.activityList) {
          activity.id = activity[mongoDbTables.activity.id].toString();
          if (activity.activityInitiator) {
            activity.activityInitiator = await this.fetchAuthorDetails(activity.activityInitiator);
          }
          delete activity[mongoDbTables.activity.id];

          if (Array.isArray(blockedUserList) && !blockedUserList.includes(activity.activityInitiator.id)) {
            activityListObject.push(activity);
          }
        }
      }

      if (language === TranslationLanguage.SPANISH) {
        await this.activityHelper.translateActivities(activityListObject, language);
      }
      userActivity.activityList = activityListObject;

      if (userActivity.activityList !== null && userActivity.activityList.length > 1) {
        userActivity.activityList = this.validate.sort(
          userActivity.activityList,
          sort,
          mongoDbTables.activity.createdDate
        );
      }

      if (params.pageNumber !== undefined) {
        const start = (params.pageNumber - 1) * params.pageSize;
        const end = start + params.pageSize;
        userActivity.activityList = userActivity.activityList.slice(start, end);
      }

      return this.result.createSuccess(userActivity);
    }
    catch (error) {
      return this.result.createException(error);
    }
  }

  public async fetchAuthorDetails(author) {
    // find the Admin user latest details.
    if (author.role) {
      const query = {
        [mongoDbTables.adminUser.id]: new ObjectId(author[mongoDbTables.activity.id])
      };
      const projection = {
        [queryStrings.projection]: {
          [mongoDbTables.adminUser.id]: true,
          [mongoDbTables.adminUser.firstName]: true,
          [mongoDbTables.adminUser.lastName]: true,
          [mongoDbTables.adminUser.displayName]: true,
          [mongoDbTables.adminUser.displayTitle]: true,
          [mongoDbTables.adminUser.role]: true
        }
      };
      const adminData = await this.mongoService.readByValue(collections.ADMINUSERS, query, projection);
      if (adminData) {
        adminData.profileImage = await this.userHelper.buildAdminImagePath(adminData.id);
        author = adminData;
      }
    } else {
      const value = {
        [mongoDbTables.users.id]: author[mongoDbTables.activity.id]
      };
      const projection = {
        [queryStrings.projection]: {
          [mongoDbTables.users.id]: true,
          [mongoDbTables.users.displayName]: true
        }
      };
      const user = await this.mongoService.readByValue(collections.USERS, value, projection);
      if (user) {
        user.profileImage = await this.userHelper.buildProfilePicturePath(user.id);
        author = user;
      }
    }
    return author;
  }
}
