import { TranslationLanguage } from "@anthem/communityapi/common";
import { mockCommentHelper, mockCommunity, mockMongo, mockResult, mockUserHelper, mockValidation } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { PageParam } from "api/communityresources/models/pageParamModel";
import { Prompt } from "api/communityresources/models/promptModel";
import { BaseResponse } from "api/communityresources/models/resultModel";
import { StoryHelper } from "../../helpers/storyHelper";
import { PromptService } from "../../promptService";

describe('StoryHelper', () => {
  let service;

  beforeEach(() => {
    service = new StoryHelper(
      <any>mockMongo,
      <any>mockResult,
      <any>mockValidation,
      <any>mockUserHelper,
      <any>mockCommentHelper,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const story = {
    id: "6182b629a7c6e3001d9fb574",
    author: {
      displayName: "potter",
      id: "612cc846c448c2002b321cdf",
      gender: "Male",
      genderRoles: {
        genderPronoun: "he",
        genderPronounPossessive: "his"
      },
      profilePicture: "https://sit.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
      age: 10,
      fullName: "SUB TEAM",
      firstName: "SUB",
      communities: [
        "607e7c99d0a2b533bb2ae3d2",
        "60a358bc9c336e882b19bbf0",
        "60e2e7277c37b43a668a32f2",
        "6214e8959aa982c0d09b40f5"
      ]
    },
    createdAt: "2021-11-03T16:17:45.052Z",
    updatedDate: "2021-11-09T15:56:19.625Z",
    answer: [
      {
        id: "62150c89cdf6e39e7ddc79a5",
        promptId: "6215088617e4506761d18e61",
        question: "What type of cancer was diagnosed?",
        sensitiveContentText: "",
        response: "5f0753b7c12e0c22d00f5d22",
        order: 0,
        type: "PromptQuestion"
      },
      {
        id: "6182b629a7c6e3001d9fb571",
        promptId: "5f9c4d39fdfbb52b2c86c98d",
        question: "If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?",
        sensitiveContentText: null,
        response: "fuvakg vnji",
        order: 0,
        type: "PromptQuestion",
        createdDate: "2021-11-03T16:17:45.052Z",
        updatedDate: "2021-11-03T16:41:01.601Z"
      },
      {
        id: "6182b629a7c6e3001d9fb573",
        promptId: "5f9c4fb4fdfbb52b2c86c9ab",
        question: "How did you adjust to your new routine?",
        sensitiveContentText: null,
        response: "TTHSVNBO ffzw",
        order: 0,
        type: "PromptQuestion",
        createdDate: "2021-11-03T16:17:45.052Z",
        updatedDate: "2021-11-03T16:41:01.601Z"
      }
    ],
    displayName: "potter",
    authorId: "612cc846c448c2002b321cdf",
    authorAgeWhenStoryBegan: 12,
    relation: "Myself",
    featuredQuote: "testinmad lib",
    relationAgeWhenDiagnosed: 60,
    communityId: "6214e8959aa982c0d09b40f5",
    communityName: "Cancer",
    storyText: "Placeholder story text",
    published: false,
    removed: false,
    flagged: false,
    hasStoryBeenPublishedOnce: true,
    questionsAskedByCurrentUser: [],
    reactionCount: {
      like: 0,
      care: 0,
      celebrate: 0,
      good_idea: 0,
      total: 0
    },
    userReaction: "null"
  };

  it('addPromptOptionValue - success', async () => {
    const result = [
      {
        id: "62150c89cdf6e39e7ddc79a5",
        promptId: "6215088617e4506761d18e61",
        question: "What type of cancer was diagnosed?",
        sensitiveContentText: "",
        response: "Oral Cancer",
        order: 0,
        type: "PromptQuestion"
      },
      {
        id: "6182b629a7c6e3001d9fb571",
        promptId: "5f9c4d39fdfbb52b2c86c98d",
        question: "If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?",
        sensitiveContentText: null,
        response: "fuvakg vnji",
        order: 0,
        type: "PromptQuestion",
        createdDate: "2021-11-03T16:17:45.052Z",
        updatedDate: "2021-11-03T16:41:01.601Z"
      },
      {
        id: "6182b629a7c6e3001d9fb573",
        promptId: "5f9c4fb4fdfbb52b2c86c9ab",
        question: "How did you adjust to your new routine?",
        sensitiveContentText: null,
        response: "TTHSVNBO ffzw",
        order: 0,
        type: "PromptQuestion",
        createdDate: "2021-11-03T16:17:45.052Z",
        updatedDate: "2021-11-03T16:41:01.601Z"
      }
    ];
    const prompts: Prompt[] = [
      {
        id: '6215088617e4506761d18e61',
        communityId: '6214e8959aa982c0d09b40f5',
        createdDate: new Date(''),
        promptId: "6215088617e4506761d18e61",
        question: "What type of cancer was diagnosed?",
        sectionTitle: "",
        helpText: "",
        sensitiveContentText: "",
        options: [
          {
            id: "",
            title: "Select One",
            type: "select"
          },
          {
            id: "5f0e744536b382377497ecef",
            title: "Anal Cancer",
            type: "cancer"
          },
          {
            id: "5f0753f6c12e0c22d00f5d23",
            title: "Breast Cancer",
            type: "cancer"
          },
          {
            id: "5f22db56a374bc4e80d80a9b",
            title: "Male Breast Cancer",
            type: "cancer"
          },
          {
            id: "5f369ba97b79ea14f85fb0ec",
            title: "Metastatic or Recurrent Breast Cancer",
            type: "cancer"
          },
          {
            id: "5f189ba00d5f552cf445b8c2",
            title: "Colorectal Cancer",
            type: "cancer"
          },
          {
            id: "5f3d2eef5617cc2e401b8adf",
            title: "Metastatic or Recurrent Colorectal Cancer",
            type: "cancer"
          },
          {
            id: "5f07537bc12e0c22d00f5d21",
            title: "Lung Cancer",
            type: "cancer"
          },
          {
            id: "5f0753b7c12e0c22d00f5d22",
            title: "Oral Cancer",
            type: "cancer"
          },
          {
            id: "5f245386aa271e24b0c6fd88",
            title: "Prostate Cancer",
            type: "cancer"
          },
          {
            id: "5f245386aa271e24b0c6fd89",
            title: "Advanced or Metastatic Prostate Cancer",
            type: "cancer"
          },
          {
            id: "6206698f6aa0f2002f172ee2",
            title: "Other",
            type: "otherCancer"
          }
        ],
        otherCancer: undefined
      },
      {
        id: '',
        communityId: '6214e8959aa982c0d09b40f5',
        createdDate: new Date(''),
        promptId: "6215088617e4506761d18e62",
        question: "Other diagnosis:",
        sectionTitle: "",
        helpText: "",
        sensitiveContentText: "",
        options:undefined,
        otherCancer: true
      },
      {
        id: '',
        communityId: '6214e8959aa982c0d09b40f5',
        createdDate: new Date(''),
        promptId: "5f9c4d39fdfbb52b2c86c98d",
        question: "If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?",
        sectionTitle: "One Piece of Advice",
        helpText: "",
        sensitiveContentText: "",
        options:undefined,
        otherCancer: undefined
      },
      {
        id: '',
        communityId: '6214e8959aa982c0d09b40f5',
        createdDate: new Date(''),
        promptId: "5f9c4e7afdfbb52b2c86c997",
        question: "What was it like to learn the diagnosis?",
        sectionTitle: "Initial Diagnosis",
        helpText: "ex: Why did you see a doctor? What was that day like? Did you get a second opinion?",
        sensitiveContentText: "",
        options:undefined,
        otherCancer: undefined
      },
      {
        id: '',
        communityId: '6214e8959aa982c0d09b40f5',
        createdDate: new Date(''),
        promptId: "5f9c4f22fdfbb52b2c86c9a1",
        question: "How did you decide what to do?",
        sectionTitle: "Deciding What to Do",
        helpText: "ex: How did you come to terms with the diagnosis? Were you given next steps? Where did you look for help when figuring out what to do?",
        sensitiveContentText: "",
        options:undefined,
        otherCancer: undefined
      },
      {
        id: '',
        communityId: '6214e8959aa982c0d09b40f5',
        createdDate: new Date(''),
        promptId: "5f9c4fb4fdfbb52b2c86c9ab",
        question: "How did you adjust to your new routine?",
        sectionTitle: "Figuring it Out",
        helpText: "ex: What was different about life after these changes? What specific adjustments did you have to make with work or kids or finances?",
        sensitiveContentText: "",
        options:undefined,
        otherCancer: undefined
      },
      {
        id: '',
        communityId: '6214e8959aa982c0d09b40f5',
        createdDate: new Date(''),
        promptId: "5f9c5221fdfbb52b2c86c9b5",
        question: "What happened after that?",
        sectionTitle: "Beyond",
        helpText: "",
        sensitiveContentText: "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
        options:undefined,
        otherCancer: undefined
      }
    ];

    jest.spyOn(PromptService.prototype, 'getPromptsWithCommunity').mockImplementation(() => { return Promise.resolve(prompts); });
    const res = await service.addPromptOptionValue(story, TranslationLanguage.ENGLISH);
    expect(res).toEqual(result);
  });

  it('updateStoryCollection - success', async () => {
    mockMongo.updateByQuery.mockReturnValue(1);
    const res = await service.updateStoryCollection('6182b629a7c6e3001d9fb574', true, story);
    expect(res).toEqual(true);
  });

  it('updateStoryCollection - fail', async () => {
    mockMongo.updateByQuery.mockReturnValue(0);
    const res = await service.updateStoryCollection('6182b629a7c6e3001d9fb574', true, story);
    expect(res).toEqual(false);
  });

  it('getCommunityByIdOrUserId - success', async () => {
    const pageParm: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };
    mockMongo.readByID.mockReturnValue({ ...story.author, active: true });
    mockMongo.getDocumentCount.mockReturnValue(1);
    mockCommunity.getCommunityById.mockReturnValue({
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '6214e8959aa982c0d09b40f5',
          createdBy: '5f99844130b711000703cd74',
          title: 'Cancer',
          category: 'Cancer',
          categoryId: '5f8759dc54fdb7a2c9ae9d0f',
          type: 'non-clinical',
          createdDate: new Date('2022-02-22T13:43:49.109Z'),
          createdAt: new Date('2022-02-22T13:43:49.109Z'),
          displayName: {
            en: "Cancer",
            es: "Cáncer"
          }
        }
      }
    });
    const expRes = [
      {
        id: "6182b629a7c6e3001d9fb574",
        createdDate: "2021-11-03T16:17:45.052Z",
        updatedDate: "2021-11-03T16:17:45.052Z",
        displayName: "potter",
        authorId: "612cc846c448c2002b321cdf",
        authorAgeWhenStoryBegan: 12,
        relation: "Myself",
        featuredQuote: "testinmad lib",
        relationAgeWhenDiagnosed: 60,
        communityId: "6214e8959aa982c0d09b40f5",
        storyText: "Placeholder story text",
        published: false,
        removed: false,
        flagged: false,
        hasStoryBeenPublishedOnce: true,
        author: {
          displayName: "potter",
          id: "612cc846c448c2002b321cdf",
          gender: "Male",
          genderRoles: {
            genderPronoun: "he",
            genderPronounPossessive: "his",
          },
          profilePicture: "https://dev.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
          fullName: "SUB undefined",
          firstName: "SUB",
          communities: [],
          age: 10,
        },
        answer: [
          {
            id: "6183e3f0720cf80016b7baf3",
            promptId: "",
            response: "Give me some answers",
            question: "hello potter!",
            questionAuthorId: "6131f55a21815b0023ca6ac3",
            questionAuthorFirstName: "SUB",
            questionAuthorProfilePicture: "https://dev.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
            questionAuthorDisplayName: "potter",
            sensitiveContentText: "",
            createdDate: {
            },
            updatedDate: {
            },
            order: 0,
            type: "UserQuestion",
          },
        ],
        communityName: "Cancer",
        questionsAskedByCurrentUser: [
          {
            id: "616016f18d84b9001519dc62",
            createdDate: "2021-11-03T16:17:45.052Z",
            updatedDate: "2021-11-03T16:17:45.052Z",
            answer: [
              {
                id: "6183e3f0720cf80016b7baf3",
                promptId: "",
                response: "Give me some answers",
                question: "hello potter!",
                questionAuthorId: "6131f55a21815b0023ca6ac3",
                questionAuthorFirstName: "SUB",
                questionAuthorProfilePicture: "https://dev.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
                questionAuthorDisplayName: "potter",
                sensitiveContentText: "",
                createdDate: {
                },
                updatedDate: {
                },
                order: 0,
                type: "UserQuestion",
              },
            ],
            displayName: "potter",
            authorId: "612cc846c448c2002b321cdf",
            authorAgeWhenStoryBegan: 54,
            relation: "Husband",
            featuredQuote: "If blocked - You don't get notifications",
            relationAgeWhenDiagnosed: 55,
            communityId: "6214e8959aa982c0d09b40f5",
            storyText: "Placeholder story text",
            published: false,
            removed: false,
            flagged: false,
            hasStoryBeenPublishedOnce: true,
            author: {
              displayName: "potter",
              id: "612cc846c448c2002b321cdf",
              gender: "Male",
              genderRoles: {
                genderPronoun: "he",
                genderPronounPossessive: "his",
              },
              profilePicture: "https://sit.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
              fullName: "SUB TEAM",
              firstName: "SUB",
              communities: [
                "607e7c99d0a2b533bb2ae3d2",
                "60a358bc9c336e882b19bbf0",
                "60e2e7277c37b43a668a32f2",
                "6214e8959aa982c0d09b40f5",
              ],
              age: undefined,
            },
            communityName: "Cancer",
            questionsAskedByCurrentUser: [
            ],
            reactionCount: {
              like: 2,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 2,
            },
            userReaction: "null",
            profilePicture: null,
          },
          {
            id: "6182b629a7c6e3001d9fb574",
            createdDate: "2021-11-03T16:17:45.052Z",
            updatedDate: "2021-11-03T16:17:45.052Z",
            answer: [
            ],
            displayName: "potter",
            authorId: "612cc846c448c2002b321cdf",
            authorAgeWhenStoryBegan: 12,
            relation: "Myself",
            featuredQuote: "testinmad lib",
            relationAgeWhenDiagnosed: 60,
            communityId: "6214e8959aa982c0d09b40f5",
            storyText: "Placeholder story text",
            published: false,
            removed: false,
            flagged: false,
            hasStoryBeenPublishedOnce: true,
            author: {
              displayName: "potter",
              id: "612cc846c448c2002b321cdf",
              gender: "Male",
              genderRoles: {
                genderPronoun: "he",
                genderPronounPossessive: "his",
              },
              profilePicture: "https://sit.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
              fullName: "SUB TEAM",
              firstName: "SUB",
              communities: [
                "607e7c99d0a2b533bb2ae3d2",
                "60a358bc9c336e882b19bbf0",
                "60e2e7277c37b43a668a32f2",
                "6214e8959aa982c0d09b40f5",
              ],
              age: undefined,
            },
            communityName: "Cancer",
            questionsAskedByCurrentUser: [
            ],
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            profilePicture: null,
          },
        ],
        reactionCount: {
          like: 0,
          care: 0,
          celebrate: 0,
          good_idea: 0,
          total: 0,
        },
        userReaction: "null",
      },
      {
        id: "616016f18d84b9001519dc62",
        createdDate: {
        },
        updatedDate: {
        },
        answer: [
          {
            id: "6183e3f0720cf80016b7baf3",
            promptId: "",
            response: "Give me some answers",
            question: "hello potter!",
            questionAuthorId: "6131f55a21815b0023ca6ac3",
            questionAuthorFirstName: "SUB",
            questionAuthorProfilePicture: "https://dev.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
            questionAuthorDisplayName: "potter",
            sensitiveContentText: "",
            createdDate: {
            },
            updatedDate: {
            },
            order: 0,
            type: "UserQuestion",
          },
        ],
        displayName: "potter",
        authorId: "612cc846c448c2002b321cdf",
        authorAgeWhenStoryBegan: 54,
        relation: "Husband",
        featuredQuote: "If blocked - You don't get notifications",
        relationAgeWhenDiagnosed: 55,
        communityId: "6214e8959aa982c0d09b40f5",
        storyText: "Placeholder story text",
        published: false,
        removed: false,
        flagged: false,
        hasStoryBeenPublishedOnce: true,
        author: {
          displayName: "potter",
          id: "612cc846c448c2002b321cdf",
          gender: "Male",
          genderRoles: {
            genderPronoun: "he",
            genderPronounPossessive: "his",
          },
          profilePicture: "https://dev.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
          fullName: "SUB undefined",
          firstName: "SUB",
          communities: [
          ],
          age: 10,
        },
        communityName: "Cancer",
        questionsAskedByCurrentUser: [
          {
            id: "616016f18d84b9001519dc62",
            createdDate: {
            },
            updatedDate: {
            },
            answer: [
              {
                id: "6183e3f0720cf80016b7baf3",
                promptId: "",
                response: "Give me some answers",
                question: "hello potter!",
                questionAuthorId: "6131f55a21815b0023ca6ac3",
                questionAuthorFirstName: "SUB",
                questionAuthorProfilePicture: "https://dev.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
                questionAuthorDisplayName: "potter",
                sensitiveContentText: "",
                createdDate: {
                },
                updatedDate: {
                },
                order: 0,
                type: "UserQuestion",
              },
            ],
            displayName: "potter",
            authorId: "612cc846c448c2002b321cdf",
            authorAgeWhenStoryBegan: 54,
            relation: "Husband",
            featuredQuote: "If blocked - You don't get notifications",
            relationAgeWhenDiagnosed: 55,
            communityId: "6214e8959aa982c0d09b40f5",
            storyText: "Placeholder story text",
            published: false,
            removed: false,
            flagged: false,
            hasStoryBeenPublishedOnce: true,
            author: {
              displayName: "potter",
              id: "612cc846c448c2002b321cdf",
              gender: "Male",
              genderRoles: {
                genderPronoun: "he",
                genderPronounPossessive: "his",
              },
              profilePicture: "https://sit.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
              fullName: "SUB TEAM",
              firstName: "SUB",
              communities: [
                "607e7c99d0a2b533bb2ae3d2",
                "60a358bc9c336e882b19bbf0",
                "60e2e7277c37b43a668a32f2",
                "6214e8959aa982c0d09b40f5",
              ],
              age: undefined,
            },
            communityName: "Cancer",
            questionsAskedByCurrentUser: [
            ],
            reactionCount: {
              like: 2,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 2,
            },
            userReaction: "null",
            profilePicture: null,
          },
          {
            id: "6182b629a7c6e3001d9fb574",
            createdDate: {
            },
            updatedDate: {
            },
            answer: [
            ],
            displayName: "potter",
            authorId: "612cc846c448c2002b321cdf",
            authorAgeWhenStoryBegan: 12,
            relation: "Myself",
            featuredQuote: "testinmad lib",
            relationAgeWhenDiagnosed: 60,
            communityId: "6214e8959aa982c0d09b40f5",
            storyText: "Placeholder story text",
            published: false,
            removed: false,
            flagged: false,
            hasStoryBeenPublishedOnce: true,
            author: {
              displayName: "potter",
              id: "612cc846c448c2002b321cdf",
              gender: "Male",
              genderRoles: {
                genderPronoun: "he",
                genderPronounPossessive: "his",
              },
              profilePicture: "https://sit.api.sydney-community.com/v2/users/profileImageString/612cc846c448c2002b321cdf",
              fullName: "SUB TEAM",
              firstName: "SUB",
              communities: [
                "607e7c99d0a2b533bb2ae3d2",
                "60a358bc9c336e882b19bbf0",
                "60e2e7277c37b43a668a32f2",
                "6214e8959aa982c0d09b40f5",
              ],
              age: undefined,
            },
            communityName: "Cancer",
            questionsAskedByCurrentUser: [
            ],
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            profilePicture: null,
          },
        ],
        reactionCount: {
          like: 0,
          care: 0,
          celebrate: 0,
          good_idea: 0,
          total: 0,
        },
        userReaction: "null",
      },
    ];
    mockMongo.readAllByValue.mockReturnValueOnce(expRes).mockReturnValueOnce([{
      id: "61b721c4cab682002dd8aa9c",
      blockedUser: "61796cad30cd04002b54e39e",
      blockingUser: "6131f55e21815b0023ca6ac4",
      createdDate: "2021-12-13T10:34:44.084Z"
    }]);
    mockUserHelper.getAuthor.mockReturnValue(story.author);
    mockValidation.sort.mockReturnValue(expRes[0].answer);
    await service.getCommunityByIdOrUserId(story.communityId, pageParm, 'currentUserId', true, true);
  });

  it('getCommunityByIdOrUserId - User Not active', async () => {
    const pageParm: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: -1
    };
    mockMongo.readByID.mockReturnValue({ ...story.author, active: false });
    const expRes: BaseResponse = {
      data: {
        isSuccess: true,
        isException: false,
        errors: [
          {
            id: "0b471e52-80ab-d83a-f9b4-ce30d82cfc12",
            errorCode: 400,
            title: "User not active",
            detail: "This user is not active and has read only access"
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.getCommunityByIdOrUserId(story.communityId, pageParm, 'currentUserId', true, true);
    expect(res).toEqual(expRes);
  });
});
