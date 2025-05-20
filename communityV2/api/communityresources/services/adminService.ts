import {
  API_RESPONSE,
  collections,
  mongoDbTables,
  Result
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { Service } from 'typedi';
import { Admin } from '../models/adminUserModel';
import { BaseResponse } from '../models/resultModel';

@Service()
export class AdminService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result
  ) { }

  public async getAdminProfile(userId: string): Promise<BaseResponse> {
    try {
      const user: Admin = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      delete user?.password;
      return this.result.createSuccess(user);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getAdminImage(adminId: string): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.adminImages.adminId]: adminId
      };
      const image = await this._mongoSvc.readByValue(collections.ADMINUSERIMAGES, query);
      if (image === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.missingImage;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(image);

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
