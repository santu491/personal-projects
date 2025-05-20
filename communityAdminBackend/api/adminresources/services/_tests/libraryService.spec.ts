import { mockCacheUtil, mockHealthWiseGatewaySvc, mockHealthwiseTokenSvc, mockMeredithGatewaySvc, mockMongo, mockResult } from '@anthem/communityadminapi/common/baseTest';
import { SectionRequest } from 'api/adminresources/models/libraryModel';
import { LibraryService } from '../libraryService';

describe('libraryService', () => {
  let service: LibraryService;

  beforeEach(() => {
    service = new LibraryService(
      <any>mockMongo,
      <any>mockCacheUtil,
      <any>mockHealthwiseTokenSvc,
      <any>mockHealthWiseGatewaySvc,
      <any>mockResult,
      <any>mockMeredithGatewaySvc
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return library for the communityId', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          headerTitle: "Library",
          headerDescription: "Carefully selected content for you.",
          communityId: "5f245386aa271e24b0c6fd89",
          title: "Advanced or Metastatic Prostate Cancer",
          description: "",
          sections: [
            {
              title: "Topics",
              description: "",
              type: "List",
              content: [
                {
                  contentId: "",
                  title: "Advanced or Metastatic Prostate Cancer Overview",
                  description: "Read about symptoms, causes, diagnostics and more.",
                  type: "HWTopic",
                  link: "/v2/library/content/5f873a21326b36caf1e632ad",
                  video: "",
                  thumbnail: ""
                },
                {
                  title: "Treatments",
                  description: "Learn about the treatment options for advanced or metastatic prostate cancer.",
                  type: "HWTopic",
                  link: "/v2/library/content/5f874124326b36caf1e75578",
                  video: "",
                  thumbnail: ""
                }
              ]
            },
            {
              title: "Living with Cancer",
              description: "A video collection about dealing with the social and emotional effects of cancer.",
              content: [
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "Cancer: When You First Find Out",
                  description: "",
                  type: "HWVideo",
                  link: "/v2/healthWise/videoTopic/abp6265",
                  video: "https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/E0/abp6265.mp4",
                  thumbnail: "https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/abp6265.jpg"
                },
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "View All Videos",
                  description: "",
                  type: "HWBTNVideoList",
                  link: "/v2/library/content/5f804eeb326b36caf1bd8e25",
                  video: "",
                  thumbnail: ""
                }
              ]
            },
            {
              title: "Caregiver Resources",
              description: "Caring for a loved one can be deeply rewarding — and demanding. Here are resources to help you take care of yourself while caring for your loved one.",
              content: [
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "Grooming and Bathing",
                  description: "Tips for helping someone bathe, dress, shave, and more.",
                  type: "HWTopic",
                  link: "/v2/library/content/5ff340cf77b01e2046c36a15",
                  video: "",
                  thumbnail: ""
                },
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "Toileting and Bathroom Care",
                  description: "Tips for assisting someone who needs help using the toilet.",
                  type: "HWTopic",
                  link: "/v2/library/content/5ff33bb977b01e2046c36a14",
                  video: "",
                  thumbnail: ""
                },
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "Movement Help",
                  description: "How to help someone who needs physical help to get around the house.",
                  type: "HWTopic",
                  link: "/v2/library/content/5ff3450977b01e2046c36a16",
                  video: "",
                  thumbnail: ""
                },
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "View All Caregiver Resources",
                  description: "",
                  type: "HWBTNCaregiverList",
                  link: "/v2/library/content/5ff3453577b01e2046c36a18",
                  video: "",
                  thumbnail: ""
                }
              ]
            },
            {
              title: "Reference Materials",
              description: "",
              content: [
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "Physician Specialty Definitions",
                  description: "Descriptions of the various types of doctors and other medical practitioners.",
                  type: "HWReference",
                  link: "/v2/library/content/5f8ef847326b36caf106b9c6",
                  video: "",
                  thumbnail: ""
                },
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "Symptom Management Toolkit",
                  description: "Helpful suggestions for managing symptoms and side effects of cancer treatments.",
                  type: "HWReference",
                  link: "/v2/library/content/5f907b60e48e5c8c0285c71d",
                  video: "",
                  thumbnail: ""
                },
                {
                  _id: "",
                  communityId: "",
                  contentId: "",
                  title: "Health Insurance Basics",
                  description: "What it is, how you can get it, what it costs and more.",
                  type: "HWReference",
                  link: "/v2/library/content/5f88993b326b36caf120b3c5",
                  video: "",
                  thumbnail: ""
                }
              ],
              backgroundColor: "#F7F7F7"
            }
          ],
          __v: 0,
          createdAt: "2021-08-11T13:32:11.405Z",
          updatedAt: "2021-08-11T13:32:11.405Z",
          id: "5f870c3b326b36caf1dd2c42"
        }
      }
    };
    mockMongo.readByValue.mockReturnValue(expRes.data.value);
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await service.getLibraryByCommunityId('communityId');
    expect(resData).toEqual(expRes);
  });

  it('Should create a new section', async () => {
    const input: SectionRequest = {
      section: {
        en: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [],
          isCommon: false
        },
        es: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [],
          isCommon: false
        }
      },
      subSections: []
    };

    const expected = {
      isSuccess: true,
      value: true
    };

    mockMongo.readAll.mockReturnValue([
      {
        content: {
          helpfulInfo: '1.0.0'
        }
      }
    ]);
    mockMongo.readAllByValue.mockReturnValue([]);
    mockMongo.updateByQuery.mockReturnValueOnce(1).mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expected);
    const result = await service.createCommunitySection(input);
    expect(result).toBe(expected);
  });

  it('Should create a new section', async () => {
    const input: SectionRequest = {
      section: {
        en: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [
            {
              title: "",
              sectionId: 'sectionId',
              subSection: [],
              description: "",
              type: "",
              backgroundColor: "",
              content: [
                {
                  communityId: "",
                  contentId: "",
                  title: "Overview",
                  description: "Understanding weight and weight management.",
                  type: "HWTopic",
                  link: "/v2/library/content/62a35850ec1cb1b82dd67172",
                  video: "",
                  thumbnail: "",
                  id: "",
                  helpfulInfoId: "",
                  backgroundColor: "",
                  types: []
                }
              ]
            }
          ],
          isCommon: false
        },
        es: {
          communityId: 'communityId',
          helpfulInfoId: 'id',
          headerDescription: 'test',
          headerTitle: 'test',
          title: 'test',
          description: 'test',
          subDescription: null,
          sections: [
            {
              title: "",
              sectionId: 'sectionId',
              subSection: [],
              description: "",
              type: "",
              backgroundColor: "",
              content: [
                {
                  communityId: "",
                  contentId: "",
                  title: "Overview",
                  description: "Understanding weight and weight management.",
                  type: "HWTopic",
                  link: "/v2/library/content/62a35850ec1cb1b82dd67172",
                  video: "",
                  thumbnail: "",
                  id: "",
                  helpfulInfoId: "",
                  backgroundColor: "",
                  types: []
                }
              ]
            }
          ],
          isCommon: false
        }
      },
      subSections: [
        {
          en: {
            helpfulInfoId: "62a35850ec1cb1b82dd67172",
            headerTitle: "Test",
            headerDescription: "Test Description",
            title: "Test",
            description: "Test Description",
            sections: [],
            communityId: "",
            subDescription: "",
            isCommon: false
          },
          es: {
            helpfulInfoId: "62a35850ec1cb1b82dd67172",
            headerTitle: "Test",
            headerDescription: "Test Description",
            title: "Test",
            description: "Test Description",
            sections: [],
            communityId: "",
            subDescription: "",
            isCommon: false
          }
        }
      ]
    };

    const expected = {
      isSuccess: true,
      value: true
    };

    mockMongo.readAll.mockReturnValue([
      {
        content: {
          helpfulInfo: '1.0.0'
        }
      }
    ]);
    mockMongo.readAllByValue.mockReturnValue([{}, {}]);
    mockMongo.updateByQuery.mockReturnValueOnce(1).mockReturnValueOnce(1)
      .mockReturnValueOnce(1).mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expected);
    const result = await service.createCommunitySection(input);
    expect(result).toBe(expected);
  });

  it('getHealthwiseArticle - error invalid Id', async () => {
    const expectedResult = {
      data: {
        isSuccess: false,
        errors: {
          errorCode: 404,
          title: "Content Not Found",
          detail: "Invalid Content Key"
        }
      }
    };
    mockCacheUtil.getCache.mockReturnValue(null);
    mockHealthwiseTokenSvc.postAuth.mockReturnValue({
      expires_in: 12323,
      access_key: 'some data'
    });
    mockCacheUtil.setCache.mockReturnValue(true);
    mockHealthWiseGatewaySvc.getTopicById.mockRejectedValue(expectedResult.data.errors);
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await service.getHealthwiseArticle({
      articleId: 'articleId',
      provider: 'healthwise'
    });
    expect(result).toBe(expectedResult);
  });

  it('getHealthwiseArticle - error response if didnt not throw an exception', async () => {
    const expectedResult = {
      data: {
        isSuccess: false,
        errors: {
          errorCode: 404,
          title: "Content Not Found",
          detail: "Invalid Content Key"
        }
      }
    };
    mockCacheUtil.getCache.mockReturnValue({
      expires_in: 12323,
      access_key: 'some data'
    });
    mockHealthWiseGatewaySvc.getTopicById.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await service.getHealthwiseArticle({
      articleId: 'articleId',
      provider: 'healthwise'
    });
    expect(result).toBe(expectedResult);
  });

  it('getHealthwiseArticle - success without spanish', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {
          en: {
            title: "How can you help prevent colorectal cancer?",
            type: "HWReference",
            communityId: "",
            contentId: "",
            description: "",
            link: "/v2/healthWise/articleTopic/acg0360",
            video: "",
            thumbnail: ""
          },
          es: {
            title: "How can you help prevent colorectal cancer?",
            type: "HWReference",
            communityId: "",
            contentId: "",
            description: "",
            link: "/v2/healthWise/articleTopic/acg0360",
            video: "",
            thumbnail: ""
          }
        }
      }
    };
    mockCacheUtil.getCache.mockReturnValue({
      expires_in: 12323,
      access_key: 'some data'
    });
    mockHealthWiseGatewaySvc.getTopicById.mockReturnValueOnce({
      data: {
        topics: [
          {
            title: {
              consumer: "How can you help prevent colorectal cancer?"
            },
            type: 'hwVideo',
            sources: {
              mp4_288p_url: 'some_Url?expires=10'
            },
            thumbnail: 'thumbnail_url'
          }
        ]
      }
    }).mockRejectedValue({
      error: 'There was an error'
    });
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const result = await service.getHealthwiseArticle({
      articleId: 'articleId',
      provider: 'healthwise'
    });
    expect(result).toBe(expectedResult);
  });

  it('getHealthwiseArticle - success with spanish', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {
          en: {
            title: "How can you help prevent colorectal cancer?",
            type: "HWReference",
            communityId: "",
            contentId: "",
            description: "",
            link: "/v2/healthWise/articleTopic/acg0360",
            video: "",
            thumbnail: ""
          },
          es: {
            title: "¿Cómo puede ayudar a prevenir el cáncer colorrectal?",
            type: "HWReference",
            communityId: "",
            contentId: "",
            description: "",
            link: "/v2/healthWise/articleTopic/acg0360",
            video: "",
            thumbnail: ""
          }
        }
      }
    };
    mockCacheUtil.getCache.mockReturnValue({
      expires_in: 12323,
      access_key: 'some data'
    });
    const mockData = {
      data: {
        topics: [
          {
            title: {
              consumer: "How can you help prevent colorectal cancer?"
            },
            type: 'hwTopic',
            sources: {
              mp4_288p_url: 'some_Url?expires=10'
            },
            thumbnail: 'thumbnail_url'
          }
        ]
      }
    };
    mockHealthWiseGatewaySvc.getTopicById.mockReturnValue(mockData);
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const result = await service.getHealthwiseArticle({
      articleId: 'articleId',
      provider: 'healthwise'
    });
    expect(result).toBe(expectedResult);
  });

  it('getMeredithArticle - return error', async () => {
    const expectedResult = {
      data: {
        isSuccess: false,
        errors: {
          errorCode: 404,
          title: "Content Not Found",
          detail: "Invalid Content Key"
        }
      }
    };
    mockMeredithGatewaySvc.getArticle.mockRejectedValue(expectedResult.data.errors);
    mockResult.createError.mockReturnValue(expectedResult);
    const result = await service.getMeredithArticle({
      articleId: 'articleId',
      provider: 'meredith'
    });
    expect(result).toBe(expectedResult);
  });

  it('getMeredithArticle - return success for video', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {
          en: {
            title: "How can you help prevent colorectal cancer?",
            type: "HWReference",
            communityId: "",
            contentId: "articleId",
            description: "",
            link: "https://www.eatingwell.com/article/7867303/sleep-might-be-the-reason-you-re-not-losing-weight/",
            video: "",
            thumbnail: "",
            copyright: "© Meredith Operations Corporation. All rights reserved. Used with permission.",
            brandLogo: "http://deliveries.foundry360.com/deliveries/xml/brand-logos/20190912/EatingWell-Logo-COLOR.png",
            brand: "EatingWell"
          },
          es: {
            title: "¿Cómo puede ayudar a prevenir el cáncer colorrectal?",
            type: "HWReference",
            communityId: "",
            contentId: "articleId",
            description: "",
            link: "https://www.eatingwell.com/article/7867303/sleep-might-be-the-reason-you-re-not-losing-weight/",
            video: "",
            thumbnail: "",
            copyright: "© Meredith Operations Corporation. All rights reserved. Used with permission.",
            brandLogo: "http://deliveries.foundry360.com/deliveries/xml/brand-logos/20190912/EatingWell-Logo-COLOR.png",
            brand: "EatingWell"
          }
        }
      }
    };
    mockMeredithGatewaySvc.getArticle.mockReturnValue({
      result: {
        title: 'some Titoe',
        id: 'articleId',
        subtitle: 'description',
        copyright: 'Copyright',
        brandLogo: 'BrnadLogo',
        brand: 'Brand',
        contentType: 'video',
        videos: [
          {
            url: 'Video Url'
          }
        ],
        images: [
          {
            previews: {
              wide: {
                uri: 'someUrl'
              }
            }
          }
        ]
      }
    });
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const result = await service.getMeredithArticle({
      articleId: 'articleId',
      provider: 'meredith'
    });
    expect(result).toBe(expectedResult);
  });

  it('getMeredithArticle - return success for article', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {
          en: {
            title: "How can you help prevent colorectal cancer?",
            type: "HWReference",
            communityId: "",
            contentId: "articleId",
            description: "",
            link: "https://www.eatingwell.com/article/7867303/sleep-might-be-the-reason-you-re-not-losing-weight/",
            video: "",
            thumbnail: "",
            copyright: "© Meredith Operations Corporation. All rights reserved. Used with permission.",
            brandLogo: "http://deliveries.foundry360.com/deliveries/xml/brand-logos/20190912/EatingWell-Logo-COLOR.png",
            brand: "EatingWell"
          },
          es: {
            title: "¿Cómo puede ayudar a prevenir el cáncer colorrectal?",
            type: "HWReference",
            communityId: "",
            contentId: "articleId",
            description: "",
            link: "https://www.eatingwell.com/article/7867303/sleep-might-be-the-reason-you-re-not-losing-weight/",
            video: "",
            thumbnail: "",
            copyright: "© Meredith Operations Corporation. All rights reserved. Used with permission.",
            brandLogo: "http://deliveries.foundry360.com/deliveries/xml/brand-logos/20190912/EatingWell-Logo-COLOR.png",
            brand: "EatingWell"
          }
        }
      }
    };
    mockMeredithGatewaySvc.getArticle.mockReturnValue({
      result: {
        title: 'some Titoe',
        id: 'articleId',
        canonicalUrl: 'Url',
        copyright: 'Copyright',
        contentType: 'article',
        textWithHtml: 'some html text',
        videos: [
          {
            url: 'Video Url'
          }
        ],
        images: [
          {
            previews: {
              standard: {
                uri: 'someUrl'
              }
            }
          }
        ]
      }
    });
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const result = await service.getMeredithArticle({
      articleId: 'articleId',
      provider: 'meredith'
    });
    expect(result).toBe(expectedResult);
  });
});
