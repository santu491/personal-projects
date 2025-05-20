import { collections, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Service } from 'typedi';
import { AppVersionModel } from '../models/appVersionModel';
import { BaseResponse } from '../models/resultModel';
import { AdminUser } from '../models/userModel';

@Service()
export class VersionService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getAppVersion(): Promise<BaseResponse> {
    try {
      const response = await this._mongoSvc.readAll(collections.APPVERSION);
      return this.result.createSuccess(response[0]);
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException(error);
    }
  }

  public async updateAppVersion(
    payload: AppVersionModel,
    currentUser: AdminUser
  ): Promise<BaseResponse> {
    try {
      payload.updatedAt = new Date();
      payload.updatedBy = currentUser.id;
      await this._mongoSvc.updateByQuery(
        collections.APPVERSION,
        {},
        {
          $set: payload
        }
      );
      return this.result.createSuccess(payload);
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException(error);
    }
  }
}
