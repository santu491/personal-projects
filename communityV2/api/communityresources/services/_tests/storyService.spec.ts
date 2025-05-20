import { API_RESPONSE, TranslationLanguage } from '@anthem/communityapi/common';
import {
  mockCommentHelper,
  mockMongo,
  mockReactionHelper,
  mockResult,
  mockSqsSvc,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { APP } from '@anthem/communityapi/utils';
import { Admin } from 'api/communityresources/models/adminUserModel';
import { PageParam } from 'api/communityresources/models/pageParamModel';
import { Prompt } from 'api/communityresources/models/promptModel';
import { Reaction } from 'api/communityresources/models/reactionModel';
import {
  PromptAnswerModel,
  StoryCommentRequest,
  StoryModel,
  StoryReactionRequest,
  StoryReplyRequest,
  StoryResponse
} from 'api/communityresources/models/storyModel';
import { ObjectId } from 'mongodb';
import { EmailService } from '../emailService';
import { CommentHelper } from '../helpers/commentHelper';
import { NotificationHelper } from '../helpers/notificationHelper';
import { ReactionHelper } from '../helpers/reactionHelper';
import { StoryHelper } from '../helpers/storyHelper';
import { PostsService } from '../postsService';
import { PromptService } from '../promptService';
import { StoryService } from '../storyService';

describe('StoryService', () => {
  let service: StoryService;
  const rawStories = require('./data/stories.json');
  const rawUser = require('./data/user.json');
  beforeEach(() => {
    service = new StoryService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockValidation,
      <any>mockSqsSvc,
      <any>mockReactionHelper,
      <any>mockCommentHelper,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllStories', () => {
    it('should return all stories', async () => {
      const page: PageParam = {
        pageNumber: 1,
        pageSize: 10,
        sort: 1
      };
      const publishedStories = rawStories.filter((s) => s.published);
      const removeBlockedContentForStories = jest.spyOn(
        StoryHelper.prototype,
        'removeBlockedContentForStories'
      );
      removeBlockedContentForStories.mockImplementation(() => {
        return Promise.resolve(publishedStories);
      });
      const buildStoryResponse = jest.spyOn(
        StoryHelper.prototype,
        'buildStoryResponse'
      );
      buildStoryResponse.mockImplementation(() => {
        return Promise.resolve(new StoryResponse());
      });
      mockValidation.sort.mockReturnValue(publishedStories);
      mockMongo.readAllByValue.mockReturnValue(publishedStories);
      mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
        reactionCount: 5,
        userReaction: 'like'
      });
      await service.getAllStories(page, 'userId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should not check for blocked content', async () => {
      const page: PageParam = {
        pageNumber: 1,
        pageSize: 10,
        sort: 1
      };
      const publishedStories = rawStories.filter((s) => s.published);
      const buildStoryResponse = jest.spyOn(
        StoryHelper.prototype,
        'buildStoryResponse'
      );
      buildStoryResponse.mockImplementation(() => {
        return Promise.resolve(new StoryResponse());
      });
      mockValidation.sort.mockReturnValue(publishedStories);
      mockMongo.readAllByValue.mockReturnValue(publishedStories);
      mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
        reactionCount: 5,
        userReaction: 'like'
      });
      await service.getAllStories(page, null);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should handle exception', async () => {
      const page: PageParam = {
        pageNumber: 1,
        pageSize: 10,
        sort: 1
      };
      mockMongo.readAllByValue.mockRejectedValue({ message: 'Not valid' });
      await service.getAllStories(page, null);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getStoryById', () => {
    it('Should return story data', async () => {
      const storyId = '618aa1950225310023a57011';
      const story = rawStories.filter((s) => s['_id'] === storyId);
      mockMongo.readByAggregate.mockReturnValue(story);
      mockMongo.readAllByValue.mockReturnValue([
        {
          _id: '612a49d3acd10700152ca963',
          blockedUser: '60b8b6abed14e40007431b06',
          blockingUser: '60646605a450020007eae236',
          createdDate: '2021-08-28T14:36:03.060Z'
        },
        {
          _id: '6135ff8c973ced0016e08d01',
          blockedUser: '6131f55a21815b0023ca6ac3',
          blockingUser: '6135fbdd1d561d001dbe7730',
          createdDate: '2021-09-06T11:46:20.020Z'
        }
      ]);
      const buildStoryResponse = jest.spyOn(
        StoryHelper.prototype,
        'buildStoryResponse'
      );
      buildStoryResponse.mockImplementation(() => {
        return Promise.resolve(new StoryResponse());
      });
      const addPromptOptionValue = jest.spyOn(
        StoryHelper.prototype,
        'addPromptOptionValue'
      );
      addPromptOptionValue.mockImplementation(() => {
        return Promise.resolve([]);
      });
      mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
        reactionCount: 5,
        userReaction: 'like'
      });
      await service.getStoryById(
        storyId,
        'userId',
        TranslationLanguage.ENGLISH
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('Should call create error with story does not exist message', async () => {
      const storyId = '618aa1950225310023a57011';
      mockMongo.readByAggregate.mockReturnValue([]);
      await service.getStoryById(
        storyId,
        'userId',
        TranslationLanguage.ENGLISH
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.storyDoesNotExist
      );
    });

    it('Should return story not published error', async () => {
      const storyId = '621cbcb7b558ef001d6ba3a7';
      const story = rawStories.filter((s) => s['_id'] === storyId);
      mockMongo.readByAggregate.mockReturnValue(story);
      await service.getStoryById(
        storyId,
        '61d49e744384dc002a286ccb',
        TranslationLanguage.ENGLISH
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.storyNotPublished
      );
    });

    it('should return exception', async () => {
      const storyId = '621cbcb7b558ef001d6ba3a7';
      mockMongo.readByAggregate.mockRejectedValue({ message: 'Exception' });
      await service.getStoryById(
        storyId,
        '61d49e744384dc002a286ccb',
        TranslationLanguage.ENGLISH
      );
      expect(mockILogger.error.mock.calls.length).toBe(1);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getStoryByUserId', () => {
    it('should return all user stories', async () => {
      const authorId = '62021eb615794e00237056b0';
      const userStories = rawStories.filter((s) => s.authorId === authorId);
      mockMongo.readByID.mockReturnValue(rawUser);
      mockMongo.readAllByValue.mockReturnValue(userStories);
      const removeBlockedContentForStories = jest.spyOn(
        StoryHelper.prototype,
        'removeBlockedContentForStories'
      );
      removeBlockedContentForStories.mockImplementation(() => {
        return Promise.resolve(userStories);
      });
      const buildStoryResponse = jest.spyOn(
        StoryHelper.prototype,
        'buildStoryResponse'
      );
      buildStoryResponse.mockImplementation(() => {
        return Promise.resolve(new StoryResponse());
      });
      mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
        reactionCount: 5,
        userReaction: 'like'
      });
      await service.getStoryByUserId(authorId);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return no user found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.getStoryByUserId('62021eb615794e00237056b0');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.userDoesNotExist
      );
    });

    it('should return story does not exist eror', async () => {
      const authorId = '62021eb615794e00237056b0';
      const userStories = rawStories.filter((s) => s.authorId === authorId);
      mockMongo.readByID.mockReturnValue(rawUser);
      mockMongo.readAllByValue.mockReturnValue(userStories);
      const removeBlockedContentForStories = jest.spyOn(
        StoryHelper.prototype,
        'removeBlockedContentForStories'
      );
      removeBlockedContentForStories.mockImplementation(() => {
        return Promise.resolve(null);
      });
      await service.getStoryByUserId(authorId);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.storyDoesNotExist
      );
    });

    it('should throw exception', async () => {
      mockMongo.readByID.mockRejectedValue({ message: 'Exception' });
      await service.getStoryByUserId('62021eb615794e00237056b0');
      expect(mockILogger.error.mock.calls.length).toBe(1);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('updateDisplayNameInStory', () => {
    it('should invoke updateQuery', async () => {
      mockMongo.updateManyByQuery.mockReturnValue({ modifiedCount: 1 });
      await service.updateDisplayNameInStory('userId', 'displayNmae');
      expect(mockMongo.updateManyByQuery.mock.calls.length).toBe(1);
    });

    it('should log error', async () => {
      mockMongo.updateManyByQuery.mockRejectedValue({ message: 'error' });
      await service.updateDisplayNameInStory('userId', 'displayNmae');
      expect(mockILogger.error.mock.calls.length).toBe(1);
    });
  });

  describe('updateStory', async () => {
    const storyModel: StoryModel = {
      id: '615c2f343ad4f8002b798af6',
      authorId: '615b154b6e6ce3002aed6a8f',
      authorAgeWhenStoryBegan: 0,
      relation: '',
      displayName: '',
      relationAgeWhenDiagnosed: 0,
      featuredQuote: '',
      storyText: '',
      communityId: '6214e8959aa982c0d09b40f5',
      isFeatureQuoteProfane: false,
      isStoryTextProfane: false,
      answers: [
        {
          id: '62150915a2b4334af6c5c7dd',
          promptId: '6215088617e4506761d18e61',
          question: 'What type of cancer was diagnosed?',
          sensitiveContentText: '',
          response: '5f189ba00d5f552cf445b8c2',
          order: 0,
          type: 'PromptQuestion',
          optionType: 'cancer',
          createdDate: new Date('2021-10-05T10:55:48.377Z'),
          isResponseProfane: false
        },
        {
          id: '615c2f343ad4f8002b798af5',
          promptId: '5f9c4e7afdfbb52b2c86c997',
          question: 'What was it like to learn the diagnosis?',
          sensitiveContentText: null,
          response: 'Test',
          order: 0,
          type: 'PromptQuestion',
          createdDate: new Date('2021-10-05T10:55:48.377Z'),
          isResponseProfane: false,
          optionType: undefined
        }
      ],
      allowComments: false
    };

    it('should update story', async () => {
      const story = rawStories.filter((s) => s['_id'] === storyModel.id)[0];
      mockMongo.readByValue.mockReturnValue(story);
      mockValidation.moderateStoryModelContent.mockReturnValue({
        moderationFlag: false
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockMongo.replaceByQuery.mockReturnValue(1);
      const buildStoryResponse = jest.spyOn(
        StoryHelper.prototype,
        'buildStoryResponse'
      );
      buildStoryResponse.mockImplementation(() => {
        return Promise.resolve(new StoryResponse());
      });
      const updateStoryInBinder = jest.spyOn(
        StoryHelper.prototype,
        'updateStoryInBinder'
      );
      updateStoryInBinder.mockImplementation(() => {
        return Promise.resolve(null);
      });
      await service.updateStory(storyModel);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error with communityId does not match', async () => {
      const storyData: StoryModel = {
        id: '615c2f343ad4f8002b798af6',
        authorId: '615b154b6e6ce3002aed6a8f',
        authorAgeWhenStoryBegan: 0,
        relation: '',
        displayName: '',
        relationAgeWhenDiagnosed: 0,
        featuredQuote: '',
        storyText: '',
        communityId: '6214e8959aa882c0d09b40f5',
        isFeatureQuoteProfane: false,
        isStoryTextProfane: false,
        answers: [
          {
            id: '62150915a2b4334af6c5c7dd',
            promptId: '6215088617e4506761d18e61',
            question: 'What type of cancer was diagnosed?',
            sensitiveContentText: '',
            response: '5f189ba00d5f552cf445b8c2',
            order: 0,
            type: 'PromptQuestion',
            optionType: 'cancer',
            createdDate: new Date('2021-10-05T10:55:48.377Z'),
            isResponseProfane: false
          },
          {
            id: '615c2f343ad4f8002b798af5',
            promptId: '5f9c4e7afdfbb52b2c86c997',
            question: 'What was it like to learn the diagnosis?',
            sensitiveContentText: null,
            response: 'Test',
            order: 0,
            type: 'PromptQuestion',
            createdDate: new Date('2021-10-05T10:55:48.377Z'),
            isResponseProfane: false,
            optionType: undefined
          }
        ],
        allowComments: false
      };
      const story = rawStories.filter((s) => s['_id'] === storyData.id)[0];
      mockMongo.readByValue.mockReturnValue(story);
      await service.updateStory(storyData);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.storyDoesNotExistInProvidedCommunity
      );
    });

    it('should return error with authorId does not exist', async () => {
      const storyData: StoryModel = {
        id: '615c2f343ad4f8002b798af6',
        authorId: '615b154b6e6ce3002aad6a8f',
        authorAgeWhenStoryBegan: 0,
        relation: '',
        displayName: '',
        relationAgeWhenDiagnosed: 0,
        featuredQuote: '',
        storyText: '',
        communityId: '6214e8959aa982c0d09b40f5',
        isFeatureQuoteProfane: false,
        isStoryTextProfane: false,
        answers: [
          {
            id: '62150915a2b4334af6c5c7dd',
            promptId: '6215088617e4506761d18e61',
            question: 'What type of cancer was diagnosed?',
            sensitiveContentText: '',
            response: '5f189ba00d5f552cf445b8c2',
            order: 0,
            type: 'PromptQuestion',
            optionType: 'cancer',
            createdDate: new Date('2021-10-05T10:55:48.377Z'),
            isResponseProfane: false
          },
          {
            id: '615c2f343ad4f8002b798af5',
            promptId: '5f9c4e7afdfbb52b2c86c997',
            question: 'What was it like to learn the diagnosis?',
            sensitiveContentText: null,
            response: 'Test',
            order: 0,
            type: 'PromptQuestion',
            createdDate: new Date('2021-10-05T10:55:48.377Z'),
            isResponseProfane: false,
            optionType: undefined
          }
        ],
        allowComments: false
      };
      const story = rawStories.filter((s) => s['_id'] === storyData.id)[0];
      mockMongo.readByValue.mockReturnValue(story);
      await service.updateStory(storyData);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.authorUpdateStoryEnforcementDetail
      );
    });

    it('should return story moderation error', async () => {
      const story = rawStories.filter((s) => s['_id'] === storyModel.id)[0];
      mockMongo.readByValue.mockReturnValue(story);
      mockValidation.moderateStoryModelContent.mockReturnValue({
        moderationFlag: true
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      await service.updateStory(storyModel);
      expect(mockResult.createExceptionWithValue.mock.calls.length).toBe(1);
    });

    it('should return story does not exist', async () => {
      mockMongo.readByValue.mockReturnValue(null);
      await service.updateStory(storyModel);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.storyDoesNotExist
      );
    });
  });

  describe('createAnswersForPrompt', () => {
    const answerModal: PromptAnswerModel = {
      storyId: '618aa1950225310023a57011',
      promptId: '607ed34c4b9db58c6e7ffa90',
      currentUserId: '61796cad30cd04002b54e39e',
      answer: 'Test Update',
      isPromptAnswerProfane: false,
      languageData: ''
    };

    const promptData: Prompt = {
      id: '5f9c5238fdfbb52b2c86c9b9',
      promptId: '5f9c5238fdfbb52b2c86c9b9',
      communityId: '607e7c99d0a2b533bb2ae3d2',
      question: 'What happened after that?',
      sectionTitle: 'Beyond',
      helpText: '',
      sensitiveContentText:
        "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
      createdDate: new Date('2020-10-30T17:49:44.009Z'),
      options: [],
      otherCancer: false
    };

    function mockGetStory(input) {
      const story = rawStories.filter((s) => s['_id'] === answerModal.storyId);
      mockMongo.readByAggregate.mockReturnValue(story);
      mockMongo.readAllByValue.mockReturnValue([
        {
          _id: '612a49d3acd10700152ca963',
          blockedUser: '60b8b6abed14e40007431b06',
          blockingUser: '60646605a450020007eae236',
          createdDate: '2021-08-28T14:36:03.060Z'
        },
        {
          _id: '6135ff8c973ced0016e08d01',
          blockedUser: '6131f55a21815b0023ca6ac3',
          blockingUser: '6135fbdd1d561d001dbe7730',
          createdDate: '2021-09-06T11:46:20.020Z'
        }
      ]);
      const buildStoryResponse = jest.spyOn(
        StoryHelper.prototype,
        'buildStoryResponse'
      );
      buildStoryResponse.mockImplementation(() => {
        return Promise.resolve(new StoryResponse());
      });
      const addPromptOptionValue = jest.spyOn(
        StoryHelper.prototype,
        'addPromptOptionValue'
      );
      addPromptOptionValue.mockImplementation(() => {
        return Promise.resolve([]);
      });
      mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
        reactionCount: 5,
        userReaction: 'like'
      });
      mockResult.createSuccess.mockReturnValue(
        input
          ? {
              data: {
                value: {
                  ...story[0],
                  id: answerModal.storyId
                }
              }
            }
          : {
              data: {
                value: null
              }
            }
      );
    }

    it('should successfully create answers', async () => {
      mockGetStory(true);
      const getPromptById = jest.spyOn(
        PromptService.prototype,
        'getPromptById'
      );
      getPromptById.mockImplementation(async () => {
        return Promise.resolve({
          data: {
            isSuccess: true,
            isException: false,
            value: promptData
          }
        });
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockValidation.moderatePromptAnswerModelContent.mockReturnValue({
        moderationFlag: false
      });
      mockMongo.updateByQuery.mockReturnValue(true);
      await service.createAnswersForPrompt(answerModal);
      expect(mockResult.createSuccess.mock.calls.length).toBe(2);
    });

    it('should return story not found', async () => {
      mockGetStory(false);
      const getPromptById = jest.spyOn(
        PromptService.prototype,
        'getPromptById'
      );
      getPromptById.mockImplementation(async () => {
        return Promise.resolve({
          data: {
            isSuccess: true,
            isException: false,
            value: promptData
          }
        });
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockValidation.moderatePromptAnswerModelContent.mockReturnValue({
        moderationFlag: false
      });
      mockMongo.updateByQuery.mockReturnValue(true);
      await service.createAnswersForPrompt(answerModal);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.storyDoesNotExist
      );
    });

    it('should return author not same issue', async () => {
      mockGetStory(true);
      const getPromptById = jest.spyOn(
        PromptService.prototype,
        'getPromptById'
      );
      getPromptById.mockImplementation(async () => {
        return Promise.resolve({
          data: {
            isSuccess: true,
            isException: false,
            value: promptData
          }
        });
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockValidation.moderatePromptAnswerModelContent.mockReturnValue({
        moderationFlag: false
      });
      mockMongo.updateByQuery.mockReturnValue(true);
      await service.createAnswersForPrompt({
        ...answerModal,
        currentUserId: 'userId'
      });
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.authorEditStoryQuestionsEnforcementDetail
      );
    });

    it('should return prompt does not exist', async () => {
      mockGetStory(true);
      const getPromptById = jest.spyOn(
        PromptService.prototype,
        'getPromptById'
      );
      getPromptById.mockImplementation(async () => {
        return Promise.resolve({
          data: {
            isSuccess: true,
            isException: false,
            value: null
          }
        });
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockValidation.moderatePromptAnswerModelContent.mockReturnValue({
        moderationFlag: false
      });
      mockMongo.updateByQuery.mockReturnValue(true);
      await service.createAnswersForPrompt(answerModal);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.promptDoesNotExist
      );
    });

    it('should return prompt does not exist', async () => {
      mockGetStory(true);
      const getPromptById = jest.spyOn(
        PromptService.prototype,
        'getPromptById'
      );
      getPromptById.mockImplementation(async () => {
        return Promise.resolve({
          data: {
            isSuccess: true,
            isException: false,
            value: { ...promptData, communityId: 'communityId' }
          }
        });
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockValidation.moderatePromptAnswerModelContent.mockReturnValue({
        moderationFlag: false
      });
      mockMongo.updateByQuery.mockReturnValue(true);
      await service.createAnswersForPrompt(answerModal);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.promptAndStoryAreDifferentCommunities
      );
    });

    it('should return question prompt empty', async () => {
      mockGetStory(true);
      const getPromptById = jest.spyOn(
        PromptService.prototype,
        'getPromptById'
      );
      getPromptById.mockImplementation(async () => {
        return Promise.resolve({
          data: {
            isSuccess: true,
            isException: false,
            value: promptData
          }
        });
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
      mockValidation.moderatePromptAnswerModelContent.mockReturnValue({
        moderationFlag: false
      });
      mockMongo.updateByQuery.mockReturnValue(true);
      await service.createAnswersForPrompt(answerModal);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.promptQuestionEmpty
      );
    });

    it('should return moderation error', async () => {
      mockGetStory(true);
      const getPromptById = jest.spyOn(
        PromptService.prototype,
        'getPromptById'
      );
      getPromptById.mockImplementation(async () => {
        return Promise.resolve({
          data: {
            isSuccess: true,
            isException: false,
            value: promptData
          }
        });
      });
      mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
      mockValidation.moderatePromptAnswerModelContent.mockReturnValue({
        moderationFlag: true,
        promptAnswerModel: 'error message'
      });
      mockMongo.updateByQuery.mockReturnValue(true);
      await service.createAnswersForPrompt(answerModal);
      expect(mockResult.createExceptionWithValue.mock.calls.length).toBe(1);
    });
  });

  // describe('flagStory', () => {
  //   it('should set flag for story', async () => {
  //     const storyId = '621cbcb7b558ef001d6ba3a7';
  //     const story = rawStories.filter((s) => s['_id'] === storyId);
  //     mockMongo.readByID.mockReturnValue(story[0]);
  //     mockMongo.updateByQuery.mockReturnValue(true);
  //     mockCommentHelper.reportToAdmin.mockReturnValue(true);
  //     mockNotificationHelper.notifyAdminOnFlagStory.mockReturnValue(true);
  //     await service.flagStory(storyId, '61d49e744374dc002a286ccb');
  //     expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  //   });
  // });

  describe('upserComment', () => {
    let htmlForStoryModeration;
    let sendEmailMessage;
    let createActivityObject;
    let createCommentObject;
    beforeEach(() => {
      htmlForStoryModeration = jest.spyOn(
        EmailService.prototype,
        'htmlForStoryModeration'
      );
      htmlForStoryModeration.mockImplementation(() => {
        return 'html body';
      });
      sendEmailMessage = jest.spyOn(EmailService.prototype, 'sendEmailMessage');
      sendEmailMessage.mockImplementation(() => {
        return Promise.resolve();
      });
      createActivityObject = jest.spyOn(
        PostsService.prototype,
        'createActivityObject'
      );
      APP.config.smtpSettings = {
        smtpServer: 'awsrelay.anthem.com',
        flagReviewEmail: 'ananya.k@legato.com',
        adminEmail: 'ananya.k@legato.com',
        fromEmailAddress: 'noreply@anthem.com',
        fromEmailName: 'SydneyCommunity',
        sendEmail: true,
        smtpPort: 587,
        apiPath: 'https://dev.api.sydney-community.com/public/v2/',
        adminUrl: 'https://dev.admin.sydney-community.com/',
        username: 'test',
        password: 'rest',
        service: 'test'
      };
      createCommentObject = jest.spyOn(
        CommentHelper.prototype,
        'createCommentObject'
      );
      createCommentObject.mockImplementation(() => {
        const id = new ObjectId();
        const commentModal = {
          author: {
            id: new ObjectId(),
            role: '',
            firstName: '',
            lastName: '',
            displayName: '',
            displayTitle: '',
            profileImage: ''
          },
          flagged: false,
          removed: false,
          reactions: {
            count: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0
            },
            log: []
          },
          createdAt: undefined,
          updatedAt: undefined,
          replies: [],
          isCommentTextProfane: false,
          flaggedUserLog: [],
          removedBy: '',
          id: id.toString(),
          _id: id.toString(),
          postId: '',
          comment: ''
        };
        return Promise.resolve(commentModal);
      });
    });

    it('should insert a comment in story', async () => {
      const commentPayload: StoryCommentRequest = {
        id: undefined,
        storyId: '621cbcb7b558ef001d6ba3a7',
        comment: 'Test Comment',
        isCommentTextProfane: false
      };
      const story = rawStories.filter(
        (s) => s['_id'] === commentPayload.storyId
      );
      mockMongo.readByValue.mockReturnValue(story);
      mockMongo.updateByQuery.mockReturnValue(1);
      const notifyUser = jest.spyOn(NotificationHelper.prototype, 'notifyUser');
      notifyUser.mockImplementation(() => Promise.resolve());
      mockValidation.identifySpecialKeyWords.mockReturnValue(false);
      await service.upsertComment(commentPayload, 'authorId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should faile to insert a comment in story', async () => {
      const commentPayload: StoryCommentRequest = {
        id: undefined,
        storyId: '621cbcb7b558ef001d6ba3a7',
        comment: 'Test Comment',
        isCommentTextProfane: false
      };
      const story = rawStories.filter(
        (s) => s['_id'] === commentPayload.storyId
      );
      mockMongo.readByValue.mockReturnValue(story);
      mockMongo.updateByQuery.mockReturnValue(0);
      await service.upsertComment(commentPayload, 'authorId');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.commentFailure
      );
    });

    it('should moderate story content', async () => {
      const commentPayload: StoryCommentRequest = {
        id: undefined,
        storyId: '621cbcb7b558ef001d6ba3a7',
        comment: 'Test Comment',
        isCommentTextProfane: false
      };
      const story = rawStories.filter(
        (s) => s['_id'] === commentPayload.storyId
      );
      mockMongo.readByValue.mockReturnValue(story);

      mockMongo.updateByQuery.mockReturnValue(1);
      const notifyUser = jest.spyOn(NotificationHelper.prototype, 'notifyUser');
      mockValidation.identifySpecialKeyWords.mockReturnValue(true);
      notifyUser.mockImplementation(() => Promise.resolve());

      //Story Content Monitor
      mockMongo.readByID.mockReturnValue({
        title: 'Test Title'
      });
      mockMongo.readAllByValue.mockReturnValue([
        {
          id: 'test1234'
        },
        {
          id: 'test4321'
        }
      ]);
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.upsertComment(commentPayload, 'authorId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should edit a comment in story', async () => {
      const commentPayload: StoryCommentRequest = {
        id: '61447d2597d29b001da45228',
        storyId: '621cbcb7b558ef001d6ba3a7',
        comment: 'Test Comment',
        isCommentTextProfane: false
      };
      const story = rawStories.filter(
        (s) => s['_id'] === commentPayload.storyId
      );
      mockMongo.readByValue.mockReturnValue(story);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockValidation.identifySpecialKeyWords.mockReturnValue(false);
      await service.upsertComment(commentPayload, 'authorId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should fail to edit a comment', async () => {
      const commentPayload: StoryCommentRequest = {
        id: '61447d2597d29b001da45228',
        storyId: '621cbcb7b558ef001d6ba3a7',
        comment: 'Test Comment',
        isCommentTextProfane: false
      };
      const story = rawStories.filter(
        (s) => s['_id'] === commentPayload.storyId
      );
      mockMongo.readByValue.mockReturnValue(story);
      mockMongo.updateByQuery.mockReturnValue(0);
      mockValidation.identifySpecialKeyWords.mockReturnValue(false);
      await service.upsertComment(commentPayload, 'authorId');
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.commentFailure
      );
    });

    it('should edit a commentand moderate content', async () => {
      const commentPayload: StoryCommentRequest = {
        id: '61447d2597d29b001da45228',
        storyId: '621cbcb7b558ef001d6ba3a7',
        comment: 'Test Comment',
        isCommentTextProfane: false
      };
      const story = rawStories.filter(
        (s) => s['_id'] === commentPayload.storyId
      );
      mockMongo.readByValue.mockReturnValue(story);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockValidation.identifySpecialKeyWords.mockReturnValue(true);
      //Story Content Monitor
      mockMongo.readByID.mockReturnValue({
        title: 'Test Title'
      });
      mockMongo.readAllByValue.mockReturnValue([
        {
          id: 'test1234'
        },
        {
          id: 'test4321'
        }
      ]);
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.upsertComment(commentPayload, 'authorId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });
  });

  describe('upsertReply', () => {
    let htmlForStoryModeration;
    let sendEmailMessage;
    let createActivityObject;
    let createCommentObject;
    let htmlForReplyForStory;
    const insertReply: StoryReplyRequest = {
      id: '',
      storyId: '615c29f0d435b70016b00209',
      comment: 'Test Reply',
      isCommentTextProfane: false,
      commentId: '61447cd997d29b001da45224'
    };
    const editReply: StoryReplyRequest = {
      id: '623c265642c8946087853f70',
      storyId: '615c29f0d435b70016b00209',
      comment: 'Test Reply',
      isCommentTextProfane: false,
      commentId: '61447cd997d29b001da45224'
    };
    const adminUser: Admin = {
      id: '',
      createdAt: undefined,
      updatedAt: undefined,
      role: 'scadmin',
      username: '',
      category: '',
      firstName: 'Test',
      lastName: 'Name',
      displayName: 'Admin',
      displayTitle: 'SCAdmin',
      profileImage: '',
      password: ''
    };

    beforeEach(() => {
      htmlForStoryModeration = jest.spyOn(
        EmailService.prototype,
        'htmlForStoryModeration'
      );
      htmlForStoryModeration.mockImplementation(() => {
        return 'html body';
      });
      htmlForReplyForStory = jest.spyOn(
        EmailService.prototype,
        'htmlForReplyForStory'
      );
      htmlForReplyForStory.mockImplementation(() => {
        return 'html body';
      });
      sendEmailMessage = jest.spyOn(EmailService.prototype, 'sendEmailMessage');
      sendEmailMessage.mockImplementation(() => {
        return Promise.resolve();
      });
      createActivityObject = jest.spyOn(
        PostsService.prototype,
        'createActivityObject'
      );
      APP.config.smtpSettings = {
        smtpServer: 'awsrelay.anthem.com',
        flagReviewEmail: 'ananya.k@legato.com',
        adminEmail: 'ananya.k@legato.com',
        fromEmailAddress: 'noreply@anthem.com',
        fromEmailName: 'SydneyCommunity',
        sendEmail: true,
        smtpPort: 587,
        apiPath: 'https://dev.api.sydney-community.com/public/v2/',
        adminUrl: 'https://dev.admin.sydney-community.com/',
        username: 'test',
        password: 'rest',
        service: 'test12'
      };
      createCommentObject = jest.spyOn(
        CommentHelper.prototype,
        'createCommentObject'
      );
      createCommentObject.mockImplementation(() => {
        const id = new ObjectId();
        const commentModal = {
          author: {
            id: new ObjectId(),
            role: '',
            firstName: '',
            lastName: '',
            displayName: '',
            displayTitle: '',
            profileImage: ''
          },
          flagged: false,
          removed: false,
          reactions: {
            count: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0
            },
            log: []
          },
          createdAt: undefined,
          updatedAt: undefined,
          replies: [],
          isCommentTextProfane: false,
          flaggedUserLog: [],
          removedBy: '',
          id: id.toString(),
          _id: id.toString(),
          postId: '',
          comment: ''
        };
        return Promise.resolve(commentModal);
      });
    });

    it('should add a new reply from admin user', async () => {
      const story = rawStories.filter((s) => s['_id'] === insertReply.storyId);
      mockMongo.readByValue.mockReturnValue(story[0]);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValueOnce(adminUser).mockReturnValue({
        title: 'Test Title'
      });
      mockValidation.identifySpecialKeyWords.mockReturnValue(false);
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.upsertReply(insertReply, '6135e075788db5002bc6743d');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return an error', async () => {
      const story = rawStories.filter((s) => s['_id'] === insertReply.storyId);
      mockMongo.readByValue.mockReturnValue(story[0]);
      mockMongo.updateByQuery.mockReturnValue(0);
      mockMongo.readByID.mockReturnValueOnce(adminUser).mockReturnValue({
        title: 'Test Title'
      });
      mockValidation.identifySpecialKeyWords.mockReturnValue(false);
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.upsertReply(insertReply, '6135e075788db5002bc6743d');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should add a new reply from app user', async () => {
      const story = rawStories.filter((s) => s['_id'] === insertReply.storyId);
      mockMongo.readByValue.mockReturnValue(story[0]);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue(null);
      mockValidation.identifySpecialKeyWords.mockReturnValue(false);
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.upsertReply(insertReply, '6135e075788db5002bc6743d');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should add a new reply from admin user with moderation', async () => {
      const story = rawStories.filter((s) => s['_id'] === insertReply.storyId);
      mockMongo.readByValue.mockReturnValue(story[0]);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValueOnce(adminUser).mockReturnValue({
        title: 'Test Title'
      });
      mockValidation.identifySpecialKeyWords.mockReturnValue(true);
      mockMongo.readAllByValue.mockReturnValue([
        {
          id: 'test1234'
        },
        {
          id: 'test4321'
        }
      ]);
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.upsertReply(insertReply, '6135e075788db5002bc6743d');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should edit a reply', async () => {
      const story = rawStories.filter((s) => s['_id'] === editReply.storyId);
      mockMongo.readByValue.mockReturnValue(story[0]);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockValidation.identifySpecialKeyWords.mockReturnValue(true);
      mockMongo.readAllByValue.mockReturnValue([
        {
          id: 'test1234'
        },
        {
          id: 'test4321'
        }
      ]);
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.upsertReply(editReply, '6135e075788db5002bc6743d');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should fail to edit a reply', async () => {
      const story = rawStories.filter((s) => s['_id'] === editReply.storyId);
      mockMongo.readByValue.mockReturnValue(story[0]);
      mockMongo.updateByQuery.mockReturnValue(0);
      await service.upsertReply(editReply, '6135e075788db5002bc6743d');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });

  describe('upsertReaction', () => {
    const commentReactionInput: StoryReactionRequest = {
      storyId: '615c29f0d435b70016b00209',
      reaction: 'like',
      type: 'comment',
      commentId: '61447cd997d29b001da45224',
      replyId: undefined,
      language: ''
    };
    const adminUser: Admin = {
      id: '',
      createdAt: undefined,
      updatedAt: undefined,
      role: 'scadmin',
      username: '',
      category: '',
      firstName: 'Test',
      lastName: 'Name',
      displayName: 'Admin',
      displayTitle: 'SCAdmin',
      profileImage: '',
      password: ''
    };

    beforeEach(() => {
      const handleStoryReactions = jest.spyOn(
        ReactionHelper.prototype,
        'handleStoryReactions'
      );
      handleStoryReactions.mockImplementation(() => {
        const react: Reaction = {
          count: {
            like: 2,
            care: 0,
            celebrate: 0,
            good_idea: 0,
            total: 2
          },
          log: []
        };
        return Promise.resolve(react);
      });
      const notifyUser = jest.spyOn(NotificationHelper.prototype, 'notifyUser');
      notifyUser.mockImplementation(() => Promise.resolve());

      const createActivityObject = jest.spyOn(
        PostsService.prototype,
        'createActivityObject'
      );
      createActivityObject.mockImplementation(() => {
        return Promise.resolve();
      });
    });

    it('should create a comment reaction', async () => {
      const story = rawStories.filter(
        (s) => s['_id'] === commentReactionInput.storyId
      );
      mockMongo.readByValue.mockReturnValue(story[0]);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByAggregate.mockReturnValue(story[0]);
      await service.upsertReaction(
        commentReactionInput,
        false,
        '6135e075788db5002bc6743d'
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should give error comment does not exist', async () => {
      mockMongo.readByValue.mockReturnValue(null);
      await service.upsertReaction(
        commentReactionInput,
        false,
        '6135e075788db5002bc6743d'
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(
        API_RESPONSE.messages.commentDoesNotExist
      );
    });
  });

  describe('deleteStoryById', () => {
    it('should return success', async () => {
      mockMongo.readByValue.mockReturnValue(rawStories[0]);
      mockMongo.delete.mockReturnValue(true);
      const removeStoryActivity = jest.spyOn(
        StoryHelper.prototype,
        'removeStoryActivity'
      );
      removeStoryActivity.mockImplementation(() => {
        return Promise.resolve();
      });
      await service.deleteStoryById('6135e075788db5002bc6743d', 'userId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return no story error', async () => {
      mockMongo.readByValue.mockReturnValue(null);
      await service.deleteStoryById('6135e075788db5002bc6743d', 'userId');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should throw an exception', async () => {
      mockMongo.readByValue.mockRejectedValue({ message: 'error' });
      await service.deleteStoryById('6135e075788db5002bc6743d', 'userId');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
