import { API_RESPONSE } from '@anthem/communityapi/common';
import {
  mockBinder,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import {
  BinderArticleModel,
  BinderPostModel,
  BinderResourceModel,
  BinderStoryModel
} from 'api/communityresources/models/binderModel';
import { BinderController } from '../binderController';

describe('BinderController', () => {
  let ctrl: BinderController;

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new BinderController(
      <any>mockBinder,
      <any>mockValidation,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // getBinderByUser
  it('Should Return Binder Info for a specific User', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: '6131f55a21815b0023ca6ac3',
          binderStories: [
            {
              storyId: '6131ea2e028e2600237066a0',
              createdDate: '2021-09-03T14:25:10.986Z',
              profilePicture:
                'https://sit.api.sydney-community.com/v2/users/profileImageString/https://sit.api.sydney-community.com/community/communityresources/v2/users/profileImageString/61309910358d7100162b8613',
              firstName: 'VEN',
              communityTitle: 'Metastatic or Recurrent Breast Cancer',
              displayName: 'Lckuy',
              authorAgeWhenStoryBegan: 22,
              featuredQuote: 'Life is short',
              relation: 'Myself',
              relationAgeWhenDiagnosed: 22
            },
            {
              storyId: '6135fca7c3da23001d9bbb1b',
              createdDate: '2021-09-06T11:37:13.989Z',
              profilePicture:
                'https://sit.api.sydney-community.com/v2/users/profileImageString/https://sit.api.sydney-community.com/community/communityresources/v2/users/profileImageString/6135fbdd1d561d001dbe7730',
              firstName: 'MASON',
              communityTitle: 'Oral Cancer',
              displayName: 'MAy',
              authorAgeWhenStoryBegan: 33,
              featuredQuote: 'Everything you need',
              relation: 'Myself',
              relationAgeWhenDiagnosed: 33
            }
          ],
          binderArticles: [
            {
              articleId: 'ack3491',
              createdDate: '2021-09-03T11:39:58.830Z',
              articleTitle: '6 Tips to Help Your Teen Manage Money',
              articleLink: '/v2/healthWise/videoTopic/ack3491',
              articleThumbnail:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/ack3491/SD/ack3491.jpg'
            },
            {
              articleId: 'abo2085',
              createdDate: '2021-09-03T11:40:19.992Z',
              articleTitle: 'Fitness: Moving More',
              articleLink: '/v2/healthWise/videoTopic/abo2085',
              articleThumbnail:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abo2085/SD/abo2085.jpg'
            },
            {
              articleId: 'abp6265',
              createdDate: '2021-09-06T11:51:37.220Z',
              articleTitle: 'Cancer: When You First Find Out',
              articleLink:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/E0/abp6265.mp4',
              articleThumbnail:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/abp6265.jpg'
            },
            {
              articleId: 'abq0092',
              createdDate: '2021-09-06T11:56:56.769Z',
              articleTitle: 'Healthy Weight: What Works',
              articleLink:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abq0092/SD/E0/abq0092.mp4',
              articleThumbnail:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abq0092/SD/abq0092.jpg'
            },
            {
              articleId: 'abu6891',
              createdDate: '2021-09-16T15:22:21.258Z',
              articleTitle: 'Why is it important to turn a person in bed?',
              articleLink: '/v2/healthWise/articleTopic/abu6891',
              articleThumbnail: ''
            },
            {
              articleId: 'abp6273',
              createdDate: '2021-09-16T15:22:49.388Z',
              articleTitle: 'Cancer: Understanding Your Feelings',
              articleLink:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6273/SD/E0/abp6273.mp4',
              articleThumbnail:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6273/SD/abp6273.jpg'
            }
          ],
          binderResources: [
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICAiJTpxAgM',
              resourceCategory: 'help hotlines',
              resourceTitle: 'Cancer Legal Resource Center',
              providerName: ' Disability Rights Legal Center',
              createdDate: '2021-09-06T12:34:35.702Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA9cjnkwkM',
              resourceCategory: 'help pay for housing',
              resourceTitle: 'Shelter Plus Care Program',
              providerName: 'New Choices Recovery Center',
              createdDate: '2021-09-16T15:20:10.543Z'
            }
          ]
        }
      }
    };
    mockValidation.isHex.mockResolvedValueOnce(true);
    mockBinder.getBinderByUser.mockResolvedValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    const data = await ctrl.getBinderByUser('615adaaba0e10b0023ad3639', 1);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while creating Binder specific User', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Incorrect id',
            detail: 'This is not a valid id'
          }
        ]
      }
    };
    mockValidation.isHex.mockClear();
    mockValidation.isHex.mockReturnValueOnce(false);
    mockResult.createError.mockResolvedValue(expRes);
    const data = await ctrl.getBinderByUser('615adaaba0e10b0023ad3639', 1);
    expect(data).toEqual(expRes);
  });

  // addReSource
  it('Should Return Binder Info after adding resources to their binder', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          _id: '6005ada2fe2c4ddb9d070ff2',
          UserId: '6005ada2fe2c4ddb9d070ff2',
          BinderStories: [],
          BinderResources: [
            {
              ResourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA8MrU7AkM',
              ResourceCategory: 'health education',
              ResourceTitle: 'Testicular Cancer Society',
              CreatedDate: '2021-01-19T16:21:38.884Z'
            }
          ],
          BinderArticles: []
        }
      }
    };

    const binderModel: BinderResourceModel = {
      resourceId: 'resourceId',
      resourceTitle: 'resourceTitle',
      resourceCategory: 'resourceCategory',
      providerName: 'providerName',
      userId: 'userId'
    };
    mockValidation.isValidForResourceBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.addResourceToBinder.mockReturnValue(expRes);
    const data = await ctrl.addResource(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should Return error while removing resources to their binder', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '2c344a0b-93fd-09ab-832b-20ddc53ae6db',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'ResourceId is required'
          }
        ]
      }
    };

    const binderModel: BinderResourceModel = {
      resourceId: '',
      resourceTitle: 'resourceTitle',
      resourceCategory: 'resourceCategory',
      providerName: 'providerName',
      userId: '600e80a9b5935a804f38c3d1'
    };
    mockValidation.isValidForResourceBinder.mockReturnValue({
      validationResult: false,
      reason: 'ResourceId is required'
    });
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.addResource(binderModel);
    expect(data).toEqual(expRes);
  });

  // removeResource
  it('Should Return Binder Info after removing resources to their binder', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          _id: '6005ada2fe2c4ddb9d070ff2',
          UserId: '6005ada2fe2c4ddb9d070ff2',
          BinderStories: [],
          BinderResources: [
            {
              ResourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICAzIXDsQoM',
              ResourceTitle:
                'The Grove City Food Pantry and Emergency Services ',
              ResourceCategory: 'emergency payments',
              ProviderName: null,
              CreatedDate: '2020-12-04T11:01:41.248Z'
            },
            {
              ResourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA6YeQhQsM',
              ResourceTitle: 'Summer Job Program',
              ResourceCategory: 'skills & training',
              ProviderName: null,
              CreatedDate: '2020-12-04T11:03:37.486Z'
            }
          ],
          BinderArticles: []
        }
      }
    };

    const binderModel: BinderResourceModel = {
      resourceId: 'resourceId',
      resourceTitle: 'resourceTitle',
      resourceCategory: 'resourceCategory',
      providerName: 'providerName',
      userId: 'userId'
    };
    mockValidation.isValidForResourceBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.removeResourceFromBinder.mockReturnValue(expRes);
    const data = await ctrl.removeResource(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should produce error while remove resource from Binder Info for a specific User', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Incorrect id',
            detail: 'This is not a valid id'
          }
        ]
      }
    };
    mockValidation.isValidForResourceBinder.mockReturnValue({
      validationResult: false
    });
    mockBinder.removeResourceFromBinder.mockResolvedValue(expRes);
    mockResult.createError.mockReturnValue(expRes);
    const binderModel: BinderResourceModel = {
      resourceId: 'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgIDQ5tvm9QoM',
      resourceTitle: 'API Food Pantry',
      resourceCategory: 'emergency food',
      providerName: 'API Food Center of Beverly Hills',
      userId: '60646605a450020007eae236'
    };
    const data = await ctrl.removeResource(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should produce error while remove resource from Binder Info for a specific User', async () => {
    mockValidation.isValidForResourceBinder.mockImplementation(() => {
      throw Error()
    });
    mockBinder.removeResourceFromBinder.mockResolvedValue(false);
    mockResult.createException.mockReturnValue(false);
    const binderModel: BinderResourceModel = {
      resourceId: 'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgIDQ5tvm9QoM',
      resourceTitle: 'API Food Pantry',
      resourceCategory: 'emergency food',
      providerName: 'API Food Center of Beverly Hills',
      userId: '60646605a450020007eae236'
    };
    await ctrl.removeResource(binderModel);
  });

  // Add Article
  it('Should Return Binder Info after adding Article to their binder', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          _id: '600e80a9b5935a804f38c3d1',
          UserId: '6005ada2fe2c4ddb9d070ff2',
          BinderStories: [],
          BinderArticles: [
            {
              ArticleId:
                '/v1/api/Library/ReferenceContent/5f8ef847326b36caf106b9c6/Cardiologist',
              CreatedDate: '2021-01-25T12:19:04.231Z',
              ArticleTitle: 'Cardiologist',
              ArticleLink:
                '/v1/api/Library/ReferenceContent/5f8ef847326b36caf106b9c6/Cardiologist',
              ArticleThumbnail: ''
            }
          ],
          BinderResources: []
        }
      }
    };

    const binderModel: BinderArticleModel = {
      userId: '6005ada2fe2c4ddb9d070ff2',
      articleId: 'articleId',
      articleLink: 'articleLink',
      articleThumbnail: 'articleThumbnail',
      articleTitle: 'articleTitle',
      link: ''
    };
    mockValidation.isValidForArticleBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.addArticleToBinder.mockReturnValue(expRes);
    const data = await ctrl.addArticle(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while adding Article to their binder', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '2c344a0b-93fd-09ab-832b-20ddc53ae6db',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'ArticleId is required'
          }
        ]
      }
    };

    const binderModel: BinderArticleModel = {
      userId: '6005ada2fe2c4ddb9d070ff2',
      articleId: '',
      articleLink: 'articleLink',
      articleThumbnail: 'articleThumbnail',
      articleTitle: 'articleTitle',
      link: ''
    };
    mockValidation.isValidForArticleBinder.mockReturnValue({
      validationResult: false,
      reason: 'ArticleId is required'
    });
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.addArticle(binderModel);
    expect(data).toEqual(expRes);
  });

  // Remove Article
  it('Should Return Binder Info after removing Article to their binder', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          _id: '600e80a9b5935a804f38c3d1',
          UserId: '6005ada2fe2c4ddb9d070ff2',
          BinderStories: [],
          BinderArticles: [],
          BinderResources: []
        }
      }
    };

    const binderModel: BinderArticleModel = {
      userId: '6005ada2fe2c4ddb9d070ff2',
      articleId: 'articleId',
      articleLink: 'articleLink',
      articleThumbnail: 'articleThumbnail',
      articleTitle: 'articleTitle',
      link: ''
    };
    mockValidation.isValidForArticleBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.removeArticleFromBinder.mockReturnValue(expRes);
    const data = await ctrl.removeArticle(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while removing Article to their binder', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '2c344a0b-93fd-09ab-832b-20ddc53ae6db',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'ArticleId is required'
          }
        ]
      }
    };

    const binderModel: BinderArticleModel = {
      userId: '6005ada2fe2c4ddb9d070ff2',
      articleId: '',
      articleLink: 'articleLink',
      articleThumbnail: 'articleThumbnail',
      articleTitle: 'articleTitle',
      link: ''
    };
    mockValidation.isValidForArticleBinder.mockReturnValue({
      validationResult: false,
      reason: 'ArticleId is required'
    });
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.removeArticle(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should produce error while removing article from Binder Info for a specific User', async () => {
    mockValidation.isValidForArticleBinder.mockImplementation(() => {
      throw new Error()
    });
    mockBinder.removeArticleFromBinder.mockResolvedValue(true);
    mockResult.createException.mockReturnValue(true);
    const binderModel: BinderArticleModel = {
      articleId: '5ff33bb977b01e2046c36a14',
      articleTitle: 'Toileting and Bathroom Care',
      articleLink: '/v1/api/HealthWise/ArticleTopic/5ff33bb977b01e2046c36a14',
      articleThumbnail: '',
      userId: '60646605a450020007eae236',
      link: ''
    };
    await ctrl.removeArticle(binderModel);
  });

  // AddStoryToBinder
  it('Add Story To Binder - invalid story ID', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '362efcf2-cf45-20ca-dca6-b0323b9770f0',
            errorCode: 400,
            title: 'Incorrect model',
            detail: 'Story does not exist'
          }
        ]
      }
    };

    const binderModel = {
      storyId: 'invalidStoryId',
      userId: '5f99844130b711000703cd74'
    };
    mockValidation.isValidForStoryBinder.mockReturnValue({
      validationResult: false,
      reason: 'Story does not exist'
    });
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.addStoryToBinder(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Add Story to Binder - success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: '60646605a450020007eae236',
          binderStories: [
            {
              storyId: '611a4fe9a3721b45570b1f32',
              createdDate: '2021-08-25T07:29:32.208Z',
              profilePicture:
                'https://sit.api.sydney-community.com/community/communityresources/v2/users/profileImageString/60b8b6abed14e40007431b06',
              firstName: 'BRANDON',
              communityTitle: 'Metastatic or Recurrent Colorectal Cancer',
              displayName: 'Don',
              authorAgeWhenStoryBegan: 29,
              featuredQuote: 'my children',
              relation: 'Father',
              relationAgeWhenDiagnosed: 2
            },
            {
              storyId: '611a642b0832e75c672efbcd',
              createdDate: '2021-08-26T11:31:49.651Z',
              profilePicture:
                'https://sit.api.sydney-community.com/community/communityresources/v2/users/profileImageString/60b8b6abed14e40007431b06',
              firstName: 'BRANDON',
              communityTitle: 'Parenting',
              displayName: 'Don',
              authorAgeWhenStoryBegan: 20,
              featuredQuote: 'children are mess',
              relation: 'Father',
              relationAgeWhenDiagnosed: 62
            },
            {
              storyId: '6127a3bcaa4a61002aededd3',
              createdDate: '2021-08-27T13:12:55.969Z',
              profilePicture:
                'https://sit.api.sydney-community.com/community/communityresources/v2/users/profileImageString/6127690664615f001c99d30a',
              firstName: 'AMY',
              communityTitle: 'Weight Management',
              displayName: 'Halo',
              authorAgeWhenStoryBegan: 22,
              featuredQuote: 'INKI  Pinki',
              relation: 'Myself',
              relationAgeWhenDiagnosed: 22
            },
            {
              storyId: '611a642b0832e75c672efb19',
              createdDate: '2021-08-28T05:19:36.154Z',
              profilePicture:
                'https://sit.api.sydney-community.com/community/communityresources/v2/users/profileImageString/60b8b6abed14e40007431b06',
              firstName: 'BRANDON',
              communityTitle: 'Parenting',
              displayName: 'Don',
              authorAgeWhenStoryBegan: 20,
              featuredQuote: 'this is FeatureQuote',
              relation: 'Father',
              relationAgeWhenDiagnosed: 62
            }
          ],
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
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA8OK1lAsM',
              resourceCategory: 'help pay for food',
              resourceTitle: 'Hope For Young Adults With Cancer',
              providerName: 'Hope For Young Adults With Cancer',
              createdDate: '2021-08-25T12:24:32.379Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA5rS4iAkM',
              resourceCategory: 'health education',
              resourceTitle: 'Teen Health Services',
              providerName: 'To Help Everyone Health and Wellness Centers',
              createdDate: '2021-08-26T06:26:44.270Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgIDQ5tvm9QoM',
              resourceCategory: 'emergency food',
              resourceTitle: 'API Food Pantry',
              providerName: 'API Food Center of Beverly Hills',
              createdDate: '2021-08-29T16:21:52.583Z'
            }
          ],
          id: '61287a3aacea08002a9fa86b'
        }
      }
    };

    mockValidation.isValidForStoryBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.addStoryToBinder.mockResolvedValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);

    const binderModel: BinderStoryModel = {
      storyId: '611a4fe9a3721b45570b1f32',
      userId: '60646605a450020007eae236'
    };

    const data = await ctrl.addStoryToBinder(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Add Story to Binder - exception', async () => {
    mockValidation.isValidForStoryBinder.mockImplementation(() => {
      throw new Error()
    });
    mockBinder.addStoryToBinder.mockResolvedValue(true);
    mockResult.createSuccess.mockReturnValue(true);

    const binderModel: BinderStoryModel = {
      storyId: '611a4fe9a3721b45570b1f32',
      userId: '60646605a450020007eae236'
    };

    await ctrl.addStoryToBinder(binderModel);
  });

  //removeStoryFromBinder
  it('Should Return Success after removing story from binder', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '5f9ab4ec2ebea500072e6e47',
          userId: '5f99844130b711000703cd74',
          binderStories: [
            {
              storyId: '5fc79633e3f3460007cb34d0',
              firstName: 'ANU',
              displayName: 'Anu',
              profilePicture: null,
              communityTitle: 'Lung Cancer',
              featuredQuote: null,
              authorAgeWhenStoryBegan: 28,
              relationAgeWhenDiagnosed: 32,
              relation: 'Brother',
              createdDate: '2020-12-02T18:46:48.951Z'
            },
            {
              storyId: '5fcf556b9b971f0007f87b80',
              firstName: 'VVFIRST',
              displayName: 'Smilido',
              profilePicture: null,
              communityTitle: 'Lung Cancer',
              featuredQuote: null,
              authorAgeWhenStoryBegan: 23,
              relationAgeWhenDiagnosed: 26,
              relation: 'Friend',
              createdDate: '2020-12-09T13:18:30.859Z'
            },
            {
              storyId: '5fc62c6de3f3460007cb34c1',
              firstName: 'CHRISTOPHER',
              displayName: '~SIT3SB802T95085',
              profilePicture: null,
              communityTitle: 'Lung Cancer',
              featuredQuote: null,
              authorAgeWhenStoryBegan: 32,
              relationAgeWhenDiagnosed: 32,
              relation: 'Myself',
              createdDate: '2020-12-09T13:19:21.452Z'
            },
            {
              storyId: '5fa2745090745f00078646a8',
              firstName: 'RODINA',
              displayName: 'QA Jones',
              profilePicture: null,
              communityTitle: 'Lung Cancer',
              featuredQuote: null,
              authorAgeWhenStoryBegan: 28,
              relationAgeWhenDiagnosed: 62,
              relation: 'Father',
              createdDate: '2020-12-09T13:20:06.348Z'
            },
            {
              storyId: '5ff4299c4e5c14000721a4f3',
              firstName: 'WIFE',
              displayName: 'WWE',
              profilePicture: null,
              communityTitle: 'Breast Cancer',
              featuredQuote:
                'Life is from the inside out. When you shift on the inside, life shifts on the outside.Those who real',
              authorAgeWhenStoryBegan: 25,
              relationAgeWhenDiagnosed: 25,
              relation: 'Myself',
              createdDate: '2021-01-18T13:48:19.185Z'
            },
            {
              storyId: '60095cdebb91ed000704a222',
              firstName: 'MASON',
              displayName: '',
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/https://sit.api.communitycareexplorer.com/communitiesapi/v1/v1/api/Users/ProfileImage/db869b73-d80e-438e-88bf-ba760c7f61cb.jpg',
              communityTitle: 'Lung Cancer',
              featuredQuote:
                'Bad times; create great men who create good times',
              authorAgeWhenStoryBegan: 27,
              relationAgeWhenDiagnosed: 28,
              relation: 'Friend',
              createdDate: '2021-02-08T20:50:05.231Z'
            },
            {
              storyId: '6026a79be7965700083c86b0',
              firstName: 'BLANE',
              displayName: 'PLANE',
              profilePicture: null,
              communityTitle: 'Lung Cancer',
              featuredQuote: 'Story CCX-333',
              authorAgeWhenStoryBegan: 56,
              relationAgeWhenDiagnosed: 48,
              relation: 'Brother',
              createdDate: '2021-02-12T16:18:06.785Z'
            },
            {
              storyId: '5fd1e15c9b971f0007f87b9d',
              firstName: 'Yuk',
              displayName: 'yulala',
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/https://sit.api.communitycareexplorer.com/communitiesapi/v1/v1/api/Users/ProfileImage/7b6629a1-e3d6-49ed-8f72-dbd0796e9337.jpg',
              communityTitle: 'Lung Cancer',
              featuredQuote:
                "Twenty years from now you will be more disappointed by the things that you didn't do than by the one",
              authorAgeWhenStoryBegan: 35,
              relationAgeWhenDiagnosed: 39,
              relation: 'Brother',
              createdDate: '2021-02-22T12:08:59.864Z'
            },
            {
              storyId: '602e29a24396fa0007b563d3',
              firstName: 'VVFIRST',
              displayName: 'Smilido',
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/https://sit.api.communitycareexplorer.com/communitiesapi/v1/v1/api/Users/ProfileImage/848e20ea-179e-40c6-ab93-34d8f1b7ec7d.jpg',
              communityTitle: 'Anal Cancer',
              featuredQuote: 'Hi there!',
              authorAgeWhenStoryBegan: 22,
              relationAgeWhenDiagnosed: 22,
              relation: 'Myself',
              createdDate: '2021-02-22T12:09:47.902Z'
            },
            {
              storyId: '6089445e78c1e30007032310',
              firstName: 'LORI',
              displayName: null,
              profilePicture: null,
              communityTitle: 'Oral Cancer',
              featuredQuote: 'Lets ***** the code',
              authorAgeWhenStoryBegan: 44,
              relationAgeWhenDiagnosed: 44,
              relation: 'Myself',
              createdDate: '2021-05-12T09:05:12.969Z'
            }
          ],
          binderResources: [
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICAnpH_mAkM',
              resourceTitle: 'Home Health Care',
              resourceCategory: 'disease management',
              providerName: null,
              createdDate: '2020-12-09T13:12:29.481Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA4sX2qgsM',
              resourceTitle: 'Behavioral Health Services',
              resourceCategory: 'outpatient treatment',
              providerName: null,
              createdDate: '2020-12-09T13:12:50.796Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA7ofyggkM',
              resourceTitle: 'Bereavement Center ',
              resourceCategory: 'bereavement',
              providerName: null,
              createdDate: '2020-12-09T13:15:33.971Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICAqIyZ6wsM',
              resourceTitle: 'Cancer Support Groups',
              resourceCategory: 'support network',
              providerName: null,
              createdDate: '2020-12-09T13:23:52.650Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICAqIyZ6woM',
              resourceTitle: 'Financial Assistance',
              resourceCategory: 'help pay for healthcare',
              providerName: null,
              createdDate: '2020-12-09T13:24:04.309Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICAqIyZmwgM',
              resourceTitle: 'Cancer Education Workshops and Publications',
              resourceCategory: 'health education',
              providerName: null,
              createdDate: '2020-12-09T13:24:36.556Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgIDAvZSY-gkM',
              resourceTitle: 'Cancer Resources',
              resourceCategory: 'health education',
              providerName: ' National Coalition for Cancer Survivorship',
              createdDate: '2021-01-16T16:33:00.689Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgIDQ5tvm9QoM',
              resourceTitle: 'API Food Pantry',
              resourceCategory: 'emergency food',
              providerName: 'API Food Center of Beverly Hills',
              createdDate: '2021-01-21T19:21:16.468Z'
            }
          ],
          binderArticles: [
            {
              articleId:
                '/v1/api/Library/ReferenceContent/5f8ef847326b36caf106b9c6/Cardiologist',
              articleTitle: 'Cardiologist',
              articleLink:
                '/v1/api/Library/ReferenceContent/5f8ef847326b36caf106b9c6/Cardiologist',
              articleThumbnail: '',
              createdDate: '2020-12-16T08:32:57.393Z'
            },
            {
              articleId: 'abq2584',
              articleTitle: 'Breast-Conserving Surgery (Lumpectomy)',
              articleLink:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abq2584/SD/E0/abq2584.mp4',
              articleThumbnail:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abq2584/SD/abq2584.jpg',
              createdDate: '2021-01-18T14:00:04.121Z'
            },
            {
              articleId: 'abt2231',
              articleTitle: 'How can you help someone with a sink bath?',
              articleLink: '/v1/api/HealthWise/ArticleTopic/abt2231',
              articleThumbnail: '',
              createdDate: '2021-02-05T13:39:57.025Z'
            },
            {
              articleId: 'acc3849',
              articleTitle: 'What is lung cancer?',
              articleLink: '/v1/api/HealthWise/ArticleTopic/acc3849',
              articleThumbnail: '',
              createdDate: '2021-02-12T09:07:50.049Z'
            },
            {
              articleId: 'acg1894',
              articleTitle: ' What are the symptoms of anal cancer? ',
              articleLink: '/v1/api/HealthWise/ArticleTopic/acg1894',
              articleThumbnail: '',
              createdDate: '2021-04-24T06:03:42.593Z'
            },
            {
              articleId: 'acj2976',
              articleTitle: 'How is anal cancer treated? ',
              articleLink: '/v1/api/HealthWise/ArticleTopic/acj2976',
              articleThumbnail: '',
              createdDate: '2021-04-24T06:04:09.579Z'
            },
            {
              articleId: 'abo2803',
              articleTitle: 'Diabetes: How to Build Your Plate',
              articleLink:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abo2803/SD/E0/abo2803.mp4',
              articleThumbnail:
                'https://d20bb9v528piij.cloudfront.net/latest/en-us/abo2803/SD/abo2803.jpg',
              createdDate: '2021-04-29T14:38:37.595Z'
            },
            {
              articleId: 'acc3834',
              articleTitle: 'How is lung cancer treated?',
              articleLink: '/v1/api/HealthWise/ArticleTopic/acc3834',
              articleThumbnail: '',
              createdDate: '2021-05-05T05:58:04.822Z'
            }
          ]
        }
      }
    };

    const binderModel = {
      storyId: '5fc630a1e3f3460007cb34c6',
      userId: '5f99844130b711000703cd74'
    };
    mockValidation.isValidForStoryBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.removeStoryFromBinder.mockReturnValue(expRes);
    const data = await ctrl.removeStoryFromBinder(binderModel);
    expect(data).toEqual(expRes);
  });

  it('removeStoryFromBinder - Should Return Error response for invalid story Id', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '836afcfb-3d02-1edc-5bd1-c8732f3721c1',
            errorCode: 400,
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'StoryId is not a 24 hex string'
          }
        ]
      }
    };

    const binderModel = {
      storyId: '5fc630a1e3f3460007cb34c5',
      userId: '5f99844130b711000703cd74'
    };
    mockValidation.isValidForStoryBinder.mockReturnValue({
      validationResult: false,
      reason: 'StoryId is not a 24 hex string'
    });
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.removeStoryFromBinder(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should produce error while removing story from Binder Info for a specific User', async () => {
    mockValidation.isValidForStoryBinder.mockImplementation(() => {
      throw new Error()
    });
    mockBinder.removeStoryFromBinder.mockResolvedValue(true);
    mockResult.createError.mockReturnValue(true);
    const binderModel: BinderStoryModel = {
      storyId: '611a4fe9a3721b45570b1f32',
      userId: '60646605a450020007eae236'
    };

    await ctrl.removeStoryFromBinder(binderModel);
  });

  //removePostFromBinder
  it('Should remove post from Binder Info for a specific User', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: '60646605a450020007eae236',
          binderStories: [
            {
              storyId: '611a4fe9a3721b45570b1f32',
              createdDate: '2021-08-25T07:29:32.208Z',
              profilePicture:
                'https://sit.api.sydney-community.com/v2/users/profileImageString/60b8b6abed14e40007431b06',
              firstName: 'BRANDON',
              communityTitle: 'Metastatic or Recurrent Colorectal Cancer',
              displayName: 'Don',
              authorAgeWhenStoryBegan: 29,
              featuredQuote: 'my children',
              relation: 'Father',
              relationAgeWhenDiagnosed: 2
            },
            {
              storyId: '611a642b0832e75c672efbcd',
              createdDate: '2021-08-26T11:31:49.651Z',
              profilePicture:
                'https://sit.api.sydney-community.com/v2/users/profileImageString/60b8b6abed14e40007431b06',
              firstName: 'BRANDON',
              communityTitle: 'Parenting',
              displayName: 'Don',
              authorAgeWhenStoryBegan: 20,
              featuredQuote: 'this is FeatureQuote',
              relation: 'Father',
              relationAgeWhenDiagnosed: 62
            }
          ],
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
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA8OK1lAsM',
              resourceCategory: 'help pay for food',
              resourceTitle: 'Hope For Young Adults With Cancer',
              providerName: 'Hope For Young Adults With Cancer',
              createdDate: '2021-08-25T12:24:32.379Z'
            },
            {
              resourceId:
                'ahJzfnNlYXJjaGJlcnRoYS1xYTFyFAsSB1Byb2dyYW0YgICA5rS4iAkM',
              resourceCategory: 'health education',
              resourceTitle: 'Teen Health Services',
              providerName: 'To Help Everyone Health and Wellness Centers',
              createdDate: '2021-08-26T06:26:44.270Z'
            }
          ],
          binderPosts: [
            {
              postId: '624fe23cb0877b401745361b',
              publishedAt: '2022-04-08T07:20:28.147Z',
              communities: ['6214e8959aa982c0d09b40f5'],
              title: {
                en: 'title',
                es: ''
              },
              author: {
                firstName: 'Ananya',
                displayName: '',
                profileImage: '',
                role: 'scadmin',
                displayTitle: 'Sydney Community',
                id: '622b417fb3add3c1b5cb1c84'
              }
            }
          ],
          id: '61164db9bf4869001cdcb31c'
        }
      }
    };
    mockValidation.isValidForPostsBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.removePostFromBinder.mockResolvedValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    const binderModel: BinderPostModel = {
      postId: '611a4fe9a3721b45570b1f32',
      userId: '60646605a450020007eae236'
    };

    const data = await ctrl.removePostFromBinder(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should produce error while removing post from Binder Info for a specific User', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Incorrect id',
            detail: 'PostId is not a 24 hex string'
          }
        ]
      }
    };
    mockValidation.isValidForPostsBinder.mockReturnValue({
      validationResult: false,
      reason: 'PostId is not a 24 hex string'
    });
    mockResult.createError.mockReturnValue(expRes);
    const binderModel: BinderPostModel = {
      postId: '611a4fe9a3x21b45570b1f32',
      userId: '60646605a450020007eae236'
    };

    const data = await ctrl.removePostFromBinder(binderModel);
    expect(data).toEqual(expRes);
  });

  it('Should produce error while removing post from Binder Info for a specific User', async () => {
    mockValidation.isValidForPostsBinder.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    const binderModel: BinderPostModel = {
      postId: '611a4fe9a3x21b45570b1f32',
      userId: '60646605a450020007eae236'
    };

    await ctrl.removePostFromBinder(binderModel);
  });

  // Add Post
  it('addPost - Should add a post to Binder for a specific User', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: '60646605a450020007eae236',
          binderStories: [],
          binderArticles: [],
          binderResources: [],
          binderPosts: [],
          id: '61164db9bf4869001cdcb31c'
        }
      }
    };

    mockValidation.isValidForPostsBinder.mockReturnValue({
      validationResult: true
    });
    mockBinder.addPostToBinder.mockResolvedValue(expRes);

    const binderModel: BinderPostModel = {
      postId: '611a4fe9a3721b45570b1f32',
      userId: '60646605a450020007eae236'
    };

    const data = await ctrl.addPost(binderModel);
    expect(data).toEqual(expRes);
  });

  it('addPost - Should produce error add a post to Binder for a specific User', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'PostId is required'
          }
        ]
      }
    };
    mockValidation.isValidForPostsBinder.mockReturnValue({
      validationResult: false,
      reason: 'PostId is required'
    });
    mockResult.createError.mockReturnValue(expRes);

    const binderModel: BinderPostModel = {
      postId: '',
      userId: '60646605a450020007eae236'
    };

    const data = await ctrl.addPost(binderModel);
    expect(data).toEqual(expRes);
  });
});
