import { API_RESPONSE, collections, mongoDbTables, Result } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { Post } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { User } from '../models/userModel';
import { S3Service } from './aws/s3Service';

@Service()
export class ImageService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private s3Service: S3Service,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async uploadImage(
    file: Buffer,
    userId: string
  ): Promise<BaseResponse> {
    try {
      const user: User = await this._mongoSvc.readByID(
        collections.USERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const fileName = this.result.createGuid();
      const resp = await this.s3Service.upload(file, fileName);
      if (resp && resp.BucketKeyEnabled) {
        await this.handleProfileImage(userId, resp.ETag, false);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
        return this.result.createError(this.result.errorInfo);
      }
      return this.result.createSuccess({ key: resp.ETag });
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateImage(
    file: Buffer,
    userId: string,
    isDelete: boolean
  ): Promise<BaseResponse> {
    try {
      const user: User = await this._mongoSvc.readByID(
        collections.USERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const fileName = user.profilePicture;
      if (isDelete) {
        const resp = await this.s3Service.delete(fileName);
        await this.handleProfileImage(userId, '', true);
        return this.result.createSuccess(resp?.DeleteMarker ?? false);
      } else {
        const resp = await this.s3Service.upload(file, fileName);
        if (!resp && !resp?.ETag) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
          return this.result.createError(this.result.errorInfo);
        }
        return this.result.createSuccess({ key: resp.Expiration });
      }
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  public async getImage(
    isUser: boolean,
    isProfile: boolean,
    id: string) {
    try {
      let post: Post;
      let user;
      if (!isProfile) {
        post = await this._mongoSvc.readByID(
          collections.POSTS,
          id
        );
        if (post === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
      } else {
        user = await this._mongoSvc.readByID(
          isUser ? collections.USERS : collections.ADMINUSERS,
          id
        );
        if (user === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
      }
      const fileName = isProfile
        ? isUser
          ? user.profilePicture
          : user.profileImage
        : post.content.image;
      const resp = await this.s3Service.getImage(fileName, isProfile);
      if (!resp) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
        return this.result.createError([this.result.errorInfo]);
      }
      return resp.Body;
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  private async handleProfileImage(
    userId: string,
    key: string,
    isDelete: boolean) {
    const search = {
      [mongoDbTables.users.id]: new ObjectId(userId)
    };
    const setData = {
      $set: {
        [mongoDbTables.users.profilePicture]: isDelete ? '' : key
      }
    };
    await this._mongoSvc.updateByQuery(collections.USERS, search, setData);
  }
}
