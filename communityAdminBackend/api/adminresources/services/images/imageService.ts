import { API_RESPONSE, collections, mongoDbTables, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectID } from 'mongodb';
import { Service } from 'typedi';
import { Admin } from '../../models/adminUserModel';
import { Post } from '../../models/postsModel';
import { BaseResponse } from '../../models/resultModel';
import { AdminUser, User } from '../../models/userModel';
import { S3Service } from '../aws/s3Service';

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
    userId: string,
    isProfile: boolean,
    postId: string
  ): Promise<BaseResponse> {
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
      const fileName = this.result.createGuid();
      const resp = await this.s3Service.upload(file, fileName, isProfile);
      if (resp && resp.Location) {
        await this.handleProfileImage(userId, resp.Key, false, isProfile, postId);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
        return this.result.createError(this.result.errorInfo);
      }
      return this.result.createSuccess({ key: resp.Key });
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateImage(
    file: Buffer,
    userId: string,
    isProfile: boolean,
    isDelete: boolean,
    postId: string
  ): Promise<BaseResponse> {
    try {
      let post: Post;
      const user: AdminUser = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      if (!isProfile) {
        post = await this._mongoSvc.readByID(
          collections.POSTS,
          postId
        );
        if (post === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
      }
      const fileName = isProfile ? user.profileImage : post.content.image;
      if (isDelete) {
        const resp = await this.s3Service.delete(fileName, isProfile);
        await this.handleProfileImage(userId, '', true, isProfile, postId);
        return this.result.createSuccess(resp);
      } else {
        const resp = await this.s3Service.upload(file, fileName, isProfile);
        if (!resp && !resp.Location) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
          return this.result.createError(this.result.errorInfo);
        }
        await this.handleProfileImage(userId, resp.Key, isDelete, isProfile, postId);
        return this.result.createSuccess({ key: resp.Key });
      }
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  public async getImage(
    adminUser,
    isProfile: boolean,
    isUser: boolean,
    id?: string
  ) {
    try {
      const imageKey = await this.handleGetImage(isProfile, isUser, id, adminUser.id);
      if (!imageKey) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.imageNotFound;

        return this.result.createError(this.result.errorInfo);
      }
      const s3Reponse = await this.s3Service.getImage(imageKey, isProfile);
      if (s3Reponse === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.imageNotFound;

        return this.result.createError(this.result.errorInfo);
      }
      return s3Reponse.Body;
    } catch (error) {
      this._log.error((error as Error).message);
      return null;
    }
  }

  private async handleProfileImage(
    userId: string,
    key: string,
    isDelete: boolean,
    isProfile: boolean,
    postId: string) {
    if (isProfile) {
      const search = {
        [mongoDbTables.adminUser.id]: new ObjectID(userId)
      };
      const setData = {
        $set: {
          [mongoDbTables.adminUser.profileImage]: isDelete ? '' : key,
          [mongoDbTables.adminUser.updatedAt]: new Date()
        }
      };
      await this._mongoSvc.updateByQuery(collections.ADMINUSERS, search, setData);
    } else {
      const search = {
        [mongoDbTables.posts.id]: new ObjectID(postId)
      };
      const setData = {
        $set: {
          [mongoDbTables.posts.postImage]: isDelete ? '' : key,
          [mongoDbTables.posts.updateDate]: new Date()
        }
      };
      await this._mongoSvc.updateByQuery(collections.POSTS, search, setData);
    }
  }

  private async handleGetImage(
    isProfile: boolean,
    isUser: boolean,
    id: string,
    adminId: string): Promise<string> {
    if (isProfile && isUser) {
      const user: User = await this._mongoSvc.readByID(collections.USERS, id);

      return user?.profilePicture;
    }

    if (isProfile && !isUser) {
      const adminUserId = (id) ? id : adminId;
      const adminUser: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminUserId);

      return adminUser?.profileImage;
    }

    if (!isProfile && !isUser) {
      const post: Post = await this._mongoSvc.readByID(collections.POSTS, id);

      return post.content?.image;
    }

    return null;

  }
}
