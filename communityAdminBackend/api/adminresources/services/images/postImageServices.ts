import { collections, mongoDbTables } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { PostImage } from 'api/adminresources/models/postsModel';
import { Service } from 'typedi';

@Service()
export class PostImageService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async postImageHandler(postId: string, base64String?: string, isCreate: boolean = true, isDelete?: boolean, isLink?: boolean) {
    try {
      const imageData: PostImage = {
        postId: postId,
        postImageBase64: base64String,
        isLinkImage: isLink ?? false
      };

      if (isDelete) {
        const query = {
          [mongoDbTables.postImages.postId]: postId
        };
        await this._mongoSvc.deleteOneByValue(collections.POSTIMAGES, query);
      } else if (isCreate) {
        await this._mongoSvc.insertValue(collections.POSTIMAGES, imageData);
      } else {
        const query = isLink ?
          {
            [mongoDbTables.postImages.postId]: postId,
            [mongoDbTables.postImages.isLinkImage]: true
          }
          :{
            [mongoDbTables.postImages.postId]: postId
          };
        const value = {
          $set: {
            [mongoDbTables.postImages.postImageBase64]: base64String
          }
        };
        await this._mongoSvc.updateByQuery(collections.POSTIMAGES, query, value);
      }
      return true;
    } catch (error) {
      this._log.error((error as Error).message);
      return false;
    }
  }

  public async getPostImage(postId: string) {
    try {
      const query = {
        [mongoDbTables.postImages.postId]: postId
      };
      const postImage: PostImage = await this._mongoSvc.readByValue(collections.POSTIMAGES, query);
      if (postImage) {
        return postImage;
      } else {
        return null;
      }
    } catch (error) {
      this._log.error((error as Error).message);
      return null;
    }
  }
}
