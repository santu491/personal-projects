import {
  TranslationLanguage
} from '@anthem/communityapi/common';
import { mockMongo, mockPublicSvc, mockResult, mockValidation } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { PageParam } from 'api/communityresources/models/pageParamModel';
import { PromptModel } from 'api/communityresources/models/promptModel';
import { PromptService } from '../promptService';

describe('PromptService', () => {
  let service: PromptService;

  beforeEach(() => {
    service = new PromptService(<any>mockMongo, <any>mockResult, <any>mockValidation, <any>mockPublicSvc, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getPromptsData = () => {
    return [
      {
        promptId: '5f9c5238fdfbb52b2c86c9b9',
        CommunityId: '5f245386aa271e24b0c6fd89',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:44.009Z'
      },
      {
        promptId: '5f9c5232fdfbb52b2c86c9b8',
        CommunityId: '5f245386aa271e24b0c6fd88',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:38.680Z'
      },
      {
        promptId: '5f9c522cfdfbb52b2c86c9b7',
        CommunityId: '5f3d2eef5617cc2e401b8adf',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:32.549Z'
      },
      {
        promptId: '5f9c5226fdfbb52b2c86c9b6',
        CommunityId: '5f369ba97b79ea14f85fb0ec',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:26.987Z'
      },
      {
        promptId: '5f9c5221fdfbb52b2c86c9b5',
        CommunityId: '5f22db56a374bc4e80d80a9b',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:21.552Z'
      },
      {
        promptId: '5f9c521bfdfbb52b2c86c9b4',
        CommunityId: '5f189ba00d5f552cf445b8c2',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:15.977Z'
      },
      {
        promptId: '5f9c5216fdfbb52b2c86c9b3',
        CommunityId: '5f0e744536b382377497ecef',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:10.453Z'
      },
      {
        promptId: '5f9c5210fdfbb52b2c86c9b2',
        CommunityId: '5f0753f6c12e0c22d00f5d23',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:49:04.681Z'
      },
      {
        promptId: '5f9c520afdfbb52b2c86c9b1',
        CommunityId: '5f0753b7c12e0c22d00f5d22',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:48:58.206Z'
      },
      {
        promptId: '5f9c5200fdfbb52b2c86c9b0',
        CommunityId: '5f07537bc12e0c22d00f5d21',
        Question: 'What happened after that?',
        SectionTitle: 'Beyond',
        HelpText: '',
        SensitiveContentText:
          "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        CreatedDate: '2020-10-30T17:48:48.616Z'
      }
    ];
  }

  it('getAllPrompt - Should Return all Prompt List', async () => {
    const pageParams: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };
    mockPublicSvc.getAppTranslations.mockReturnValue({
      data: {
        isSuccess: true,
        value: {
          data: {
            createStoryModule: [
              {
                communityId: 'communityId',
                prompts: [...getPromptsData()]
              },
              {
                communityId: 'communityId1',
                prompts: [...getPromptsData()]
              }
            ]
          },
          createdAt: '2020-10-30T17:49:44.009Z'
        }
      }
    });
    mockValidation.sort.mockReturnValue([...getPromptsData()]);
    await service.getAllPrompt(pageParams, TranslationLanguage.ENGLISH);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPromptById - Should Return a specific Prompt', async () => {
    mockPublicSvc.getAppTranslations.mockReturnValue({
      data: {
        isSuccess: true,
        value: {
          data: {
            createStoryModule: [
              {
                communityId: 'communityId',
                prompts: [...getPromptsData()]
              }
            ]
          },
          createdAt: '2020-10-30T17:49:44.009Z'
        }
      }
    });
    await service.getPromptById('5f9c5232fdfbb52b2c86c9b8', TranslationLanguage.ENGLISH);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPromptById - Should Return a error', async () => {
    mockPublicSvc.getAppTranslations.mockReturnValue({
      data: {
        isSuccess: true,
        value: {
          data: {
            createStoryModule: [
              {
                communityId: 'communityId',
                prompts: [...getPromptsData()]
              }
            ]
          },
          createdAt: '2020-10-30T17:49:44.009Z'
        }
      }
    });
    await service.getPromptById('5f9c5232fd2bb22b2c86c9b8', TranslationLanguage.ENGLISH);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('getByCommunityId - Should Return all prompts for a community', async () => {
    mockPublicSvc.getAppTranslations.mockReturnValue({
      data: {
        isSuccess: true,
        value: {
          data: {
            createStoryModule: [
              {
                communityId: 'communityId',
                prompts: [...getPromptsData()]
              },
              {
                communityId: 'communityId1',
                prompts: [...getPromptsData()]
              }
            ]
          },
          createdAt: '2020-10-30T17:49:44.009Z'
        }
      }
    });
    await service.getByCommunityId('communityId', TranslationLanguage.ENGLISH);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getByCommunityId - Should Return error', async () => {
    mockPublicSvc.getAppTranslations.mockReturnValue(null);
    await service.getByCommunityId('communityId', TranslationLanguage.ENGLISH);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('create - Should Return prompt after creating', async () => {
    const input: PromptModel = {
      communityId: '5f07537bc12e0c22d00f5d21',
      helpText: 'help text',
      question: 'test',
      sectionTitle: 'sectionTitle',
      sensitiveContentText: 'test',
      id: ''
    }
    mockMongo.readByID.mockReturnValue({
      id: '5f07537bc12e0c22d00f5d21',
      title: 'Test'
    });
    await service.create(input);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    expect(mockMongo.insertValue.mock.calls.length).toBe(1);
  });

  it('create - should return a error', async () => {
    const input: PromptModel = {
      communityId: '5f07537bc12e0c22d00f5d21',
      helpText: 'help text',
      question: 'test',
      sectionTitle: 'sectionTitle',
      sensitiveContentText: 'test',
      id: ''
    }
    mockMongo.readByID.mockReturnValue(null);
    await service.create(input);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  })

  it('getPromptsWithCommunity - success in English', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          'Anal Cancer',
          'Breast Cancer',
          'Male Breast Cancer',
          'Metastatic or Recurrent Breast Cancer',
          'Colorectal Cancer',
          'Metastatic or Recurrent Colorectal Cancer',
          'Lung Cancer',
          'Oral Cancer',
          'Prostate Cancer',
          'Advanced or Metastatic Prostate Cancer',
          'Other'
        ]
      }
    };

    mockPublicSvc.getAppTranslations.mockReturnValue({
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '6203e9dca0040cf61189a9e7',
          contentType: 'prompts',
          createdAt: '2022-02-09T16:20:44.332Z',
          data: {
            createStoryModule: ['Some', 'values'],
            communitiesList: {
              Cancer: [
                'Anal Cancer',
                'Breast Cancer',
                'Male Breast Cancer',
                'Metastatic or Recurrent Breast Cancer',
                'Colorectal Cancer',
                'Metastatic or Recurrent Colorectal Cancer',
                'Lung Cancer',
                'Oral Cancer',
                'Prostate Cancer',
                'Advanced or Metastatic Prostate Cancer',
                'Other'
              ]
            }
          }
        }
      }
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    const res = await service.getCommunitiesList('Cancer', 'en');
    expect(res).toEqual(expRes);
  });

  it('getPromptsWithCommunity - Invalid Community', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          id: "13bbf6d7-83dd-3fac-613d-3f86ed792912",
          errorCode: 400,
          title: "Bad data",
          detail: "The community does not exist in the database"
        }
      }
    };

    mockPublicSvc.getAppTranslations.mockReturnValue({
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '6203e9dca0040cf61189a9e7',
          contentType: 'prompts',
          createdAt: '2022-02-09T16:20:44.332Z',
          data: {
            createStoryModule: ['Some', 'values'],
            communitiesList: {
              Cancer: [
                'Anal Cancer',
                'Breast Cancer',
                'Male Breast Cancer',
                'Metastatic or Recurrent Breast Cancer',
                'Colorectal Cancer',
                'Metastatic or Recurrent Colorectal Cancer',
                'Lung Cancer',
                'Oral Cancer',
                'Prostate Cancer',
                'Advanced or Metastatic Prostate Cancer',
                'Other'
              ]
            }
          }
        }
      }
    });
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.getCommunitiesList('Invalid', 'en');
    expect(res).toEqual(expRes);
  });

  it('getPromptsWithCommunity - Invalid Language', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          id: "13bbf6d7-83dd-3fac-613d-3f86ed792912",
          errorCode: 400,
          title: "Bad data",
          detail: "Language is invalid"
        }
      }
    };

    mockPublicSvc.getAppTranslations.mockReturnValue({
      data: {
        isSuccess: true,
        isException: false,
        value: null
      }
    });
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.getCommunitiesList('Cancer', 'invalid');
    expect(res).toEqual(expRes);
  });
});
