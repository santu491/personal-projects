import {
  AdminRole,
  API_RESPONSE,
  collections,
  contentKeys,
  mongoDbTables,
  Result
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { AppVersionModel } from '../models/appVersionModel';
import {
  Community, CommunityImage, CommunityModel
} from '../models/communitiesModel';
import { ContentModel } from '../models/contentModel';
import { BaseResponse } from '../models/resultModel';
import { AdminUser } from '../models/userModel';
import { ContentService } from './contentService';

@Service()
export class CommunityService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private _contentSvc: ContentService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async createCommunity(communityModel: CommunityModel, admin): Promise<BaseResponse> {
    try {
      let community;
      if (communityModel.id) {
        community = await this._mongoSvc.readByID(collections.COMMUNITY, communityModel.id);
        if (community === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.communityDoesNotExist;

          return this.result.createError(this.result.errorInfo);
        }
        communityModel.updatedDate = new Date();
        communityModel.updatedBy = admin.id;
        // Handle the images.
        if (communityModel.image !== '') {
          this.communityImageHandler(community.id, communityModel.image, false);
        }
        delete communityModel.image;
        const setData = {
          $set: communityModel
        };
        if (community.active !== communityModel.active) {
          await this._contentSvc.updateDeepLinkContent(communityModel.id, communityModel.active, communityModel.title);
        }
        community = await this._mongoSvc.findAndUpdateOne(collections.COMMUNITY, { [mongoDbTables.community.id]: new ObjectId(communityModel.id) }, setData);
        const image: CommunityImage = await this._mongoSvc.readByValue(collections.COMMUNITYIMAGES, {
          [mongoDbTables.communityImage.communityId]: community.id
        });
        community.image = (image) ? image.imageBase64 : null;
      } else {
        delete communityModel.id;
        const communityData = this.createCommunityFromModel(communityModel, admin.id);
        community = await this._mongoSvc.insertValue(collections.COMMUNITY, communityData);
        community.id = community[mongoDbTables.community.id];
        delete community[mongoDbTables.community.id];
        // Handle the images.
        if (communityModel.image !== '') {
          this.communityImageHandler(community.id, communityModel.image, true);
        }
        // Create the DeeplInk for the community.
        await this._contentSvc.createDeepLinkContent(community.id, communityModel);
      }

      return this.result.createSuccess(community);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommunityById(id: string): Promise<BaseResponse> {
    try {
      const community: Community = await this._mongoSvc.readByID(
        collections.COMMUNITY,
        id
      );
      if (community === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.communityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(community);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getAllCommunities(pageParams, withImage: boolean, isActive?: boolean): Promise<BaseResponse> {
    try {
      const sort = {
        [mongoDbTables.community.createdDate]: pageParams.sort
      };

      const limit = pageParams.pageSize;
      const skip = pageParams.pageSize * (pageParams.pageNumber - 1);
      const query = (isActive) ? {
        [mongoDbTables.community.active]: isActive
      } : {};
      const communityList = await this._mongoSvc.readAllByValue(collections.COMMUNITY, query, sort, limit, skip);

      if (withImage) {
        for (const community of communityList) {
          const image: CommunityImage = await this._mongoSvc.readByValue(collections.COMMUNITYIMAGES, {
            [mongoDbTables.communityImage.communityId]: community.id
          });
          community.image = (image) ? image.imageBase64 : null;
        }
      }

      return this.result.createSuccess(communityList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getSubCommunities(communityId: string) {
    try {
      const appVersions: AppVersionModel[] = await this._mongoSvc.readAll(collections.APPVERSION);
      const search = {
        [mongoDbTables.content.language]: contentKeys.english,
        [mongoDbTables.content.version]: appVersions[0].content.prompts,
        [mongoDbTables.content.contentType]: contentKeys.prompts
      };
      const content: ContentModel[] = await this._mongoSvc.readAllByValue(
        collections.CONTENT,
        search
      );
      const communityPrompt = content[0].data[contentKeys.createStoryModule]
        .filter((community) => community.communityId === communityId);
      if (communityPrompt.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.communityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const subCommunities = communityPrompt[0].prompts.filter((prompt) => prompt?.options);
      return this.result.createSuccess(subCommunities[0]?.options);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommunityAdmins(communityId: string): Promise<BaseResponse> {
    try {
      const admins: AdminUser[] = await this._mongoSvc.readAllByValue(collections.ADMINUSERS, {
        [mongoDbTables.adminUser.active]: true,
        [mongoDbTables.adminUser.role]: AdminRole.scadvocate,
        [mongoDbTables.adminUser.communities]: {
          $in: [communityId]
        }
      });
      return this.result.createSuccess(admins);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private createCommunityFromModel(communityModel: CommunityModel, adminId: string) {
    const community = new Community();
    community.createdBy = adminId;
    community.createdDate = new Date();
    community.title = community.parent = communityModel.title;
    community.displayName = communityModel.displayName;
    community.category = communityModel.category;
    community.categoryId = new ObjectId().toString();
    community.type = communityModel.type;
    community.color = communityModel.color;
    community.isNew = communityModel.isNew;
    community.active = communityModel.active;

    return community;
  }

  private async communityImageHandler(communityId: string, base64String?: string, isCreate: boolean = true) {
    try {
      const imageData: CommunityImage = {
        communityId: communityId,
        imageBase64: base64String
      };

      if (isCreate) {
        await this._mongoSvc.insertValue(collections.COMMUNITYIMAGES, imageData);
      } else {
        const query = {
          [mongoDbTables.communityImage.communityId]: communityId
        };
        const value = {
          $set: {
            [mongoDbTables.communityImage.imageBase64]: base64String
          }
        };
        await this._mongoSvc.updateByQuery(collections.COMMUNITYIMAGES, query, value);
      }
      return true;
    } catch (error) {
      this._log.error((error as Error).message);
      return false;
    }
  }

}
