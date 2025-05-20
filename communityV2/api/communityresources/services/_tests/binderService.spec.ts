import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockMongo, mockResult, mockUserHelper, mockValidation } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { BinderArticleModel, BinderResourceModel, BinderStoryModel } from 'api/communityresources/models/binderModel';
import { BinderService } from '../binderService';
import { UserHelper } from '../helpers/userHelper';
import { StoryService } from '../storyService';

describe('BinderService', () => {
  let svc;

  beforeEach(() => {
    svc = new BinderService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockValidation,
      <any>mockUserHelper,
      <any>mockILogger
    );
    const buildProfilePicturePath = jest.spyOn(UserHelper.prototype, 'buildProfilePicturePath');
    buildProfilePicturePath.mockImplementation(() => Promise.resolve(null));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const binderData = require('./data/binder.json');
  const user = {
    _id: '5f99844130b711000703cd74',
    firstName: 'GA',
    lastName: 'JONES',
    username: '~sit3gajones',
    gender: 'Male',
    genderRoles: null,
    age: 42,
    profilePicture:
      'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/5f99844130b711000703cd74',
    myCommunities: [
      '5f07537bc12e0c22d00f5d21',
      '5f22db56a374bc4e80d80a9b',
      '5f0e744536b382377497ecef',
      '5f189ba00d5f552cf445b8c2',
      '5f0753f6c12e0c22d00f5d23',
      '5f0753b7c12e0c22d00f5d22'
    ],
    active: true,
    hasAgreedToTerms: false
  };

  const post = {
    communities: [
      "5f245386aa271e24b0c6fd88",
    ],
    content: {
      en: {
        title: "Fresh New post 22",
        body: "New post body.",
        link: "",
        deepLink: "",
      },
      es: {
        title: "",
        body: "",
        link: "",
        deepLink: "",
      },
      image: "",
    },
    createdDate: "2022-01-11T07:31:44.112Z",
    updatedDate: "2022-01-11T07:31:44.112Z",
    published: true,
    isNotify: true,
    hasContentBeenPublishedOnce: false,
    flagged: false,
    removed: false,
    author: {
      firstName: "Raven",
      lastName: "P",
      displayName: "Raven P",
      role: "scadvocate",
      id: "61b21e9c26dbb012b69cf67f",
      profileImage: "",
      displayTitle: "Community Advocate",
    },
    comments: [
      {
        _id: "61e1593ced4916dc990d7b5e",
        comment: "Admin Comment",
        createdAt: "2022-01-14T11:06:36.215Z",
        updatedAt: "2022-01-14T11:06:36.215Z",
        flagged: false,
        removed: false,
        author: {
          id: "61b21e9c26dbb012b69cf67f",
          firstName: "Raven",
          lastName: "P",
          displayName: "Raven P",
          displayTitle: "Community Advocate",
          profileImage: "",
          role: "scadvocate"
        },
        replies: [
          {
            _id: "61e15962ed4916dc990d7b5f",
            comment: "Admin Comment",
            createdAt: "2022-01-14T11:07:14.535Z",
            updatedAt: "2022-01-14T11:07:14.535Z",
            flagged: false,
            removed: false,
            author: {
              id: "61b21e9c26dbb012b69cf67f",
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              displayTitle: "Community Advocate",
              profileImage: "",
              role: "scadvocate"
            }
          }
        ]
      }
    ],
    id: "61b21e9c26dbb012b69cf67f"
  };

  const individualBinderPost = {
    communities: [
      "5f245386aa271e24b0c6fd88",
    ],
    content: {
      en: {
        title: "title",
        body: "New post body.",
        link: "",
        deepLink: "",
      },
      es: {
        title: "",
        body: "",
        link: "",
        deepLink: "",
      },
      image: "",
    },
    createdDate: "2022-01-11T07:31:44.112Z",
    updatedDate: "2022-01-11T07:31:44.112Z",
    published: true,
    isNotify: true,
    hasContentBeenPublishedOnce: false,
    flagged: false,
    removed: false,
    author: {
      firstName: "Ananya",
      lastName: "",
      displayName: "",
      role: "scadmin",
      id: "622b417fb3add3c1b5cb1c84",
      profileImage: "",
      displayTitle: "Sydney Community",
    },
    id: "624fe23cb0877b401745361b"
  };

  describe('addPostToBinder', () => {
    it('Should add a post to Binder', async () => {
      const expRes = {
        data: {
          isSuccess: true,
          isException: false,
          value: {
            userId: '60646605a450020007eae236',
            binderStories: [],
            binderArticles: [
              {
                articleId: 'acj2976',
                createdDate: '2021-08-17T10:14:37.278Z',
                articleTitle: 'How is anal cancer treated? ',
                articleLink: '/v1/api/HealthWise/ArticleTopic/acj2976',
                articleThumbnail: ''
              },
              {
                articleId: '5ff33bb977b01e2046c36a14',
                createdDate: '2021-08-25T07:29:11.779Z',
                articleTitle: 'Toileting and Bathroom Care',
                articleLink:
                  '/v1/api/HealthWise/ArticleTopic/5ff33bb977b01e2046c36a14',
                articleThumbnail: ''
              }
            ],
            binderResources: [
              {
                resourceId: 'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0',
                resourceCategory: 'disease management',
                resourceTitle: 'Home Health ',
                providerName: 'Random',
                createdDate: '2021-08-23T11:04:43.149Z'
              },
              {
                resourceId:
                  'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICArODWhwkM',
                resourceCategory: 'emergency food',
                resourceTitle: 'The Food Resource Network Federation',
                providerName: 'The Food Resource Network Federation',
                createdDate: '2021-08-25T12:02:16.062Z'
              }
            ],
            binderPosts: [
              {
                "postId": "624fe23cb0877b401745361b",
                "publishedAt": "2022-04-08T07:20:28.147Z",
                "communities": [
                    "6214e8959aa982c0d09b40f5"
                ],
                "title": {
                    "en": "title",
                    "es": ""
                },
                "author": {
                    "firstName": "Ananya",
                    "displayName": "",
                    "profileImage": "",
                    "role": "scadmin",
                    "displayTitle": "Sydney Community",
                    "id": "622b417fb3add3c1b5cb1c84"
                }
              },
              {
                communities: [
                  "5f245386aa271e24b0c6fd88",
                ],
                id: "61b21e9c26dbb012b69cf67f",
                title: {
                  en: "Fresh New post 22",
                  es: ""
                },
                "author": {
                  "firstName": "Raven",
                  "displayName": "Raven P",
                  "profileImage": "",
                  "role": "scadvocate",
                  "displayTitle": "Community Advocate",
                  "id": "61b21e9c26dbb012b69cf67f"
                },
                "postId": "624fe23cb0877b401745361b",
                "publishedAt": "2022-04-08T07:20:28.147Z",
              }
            ],
            id: '61b21e9c26dbb012b69cf67f'
          }
        }
      };
      mockMongo.readByID.mockReturnValueOnce(user)
        .mockReturnValueOnce(post)
        .mockReturnValue(individualBinderPost);
      mockMongo.readByValue.mockReturnValueOnce(binderData.success).mockReturnValue(null);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(expRes);
      const actualRes = await svc.addPostToBinder({
        userId: "5f99844130b711000703cd74",
        postId: "61b21e9c26dbb012b69cf67f"
      });
      expect(actualRes).toEqual(expRes);
    });

    it('should return user not found', async () => {
      const expRes = {
        data: {
          isSuccess: false,
          isException: false,
          errors: [
            {
              id: '2c344a0b-93fd-09ab-832b-20ddc53ae6db',
              errorCode: API_RESPONSE.statusCodes[400],
              title: API_RESPONSE.messages.badModelTitle,
              detail: API_RESPONSE.messages.userDoesNotExist
            }
          ]
        }
      };
      mockMongo.readByID.mockReturnValue(null);
      mockResult.createError.mockReturnValue(expRes);
      const actualRes = await svc.addPostToBinder({
        userId: "5f99844130b711000703cd74",
        postId: "61b21e9c26dbb012b69cf67f"
      });
      expect(actualRes).toEqual(expRes);
    });

    it('should return post not found', async () => {
      const expRes = {
        data: {
          isSuccess: false,
          isException: false,
          errors: [
            {
              id: '2c344a0b-93fd-09ab-832b-20ddc53ae6db',
              errorCode: API_RESPONSE.statusCodes[400],
              title: API_RESPONSE.messages.badModelTitle,
              detail: API_RESPONSE.messages.postDoesNotExist
            }
          ]
        }
      };
      mockMongo.readByID.mockReturnValueOnce(user).mockReturnValue(null);
      mockResult.createError.mockReturnValue(expRes);
      const actualRes = await svc.addPostToBinder({
        userId: "5f99844130b711000703cd74",
        postId: "61b21e9c26dbb012b69cf67f"
      });
      expect(actualRes).toEqual(expRes);
    });

    it('should return binder already exists', async () => {
      const expRes = {
        data: {
          isSuccess: false,
          isException: false,
          errors: [
            {
              id: '2c344a0b-93fd-09ab-832b-20ddc53ae6db',
              errorCode: API_RESPONSE.statusCodes[400],
              title: API_RESPONSE.messages.badData,
              detail: API_RESPONSE.messages.postAlreadyExistsInBinder
            }
          ]
        }
      };
      mockMongo.readByID.mockReturnValueOnce(user).mockReturnValue(post);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      mockResult.createError.mockReturnValue(expRes);
      const actualRes = await svc.addPostToBinder({
        userId: "5f99844130b711000703cd74",
        postId: "624fe23cb0877b401745361b"
      });
      expect(actualRes).toEqual(expRes);
    });

    it('no existing post', async () => {
      const expRes = {
        data: {
          isSuccess: true,
          isException: false,
          value: {
            userId: '60646605a450020007eae236',
            binderStories: [],
            binderArticles: [
              {
                articleId: 'acj2976',
                createdDate: '2021-08-17T10:14:37.278Z',
                articleTitle: 'How is anal cancer treated? ',
                articleLink: '/v1/api/HealthWise/ArticleTopic/acj2976',
                articleThumbnail: ''
              },
              {
                articleId: '5ff33bb977b01e2046c36a14',
                createdDate: '2021-08-25T07:29:11.779Z',
                articleTitle: 'Toileting and Bathroom Care',
                articleLink:
                  '/v1/api/HealthWise/ArticleTopic/5ff33bb977b01e2046c36a14',
                articleThumbnail: ''
              }
            ],
            binderResources: [
              {
                resourceId: 'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0',
                resourceCategory: 'disease management',
                resourceTitle: 'Home Health ',
                providerName: 'Random',
                createdDate: '2021-08-23T11:04:43.149Z'
              },
              {
                resourceId:
                  'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICArODWhwkM',
                resourceCategory: 'emergency food',
                resourceTitle: 'The Food Resource Network Federation',
                providerName: 'The Food Resource Network Federation',
                createdDate: '2021-08-25T12:02:16.062Z'
              }
            ],
            binderPosts: [
              {
                communities: [
                  "5f245386aa271e24b0c6fd88",
                ],
                id: "61b21e9c26dbb012b69cf67f",
                title: {
                  en: "Fresh New post 22",
                  es: ""
                },
                "author": {
                  "firstName": "Raven",
                  "displayName": "Raven P",
                  "profileImage": "",
                  "role": "scadvocate",
                  "displayTitle": "Community Advocate",
                  "id": "61b21e9c26dbb012b69cf67f"
                },
                "postId": "624fe23cb0877b401745361b",
                "publishedAt": "2022-04-08T07:20:28.147Z",
              }
            ],
            id: '61b21e9c26dbb012b69cf67f'
          }
        }
      };
      mockMongo.readByID.mockReturnValueOnce(user).mockReturnValue(post);
      mockMongo.readByValue.mockReturnValue(binderData.binderWithoutPost);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(expRes);
      const actualRes = await svc.addPostToBinder({
        userId: "5f99844130b711000703cd74",
        postId: "61b21e9c26dbb012b69cf67f"
      });
      expect(actualRes).toEqual(expRes);
    });
  });

  describe('removePostFromBinder', () => {
    it('should return expected value', async () => {
      const expRes = {
        data: {
          isSuccess: true,
          isException: false,
          value: true
        }
      };
      mockMongo.updateByQuery.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(expRes);
      const actualRes = await svc.removePostFromBinder({
        userId: "5f99844130b711000703cd74",
        postId: "624fe23cb0877b401745361b"
      });
      expect(actualRes).toEqual(expRes);
    });

    it('should return error', async () => {
      const expRes = {
        data: {
          isSuccess: true,
          isException: false,
          value: false
        }
      };

      mockMongo.updateByQuery.mockReturnValue(0);
      mockResult.createSuccess.mockReturnValue(expRes);
      const actualRes = await svc.removePostFromBinder({
        userId: "5f99844130b711000703cd74",
        postId: "624fe23cb0877b401745361b"
      });
      expect(actualRes).toEqual(expRes);
    });
  });

  describe('removeStoryFromBinder', () => {
    const removeStoryInput: BinderStoryModel = {
      userId: '5ff33bb977b01e2046c36a14',
      storyId: '62d91caef1f7370023f4716b'
    };

    it('should call createSuccess', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.removeStoryFromBinder(removeStoryInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error after creating binder', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(null);
      mockMongo.insertValue.mockReturnValue(binderData.newBinder);
      await svc.removeStoryFromBinder(removeStoryInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await svc.removeStoryFromBinder(removeStoryInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });

    it('should return story does not exist in binder', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.binderWithoutStories);
      await svc.removeStoryFromBinder(removeStoryInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.storyDoesNotExistInBinder);
    });

    it('should create an exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await svc.removeStoryFromBinder(removeStoryInput);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('addStoryToBinder', async () => {
    const addStoryInput: BinderStoryModel = {
      storyId: '6188e1d94dd042001c6151a1',
      userId: '5ff33bb977b01e2046c36a14'
    };

    it('should return success message', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.binderWithoutStories);
      const getStory = jest.spyOn(StoryService.prototype, 'getStoryById');
      getStory.mockImplementation(() => Promise.resolve(binderData.storyData));
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.addStoryToBinder(addStoryInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return user does not exist error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await svc.addStoryToBinder(addStoryInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });

    it('should return story does not exist', async () => {
      mockMongo.readByID.mockReturnValue(user);
      const getStory = jest.spyOn(StoryService.prototype, 'getStoryById');
      getStory.mockImplementation(() => Promise.resolve({
        data: {
          isSuccess: false,
          isException: false,
          value: null
        }
      }));
      await svc.addStoryToBinder(addStoryInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.storyDoesNotExist);
    });

    it('should return story already exist in binder error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      const getStory = jest.spyOn(StoryService.prototype, 'getStoryById');
      getStory.mockImplementation(() => Promise.resolve(binderData.storyData));
      mockMongo.readByValue.mockReturnValue(binderData.success);
      await svc.addStoryToBinder(addStoryInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.storyAlreadyExistsInBinder);
    });

    it('should return user cannot add own story error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      const getStory = jest.spyOn(StoryService.prototype, 'getStoryById');
      getStory.mockImplementation(() => Promise.resolve(binderData.storyData));
      await svc.addStoryToBinder({...addStoryInput, userId: binderData.storyData.data.value.authorId});
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userCannotAddOwnStoryToBinder);
    });

    it('should create an exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await svc.addStoryToBinder(addStoryInput);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('removeArticleFromBinder', async () => {
    const articleInput: BinderArticleModel = {
      articleId: 'acj2976',
      link: '',
      articleLink: '',
      articleThumbnail: '',
      articleTitle: '',
      userId: '5f99844130b711000703cd74'
    };

    it('should return a success message', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.removeArticleFromBinder(articleInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return a exception message', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'error'
      });
      await svc.removeArticleFromBinder(articleInput);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await svc.removeArticleFromBinder(articleInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });

    it('should article does not exist error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.newBinder);
      await svc.removeArticleFromBinder(articleInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.articleDoesNotExistInBinder);
    });

    it('should return article does not exist error - 2', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.binderWithoutArticle);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.removeArticleFromBinder(articleInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.articleDoesNotExistInBinder);
    });
  });

  describe('addArticleToBinder', () => {
    const addArticleInput: BinderArticleModel = {
      articleId: 'articleId',
      link: '',
      articleLink: 'articleLink',
      articleThumbnail: '',
      articleTitle: '',
      userId: '5f99844130b711000703cd74'
    };

    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.newBinder);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.addArticleToBinder(addArticleInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'Error Occured'
      });
      await svc.addArticleToBinder(addArticleInput);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await svc.addArticleToBinder(addArticleInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });

    it('should return article exist in binder error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.addArticleToBinder({...addArticleInput, articleId: '5ff33bb977b01e2046c36a14'});
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.articleAlreadyExistsInBinder);
    });
  });

  describe('removeResourceFromBinder', () => {
    const removeBinderInput: BinderResourceModel = {
      resourceId: 'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICArODWhwkM',
      resourceTitle: '',
      resourceCategory: '',
      providerName: '',
      userId: ''
    };

    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.removeResourceFromBinder(removeBinderInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return resource does not exist error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      await svc.removeResourceFromBinder(removeBinderInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.resourceDoesNotExistInBinder);
    });

    it('should throw an exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'Error Occured'
      });
      await svc.removeResourceFromBinder(removeBinderInput);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await svc.removeResourceFromBinder(removeBinderInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });

    it('should return resource does not exist error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.binderWithoutResources);
      await svc.removeResourceFromBinder(removeBinderInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.resourceDoesNotExistInBinder);
    });
  });

  describe('addResourceToBinder', () => {
    const addBinderInput: BinderResourceModel = {
      resourceId: 'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICArODWhwkM',
      resourceTitle: '',
      resourceCategory: '',
      providerName: '',
      userId: ''
    };

    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.addResourceToBinder(addBinderInput);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return resource already exists error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.success);
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.addResourceToBinder(addBinderInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.resourceAlreadyExistsInBinder);
    });

    it('should throw an exception', async () => {
      mockMongo.readByID.mockRejectedValue({
        message: 'Error Occured'
      });
      await svc.addResourceToBinder(addBinderInput);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });

    it('should return user not found error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await svc.addResourceToBinder(addBinderInput);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist);
    });
  });

  describe('getBinderByUser', () => {
    it('should return success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(binderData.newBinder);
      await svc.getBinderByUser('5f99844130b711000703cd74', 1);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });
  });
});
