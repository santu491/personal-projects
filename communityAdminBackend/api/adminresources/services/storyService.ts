import {
  API_RESPONSE,
  collections,
  LinkedTexts,
  mongoDbTables, NotificationMessages, Result,
  Validation
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP } from '@anthem/communityadminapi/utils';
import { ObjectID } from 'mongodb';
import { Service } from 'typedi';
import { StoryHelperService } from '../helpers/storyHelper';
import { Blocked } from '../models/blockedModel';
import { Community } from '../models/communitiesModel';
import { Question } from '../models/questionModel';
import { BaseResponse } from '../models/resultModel';
import { Answer, BooleanResponse, Story, StoryResponse } from '../models/storyModel';
import { Author, User } from '../models/userModel';
import { CommunityService } from './communityServies';

@Service()
export class StoryService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    private communityService: CommunityService,
    private storyHelper: StoryHelperService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getStoryByUserId(userId: string): Promise<BaseResponse> {
    try {
      const user = await this._mongoSvc.readByID(collections.USERS, userId);
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const value = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.authorId]: userId
      };
      let stories: Story[] = await this._mongoSvc.readAllByValue(
        collections.STORY,
        value
      );
      if (stories.length > 0) {
        stories = await this.removeBlockedContentForStories(userId, stories);
      }
      if (stories === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const storyResponseList: StoryResponse[] = [];
      for (const story of stories) {
        const storyResponse = await this.buildStoryResponse(story, userId);
        storyResponseList.push(storyResponse);
      }

      return this.result.createSuccess(storyResponseList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createError(error);
    }
  }

  public async buildStoryResponse(
    story: Story,
    currentUserId: string
  ): Promise<StoryResponse> {
    const author: Author = await this.getAuthor(story.authorId);
    author.profilePicture = this.buildProfilePicturePath(author.id);

    const communityObject = await this.communityService.getCommunityById(
      story.communityId
    );
    const community: Community = communityObject.data.value as unknown as Community;

    if (story.answer !== null && story.answer.length > 0) {
      story.answer = this.validate.sort(
        story.answer,
        -1,
        mongoDbTables.story.createdDate
      );
      for (const ans of story.answer) {
        if (ans[mongoDbTables.story.id]) {
          ans.id = ans[mongoDbTables.story.id].toString();
          delete ans[mongoDbTables.story.id];
        }
        if (ans.questionAuthorId) {
          const questionAuthor: Author = await this.getQuestionAuthorData(
            ans.questionAuthorId
          );
          ans.questionAuthorDisplayName = questionAuthor.displayName;
          ans.questionAuthorFirstName = questionAuthor.firstName;
          ans.questionAuthorProfilePicture = this.buildProfilePicturePath(
            questionAuthor.id
          );
        }
      }

      if (currentUserId) {
        const modifiedAnswerList: Answer[] = [];

        story.answer.forEach((ans) => {
          if (
            (ans.questionAuthorId && !ans.questionAuthorId.trim()) ||
            ans.questionAuthorId !== currentUserId
          ) {
            modifiedAnswerList.push(ans);
          }
        });

        story.answer = modifiedAnswerList;
      }
    }
    const storyResponse = new StoryResponse();
    storyResponse.id = (story[mongoDbTables.story.id]) ? story[mongoDbTables.story.id] : story.id;
    storyResponse.author = author;
    storyResponse.createdDate = story.createdDate;
    storyResponse.updatedDate = story.updatedDate;
    storyResponse.answer = story.answer;
    storyResponse.displayName = story.displayName;
    storyResponse.authorId = story.authorId;
    storyResponse.authorAgeWhenStoryBegan = story.authorAgeWhenStoryBegan;
    storyResponse.relation = story.relation;
    storyResponse.featuredQuote = story.featuredQuote;
    storyResponse.relationAgeWhenDiagnosed = story.relationAgeWhenDiagnosed;
    storyResponse.communityId = story.communityId;
    storyResponse.communityName = community.title;
    storyResponse.storyText = story.storyText;
    storyResponse.published = story.published;
    storyResponse.removed = story.removed;
    storyResponse.flagged = story.flagged;
    storyResponse.hasStoryBeenPublishedOnce = story.hasStoryBeenPublishedOnce;
    storyResponse.questionsAskedByCurrentUser = (currentUserId) ? await this.buildUserQuestionsAskedInStory(currentUserId, story.id) : [];

    return storyResponse;
  }

  public async getQuestionAuthorData(
    questionAuthorId: string
  ): Promise<Author> {
    const questionAuthor = await this.getAuthor(questionAuthorId);
    return questionAuthor;
  }

  public async getRemovedStory(): Promise<BaseResponse> {
    try {
      const value = {
        [mongoDbTables.story.removed]: true
      };
      const sort = { [mongoDbTables.story.createdDate]: -1 };
      const stories: Story[] = await this._mongoSvc.readAllByValue(
        collections.STORY,
        value,
        sort
      );
      stories.forEach((story) => {
        if (story.answer !== null) {
          story.answer = this.validate.sort(
            story.answer,
            -1,
            mongoDbTables.story.createdDate
          );
        }
      });
      const storyResponseList: StoryResponse[] = [];
      for (const story of stories) {
        const storyResponse = await this.buildStoryResponse(
          story,
          null
        );
        storyResponseList.push(storyResponse);
      }
      return this.result.createSuccess(storyResponseList);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async removeStory(storyId: string, admin): Promise<BaseResponse> {
    try {
      const story: Story = await this._mongoSvc.readByID(
        collections.STORY,
        storyId
      );
      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      story.removed = true;
      const filter = { [mongoDbTables.story.id]: new ObjectID(storyId) };
      const setvalues = {
        $set: {
          [mongoDbTables.story.removed]: story.removed
        }
      };
      await this._mongoSvc.updateByQuery(collections.STORY, filter, setvalues);
      const storyResponse = await this.buildStoryResponse(story, null);

      // Notify the user about the removed story.
      const user: User = await this._mongoSvc.readByID(collections.USERS, story.authorId);
      if (user) {
        this.storyHelper.handleUserActivityForStory(user, storyId, admin.id, NotificationMessages.storyContentModeration, null, null, true, LinkedTexts.touText);
      }

      return this.result.createSuccess(storyResponse);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async storyFlag(storyId: string, flag: boolean): Promise<BaseResponse> {
    try {
      const story: Story = await this._mongoSvc.readByID(
        collections.STORY,
        storyId
      );
      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      story.flagged = flag;
      const filter = { [mongoDbTables.story.id]: new ObjectID(storyId) };
      const setvalues = {
        $set: {
          [mongoDbTables.story.flagged]: story.flagged
        }
      };
      await this._mongoSvc.updateByQuery(collections.STORY, filter, setvalues);
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  private async removeBlockedContentForStories(
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
        stories.forEach((story) => {
          if (story.answer !== null) {
            story.answer = story.answer.filter(
              (s) => s.questionAuthorId !== blockedUserId
            );
          }
        });
      });
      return stories;
    } catch (error) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = (error as Error).message;
      throw [this.result.errorInfo];
    }
  }

  private async getAuthor(authorId: string): Promise<Author> {
    const user: User = await this._mongoSvc.readByID(
      collections.USERS,
      authorId
    );
    if (user === null) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
      throw [this.result.errorInfo];
    }
    const author = new Author();
    author.displayName = user.displayName;
    author.id = user.id;
    author.gender = user.gender;
    author.genderRoles = user.genderRoles;
    author.profilePicture = user.profilePicture;
    author.fullName = `${user.firstName} ${user.lastName}`;
    author.firstName = user.firstName;
    author.communities = user.myCommunities ?? [];
    author.age = user.age;

    return author;
  }

  private buildProfilePicturePath(userId: string): string {
    if (!userId || /^ *$/.test(userId)) {
      return null;
    }

    if (userId.includes(APP.config.restApi.userProfile.BaseUrlPath)) {
      return userId;
    }

    return APP.config.restApi.userProfile.BaseUrlPath + userId;
  }

  private async buildUserQuestionsAskedInStory(
    currentUserId: string,
    storyId: string
  ): Promise<Question[]> {
    try {
      const user: User = await this._mongoSvc.readByID(
        collections.USERS,
        currentUserId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        throw [this.result.errorInfo];
      }
      const value = {
        [mongoDbTables.question.userId]: currentUserId,
        [mongoDbTables.question.storyId]: storyId
      };
      const sort = { [mongoDbTables.question.createdDate]: -1 };
      const getQuestions: Question[] = await this._mongoSvc.readAllByValue(
        collections.QUESTIONS,
        value,
        sort
      );

      if (getQuestions.length > 0) {
        getQuestions.forEach((question) => {
          question.profilePicture = this.buildProfilePicturePath(
            question.userId
          );
        });
      }
      return getQuestions;
    } catch (error) {
      throw [error];
    }
  }
}
