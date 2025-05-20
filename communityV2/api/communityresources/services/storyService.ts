import {
  AdminRole,
  API_RESPONSE, collections,
  mongoDbTables, NotificationDeepLink, NotificationMessages, NotificationType, PostResponse, queryStrings, QuestionType, REACTIONS,
  reactionsType,
  Result, SQSParams, storyReactionsType, TranslationLanguage, translationLiterals, Validation
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP, getArgument } from '@anthem/communityapi/utils';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { Admin } from '../models/adminUserModel';
import { Blocked } from '../models/blockedModel';
import { Community } from '../models/communitiesModel';
import { NotificationContentType } from '../models/notificationModel';
import { PageParam } from '../models/pageParamModel';
import { Prompt } from '../models/promptModel';
import {
  NotificationMessage
} from '../models/pushNotificationModel';
import { Reaction } from '../models/reactionModel';
import { BaseResponse } from '../models/resultModel';
import {
  Answer,
  BooleanResponse, PromptAnswerModel,
  Story,
  StoryAnswers, StoryCommentRequest,
  StoryModel,
  StoryReactionRequest,
  StoryReplyRequest,
  StoryResponse
} from '../models/storyModel';
import { SqsService } from './aws/sqsService';
import { CommunityService } from './communityServies';
import { EmailService } from './emailService';
import { CommentHelper } from './helpers/commentHelper';
import { NotificationHelper } from './helpers/notificationHelper';
import { ReactionHelper } from './helpers/reactionHelper';
import { StoryHelper } from './helpers/storyHelper';
import { UserHelper } from './helpers/userHelper';
import { PostsService } from './postsService';
import { PromptService } from './promptService';

@Service()
export class StoryService {
  storyHelper = Container.get(StoryHelper);
  postService = Container.get(PostsService);
  communityService = Container.get(CommunityService);
  emailService = Container.get(EmailService);
  userHelper = Container.get(UserHelper);
  notificationHelper = Container.get(NotificationHelper);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    private sqsService: SqsService,
    private reactionHelper: ReactionHelper,
    private commentHelper: CommentHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getAllStories(
    pageParams: PageParam,
    currentUserId: string
  ): Promise<BaseResponse> {
    try {
      const value = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.published]: true
      };
      const sort = {
        [mongoDbTables.story.publishedAt]: -1
      };
      let stories: Story[] = await this._mongoSvc.readAllByValue(
        collections.STORY,
        value,
        sort
      );
      if (currentUserId) {
        stories = await this.storyHelper.removeBlockedContentForStories(
          currentUserId,
          stories
        );
      }
      stories.forEach((story) => {
        if (story.answer !== null) {
          story.answer = this.validate.sort(
            story.answer,
            pageParams.sort,
            mongoDbTables.story.reactionTotal
          );
        }
      });

      if (pageParams != null) {
        const start = (pageParams.pageNumber - 1) * pageParams.pageSize;
        const end = start + pageParams.pageSize;
        if (pageParams.sort === 1) {
          stories = this.validate.sort(
            stories,
            pageParams.sort,
            mongoDbTables.story.reactionTotal
          );
        }
        stories = stories.slice(start, end);
      }

      const storyResponseList: StoryResponse[] = [];
      for (const story of stories) {
        const storyResponse = await this.storyHelper.buildStoryResponse(
          story,
          currentUserId
        );
        const userReaction = this.reactionHelper.getReactionForCurrentUser(storyResponse.reaction, currentUserId);
        storyResponse[REACTIONS.REACTION_COUNT] = userReaction.reactionCount;
        storyResponse[REACTIONS.USER_REACTION] = userReaction.userReaction;

        delete storyResponse.reaction;
        storyResponseList.push(storyResponse);
      }

      return this.result.createSuccess(storyResponseList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getStoryById(
    id: string,
    currentUserId: string,
    language: string
  ): Promise<BaseResponse> {
    try {
      const matchQuery = {
        $match: {
          [mongoDbTables.story.removed]: false,
          [mongoDbTables.story.id]: new ObjectId(id)
        }
      };

      const commentLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.posts.commentAuthorId,
          foreignField: mongoDbTables.posts.id,
          as: mongoDbTables.posts.commentAuthors
        }
      };

      const replyLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.posts.replyAuthorId,
          foreignField: mongoDbTables.posts.id,
          as: mongoDbTables.posts.replyAuthors
        }
      };

      const storyData: Story[] = await this._mongoSvc.readByAggregate(
        collections.STORY,
        [matchQuery, commentLookup, replyLookup]
      );
      let story = storyData[0];
      if (story) {
        story = await this.removeBlockedContentForStory(currentUserId, story);
      }
      if (!story) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }
      if (
        currentUserId &&
        currentUserId.trim() &&
        story.authorId !== currentUserId &&
        !story.published
      ) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyNotPublished;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[472];
        return this.result.createError([this.result.errorInfo]);
      }

      const storyResponse = await this.storyHelper.buildStoryResponse(story, currentUserId, language);
      const userReaction = this.reactionHelper.getReactionForCurrentUser(storyResponse.reaction, currentUserId);
      storyResponse[REACTIONS.REACTION_COUNT] = userReaction.reactionCount;
      storyResponse[REACTIONS.USER_REACTION] = userReaction.userReaction;

      if (Object.values(translationLiterals.cancer).includes(storyResponse.communityName)) {
        storyResponse.answer = await this.storyHelper.addPromptOptionValue(storyResponse, language);
      }

      delete storyResponse.reaction;
      return this.result.createSuccess(storyResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

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
        stories = await this.storyHelper.removeBlockedContentForStories(userId, stories);
      }
      if (stories === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const storyResponseList: StoryResponse[] = [];
      for (const story of stories) {
        const storyResponse = await this.storyHelper.buildStoryResponse(story, userId);
        const userReaction = this.reactionHelper.getReactionForCurrentUser(storyResponse.reaction, userId);
        storyResponse[REACTIONS.REACTION_COUNT] = userReaction.reactionCount;
        storyResponse[REACTIONS.USER_REACTION] = userReaction.userReaction;

        delete storyResponse.reaction;
        storyResponseList.push(storyResponse);
      }

      return this.result.createSuccess(storyResponseList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getByCommunity(
    communityId: string,
    pageParams: PageParam,
    currentUserId: string
  ): Promise<BaseResponse> {
    try {
      return await this.storyHelper.getCommunityByIdOrUserId(
        communityId,
        pageParams,
        currentUserId,
        false,
        true
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getByCommunityAndStoryAuthor(
    communityId: string,
    currentUserId: string,
    pageParams: PageParam
  ): Promise<BaseResponse> {
    try {
      return await this.storyHelper.getCommunityByIdOrUserId(
        communityId,
        pageParams,
        currentUserId,
        true,
        false
      );
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async createAnswersForPrompt(
    answerModel: PromptAnswerModel
  ): Promise<BaseResponse> {
    try {
      const storyWrapper = await this.getStoryById(answerModel.storyId, null, TranslationLanguage.ENGLISH);
      const story: Story = storyWrapper.data.value as Story;
      let language = answerModel.languageData;

      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }

      const promptWrapper = await Container.get(PromptService).getPromptById(
        answerModel.promptId, language
      );
      const prompt: Prompt = promptWrapper.data.value as Prompt;

      if (story == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (answerModel.currentUserId !== story.authorId) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.authorEditStoryQuestionsEnforcementDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      if (prompt == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.promptDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (prompt.communityId !== story.communityId) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.promptAndStoryAreDifferentCommunities;
        return this.result.createError([this.result.errorInfo]);
      }

      if (this.validate.isNullOrWhiteSpace(prompt.question)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.promptQuestionEmpty;
        return this.result.createError([this.result.errorInfo]);
      }

      // Verifying if any content is moderated.
      const moderatePromptAnswerModelContent = this.validate.moderatePromptAnswerModelContent(
        answerModel
      );
      if (moderatePromptAnswerModelContent.moderationFlag) {
        const errorMessage = API_RESPONSE.messages.contentModerationError;
        const value = moderatePromptAnswerModelContent.promptAnswerModel;
        return this.result.createExceptionWithValue(errorMessage, value);
      }

      const answerObject = this.createAnswerForPrompt(
        prompt,
        answerModel.answer
      );

      if (answerObject == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = 'Error creating Answer';
        return this.result.createError([this.result.errorInfo]);
      }

      story.answer.push(answerObject);

      const filter = {
        [mongoDbTables.users.id]: new ObjectId(answerModel.storyId)
      };
      const setvalues = {
        $set: {
          [mongoDbTables.story.answer]: story.answer,
          [mongoDbTables.story.updateDate]: new Date()
        }
      };
      await this._mongoSvc.updateByQuery(collections.STORY, filter, setvalues);

      const storyResponse = await this.storyHelper.buildStoryResponse(story, null);
      return this.result.createSuccess(storyResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateStory(storyModel: StoryModel): Promise<BaseResponse> {
    try {
      const value = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.id]: new ObjectId(storyModel.id)
      };
      const story: Story = await this._mongoSvc.readByValue(
        collections.STORY,
        value
      );

      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (story.authorId !== storyModel.authorId) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.authorUpdateStoryEnforcementDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      if (story.communityId !== storyModel.communityId) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.storyDoesNotExistInProvidedCommunity;
        return this.result.createError([this.result.errorInfo]);
      }

      //TODO: Uncomment once FE incorporates DisplayName mandatory to Stories
      // const author = await this.getAuthor(storyModel.authorId);
      // if (storyModel.displayName.toUpperCase() !== author.firstName.toUpperCase() &&
      //   storyModel.displayName.toUpperCase() !== author.displayName.toUpperCase()) {
      //   this.result.errorInfo.title = API_RESPONSE.messages.badData;
      //   this.result.errorInfo.detail = API_RESPONSE.messages.displayNameMisMatch;
      //   return this.result.createError([this.result.errorInfo]);
      // }

      const moderateStoryModelContent = this.validate.moderateStoryModelContent(
        storyModel
      );
      if (moderateStoryModelContent.moderationFlag) {
        const errorMessage = API_RESPONSE.messages.contentModerationError;
        const moderationValue = moderateStoryModelContent.storyModel;
        return this.result.createExceptionWithValue(errorMessage, moderationValue);
      }

      const storyIn = this.createStoryFromModel(storyModel, false);
      storyIn.createdAt = story.createdAt;
      storyIn.updatedAt = new Date();
      storyIn.published = story.published;
      storyIn.removed = story.removed;
      storyIn.flagged = story.flagged;
      storyIn.hasStoryBeenPublishedOnce = story.hasStoryBeenPublishedOnce;
      storyIn.reaction = story.reaction;
      storyIn.comments = story.comments ?? [];

      const storyId = { [mongoDbTables.story.id]: new ObjectId(storyModel.id) };
      await this._mongoSvc.replaceByQuery(collections.STORY, storyId, storyIn);

      //Syncing BinderStories with Story
      this.storyHelper.updateStoryInBinder(storyModel.id, storyIn);

      storyIn.id = storyModel.id;
      const storyResponse = await this.storyHelper.buildStoryResponse(storyIn, null);

      return this.result.createSuccess(storyResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateDisplayNameInStory(userId: string, displayName: string) {
    try {
      const updateQuery = {
        $set: {
          [mongoDbTables.users.displayName]: displayName
        }
      };
      const storyObj = { [mongoDbTables.story.authorId]: userId };
      await this._mongoSvc.updateManyByQuery(
        collections.STORY,
        storyObj,
        updateQuery
      );
    } catch (error) {
      this._log.error(error as Error);
    }
  }

  public async setPublished(
    userId: string,
    storyId: string,
    publish: boolean
  ): Promise<BaseResponse> {
    try {
      const response = new BooleanResponse();
      response.operation = false;
      const value = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.id]: new ObjectId(storyId)
      };

      const story: Story = await this._mongoSvc.readByValue(
        collections.STORY,
        value
      );

      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (story.authorId !== userId) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.unauthorized;
        return this.result.createError([this.result.errorInfo]);
      }

      story.published = publish;
      story.updatedAt = new Date();
      if (publish && !story.hasStoryBeenPublishedOnce) {
        story.hasStoryBeenPublishedOnce = true;
        /**
         * CCX-2059 && CCX-3432:
         *      When we are creating a new story and mark as published, update the Story and Activity collection.
         *      As we store the story data to the Activity, we are using it for the PN.
         *      Push the message with required details to Story SQS. Which will handle the following.
         *          - Update Activity for all Active Community users.
         *          - Delay of 60sec before pushing the PN to community members.
         *          - Handle the cancel PN usercase based on the story status.
         */
        const community: Community = await this._mongoSvc.readByID(collections.COMMUNITY, story.communityId);
        /* Send message object to Queue */
        const notificationData = {
          type: NotificationType.STORY,
          senderId: story.authorId,
          title: NotificationMessage.StoryCreatedTitle,
          body: NotificationMessage.StoryCreatedContent,
          storyId: story.id,
          deepLink: NotificationDeepLink.ACTIVITY,
          communityId: story.communityId,
          createdAt: new Date(),
          env: getArgument('env'),
          activityText: API_RESPONSE.messages.userStoryPosted.concat(community.title)
        };
        await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.storyQueue, SQSParams.STORY_MESSAGE_GROUP_ID);

        // Notify the admins who are part of that community.
        const author = await this._mongoSvc.readByID(collections.USERS, userId);
        const name = (author.displayName);
        const admins = await this._mongoSvc.readAllByValue(collections.ADMINUSERS,
          {
            [mongoDbTables.adminUser.communities]: {
              $exists: true,
              $in: [story.communityId]
            },
            [mongoDbTables.adminUser.active]: true
          }
        );

        admins.forEach(async (admin) => {
          await this.postService.createActivityObject(
            admin.id,
            story.authorId,
            storyReactionsType[0],
            `${name} ${NotificationMessages.StoryPublish} ${community.title}`,
            false,
            null, storyId
          );
        });
      }

      response.operation = await this.storyHelper.updateStoryCollection(
        storyId,
        publish,
        story
      );

      if (publish) { this.userHelper.setStoryPromotionReminder(story.authorId); }

      // Sensitive Word used in the story model.
      if (publish) {
        if (this.validate.moderateStoryModelForSensitiveWords(story)) {
          await this.storyContentMonitor(story.id, story.communityId, story.authorId);
        }
      }

      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removePromptFromStory(
    userId: string,
    storyId: string,
    promptId: string
  ): Promise<BaseResponse> {
    try {
      const story = await this._mongoSvc.readByID(collections.STORY, storyId);

      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (story.authorId !== userId) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.authorUpdateStoryEnforcementDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      const prompt = await Container.get(PromptService).getPromptById(promptId, TranslationLanguage.ENGLISH);

      if (prompt !== null && !prompt.data.isSuccess) {
        return this.result.createError(prompt.data.errors);
      }

      const promptLength = story.answer.filter(
        (item) => item.Type === QuestionType.promptQuestion
      ).length;
      const promptInStory = story.answer.find(
        (item) => item.promptId === promptId
      );
      if (promptInStory === undefined || promptInStory === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.promptNotInStory;
        return this.result.createError([this.result.errorInfo]);
      }
      if (promptLength === 1) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.atleastOnePromptRequiredPerStory;
        return this.result.createError([this.result.errorInfo]);
      }

      story.answer = story.answer.filter((item) => item.promptId !== promptId);
      const filter = { [mongoDbTables.story.id]: new ObjectId(storyId) };
      const setValues = {
        $set: {
          [mongoDbTables.story.answer]: story.answer,
          [mongoDbTables.story.updateDate]: new Date()
        }
      };

      await this._mongoSvc.updateByQuery(collections.STORY, filter, setValues);
      const storyResponse = await this.storyHelper.buildStoryResponse(story, null);
      return this.result.createSuccess(storyResponse);
    } catch (error) {
      return this.result.createException(error);
    }
  }

  public async flagStory(storyId: string, userId: string): Promise<BaseResponse> {
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

      const updateQuery = {
        $set: {
          [mongoDbTables.story.flagged]: true
        }
      };
      const storyObj = { [mongoDbTables.story.id]: new ObjectId(storyId) };
      this._mongoSvc.updateByQuery(collections.STORY, storyObj, updateQuery);

      //Send email message
      this.commentHelper.reportToAdmin(story, storyReactionsType[0]);
      //Add Admin Notifications
      this.notificationHelper.notifyAdminOnFlagStory(storyId, userId, story.communityId);

      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async create(
    storyModel: StoryModel,
    published: boolean = true
  ): Promise<BaseResponse> {
    try {
      const authorDetails = await this.userHelper.getAuthor(storyModel.authorId);
      const getCommunity = await this.communityService.getCommunityById(
        storyModel.communityId,
        TranslationLanguage.ENGLISH
      );
      if (!authorDetails.communities.includes(getCommunity.data.value['id'])) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.userIsNotInCommunity;
        return this.result.createError([this.result.errorInfo]);
      }

      //TODO: Uncomment once FE incorporates DisplayName mandatory to Stories
      // const author = await this.getAuthor(storyModel.authorId);
      // if (storyModel.displayName.toUpperCase() !== author.firstName.toUpperCase() &&
      //   storyModel.displayName.toUpperCase() !== author.displayName.toUpperCase()) {
      //   this.result.errorInfo.title = API_RESPONSE.messages.badData;
      //   this.result.errorInfo.detail = API_RESPONSE.messages.displayNameMisMatch;
      //   return this.result.createError([this.result.errorInfo]);
      // }

      const query = {
        [mongoDbTables.story.authorId]: storyModel.authorId,
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.communityId]: storyModel.communityId
      };
      const storyInCommunity = await this._mongoSvc.readByValue(
        collections.STORY,
        query
      );

      if (storyInCommunity !== null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.userCanPostOneStoryPerCommunity;
        return this.result.createError([this.result.errorInfo]);
      }

      const moderateStoryModelContent = this.validate.moderateStoryModelContent(
        storyModel
      );
      if (moderateStoryModelContent.moderationFlag) {
        const errorMessage = API_RESPONSE.messages.contentModerationError;
        const value = moderateStoryModelContent.storyModel;
        return this.result.createExceptionWithValue(errorMessage, value);
      }

      const story = this.createStoryFromModel(storyModel, true);
      story.published = published;
      story.flagged = story.flagged ?? false;
      story.removed = story.removed ?? false;
      story.hasStoryBeenPublishedOnce = story.hasStoryBeenPublishedOnce ?? false;
      await this._mongoSvc.insertValue(collections.STORY, story);
      const storyResponse = await this.storyHelper.buildStoryResponse(story, null);
      if (published) { this.userHelper.setStoryPromotionReminder(storyModel.authorId); }

      return this.result.createSuccess(storyResponse);
    } catch (error) {
      return this.result.createException(error);
    }
  }

  public async upsertComment(payload: StoryCommentRequest, authorId: string): Promise<BaseResponse> {
    try {
      const value = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.id]: new ObjectId(payload.storyId)
      };
      const story: Story = await this._mongoSvc.readByValue(
        collections.STORY,
        value
      );
      if (payload.id) {
        const updateQuery = {
          [mongoDbTables.story.id]: new ObjectId(payload.storyId),
          [mongoDbTables.story.commentId]: new ObjectId(payload.id)
        };
        const updateSetValue = {
          $set: {
            [mongoDbTables.story.commentMsg]: payload.comment,
            [mongoDbTables.story.isCommentProfane]: payload.isCommentTextProfane,
            [mongoDbTables.story.commentUpdatedAt]: new Date()
          }
        };
        const result = await this._mongoSvc.updateByQuery(collections.STORY, updateQuery, updateSetValue);
        if (result === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.commentFailure;
          return this.result.createError([this.result.errorInfo]);
        }

        // Sensitive Word used in the story model.
        if (this.validate.identifySpecialKeyWords(payload.comment)) {
          await this.storyContentMonitor(story.id, story.communityId, authorId, payload.id);
        }

        const response = new BooleanResponse();
        response.operation = true;
        return this.result.createSuccess(response);
      }
      const commentObj = await Container.get(CommentHelper).createCommentObject(payload, authorId);
      const query = { [mongoDbTables.story.id]: new ObjectId(payload.storyId) };
      const setValue = { $addToSet: { comments: commentObj } };
      const result = await this._mongoSvc.updateByQuery(collections.STORY, query, setValue);
      if (result === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentFailure;
        return this.result.createError([this.result.errorInfo]);
      }
      commentObj.id = commentObj[mongoDbTables.story.id];
      delete commentObj[mongoDbTables.story.id];

      await Container.get(NotificationHelper).notifyUser(
        NotificationContentType.STORY,
        story.authorId,
        authorId,
        story.id,
        {
          title: NotificationMessages.StoryCommentTitle,
          body: NotificationMessages.StoryCommentBody
        },
        NotificationMessages.StoryCommentActivity,
        PostResponse.COMMENT,
        commentObj.id.toString(),
        NotificationType.COMMENT
      );

      // Sensitive Word used in the story model.
      if (this.validate.identifySpecialKeyWords(payload.comment)) {
        await this.storyContentMonitor(story.id, story.communityId, authorId, commentObj.id);
      }

      return this.result.createSuccess(commentObj);

    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async upsertReply(payload: StoryReplyRequest, authorId: string): Promise<BaseResponse> {
    try {
      const comment: Story = await this._mongoSvc.readByValue(
        collections.STORY,
        {
          [mongoDbTables.story.removed]: false,
          [mongoDbTables.story.id]: new ObjectId(payload.storyId)
        }
      );

      if (payload.id) {
        const queryData = {
          [mongoDbTables.story.id]: new ObjectId(payload.storyId)
        };
        const setData = {
          $set: {
            [mongoDbTables.story.postCommentFilter]: payload.comment,
            [mongoDbTables.story.isReplyProfane]: payload.isCommentTextProfane,
            [mongoDbTables.story.storyDateFilter]: new Date()
          }
        };
        const filter = {
          'arrayFilters': [
            { [mongoDbTables.story.storyOuterFilter]: new ObjectId(payload.commentId) },
            { [mongoDbTables.story.storyInnerFilter]: new ObjectId(payload.id) }
          ]
        };
        const resultCount = await this._mongoSvc.updateByQuery(collections.STORY, queryData, setData, filter);
        if (resultCount === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.commentFailure;
          return this.result.createError([this.result.errorInfo]);
        }

        // Sensitive Word used in the story model.
        if (this.validate.identifySpecialKeyWords(payload.comment)) {
          await this.storyContentMonitor(comment.id, comment.communityId, comment.authorId, payload.commentId, payload.id);
        }
        const response = new BooleanResponse();
        response.operation = (resultCount) ? true : false;

        return this.result.createSuccess(response);
      }
      const commentReplyObj = await Container.get(CommentHelper).createCommentObject(payload, authorId);
      const query = {
        [mongoDbTables.story.id]: new ObjectId(payload.storyId),
        [mongoDbTables.story.commentId]: new ObjectId(payload.commentId)
      };
      const setValue = { $addToSet: { [mongoDbTables.story.storyReplies]: commentReplyObj } };
      const result = await this._mongoSvc.updateByQuery(collections.STORY, query, setValue);
      if (result === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.commentFailure;
        return this.result.createError([this.result.errorInfo]);
      }
      commentReplyObj.id = commentReplyObj[mongoDbTables.story.id];
      delete commentReplyObj[mongoDbTables.story.id];

      const replyToComment = comment.comments.filter((commentObj) =>
        commentObj[mongoDbTables.story.id].toString() === payload.commentId)[0];

      await Container.get(NotificationHelper).notifyUser(
        NotificationContentType.STORY,
        replyToComment.author.id.toString(),
        authorId,
        comment.id,
        {
          title: NotificationMessages.UserReplyTitle,
          body: NotificationMessages.UserReplyBody
        },
        NotificationMessages.UserReplyContent,
        PostResponse.REPLY,
        replyToComment[mongoDbTables.story.id].toString(),
        NotificationType.COMMENT,
        commentReplyObj.id.toString()
      );

      const adminUser: Admin = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        replyToComment.author.id.toString()
      );
      if (adminUser !== null) {
        /* update admin activity */
        await this.postService.createActivityObject(
          adminUser.id,
          authorId,
          reactionsType[2],
          `${API_RESPONSE.messages.replyComment}: ${comment.featuredQuote}`,
          false,
          null, payload.storyId,
          payload.commentId,
          commentReplyObj.id
        );

        // CCX-7277: Notify other admins as well related to the user reponse.
        if (adminUser.role === AdminRole.scadvocate) {
          const admins: Admin[] = await this._mongoSvc.readAllByValue(
            collections.ADMINUSERS,
            {
              [mongoDbTables.adminUser.active]: true,
              [mongoDbTables.adminUser.id]: { $nin: [new ObjectId(adminUser.id)] },
              [mongoDbTables.adminUser.communities]: { $in: [comment.communityId] }
            }
          );
          const member = await this._mongoSvc.readByID(collections.USERS, authorId);
          const memberName = (member.displayName) ;
          admins.forEach(async (admin) => {
            const adminName = (adminUser.displayName === '' || adminUser.displayName === null) ? adminUser.firstName : adminUser.displayName;
            await this.postService.createActivityObject(
              admin.id,
              authorId,
              reactionsType[2],
              `${memberName} replied to ${adminName} comment`,
              false,
              null, payload.storyId,
              payload.commentId,
              commentReplyObj.id
            );
          });
        }

        const community = await this._mongoSvc.readByID(collections.COMMUNITY, comment.communityId);
        const html = this.emailService.htmlForReplyForStory(
          comment.featuredQuote,
          APP.config.smtpSettings.adminUrl,
          comment.id
        );
        this.emailService.sendEmailMessage(APP.config.smtpSettings,
          APP.config.smtpSettings.adminEmail,
          `${API_RESPONSE.messages.replySubject} ${community?.title} community`
          , html);
      }

      // Sensitive Word used in the story model.
      if (this.validate.identifySpecialKeyWords(payload.comment)) {
        await this.storyContentMonitor(comment.id, comment.communityId, comment.authorId, payload.commentId, commentReplyObj.id);
      }
      return this.result.createSuccess(commentReplyObj);

    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async upsertReaction(payload: StoryReactionRequest, isRemove: boolean, userId: string): Promise<BaseResponse> {
    try {
      let result = null;
      switch (payload.type) {
        case storyReactionsType[1]:
          result = await this.upsertCommentReaction(payload, isRemove, userId);
          break;
        case storyReactionsType[2]:
          result = await this.upsertReplyReaction(payload, isRemove, userId);
          break;
        default:
          break;
      }
      if (!result.operation) {
        return this.result.createError([this.result.errorInfo]);
      }
      const query = {
        $match: {
          [mongoDbTables.story.id]: new ObjectId(payload.storyId),
          removed: false
        }
      };
      const commentLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.story.commentAuthorId,
          foreignField: mongoDbTables.story.id,
          as: mongoDbTables.story.commentAuthors
        }
      };
      const replyLookup = {
        $lookup: {
          from: collections.USERS,
          localField: mongoDbTables.story.replyAuthorId,
          foreignField: mongoDbTables.story.id,
          as: mongoDbTables.story.replyAuthors
        }
      };

      const newStory: Story[] = await this._mongoSvc.readByAggregate(
        collections.STORY,
        [query, commentLookup, replyLookup]
      );
      if (!payload.language) {
        payload.language = TranslationLanguage.ENGLISH;
      }
      return this.result.createSuccess(newStory);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async deleteStoryById(storyId: string, userId: string) {
    try {
      const story = await this._mongoSvc.readByValue(collections.STORY, {
        [mongoDbTables.story.id]: new ObjectId(storyId),
        [mongoDbTables.story.authorId]: userId
      });
      if (!story) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
        return this.result.createError([this.result.errorInfo]);
      }

      const res = await this._mongoSvc.deleteOneByValue(collections.STORY, {
        [mongoDbTables.story.id]: new ObjectId(storyId)
      });
      await this.storyHelper.removeStoryActivity(storyId);
      return this.result.createSuccess(res);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private createStoryFromModel(
    storyModel: StoryModel,
    isCreate: boolean
  ): Story {
    const story = new Story();

    story.authorId = storyModel.authorId;
    story.featuredQuote = storyModel.featuredQuote;
    story.answer = this.getAnswers(storyModel.answers, isCreate);
    story.communityId = storyModel.communityId;
    story.storyText = storyModel.storyText;
    story.authorAgeWhenStoryBegan = storyModel.authorAgeWhenStoryBegan;
    story.relation = storyModel.relation;
    story.displayName = storyModel.displayName;
    story.relationAgeWhenDiagnosed = storyModel.relationAgeWhenDiagnosed;
    story.allowComments = storyModel.allowComments ?? true;

    if (isCreate) {
      story.createdAt = new Date();
    }
    story.updatedAt = new Date();

    return story;
  }

  private getAnswers(
    storyAnswers: StoryAnswers[],
    isCreate: boolean
  ): Answer[] {
    const answers: Answer[] = [];

    if (storyAnswers && storyAnswers !== null && storyAnswers.length > 0) {
      for (const storyAnswer of storyAnswers) {
        const answer = this.createAnswer(storyAnswer);

        if (isCreate) {
          const newObjectId = new ObjectId();
          answer.id = newObjectId.toHexString();
          answer.type = QuestionType.promptQuestion;
          answer.createdDate = new Date();
        }

        answers.push(answer);
      }
    }

    return answers;
  }

  private escapeHtml(value: string) {
    return value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  private createAnswer(storyAnswer: StoryAnswers): Answer {
    const answer = new Answer();
    const newId = new ObjectId();
    const createdOn = new Date(storyAnswer.createdDate);

    answer.id = this.validate.isNullOrWhiteSpace(storyAnswer.id)
      ? newId.toHexString()
      : storyAnswer.id;
    answer.promptId = storyAnswer.promptId;
    answer.question = this.escapeHtml(storyAnswer.question);
    answer.sensitiveContentText = storyAnswer.sensitiveContentText;
    answer.response = this.escapeHtml(storyAnswer.response);
    answer.order = 0;
    answer.type = this.validate.isNullOrWhiteSpace(storyAnswer.type)
      ? QuestionType.promptQuestion
      : storyAnswer.type;
    answer.createdDate =
      createdOn.getFullYear() !== 1 ? storyAnswer.createdDate : new Date();
    answer.updatedDate = new Date();
    if (storyAnswer.optionType ?? false) {
      answer.optionType = storyAnswer.optionType;
    }
    return answer;
  }

  private createAnswerForPrompt(prompt: Prompt, answer: string) {
    const answerObject = new Answer();

    const newId = new ObjectId();
    answerObject.id = newId.toHexString();
    answerObject.response = this.escapeHtml(answer);
    answerObject.promptId = prompt.id;
    answerObject.question = this.escapeHtml(prompt.question);
    answerObject.sensitiveContentText = prompt.sensitiveContentText;
    answerObject.createdDate = new Date();
    answerObject.updatedDate = new Date();
    answerObject.order = 0;
    answerObject.type = QuestionType.promptQuestion;

    return answerObject;
  }

  private async removeBlockedContentForStory(
    currentUserId: string,
    story: Story
  ) {
    try {
      let hasBlockedUserReaction=false;
      const value = {
        $or: [
          { [mongoDbTables.blocked.blockedUser]: currentUserId },
          { [mongoDbTables.blocked.blockingUser]: currentUserId }
        ]
      };
      const blockedUsers: Blocked[] = await this._mongoSvc.readAllByValue(
        collections.BLOCKED,
        value
      );
      let blockUserIdList = [];
      blockedUsers.forEach((block) => {
        blockUserIdList.push(block.blockingUser);
        blockUserIdList.push(block.blockedUser);
      });
      blockUserIdList = [...new Set(blockUserIdList)];
      blockUserIdList = blockUserIdList.filter((id) => id !== currentUserId);
      if (blockUserIdList && blockUserIdList.length > 0) {
        blockUserIdList.forEach((blockedUser) => {
          story.answer = story.answer?.filter(
            (s) => s.questionAuthorId !== blockedUser
          );
          story.comments = story?.comments?.filter((comment) => comment.author.id.toString() !== blockedUser)
            .map((element) => {
              return {
                ...element,
                replies: element?.replies?.filter(
                  (subElement) => subElement?.author?.id.toString() !== blockedUser
                )
              };
            });
          const findIndex = story?.reaction?.log?.findIndex((log) => log?.userId === blockedUser);
          if (findIndex > -1) {
            story.reaction.log = story?.reaction?.log.filter(
              (log) => log?.userId !== blockedUser
            );
            hasBlockedUserReaction=true;
          }
        });

        if (story?.reaction?.log?.length > 0 && hasBlockedUserReaction) {
          story.reaction.count = this.reactionHelper.createReactionCount(
            story.reaction.log
          );
          hasBlockedUserReaction=false;
        }
      }
      return story;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private async upsertCommentReaction(payload: StoryReactionRequest, isRemove: boolean, userId: string): Promise<BooleanResponse> {
    const response = new BooleanResponse();
    const cmntVal = {
      [mongoDbTables.story.removed]: false,
      [mongoDbTables.story.id]: new ObjectId(payload.storyId),
      [mongoDbTables.story.commentId]: new ObjectId(payload.commentId)
    };
    const storyObj: Story = await this._mongoSvc.readByValue(
      collections.STORY,
      cmntVal
    );
    if (storyObj === null) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.commentDoesNotExist;
      response.operation = false;
      return response;
    }
    const commentObjId = storyObj.comments.map((value) => {
      return value[mongoDbTables.story.id].toString();
    }).indexOf(payload.commentId);
    const commentObj = storyObj.comments[commentObjId];
    let cmntReaction: Reaction = commentObj.reactions ? commentObj.reactions : this.reactionHelper.createReactionObject();
    const index = cmntReaction.log.findIndex((reactions) => reactions.userId === userId);
    if (index === -1 && isRemove) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
      response.operation = false;
      return response;
    }
    cmntReaction = await Container.get(ReactionHelper).handleStoryReactions(cmntReaction, payload, index, isRemove, userId);
    const searchFilterComment = {
      [mongoDbTables.story.id]: new ObjectId(payload.storyId),
      [mongoDbTables.story.commentId]: new ObjectId(payload.commentId)
    };
    const setValue = {
      $set: {
        [mongoDbTables.story.commentReaction]: cmntReaction
      }
    };
    await this._mongoSvc.updateByQuery(collections.STORY, searchFilterComment, setValue);
    if (index === -1 && !isRemove) {
      await Container.get(NotificationHelper).notifyUser(
        NotificationContentType.STORY,
        commentObj.author.id.toString(),
        userId,
        storyObj.id,
        {
          title: NotificationMessages.ReactionTitle,
          body: NotificationMessages.UserReactionBody
        },
        NotificationMessages.UserReactionContent,
        PostResponse.COMMENT,
        payload.commentId,
        NotificationType.REACTION
      );
    }

    response.operation = true;
    return response;
  }

  private async upsertReplyReaction(payload: StoryReactionRequest, isRemove: boolean, userId: string): Promise<BooleanResponse> {
    const replyObj = await this.commentHelper.getReplyStory(payload.storyId, payload.commentId, payload.replyId);
    const response = new BooleanResponse();
    if (replyObj === null) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.replyDoesNotExists;
      response.operation = false;
      return response;
    }
    const replyCommentObj = replyObj.comments.filter((c) =>
      c[mongoDbTables.story.id].toString() === payload.commentId
    )[0];
    const reply = replyCommentObj.replies.filter((r) =>
      r[mongoDbTables.story.id].toString() === payload.replyId
    )[0];

    let replyReaction: Reaction = reply.reactions ? reply.reactions : this.reactionHelper.createReactionObject();
    const replyIndex = replyReaction.log.findIndex((reactions) => reactions.userId === userId);
    if (replyIndex === -1 && isRemove) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
      response.operation = false;
      return response;
    }
    replyReaction = await Container.get(ReactionHelper).handleStoryReactions(replyReaction, payload, replyIndex, isRemove, userId);
    const updateQuery = {
      [mongoDbTables.story.id]: new ObjectId(payload.storyId)
    };
    const updateSetValue = {
      $set: {
        [mongoDbTables.story.replyReactions]: replyReaction,
        [mongoDbTables.story.replyUpdatedAt]: new Date()
      }
    };
    const arrayFilters = {
      [queryStrings.arrayFilters]: [
        { [mongoDbTables.story.postOuterFilter]: new ObjectId(payload.commentId) },
        { [mongoDbTables.story.postInnerFilter]: new ObjectId(payload.replyId) }
      ]
    };
    await this._mongoSvc.updateByQuery(collections.STORY, updateQuery, updateSetValue, arrayFilters);
    if (replyIndex === -1 && !isRemove) {
      await Container.get(NotificationHelper).notifyUser(
        NotificationContentType.STORY,
        reply.author.id.toString(),
        userId,
        replyObj.id,
        {
          title: NotificationMessages.ReactionTitle,
          body: NotificationMessages.UserReactionBody
        },
        NotificationMessages.UserReactionContent,
        PostResponse.COMMENT,
        payload.commentId,
        NotificationType.REACTION,
        payload.replyId
      );
    }

    response.operation = true;
    return response;
  }

  private async storyContentMonitor(storyId: string, communityId: string, storyAuthor: string, commentId?: string, replyId?: string) {
    const community: Community = await this._mongoSvc.readByID(collections.COMMUNITY, communityId);
    const html = this.emailService.htmlForStoryModeration(
      storyId,
      APP.config.smtpSettings.adminUrl
    );
    this.emailService.sendEmailMessage(
      APP.config.smtpSettings,
      APP.config.smtpSettings.flagReviewEmail,
      `${API_RESPONSE.messages.keyWordPublished} ${community.title} community`, html
    );

    // Notify the SCAdmins regarding the same.
    const scadmins = await this._mongoSvc.readAllByValue(
      collections.ADMINUSERS,
      {
        [mongoDbTables.adminUser.active]: true,
        [mongoDbTables.adminUser.communities]: {
          $in: [communityId]
        }
      }
    );
    scadmins.forEach((sca) => {
      this.postService.createActivityObject(
        sca.id,
        storyAuthor,
        NotificationType.STORY,
        `${API_RESPONSE.messages.sensitiveWords} story`,
        false,
        null,
        storyId, commentId, replyId
      );
    });

  }
}
