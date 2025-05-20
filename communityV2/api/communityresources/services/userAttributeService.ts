import { API_RESPONSE, collections, ConstCommunityNames, mongoDbTables, Result, unitOfTime } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { Community } from '../models/communitiesModel';
import { BaseResponse } from '../models/resultModel';
import { CommunityInfo, CommunityInfoRequest, User } from '../models/userModel';
import { PushNotifications } from './pushNotifications';

@Service()
export class UserAttributeService {
  constructor(
    private _mongoService: MongoDatabaseClient,
    private _result: Result,
    private pushNotification: PushNotifications,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async updateStoryPromotion(userId: string, remindMe: boolean) {
    try {
      let res = 1;
      const user: User = await this._mongoService.readByID(collections.USERS, userId);
      if (user == null) {
        this._result.errorInfo.title = API_RESPONSE.messages.badData;
        this._result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this._result.createError([this._result.errorInfo]);
      }

      if (remindMe && !user?.attributes?.storyPromotion?.nextPromotionDate) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 15);
        res = await this._mongoService.updateByQuery(
          collections.USERS,
          { [mongoDbTables.users.id]: new ObjectId(user.id) },
          {
            $set: {
              [mongoDbTables.users.remindStoryPromotion]: remindMe,
              [mongoDbTables.users.nextStoryPromotionDate]: nextDate
            }
          }
        );
      }
      else {
        res = await this._mongoService.updateByQuery(
          collections.USERS,
          { [mongoDbTables.users.id]: new ObjectId(user.id) },
          {
            $set: { [mongoDbTables.users.remindStoryPromotion]: remindMe }
          }
        );
      }

      return this._result.createSuccess(res > 0);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }

  public async updateCommunityVisit(currentUser: User, communityId: string): Promise<BaseResponse> {
    try {
      const user: User = await this._mongoService.readByID(collections.USERS, currentUser.id);

      // Find the user visit count
      const communitydata = user.attributes.communityDetails.filter((data) => data.communityId === communityId)[0];
      if (!communitydata) {
        this._result.errorInfo.title = API_RESPONSE.messages.noDocumentFound;
        this._result.errorInfo.detail = API_RESPONSE.messages.userHasNoAssociatedCommunity;

        return this._result.createError([this._result.errorInfo]);
      }
      const userVisitCount = communitydata.visitCount + 1;

      if (userVisitCount > unitOfTime.visitCountLimit) {
        this._result.errorInfo.title = API_RESPONSE.messages.userVisitCountExceedTitle;
        this._result.errorInfo.detail = API_RESPONSE.messages.userVisitCountExceedDetail;

        return this._result.createError([this._result.errorInfo]);
      }
      const search = {
        [mongoDbTables.users.id]: new ObjectId(currentUser.id),
        [mongoDbTables.users.communityDetails]: {
          $elemMatch: {
            [mongoDbTables.users.communityId]: communityId
          }
        }
      };
      const userInfo = {
        $set: {
          [mongoDbTables.users.visitCountInList] : userVisitCount
        }
      };

      const response = await this._mongoService.findAndUpdateOne(collections.USERS, search, userInfo);
      if (response === null) {
        this._result.errorInfo.title = API_RESPONSE.messages.badData;
        this._result.errorInfo.detail = API_RESPONSE.messages.failedToUpdate;

        return this._result.createError([this._result.errorInfo]);
      }

      return this._result.createSuccess(response);

    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }

  public async updateCommunityInfo(communityInfo: CommunityInfoRequest, currentUser: User): Promise<BaseResponse> {
    try {
      const community: Community = await this._mongoService.readByID(collections.COMMUNITY, communityInfo.communityId);
      if (communityInfo.dueDate && community.title !== ConstCommunityNames.MATERNITY) {
        this._result.errorInfo.title = API_RESPONSE.messages.badData;
        this._result.errorInfo.detail = API_RESPONSE.messages.invalidReques;

        return this._result.createError([this._result.errorInfo]);
      }
      const user: User = await this._mongoService.readByID(collections.USERS, currentUser.id);
      const communityIndex = user.attributes.communityDetails.findIndex((data) => data.communityId === communityInfo.communityId);
      if (communityIndex === -1) {
        this._result.errorInfo.title = API_RESPONSE.messages.noDocumentFound;
        this._result.errorInfo.detail = API_RESPONSE.messages.userHasNoAssociatedCommunity;

        return this._result.createError([this._result.errorInfo]);
      }
      const dueDateStatus = user.attributes.communityDetails[communityIndex].dueDateEnteredOnce;
      const newCommunityData: CommunityInfo = {
        ...communityInfo,
        visitCount: user.attributes.communityDetails[communityIndex].visitCount,
        dueDate: (communityInfo.dueDate === '') ? '' : new Date(communityInfo.dueDate),
        dueDateEnteredOnce: (dueDateStatus || communityInfo.dueDate !== '') ? true : false
      };
      user.attributes.communityDetails[communityIndex] = newCommunityData;
      const search = {
        [mongoDbTables.users.id]: new ObjectId(currentUser.id),
        [mongoDbTables.users.communityDetails]: {
          $elemMatch: {
            [mongoDbTables.users.communityId]: communityInfo.communityId
          }
        }
      };
      const userInfo = {
        $set: {
          [mongoDbTables.users.communityDetails] : user.attributes.communityDetails
        }
      };
      const response = await this._mongoService.updateByQuery(collections.USERS, search, userInfo);
      if (response <= 0) {
        this._result.errorInfo.title = API_RESPONSE.messages.badData;
        this._result.errorInfo.detail = API_RESPONSE.messages.failedToUpdate;

        return this._result.createError([this._result.errorInfo]);
      }

      // Create Scheduled Job for the Users.
      const result = await this.pushNotification.generatePNJobs(currentUser.id, communityInfo.communityId, communityInfo.dueDate);
      if (!result) {
        this._result.errorInfo.title = API_RESPONSE.messages.failedToCreatePNTitle;
        this._result.errorInfo.detail = API_RESPONSE.messages.failedToCreateDetail;

        return this._result.createError([this._result.errorInfo]);
      }

      return this._result.createSuccess(user);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }
}
