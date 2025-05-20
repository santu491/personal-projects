import {
  Result, SQSParams, collections, mongoDbTables
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import { ObjectId } from 'bson';
import { Service } from 'typedi';
import { BaseResponse } from '../models/resultModel';
import { User } from '../models/userModel';
import { SqsService } from './aws/sqsService';

@Service()
export class AppMemberService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private sqsService: SqsService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getDeleteRequestedUsers(): Promise<BaseResponse> {
    try {
      const sortOption = { [mongoDbTables.users.createdAt]: -1 };
      const users = await this._mongoSvc.readAllByValue(collections.USERS, {
        [mongoDbTables.users.deleteRequested]: true,
        [mongoDbTables.users.active]: true
      }, sortOption);

      return this.result.createSuccess(users);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(true);
    }
  }

  public async updateUserDeleteRequest(approved: boolean, userId: string): Promise<BaseResponse> {
    try {
      if (approved) {
        const user: User = await this._mongoSvc.readByID(collections.USERS, userId);
        /* Push the payload to the SQS Queue. */
        const payload = {
          userId: userId,
          username: user.username,
          env: getArgument('env'),
          createdDate: new Date()
        };
        await this.sqsService.addToNotificationQueue(
          payload,
          APP.config.aws.deleteProfileQueue,
          SQSParams.DELETE_PROFILE_MESSAGE_GROUP_ID
        );

        return this.result.createSuccess(true);
      } else {
        /* Allow the user to access the App */
        const response = await this._mongoSvc.updateByQuery(collections.USERS,
          {
            [mongoDbTables.users.id]: new ObjectId(userId)
          },
          {
            $set: {
              [mongoDbTables.users.deleteRequested]: false
            }
          }
        );

        return this.result.createSuccess(response);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(true);
    }
  }
}
