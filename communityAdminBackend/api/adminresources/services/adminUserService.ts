import {
  AdminRole,
  API_RESPONSE,
  collections, mongoDbTables, Result
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectID } from 'mongodb';
import { Service } from 'typedi';
import { AdminActivity, AdminActivityList } from '../models/activityModel';
import { AdminImage } from '../models/adminModel';
import { ActivityAuthor } from '../models/adminUserModel';
import { BaseResponse } from '../models/resultModel';

@Service()
export class AdminUserService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getPersona(isPersona: boolean = true): Promise<BaseResponse> {
    try {
      const value = isPersona ? {
        [mongoDbTables.adminUser.active]: true,
        [mongoDbTables.adminUser.isPersona]: true
      } : {
        [mongoDbTables.adminUser.active]: true,
        [mongoDbTables.adminUser.role]: { $in: [AdminRole.scadvocate] }
      };
      const persona = await this._mongoSvc.readAllByValue(collections.ADMINUSERS, value);
      if (persona.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidPersonaDetails;

        return this.result.createError(this.result.errorInfo);
      }

      return this.result.createSuccess(persona);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async createActivityObject(
    adminId: string,
    userId: string,
    type: string,
    title: string,
    isFlagged: boolean,
    postId?: string,
    storyId?: string,
    commentId?: string,
    replyId?: string,
    reactionType?: string,
    adminUserId?: string
  ) {
    const obj = new AdminActivity();
    obj.userId = adminId;
    obj.list = [];
    const list = new AdminActivityList();
    list[mongoDbTables.posts.id] = new ObjectID();
    list.author = await this.getUser(userId);
    list.postId = postId;
    list.storyId = storyId;
    list.commentId = commentId;
    list.replyId = replyId;
    list.reactionType = reactionType;
    list.entityType = type;
    list.adminUserId = adminUserId;
    list.isRead = false;
    list.isRemoved = false;
    list.isFlagged = isFlagged;
    list.title = title;
    list.createdAt = new Date();
    list.updatedAt = new Date();
    obj.list.push(list);

    const actQuery = { [mongoDbTables.adminActivity.userId]: adminId };
    const activity: AdminActivity = await this._mongoSvc.readByValue(
      collections.ADMINACTIVITY,
      actQuery
    );
    if (activity) {
      const updateSetValue = {
        $push: {
          [mongoDbTables.adminActivity.list]: list
        }
      };
      await this._mongoSvc.updateByQuery(collections.ADMINACTIVITY, actQuery, updateSetValue);
    } else {
      await this._mongoSvc.insertValue(collections.ADMINACTIVITY, obj);
    }
  }

  public async getOtherProfile(userId: string) {
    try {
      const value = {
        [mongoDbTables.adminUser.active]: true,
        [mongoDbTables.adminUser.id]: new ObjectID(userId)
      };
      const adminUser = await this._mongoSvc.readByValue(collections.ADMINUSERS, value);
      if (adminUser === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.adminUserNotFound;

        return this.result.createError(this.result.errorInfo);
      }

      return this.result.createSuccess(adminUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async adminImageHandler(adminId: string, base64String?: string, isCreate: boolean = true, isDelete?: boolean) {
    try {
      const image: AdminImage = await this._mongoSvc.readByValue(collections.ADMINUSERIMAGES, { [mongoDbTables.adminUserImages.adminId]: adminId });
      if (isDelete && image) {
        const query = {
          [mongoDbTables.adminUserImages.adminId]: adminId
        };
        await this._mongoSvc.deleteOneByValue(collections.ADMINUSERIMAGES, query);
        return true;
      }
      if (isCreate) {
        if (image) {
          const query = {
            [mongoDbTables.adminUserImages.adminId]: adminId
          };
          const value = {
            $set: {
              [mongoDbTables.adminUserImages.imageBase64]: base64String
            }
          };
          await this._mongoSvc.updateByQuery(collections.ADMINUSERIMAGES, query, value);
          return true;
        }
        const imageData: AdminImage = {
          adminId: adminId,
          imageBase64: base64String
        };
        await this._mongoSvc.insertValue(collections.ADMINUSERIMAGES, imageData);
        return true;
      }
      return true;
    } catch (error) {
      this._log.error((error as Error).message);
      return false;
    }
  }

  public async getAdminImage(adminId: string) {
    try {
      const query = {
        [mongoDbTables.adminUserImages.adminId]: adminId
      };
      const image: AdminImage = await this._mongoSvc.readByValue(collections.ADMINUSERIMAGES, query);
      if (image) {
        return image.imageBase64;
      } else {
        return null;
      }
    } catch (error) {
      this._log.error((error as Error).message);
      return null;
    }
  }

  private async getUser(userId: string): Promise<ActivityAuthor> {
    const author = new ActivityAuthor();
    const user = await this._mongoSvc.readByID(
      collections.ADMINUSERS,
      userId
    );
    author.id = user.id;
    author.firstName = user.firstName;
    author.lastName = user.lastName;
    author.displayName = user.displayName;
    return author;
  }
}
