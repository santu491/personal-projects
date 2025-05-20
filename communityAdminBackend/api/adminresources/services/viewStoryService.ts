import {
  API_RESPONSE,
  collections,
  mongoDbTables,
  Result,
  storyType
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { PageParam } from 'api/adminresources/models/pageParamModel';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { PostHelperService } from '../helpers/postHelper';
import { StoryHelperService } from '../helpers/storyHelper';
import { StoryResponse } from '../models/storyModel';
import { User } from '../models/userModel';

@Service()
export class ViewStoryService {
  storyHelper = Container.get(StoryHelperService);
  postHelperService = Container.get(PostHelperService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result
  ) { }

  /**
   * Get all stories or stories by community id
   * @param pageParams Page params
   * @param type story type
   * @param communityId community ids
   * @returns list of stories
   */
  public async getAllStories(
    pageParams: PageParam,
    type: string,
    communityId?: string[]
  ) {
    const value = {};
    switch (type) {
      case storyType[0]:
        value[mongoDbTables.story.flagged] = true;
        value[mongoDbTables.story.removed] = false;
        value[mongoDbTables.story.published] = true;
        break;
      case storyType[1]:
        value[mongoDbTables.story.published] = true;
        value[mongoDbTables.story.removed] = false;
        break;
      case storyType[2]:
        value[mongoDbTables.story.removed] = true;
        value[mongoDbTables.story.published] = true;
        break;
      case storyType[3]:
        value[mongoDbTables.story.published] = true;
        break;
      default:
        break;
    }
    if (!communityId) {
      delete value[mongoDbTables.story.communityId];
    } else {
      value[mongoDbTables.story.communityId] = { $in: communityId };
    }
    const limit = pageParams.pageSize;
    const skip = pageParams.pageSize * (pageParams.pageNumber - 1);
    const sortOption = { [mongoDbTables.story.publishedAt]: pageParams.sort };
    const projection = {
      'projection': {
        [mongoDbTables.story.reactions]: false,
        [mongoDbTables.story.comments]: false,
        [mongoDbTables.story.answer]: false
      }
    };
    const stories: StoryResponse[] = await this._mongoSvc.readAllByValue(
      collections.STORY,
      value,
      sortOption,
      limit,
      skip,
      projection
    );
    const totalStoryCount = await this._mongoSvc.getDocumentCount(collections.STORY, value);
    const authors = stories.map((story) => {
      return new ObjectId(story.authorId);
    });
    const users: User[] = await this._mongoSvc.readByIDArray(
      collections.USERS,
      authors
    );
    const response = this.storyHelper.getStoryAuthor(stories, users);

    return this.result.createSuccess({ stories: response, totalCount: totalStoryCount });
  }

  /**
   * Get a story by id
   * @param storyId string
   * @returns Story
   */
  public async getStory(storyId: string) {
    const story: StoryResponse = await this.storyHelper.readStoryCollection(
      storyId
    );

    if (!story) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

      return this.result.createError(this.result.errorInfo);
    }
    story.author = await this._mongoSvc.readByID(
      collections.USERS,
      story.authorId
    );

    const projection = {
      projection: {
        [mongoDbTables.adminUser.id]: true,
        [mongoDbTables.adminUser.displayTitle]: true,
        [mongoDbTables.adminUser.displayName]: true,
        [mongoDbTables.adminUser.firstName]: true,
        [mongoDbTables.adminUser.lastName]: true
      }
    };
    const adminUsers = await this._mongoSvc.readAllByValue(
      collections.ADMINUSERS,
      {},
      {},
      null,
      null,
      projection
    );

    const newStory: StoryResponse = await this.storyHelper.formateComments(story, story[mongoDbTables.posts.commentAuthors], story[mongoDbTables.posts.replyAuthors], adminUsers);
    newStory.communityName = (
      await this._mongoSvc.readByID(collections.COMMUNITY, story.communityId)
    ).title;
    newStory.id = newStory[mongoDbTables.posts.id].toString();
    delete newStory.commentAuthors;
    delete newStory.replyAuthors;
    return this.result.createSuccess(newStory);
  }
}
