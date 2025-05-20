import { API_RESPONSE } from '@anthem/communityadminapi/common';
import { mockResult, mockStoryService, mockValidation } from '@anthem/communityadminapi/common/baseTest';
import { StoryController } from '../storyController';

describe('StoryController', () => {
  let controller: StoryController;

  const mockifiedUserContext = jest.fn().mockReturnValue("{\"id\":\"61b21e9c26dbb012b69cf67e\",\"name\":\"az00001\",\"active\":\"true\",\"role\":\"scadmin\",\"iat\":1643012245,\"exp\":1643041045,\"sub\":\"az00001\",\"jti\":\"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433\"}");

  beforeEach(() => {
    controller = new StoryController(<any>mockStoryService, <any>mockResult, <any>mockValidation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return all Removed Story: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            Id: '60aca398027ac10007e458cc',
            Author: {
              displayName: null,
              id: '60097b89bb91ed000704a22d',
              gender: 'Female',
              genderRoles: {
                GenderPronoun: 'she',
                GenderPronounPossessive: 'her'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/3e1b07b5-aa7c-4761-b449-4c7f822f3ba5.jpg',
              fullName: 'TOMAS CUI',
              firstName: 'TOMAS',
              communities: [
                '60a358bc9c336e882b19bbf0',
                '5f07537bc12e0c22d00f5d21'
              ],
              age: 70
            },
            CreatedDate: '2021-05-25T07:13:28.966Z',
            UpdatedDate: '2021-05-25T07:13:28.966Z',
            Answer: [
              {
                _id: '60aca398027ac10007e458cb',
                PromptId: '5f9c4cfafdfbb52b2c86c989',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test',
                Order: 0,
                CreatedDate: '2021-05-25T07:13:28.966Z',
                UpdatedDate: '2021-05-25T07:13:28.966Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'TOMAS',
            AuthorId: '60097b89bb91ed000704a22d',
            AuthorAgeWhenStoryBegan: 20,
            Relation: 'Father',
            FeaturedQuote: 'Test',
            RelationAgeWhenDiagnosed: 40,
            CommunityId: '5f0753b7c12e0c22d00f5d22',
            CommunityName: 'Oral Cancer',
            StoryText: 'Placeholder story text',
            Published: false,
            Removed: true,
            Flagged: false,
            HasStoryBeenPublishedOnce: false
          }
        ]
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockStoryService.getRemovedStory.mockReturnValue(expRes);
    const res = await controller.removedStory();
    expect(res).toEqual(expRes);
  });

  it('Should Return all Removed Story: Failed', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.removedStory();
    expect(res).toEqual(expRes);
  });

  it('Should Return all Removed Story: Exception', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockStoryService.getRemovedStory.mockImplementation(() => {
      throw new Error();
    })
    await controller.removedStory();
  });

  it("Should remove a story based on storyId: Success", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            id: "5fbe41b8e3f3460007cb346c",
            author: {
              displayName: "IamGAJones",
              id: "5f99844130b711000703cd74",
              gender: "Male",
              genderRoles: {
                genderPronoun: "he",
                genderPronounPossessive: "his",
              },
              profilePicture:
                "http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/6e014d87-b83f-4f13-b7f2-cdb956bf8e08.jpg",
              fullName: "George JONES",
              firstName: "Male",
              communities: [
                "5f189ba00d5f552cf445b8c2"
              ],
              age: 42,
            },
            answer: [
              {
                id: "6098f41aef1ff90007bba667",
                promptId: "5f9c4cfafdfbb52b2c86c989",
                question:
                  "If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?",
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: "",
                response: "1",
                order: 0,
                createdDate: "2021-05-10T08:51:38.491Z",
                updatedDate: "2021-05-11T10:32:11.733Z",
                type: "PromptQuestion",
              }
            ],
            displayName: "IamGAJones",
            authorId: "5f99844130b711000703cd74",
            authorAgeWhenStoryBegan: 32,
            relation: "Grandfather",
            featuredQuote:
              "Something1. User can click on 'Read All Stories' button in featured stories screen to view a **** 77",
            relationAgeWhenDiagnosed: 32,
            communityId: "5f0753b7c12e0c22d00f5d22",
            communityName: "Oral Cancer",
            storyText: "Placeholder story text",
            published: true,
            removed: true,
            flagged: false,
            hasStoryBeenPublishedOnce: true,
          },
        ],
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockStoryService.removeStory.mockReturnValue(expRes);
    const data = await controller.removeStory("5fbe41b8e3f3460007cb346c");
    expect(data).toEqual(expRes);
  });

  it("Should remove a story based on storyId: Failed User Validation", async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title : API_RESPONSE.messages.badData,
          detail : API_RESPONSE.messages.userDoesNotExist
        }
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    await controller.removeStory("5fbe41b8e3f3460007cb346c");
  });

  it("Should remove a story based on storyId: Failed Id Validation", async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.removeStory("5fbe41b8e3f3460007cb346c");
    expect(data).toEqual(expRes);
  });

  it("Should remove a story based on storyId: exception", async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error()
    })
    await controller.removeStory("5fbe41b8e3f3460007cb346c");
  });

  it("Should remove a story flag based on storyId: Success", async () => {
    const expRes = {
      data: {
        "isSuccess": true,
        "isException": false,
        "value": {
          "operation": true
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockStoryService.storyFlag.mockReturnValue(expRes);
    const data = await controller.storyFlag("5ff42eea4e5c14000721a4f6", true);
    expect(data).toEqual(expRes);
  });

  it("Should remove a story based on storyId: Failed User Validation", async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title : API_RESPONSE.messages.badData,
          detail : API_RESPONSE.messages.userDoesNotExist
        }
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.storyFlag("5fbe41b8e3f3460007cb346c", true);
    expect(data).toEqual(expRes);
  });

  it("Should remove a story based on storyId: Failed Id Validation", async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.storyFlag("5fbe41b8e3f3460007cb346c", true);
    expect(data).toEqual(expRes);
  });

  it("Should remove a story based on storyId: exception", async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error()
    })
    await controller.storyFlag("5fbe41b8e3f3460007cb346c", true);
  });
});
