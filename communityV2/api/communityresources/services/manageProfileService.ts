import {
  API_RESPONSE,
  collections,
  mongoDbTables,
  Result,
  SQSParams
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP, getArgument } from '@anthem/communityapi/utils';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { BaseResponse } from '../models/resultModel';
import { User } from '../models/userModel';
import { SqsService } from './aws/sqsService';

@Service()
export class ManageProfileService {
  constructor(
    private mongoService: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger,
    private sqsService: SqsService
  ) {}

  public async deleteProfile(id: string): Promise<BaseResponse> {
    try {
      const userInfo: User = await this.mongoService.readByID(
        collections.USERS,
        id
      );
      if (userInfo == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const setValue = {
        $set: {
          [mongoDbTables.users.deleteRequested]: true
        }
      };
      const search = {
        [mongoDbTables.users.id]: new ObjectId(userInfo.id)
      };
      await this.mongoService.updateByQuery(collections.USERS, search, setValue);
      /* Push the payload to the SQS Queue. */
      const payload = {
        userId: id,
        username: userInfo.username,
        env: getArgument('env'),
        createdDate: new Date()
      };
      const response = await this.sqsService.addToNotificationQueue(
        payload,
        APP.config.aws.deleteProfileQueue,
        SQSParams.DELETE_PROFILE_MESSAGE_GROUP_ID
      );
      if (response) {
        return this.result.createSuccess(response);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.serverError;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[422];
        return this.result.createError(this.result.errorInfo);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
