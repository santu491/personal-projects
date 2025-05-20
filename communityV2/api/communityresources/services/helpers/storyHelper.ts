import { API_RESPONSE, collections, mongoDbTables, queryStrings, REACTIONS, Result, TranslationLanguage, Validation } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { Blocked } from '../../models/blockedModel';
import { PageParam, PageParamModel } from '../../models/pageParamModel';
import { Prompt } from '../../models/promptModel';
import { BaseResponse } from '../../models/resultModel';
import { Answer, Story, StoryResponse } from '../../models/storyModel';
import { Author, User } from '../../models/userModel';
import { PromptService } from '../promptService';
import { CommentHelper } from './commentHelper';
import { ReactionHelper } from './reactionHelper';
import { UserHelper } from './userHelper';

@Service()
export class StoryHelper {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    private userHelper: UserHelper,
    private commentHelper: CommentHelper,
    @LoggerParam(__filename) private _log: ILogger
  ){ }

  /*
   * Returns answers after changing the answer with cancer options from id to title
   */
  public async addPromptOptionValue(story: StoryResponse, language: string): Promise<Answer[]> {
    const promptsResponse = await Container.get(PromptService).getPromptsWithCommunity(language);
    const promptOption = promptsResponse.filter((prompt) => !!prompt.options)[0];
    let otherOption = false;
    story.answer.forEach((ans) => {
      if (ans.promptId === promptOption.id) {
        const optionValue = promptOption.options.filter((option) => option.id === ans.response)[0];
        otherOption = optionValue.type === 'otherCancer';
        ans.response = optionValue.title;
      }
    });
    if (!otherOption) { this.removeOtherPrompt(story, promptsResponse);}
    return story.answer;
  }

  /**
   * Update publish state of the story
   * @param storyId Story ID
   * @param publish publish state
   * @param story story
   * @returns updation success reult
   */
  public async updateStoryCollection(
    storyId: string,
    publish: boolean,
    story: Story
  ): Promise<boolean> {
    const storyObj = { [mongoDbTables.story.id]: new ObjectId(storyId) };

    const query = {
      $set: {
        [mongoDbTables.story.published]: publish,
        [mongoDbTables.story.updateDate]: new Date(),
        [mongoDbTables.story.hasStoryBeenPublishedOnce]: story.hasStoryBeenPublishedOnce,
        [mongoDbTables.story.publishedAt]: new Date()
      }
    };
    const updateCount = await this._mongoSvc.updateByQuery(
      collections.STORY,
      storyObj,
      query
    );
    return updateCount > 0 ? true : false;
  }

  public async getCommunityByIdOrUserId(
    communityId: string,
    pageParams: PageParam,
    currentUserId: string,
    byUserId: boolean,
    publishedFlag: boolean
  ): Promise<BaseResponse> {
    const { start, end } = this.getStartAndEndValues(pageParams);

    const user: User = await this._mongoSvc.readByID(
      collections.USERS,
      currentUserId
    );
    if (!user.active) {
      this.result.errorInfo.title = API_RESPONSE.messages.userNotActiveTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.userNotActiveMessage;
      return this.result.createError([this.result.errorInfo]);
    }

    const community = await this._mongoSvc.getDocumentCount(
      collections.COMMUNITY,
      { [mongoDbTables.community.id]: new ObjectId(communityId) }
    );
    if (+community === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail =
        API_RESPONSE.messages.communityDoesNotExist;
      return this.result.createError([this.result.errorInfo]);
    }

    const value = (publishedFlag) ? {
      [mongoDbTables.story.removed]: false,
      [mongoDbTables.story.published]: true,
      [mongoDbTables.story.authorId]: currentUserId,
      [mongoDbTables.story.communityId]: communityId
    } : {
      [mongoDbTables.story.removed]: false,
      [mongoDbTables.story.authorId]: currentUserId,
      [mongoDbTables.story.communityId]: communityId
    };

    if (!byUserId) {
      delete value[mongoDbTables.story.authorId];
    }

    // Sort the Stories based on the recently published stories.
    const sort = {
      [mongoDbTables.story.publishedAt]: -1
    };
    let stories: Story[] = await this._mongoSvc.readAllByValue(
      collections.STORY,
      value,
      sort
    );
    if (stories.length === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
      return this.result.createError([this.result.errorInfo]);
    } else {
      stories = await this.removeBlockedContentForStories(
        currentUserId,
        stories
      );
    }
    stories = stories.slice(start, end);
    const storyResponseList: StoryResponse[] = [];
    for (const story of stories) {
      const storyResponse = await this.buildStoryResponse(story, currentUserId);
      const userReaction = Container.get(ReactionHelper).getReactionForCurrentUser(storyResponse.reaction, currentUserId);
      storyResponse[REACTIONS.REACTION_COUNT] = userReaction.reactionCount;
      storyResponse[REACTIONS.USER_REACTION] = userReaction.userReaction;

      delete storyResponse.reaction;
      storyResponseList.push(storyResponse);
    }

    return this.result.createSuccess(storyResponseList);
  }

  public async removeBlockedContentForStories(
    currentUserId: string,
    stories: Story[]
  ) {
    try {
      const value = {
        $or: [
          { [mongoDbTables.blocked.blockedUser]: currentUserId },
          { [mongoDbTables.blocked.blockingUser]: currentUserId }
        ]
      };
      const myBlocks: Blocked[] = await this._mongoSvc.readAllByValue(
        collections.BLOCKED,
        value
      );

      myBlocks.forEach((b) => {
        const blockedUserId =
          b.blockingUser === currentUserId ? b.blockedUser : b.blockingUser;
        stories = stories.filter((s) => s.authorId !== blockedUserId);
      });
      return stories;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public createStoryResponseObject(story: Story): StoryResponse {
    const storyResponse = new StoryResponse();
    storyResponse.id = (story[mongoDbTables.story.id]) ? story[mongoDbTables.story.id] : story.id;
    storyResponse.createdAt = story.createdAt;
    storyResponse.updatedAt = story.updatedAt;
    storyResponse.answer = story.answer;
    storyResponse.displayName = story.displayName;
    storyResponse.authorId = story.authorId;
    storyResponse.authorAgeWhenStoryBegan = story.authorAgeWhenStoryBegan;
    storyResponse.relation = story.relation;
    storyResponse.featuredQuote = story.featuredQuote;
    storyResponse.relationAgeWhenDiagnosed = story.relationAgeWhenDiagnosed;
    storyResponse.communityId = story.communityId;
    storyResponse.storyText = story.storyText;
    storyResponse.published = story.published;
    storyResponse.publishedAt = story.publishedAt;
    storyResponse.removed = story.removed;
    storyResponse.flagged = story.flagged;
    storyResponse.hasStoryBeenPublishedOnce = story.hasStoryBeenPublishedOnce;
    storyResponse.reaction = story.reaction;
    storyResponse.allowComments = story.allowComments;
    return storyResponse;
  }

  /**
   * Creates and returns a story Object
   * @param story Story Data
   * @param currentUserId User Id
   * @returns Returns response object
   */
  public async buildStoryResponse(
    story: Story,
    currentUserId: string,
    language?: string
  ): Promise<StoryResponse> {
    language = language ?? TranslationLanguage.ENGLISH;
    const author: Author = await this.userHelper.getAuthor(story.authorId);

    const searchImage = {
      [mongoDbTables.profileImages.profileImageBase64]: { $ne: null },
      [mongoDbTables.profileImages.userId]: author.id
    };
    const image = await this._mongoSvc.readByValue(collections.PROFILEIMAGES, searchImage);
    author.profilePicture = (image) ? await this.userHelper.buildProfilePicturePath(author.id) : null;

    const community = await this._mongoSvc.readByID(collections.COMMUNITY, story.communityId);
    community.title = language ? community.displayName[language] : community.displayName.en;

    if (story.answer !== null && story.answer.length > 0) {
      story.answer = this.validate.sort(
        story.answer,
        -1,
        mongoDbTables.story.createdAt
      );
    }
    const storyResponse = this.createStoryResponseObject(story);
    storyResponse.author = author;
    storyResponse.communityName = community.title;
    storyResponse.allowComments = story.allowComments ?? true;

    if ((story.comments ?? false) && (story[mongoDbTables.posts.commentAuthors] ?? false)) {
      storyResponse.comments = await this.commentHelper.buildComment(
        story.comments,
        story[mongoDbTables.posts.commentAuthors],
        story[mongoDbTables.posts.replyAuthors],
        currentUserId,
        language
      );
    }
    storyResponse.commentCount = story?.comments ? this.commentHelper.getCommentCount(story.comments) : 0;
    return storyResponse;
  }

  public async updateStoryInBinder(storyId: string, story: Story) {
    const getValueQuery = {
      [mongoDbTables.binder.storyPath]: storyId
    };
    const updateValueQuery = {
      $set: {
        [mongoDbTables.binder.binderStoryFeaturedQuote]: story.featuredQuote,
        [mongoDbTables.binder.binderStoryRelation]: story.relation,
        [mongoDbTables.binder.binderStoryRelationAge]: story.relationAgeWhenDiagnosed,
        [mongoDbTables.binder.binderStoryAuthorAge]: story.authorAgeWhenStoryBegan
      }
    };
    const arrayFilters = {
      [queryStrings.arrayFilters]: [
        { [mongoDbTables.binder.binderStoryIdFilter]: storyId }
      ]
    };

    await this._mongoSvc.updateManyByQuery(
      collections.BINDER,
      getValueQuery,
      updateValueQuery,
      arrayFilters
    );
  }

  public async removeStoryActivity(storyId: string) {
    try {
      const query = {
        [mongoDbTables.activity.storyId]: storyId
      };
      const activities = await this._mongoSvc.readAllByValue(collections.ACTIVITY, query);

      activities.forEach(async (userActivity) => {
        userActivity.activityList = userActivity.activityList.filter((activity) => activity?.storyLink?.storyId !== storyId);
        await this._mongoSvc.updateByQuery(collections.ACTIVITY, {
          [mongoDbTables.activity.id]: new ObjectId(userActivity.id)
        }, {
          $set: {
            [mongoDbTables.activity.activityList]: userActivity.activityList
          }
        });
      });
    } catch (error) {
      this._log.error(error as Error);
    }
  }

  /**
   * Return start and end values
   * @param pageParams Page parameters
   * @returns start and end values
   */
  private getStartAndEndValues(pageParams: PageParam){
    const pageParam = new PageParamModel();
    if (pageParams.pageNumber) {
      pageParam.setPageNumber(pageParams.pageNumber);
    }
    if (pageParams.pageSize) {
      pageParam.setPageSize(pageParams.pageSize);
    }
    pageParam.sort = pageParams.sort ? pageParams.sort : pageParam.sort;
    const start = (pageParam.pageNumber - 1) * pageParam.pageSize;
    const end = start + pageParam.pageSize;
    return {
      start: start,
      end: end
    };
  }

  private removeOtherPrompt(story: StoryResponse, prompts: Prompt[]) {
    const otherPrompt = prompts.filter((prompt) => prompt?.otherCancer)[0];
    const index = story?.answer.findIndex((ans) => ans.promptId === otherPrompt?.id);
    if (index !== -1) {
      story.answer.splice(index, 1);
    }
  }
}
