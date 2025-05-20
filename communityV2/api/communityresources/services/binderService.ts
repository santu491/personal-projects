import {
  API_RESPONSE,
  collections,
  mongoDbTables,
  queryStrings,
  Result,
  TranslationLanguage,
  Validation,
  variableNames
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import {
  Binder,
  BinderArticle,
  BinderArticleModel,
  BinderPost,
  BinderPostModel,
  BinderResource,
  BinderResourceModel,
  BinderStory,
  BinderStoryModel,
  Content,
  PostAuthor
} from '../models/binderModel';
import { Post } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';
import { StoryResponse } from '../models/storyModel';
import { User } from '../models/userModel';
import { UserHelper } from './helpers/userHelper';
import { StoryService } from './storyService';

@Service()
export class BinderService {
  storyService = Container.get(StoryService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    private userHelper: UserHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getBinderByUser(id: string, sortOrder): Promise<BaseResponse> {
    try {
      const userInfo = await this._mongoSvc.readByID(collections.USERS, id);
      if (userInfo == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const binder = await this.getBinderByUserId(id);

      if (binder.binderResources != null && binder.binderResources.length > 0) {
        binder.binderResources = this.validate.sort(
          binder.binderResources,
          sortOrder,
          mongoDbTables.binder.createdDate
        );
      }

      if (binder.binderStories != null && binder.binderStories.length > 0) {
        binder.binderStories = this.validate.sort(
          binder.binderStories,
          sortOrder,
          mongoDbTables.binder.createdDate
        );
        const binderStories = [];
        for (const story of binder.binderStories) {
          const bookmarkedStory = await this._mongoSvc.readByID(collections.STORY, story.storyId);
          if (bookmarkedStory) {
            const user: User = await this._mongoSvc.readByID(collections.USERS, bookmarkedStory.authorId);
            story.displayName = user.displayName;
          }
          binderStories.push(story);
        }
        binder.binderStories = binderStories;
      }

      if (binder.binderPosts != null && binder.binderPosts.length > 0) {
        for (const post of binder.binderPosts) {
          const query = {
            [mongoDbTables.adminUser.id]: new ObjectId(post.author.id)
          };
          const projection = {
            [queryStrings.projection]: {
              [mongoDbTables.adminUser.id]: true,
              [mongoDbTables.adminUser.firstName]: true,
              [mongoDbTables.adminUser.lastName]: true,
              [mongoDbTables.adminUser.displayName]: true,
              [mongoDbTables.adminUser.displayTitle]: true,
              [mongoDbTables.adminUser.role]: true
            }
          };
          post.author = await this._mongoSvc.readByValue(collections.ADMINUSERS, query, projection);
          post.author.profileImage = await this.userHelper.buildAdminImagePath(post.author.id);
        }
      }

      binder.id = binder[mongoDbTables.binder.id];
      delete binder[mongoDbTables.binder.id];

      return this.result.createSuccess(binder);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async addResourceToBinder(
    binderModel: BinderResourceModel
  ): Promise<BaseResponse> {
    try {
      const user = await this._mongoSvc.readByID(
        collections.USERS,
        binderModel.userId
      );

      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const binder: Binder = await this.getBinderByUserId(binderModel.userId);
      if (binder.binderResources == null) {
        binder.binderResources = [];
      }

      const existingResource = binder.binderResources.filter(
        (resource) => resource.resourceId === binderModel.resourceId
      );
      if (existingResource != null && existingResource.length > 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.resourceAlreadyExistsInBinder;
        return this.result.createError([this.result.errorInfo]);
      }

      binder.binderResources.push({
        resourceId: binderModel.resourceId,
        resourceCategory: binderModel.resourceCategory,
        resourceTitle: binderModel.resourceTitle,
        providerName: binderModel.providerName,
        createdDate: new Date()
      });

      const query = {
        $set: {
          [mongoDbTables.binder.binderResources]: binder.binderResources
        }
      };

      const userId = { userId: binder.userId };

      await this._mongoSvc.updateByQuery(collections.BINDER, userId, query);

      return this.result.createSuccess(binder);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removeResourceFromBinder(binderModel: BinderResourceModel) {
    try {
      const user = await this._mongoSvc.readByID(
        collections.USERS,
        binderModel.userId
      );

      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const binder: Binder = await this.getBinderByUserId(binderModel.userId);

      if (binder.binderResources == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.resourceDoesNotExistInBinder;
        return this.result.createError([this.result.errorInfo]);
      }

      const existingResource = binder.binderResources.filter(
        (resource) => resource.resourceId === binderModel.resourceId
      );

      if (existingResource.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.resourceDoesNotExistInBinder;
        return this.result.createError([this.result.errorInfo]);
      } else {
        binder.binderResources = binder.binderResources.filter(
          (resource) => resource.resourceId !== binderModel.resourceId
        );
      }

      const query = {
        $set: {
          [mongoDbTables.binder.binderResources]: binder.binderResources
        }
      };
      const userId = { userId: binder.userId };

      await this._mongoSvc.updateByQuery(collections.BINDER, userId, query);

      return this.result.createSuccess(binder);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async addArticleToBinder(binderModel: BinderArticleModel) {
    try {
      const user = await this._mongoSvc.readByID(
        collections.USERS,
        binderModel.userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const binder: Binder = await this.getBinderByUserId(binderModel.userId);
      if (binder.binderArticles == null) {
        binder.binderArticles = [];
      }

      const existingArticle = binder.binderArticles.filter(
        (article) => article.articleId === binderModel.articleId
      );
      if (existingArticle != null && existingArticle.length > 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.articleAlreadyExistsInBinder;
        return this.result.createError([this.result.errorInfo]);
      }

      const link = binderModel.articleLink.includes(variableNames.HTTPS)
        ? binderModel.articleLink.replace(':', '://')
        : binderModel.articleLink;
      const thumbnail = binderModel.articleThumbnail.includes(variableNames.HTTPS)
        ? binderModel.articleThumbnail.replace(':', '://')
        : binderModel.articleThumbnail;

      binder.binderArticles.push({
        articleId: binderModel.articleId,
        createdDate: new Date(),
        articleTitle: binderModel.articleTitle,
        articleLink: link,
        articleThumbnail: thumbnail,
        link: binderModel.link
      });

      const query = {
        $set: {
          [mongoDbTables.binder.binderArticles]: binder.binderArticles
        }
      };
      const userId = { userId: binder.userId };
      await this._mongoSvc.updateByQuery(collections.BINDER, userId, query);
      return this.result.createSuccess(binder);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removeArticleFromBinder(binderModel: BinderArticleModel) {
    try {
      const user = await this._mongoSvc.readByID(
        collections.USERS,
        binderModel.userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const binder: Binder = await this.getBinderByUserId(binderModel.userId);
      if (binder.binderArticles == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.articleDoesNotExistInBinder;
        return this.result.createError([this.result.errorInfo]);
      }

      const existingArticle = binder.binderArticles.filter(
        (article) => article.articleId === binderModel.articleId
      );
      if (existingArticle.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.articleDoesNotExistInBinder;
        return this.result.createError([this.result.errorInfo]);
      } else {
        binder.binderArticles = binder.binderArticles.filter(
          (article) => article.articleId !== binderModel.articleId
        );
      }

      const query = {
        $set: {
          [mongoDbTables.binder.binderArticles]: binder.binderArticles
        }
      };
      const userId = { userId: binder.userId };
      await this._mongoSvc.updateByQuery(collections.BINDER, userId, query);
      return this.result.createSuccess(binder);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async addStoryToBinder(binderModel: BinderStoryModel) {
    try {
      const user = await this._mongoSvc.readByID(
        collections.USERS,
        binderModel.userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const storyObject = await this.storyService.getStoryById(binderModel.storyId, binderModel.userId, TranslationLanguage.ENGLISH);

      if (!storyObject.data.value) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const story: StoryResponse = storyObject.data.value as StoryResponse;

      if (story.authorId === binderModel.userId) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userCannotAddOwnStoryToBinder;
        return this.result.createError([this.result.errorInfo]);
      }

      const binder: Binder = await this.getBinderByUserId(binderModel.userId);
      if (binder.binderStories == null) {
        binder.binderStories = [];
      }

      for (const b of binder.binderStories) {
        if (b.storyId === binderModel.storyId) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.storyAlreadyExistsInBinder;
          return this.result.createError([this.result.errorInfo]);
        }
      }

      const binderStory = new BinderStory();
      binderStory.storyId = binderModel.storyId;
      binderStory.createdDate = new Date();
      binderStory.profilePicture = await this.userHelper.buildProfilePicturePath(story.authorId);
      binderStory.communityTitle = story.communityName;
      binderStory.displayName = story.author.displayName;
      binderStory.authorAgeWhenStoryBegan = story.authorAgeWhenStoryBegan;
      binderStory.featuredQuote = story.featuredQuote;
      binderStory.relation = story.relation;
      binderStory.relationAgeWhenDiagnosed = story.relationAgeWhenDiagnosed;

      binder.binderStories.push(binderStory);

      const query = {
        $set: {
          [mongoDbTables.binder.binderStories]: binder.binderStories
        }
      };
      const binderObject = { [mongoDbTables.binder.userId]: binder.userId };
      await this._mongoSvc.updateByQuery(collections.BINDER, binderObject, query);

      return this.result.createSuccess(binder);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removeStoryFromBinder(binderModel: BinderStoryModel) {
    try {
      const user = await this._mongoSvc.readByID(
        collections.USERS,
        binderModel.userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const binder: Binder = await this.getBinderByUserId(binderModel.userId);
      if (binder.binderStories === undefined || binder.binderStories === null || binder.binderStories.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExistInBinder;
        return this.result.createError([this.result.errorInfo]);
      }

      binder.binderStories.forEach((item, index, object) => {
        if (item.storyId === binderModel.storyId) {
          object.splice(index, 1);
        }
      });

      const query = {
        $set: {
          binderStories: binder.binderStories
        }
      };
      const userId = { userId: binder.userId };
      await this._mongoSvc.updateByQuery(collections.BINDER, userId, query);

      for (const story of binder.binderStories) {
        if (story.profilePicture) {
          story.profilePicture = await this.userHelper.buildProfilePicturePath(story.profilePicture);
        }
      }

      return this.result.createSuccess(binder);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async addPostToBinder(binderModel: BinderPostModel) {
    try {
      const user = await this._mongoSvc.readByID(
        collections.USERS,
        binderModel.userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const post = await this._mongoSvc.readByID(
        collections.POSTS,
        binderModel.postId
      );
      if (post === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badModelTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.postDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const binderPostObject = await this.createBinderPostObject(post);

      const query = { [mongoDbTables.binder.userId]: binderModel.userId };
      const binder: Binder = await this.getBinderByUserId(binderModel.userId);

      if (binder.binderPosts) {
        if (binder.binderPosts.length > 0) {
          const postExist = await this._mongoSvc.readByValue(
            collections.BINDER,
            {
              [mongoDbTables.binder.userId]: binderModel.userId,
              [mongoDbTables.binder.binderPostId]: binderModel.postId
            }
          );
          if (postExist !== null) {
            this.result.errorInfo.title = API_RESPONSE.messages.badData;
            this.result.errorInfo.detail = API_RESPONSE.messages.postAlreadyExistsInBinder;
            return this.result.createError([this.result.errorInfo]);
          }
        }
        binder.binderPosts.push(binderPostObject);
      }
      else {
        binder.binderPosts = [binderPostObject];
      }

      const updateStatement = {
        $set: {
          [mongoDbTables.binder.binderPosts]: binder.binderPosts
        }
      };

      const updateResult = await this._mongoSvc.updateByQuery(collections.BINDER, query, updateStatement);
      return this.result.createSuccess(updateResult ? true : false);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removePostFromBinder(binderModel: BinderPostModel) {
    try {
      const query = {
        $pull: {
          [mongoDbTables.binder.binderPosts]: {
            [mongoDbTables.adminActivity.listPostId]: binderModel.postId
          }
        }
      };
      const userId = { [mongoDbTables.binder.userId]: binderModel.userId };
      const updateResult = await this._mongoSvc.updateByQuery(collections.BINDER, userId, query);

      return this.result.createSuccess(updateResult? true: false);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async createBinderPostObject(post: Post) {
    const binderPost = new BinderPost();
    binderPost.postId = post.id;
    binderPost.publishedAt = post.publishedAt;
    binderPost.communities = post.communities;
    binderPost.title = new Content();
    binderPost.title.en = post.content?.en?.title ?? '';
    binderPost.title.es = post.content?.es?.title ?? '';
    binderPost.author = new PostAuthor();
    binderPost.author.firstName = post.author.firstName;
    binderPost.author.displayName = post.author.displayName;
    binderPost.author.profileImage = await this.userHelper.buildAdminImagePath(post.author.id);
    binderPost.author.role = post.author.role;
    binderPost.author.displayTitle = post.author.displayTitle;
    binderPost.author.id = post.author.id;

    return binderPost;
  }

  private async getBinderByUserId(userId: string) {
    try {
      let binder = await this._mongoSvc.readByValue(collections.BINDER, {
        [mongoDbTables.binder.userId]: userId
      });

      if (binder == null || binder.length === 0) {
        const binderObject = new Binder();
        binderObject.userId = userId;
        binderObject.binderStories = Array<BinderStory>();
        binderObject.binderArticles = Array<BinderArticle>();
        binderObject.binderResources = Array<BinderResource>();
        binderObject.binderPosts = Array<BinderPost>();

        binder = await this._mongoSvc.insertValue(
          collections.BINDER,
          binderObject
        );
      }

      if (binder.binderPosts != null && binder.binderPosts.length > 0) {
        for (const binderPost of binder.binderPosts) {
          binderPost.title.es = binderPost.title.es === '' ? binderPost.title.en : binderPost.title.es;
        }
      }
      return binder;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
