import { API_RESPONSE, collections, mongoDbTables, Result } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { Post } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';

@Service()
export class PostImageService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getPostImage(postId: string): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.postImages.postId]: postId
      };
      const postImage = await this._mongoSvc.readByValue(collections.POSTIMAGES, query);
      if (postImage === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.postWithImageDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(postImage);

    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createException((error as Error).message);
    }
  }

  /**
   * Returns post picture path for given post id
   * @param postId User ID
   * @returns post image path
   */
  public async buildPostImagePath(postId: string) {
    const query = {
      [mongoDbTables.postImages.postId]: postId
    };
    const postImage = await this._mongoSvc.readByValue(collections.POSTIMAGES, query);
    if (!postImage || (postImage[mongoDbTables.postImages.postImageBase64] === null)) {
      return null;
    }

    if (!postId || /^ *$/.test(postId)) {
      return null;
    }

    return APP.config.restApi.userProfile.PostImagePath + postId;
  }

  public async setPostImage(post: Post) {
    if (post.content?.link?.isImageUploaded) {
      post.content.link.imageBase64 = await this.buildPostImagePath(post.id.toString());
    }
    else {
      post.content.image = await this.buildPostImagePath(post.id.toString());
    }
  }
}
