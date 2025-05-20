import { TranslationLanguage } from "@anthem/communityapi/common";
import { mockResult, mockValidation, postsSvc } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { RequestContext } from "@anthem/communityapi/utils";
import { CommentRequest, DeleteCommentRequest, ReactionRequest, ReplyRequest } from "api/communityresources/models/postsModel";
import { PostsController } from "../postsController";

describe("PostsnController", () => {
  let ctrl: PostsController;

  const mockRequestContext = jest.fn().mockReturnValue("{\"name\":\"~SIT3SBB000008AB\",\"id\":\"61604cdd33b45d0023d0db61\",\"firstName\":\"PHOEBE\",\"lastName\":\"STINSON\",\"active\":\"true\",\"isDevLogin\":\"true\",\"iat\":1642001503,\"exp\":1642030303,\"sub\":\"~SIT3SBB000008AB\",\"jti\":\"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019\"}");
  const communityId = '60e2e7277c37b43a668a32f2';
  const postId = '61dd8c62889ea4001519e705';

  beforeEach(() => {
    ctrl = new PostsController(<any>postsSvc, <any> mockValidation, <any>mockResult, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GetAllPosts - Validate Invalid Page number', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "8605fc37-e5df-967f-d4c7-ffe76789ffad",
          errorCode: 400,
          title: "Incorrect model",
          detail: "Page number can be greater than 0 only",
        }
      }
    };

    const language = TranslationLanguage.ENGLISH;
    const pageNumber = -1;
    const pageSize = 10;
    const published = true;
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isValid.mockReturnValue({
      validationResult: false,
      reason: 'Page number can be greater than 0 only'
    });
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getAllPosts(pageNumber, pageSize, published, language);
    expect(res).toEqual(expRes);
  });

  it('GetAllPosts - Undefined Published', async () => {
    const successEnglish = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            communities: [
              "5f0e744536b382377497ecef",
            ],
            content: {
              title: "Gajhni",
              body: "Zombie",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "6197d6aa4b8aa1e7702a13e4",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61ddac86ecd939002a428924",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "hi parenting",
              body: "hello",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "61cd9b906ed9ad001cdbc708",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd8c62889ea4001519e705",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 2,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "new weight mgmt 3",
              body: "new weight mgmt 3",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd8aca40fb200015b8bd0f",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "new weight mgmt 1",
              body: "new weight mgmt 1",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd8a0fecd939002a4288eb",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "new weight mgmt",
              body: "new weight mgmt",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd89c9eecc4d0023ad6102",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "607e7c99d0a2b533bb2ae3d2",
            ],
            content: {
              title: "Hi There",
              body: "Body smileys",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "6197d6aa4b8aa1e7702a13e4",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd7d7b0c872100232a0cb3",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 8,
          },
          {
            communities: [
              "5f245386aa271e24b0c6fd89",
            ],
            content: {
              title: "test test 2",
              body: "body",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd7712e055cc001cd8c065",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "5f0e744536b382377497ecef",
            ],
            content: {
              title: "new thing",
              body: "new thing",
              link: "new thing",
              deepLink: "",
              image: "profileImageString",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "612cf5b16921eb0016e396b6",
                  reaction: "celebrate",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "6127690664615f001c99d30a",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 1,
                good_idea: 0,
                total: 2,
              },
            },
            id: "61dd770ce055cc001cd8c02d",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 1,
              good_idea: 0,
              total: 2,
            },
            userReaction: "null",
            commentCount: 5,
          },
          {
            communities: [
              "5f245386aa271e24b0c6fd89",
            ],
            content: {
              title: "test test test",
              body: "body",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd768cecd939002a4288d9",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "Test post",
              body: "Test post",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "6127881a7ff27200241bda35",
                  reaction: "celebrate",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 0,
                celebrate: 1,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd7305889ea4001519e6ca",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 1,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 1,
          },
        ],
      },
    };

    const language = TranslationLanguage.ENGLISH;
    const pageNumber = 1;
    const pageSize = 10;
    const published = undefined;
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isValid.mockReturnValue({
      validationResult: true
    });
    postsSvc.getAllPosts.mockReturnValue(successEnglish);
    const res = await ctrl.getAllPosts(pageNumber, pageSize, published, language);
    expect(res).toEqual(successEnglish);
  });

  it('GetAllPosts - Language not defined', async () => {
    const successEnglish = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            communities: [
              "5f0e744536b382377497ecef",
            ],
            content: {
              title: "Gajhni",
              body: "Zombie",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "6197d6aa4b8aa1e7702a13e4",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61ddac86ecd939002a428924",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "hi parenting",
              body: "hello",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "61cd9b906ed9ad001cdbc708",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd8c62889ea4001519e705",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 2,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "new weight mgmt 3",
              body: "new weight mgmt 3",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd8aca40fb200015b8bd0f",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "new weight mgmt 1",
              body: "new weight mgmt 1",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd8a0fecd939002a4288eb",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "new weight mgmt",
              body: "new weight mgmt",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd89c9eecc4d0023ad6102",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "607e7c99d0a2b533bb2ae3d2",
            ],
            content: {
              title: "Hi There",
              body: "Body smileys",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "6197d6aa4b8aa1e7702a13e4",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd7d7b0c872100232a0cb3",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 8,
          },
          {
            communities: [
              "5f245386aa271e24b0c6fd89",
            ],
            content: {
              title: "test test 2",
              body: "body",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd7712e055cc001cd8c065",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "5f0e744536b382377497ecef",
            ],
            content: {
              title: "new thing",
              body: "new thing",
              link: "new thing",
              deepLink: "",
              image: "profileImageString",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "612cf5b16921eb0016e396b6",
                  reaction: "celebrate",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "6127690664615f001c99d30a",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 1,
                good_idea: 0,
                total: 2,
              },
            },
            id: "61dd770ce055cc001cd8c02d",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 1,
              good_idea: 0,
              total: 2,
            },
            userReaction: "null",
            commentCount: 5,
          },
          {
            communities: [
              "5f245386aa271e24b0c6fd89",
            ],
            content: {
              title: "test test test",
              body: "body",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            id: "61dd768cecd939002a4288d9",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 0,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60a358bc9c336e882b19bbf0",
            ],
            content: {
              title: "Test post",
              body: "Test post",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "6127881a7ff27200241bda35",
                  reaction: "celebrate",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 0,
                celebrate: 1,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd7305889ea4001519e6ca",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 1,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 1,
          },
        ],
      },
    };

    const language = undefined;
    const pageNumber = 1;
    const pageSize = 10;
    const published = true;

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isValid.mockReturnValue({
      validationResult: true
    });
    postsSvc.getAllPosts.mockReturnValue(successEnglish);
    const res = await ctrl.getAllPosts(pageNumber, pageSize, published, language);
    expect(res).toEqual(successEnglish);
  });

  it('GetAllPostsForCommunity - Validate Invalid Page number', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "8605fc37-e5df-967f-d4c7-ffe76789ffad",
          errorCode: 400,
          title: "Incorrect model",
          detail: "Page number can be greater than 0 only",
        }
      }
    };

    const language = TranslationLanguage.ENGLISH;
    const pageNumber = -1;
    const pageSize = 10;
    const published = true;
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isValid.mockReturnValue({
      validationResult: false,
      reason: 'Page number can be greater than 0 only'
    });
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getAllPostsForCommunity(communityId, pageNumber, pageSize, published, language);
    expect(res).toEqual(expRes);
  });

  it('GetAllPostsForCommunity - Undefined Published', async () => {
    const successEnglish = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "hi parenting",
              body: "hello",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "61cd9b906ed9ad001cdbc708",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd8c62889ea4001519e705",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 2,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "Hello",
              body: "This is my first post",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: false,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "celebrate",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "61cd9b906ed9ad001cdbc708",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 1,
                good_idea: 0,
                total: 2,
              },
            },
            id: "61d86e13cb68a20016887dc7",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 1,
              good_idea: 0,
              total: 2,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "Hi my name is Raven",
              body: "It's nice to meet you. I can't wait to get to know everyone.",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: false,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61d72d298b26ea002ce2eb1f",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 5,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "Test Parenting Post",
              body: "This is a test post.",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: false,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "6197d6aa4b8aa1e7702a13e4",
                  reaction: "remove",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61d72c8acb68a20016887d96",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "2nd Post",
              body: "According to the Oxford English Dictionary (third edition 2009), the name \"India\" is derived from the Classical Latin India, a reference to South Asia and an uncertain region to its east; and in turn derived successively from: Hellenistic Greek India ( Ἰνδία); ancient Greek Indos ( Ἰνδός);",
              link: "https://en.wikipedia.org/wiki/India",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "good_idea",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "61d475ebe09464001cefb80d",
                  reaction: "remove",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 0,
                celebrate: 0,
                good_idea: 1,
                total: 1,
              },
            },
            id: "61cea86c732aab00235fafe4",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 1,
              total: 1,
            },
            userReaction: "null",
            commentCount: 5,
          },
        ],
      },
    };
    const language = TranslationLanguage.ENGLISH;
    const pageNumber = 1;
    const pageSize = 10;
    const published = undefined;

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isValid.mockReturnValue({
      validationResult: true
    });
    postsSvc.getAllPostsForCommunity.mockReturnValue(successEnglish);
    const res = await ctrl.getAllPostsForCommunity(communityId, pageNumber, pageSize, published, language);
    expect(res).toEqual(successEnglish);
  });

  it('GetAllPostsForCommunity - Language not defined', async () => {
    const successEnglish = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "hi parenting",
              body: "hello",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "61cd9b906ed9ad001cdbc708",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61dd8c62889ea4001519e705",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 2,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "Hello",
              body: "This is my first post",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: false,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "celebrate",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "61cd9b906ed9ad001cdbc708",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 1,
                good_idea: 0,
                total: 2,
              },
            },
            id: "61d86e13cb68a20016887dc7",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 1,
              good_idea: 0,
              total: 2,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "Hi my name is Raven",
              body: "It's nice to meet you. I can't wait to get to know everyone.",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: false,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "care",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 1,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61d72d298b26ea002ce2eb1f",
            reactionCount: {
              like: 0,
              care: 1,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 5,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "Test Parenting Post",
              body: "This is a test post.",
              link: "",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: false,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            editedAfterPublish: false,
            author: {
              firstName: "Raven",
              lastName: "P",
              displayName: "Raven P",
              role: "scadvocate",
              id: "6197d6aa4b8aa1e7702a13e4",
              profileImage: "",
              displayTitle: "Community Advocate",
            },
            reactions: {
              log: [
                {
                  userId: "6197d6aa4b8aa1e7702a13e4",
                  reaction: "remove",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "like",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 1,
                care: 0,
                celebrate: 0,
                good_idea: 0,
                total: 1,
              },
            },
            id: "61d72c8acb68a20016887d96",
            reactionCount: {
              like: 1,
              care: 0,
              celebrate: 0,
              good_idea: 0,
              total: 1,
            },
            userReaction: "null",
            commentCount: 0,
          },
          {
            communities: [
              "60e2e7277c37b43a668a32f2",
            ],
            content: {
              title: "2nd Post",
              body: "According to the Oxford English Dictionary (third edition 2009), the name \"India\" is derived from the Classical Latin India, a reference to South Asia and an uncertain region to its east; and in turn derived successively from: Hellenistic Greek India ( Ἰνδία); ancient Greek Indos ( Ἰνδός);",
              link: "https://en.wikipedia.org/wiki/India",
              deepLink: "",
              image: "",
            },
            createdDate: {
            },
            updatedDate: {
            },
            published: true,
            isNotify: true,
            hasContentBeenPublishedOnce: true,
            flagged: false,
            removed: false,
            author: {
              firstName: "",
              lastName: "",
              displayName: "Sydney Community",
              role: "scadmin",
              id: "6197d6364b8aa1e7702a13e3",
              profileImage: "",
              displayTitle: "",
            },
            reactions: {
              log: [
                {
                  userId: "611b89667f07f467cae13a44",
                  reaction: "good_idea",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
                {
                  userId: "61d475ebe09464001cefb80d",
                  reaction: "remove",
                  createdDate: {
                  },
                  updatedDate: {
                  },
                },
              ],
              count: {
                like: 0,
                care: 0,
                celebrate: 0,
                good_idea: 1,
                total: 1,
              },
            },
            id: "61cea86c732aab00235fafe4",
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 1,
              total: 1,
            },
            userReaction: "null",
            commentCount: 5,
          },
        ],
      },
    };
    const language = undefined;
    const pageNumber = 1;
    const pageSize = 10;
    const published = true;

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isValid.mockReturnValue({
      validationResult: true
    });
    postsSvc.getAllPostsForCommunity.mockReturnValue(successEnglish);
    const res = await ctrl.getAllPostsForCommunity(communityId, pageNumber, pageSize, published, language);
    expect(res).toEqual(successEnglish);
  });

  it('Get Post By Id - Language not defined', async () => {
    const successEnglish = {
      isSuccess: true,
      isException: false,
      value: {
        communities: [
          "60e2e7277c37b43a668a32f2",
        ],
        content: {
          title: "hi parenting",
          body: "hello",
          link: "",
          deepLink: "",
          image: "",
        },
        createdDate: {
        },
        updatedDate: {
        },
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: true,
        flagged: false,
        removed: false,
        editedAfterPublish: false,
        author: {
          firstName: "",
          lastName: "",
          displayName: "Sydney Community",
          role: "scadmin",
          id: "6197d6364b8aa1e7702a13e3",
          profileImage: "",
          displayTitle: "",
        },
        comments: [
          {
            comment: "Hey admin",
            createdAt: {
            },
            updatedAt: {
            },
            flagged: false,
            removed: false,
            isCommentTextProfane: false,
            author: {
              id: "61cd9b906ed9ad001cdbc708",
              firstName: "JULISSA",
              lastName: "PRIOLO",
              displayName: "Juli",
              profileImage: "https://sit.api.sydney-community.com/v2/users/profileImageString/61cd9b906ed9ad001cdbc708",
            },
            replies: [
              {
                comment: "heyy",
                createdAt: {
                },
                updatedAt: {
                },
                flagged: false,
                removed: false,
                author: {
                  id: "6197d6364b8aa1e7702a13e3",
                  firstName: "",
                  lastName: "",
                  displayName: "Sydney Community",
                  displayTitle: "",
                  profileImage: "",
                  role: "scadmin",
                },
                reactionCount: {
                  like: 0,
                  care: 0,
                  celebrate: 0,
                  good_idea: 0,
                  total: 0,
                },
                userReaction: "null",
                id: "61cd9b906ed9ad001cdbc708"
              },
            ],
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 1,
              total: 1,
            },
            userReaction: "null",
            id: "61cd9b906ed9ad001cdbc708"
          },
        ],
        reactionCount: {
          like: 1,
          care: 0,
          celebrate: 0,
          good_idea: 0,
          total: 1,
        },
        userReaction: "null",
        commentCount: 2,
        id: postId
      }
    };
    const language = undefined;

    RequestContext.getContextItem = mockRequestContext;
    postsSvc.getPostById.mockReturnValue(successEnglish);
    const res = await ctrl.getPostById(postId, language);
    expect(res).toEqual(successEnglish);
  });

  it('UpsertComment - Valid Parameters - Create a comment', async () => {
    const successMsg = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: 'Test  Comments - for',
          createdAt: '2022-01-12T09:47:11.310Z',
          updatedAt: '2022-01-12T09:47:11.310Z',
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: '61604cdd33b45d0023d0db61',
            firstName: 'PHOEBE',
            lastName: 'STINSON',
            displayName: 'Phoebe '
          },
          id: '61dea39f735a68397ff34a0a'
        }
      }
    };
    const payload: CommentRequest = {
      postId: postId,
      comment: 'Test  Comments - for',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: false
    });

    postsSvc.upsertComment.mockReturnValue(successMsg);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(successMsg);
  });

  it('UpsertComment - Valid Parameters - Edit a comment', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const payload: CommentRequest = {
      postId: postId,
      comment: 'Test  Comments - for',
      id: '61dea39f735a68397ff34a0a',
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: false
    });
    postsSvc.upsertComment.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertComment - post id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: CommentRequest = {
      postId: postId,
      comment: 'Test  Comments - for',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertComment - comment null check', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Bad data",
          detail: "Comment cannot be empty"
        }
      }
    };
    const payload: CommentRequest = {
      postId: postId,
      comment: null,
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertComment - comment is moderated', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        message: 'CommentModerationError',
        value:
        {
          postId: postId,
          comment: 'profaneContent',
          isCommentTextProfane: true
        }
      }
    };
    const payload: CommentRequest = {
      postId: postId,
      comment: 'profaneContent',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: true
    });
    mockResult.createExceptionWithValue.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReply - post id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: ReplyRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      comment: 'Test  Comments - for',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReply - reply null check', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Bad data",
          detail: "Comment cannot be empty"
        }
      }
    };
    const payload: ReplyRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      comment: null,
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReply - reply is moderated', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        message: 'CommentModerationError',
        value:
        {
          postId: postId,
          comment: 'profaneContent',
          isCommentTextProfane: true
        }
      }
    };
    const payload: ReplyRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      comment: 'profaneContent',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: true
    });
    mockResult.createExceptionWithValue.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReply - reply is created', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: 'Test  Comments - for',
          createdAt: '2022-01-12T09:47:11.310Z',
          updatedAt: '2022-01-12T09:47:11.310Z',
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: '61604cdd33b45d0023d0db61',
            firstName: 'PHOEBE',
            lastName: 'STINSON',
            displayName: 'Phoebe '
          },
          id: '61dea39f735a68397ff34a0a'
        }
      }
    };
    const payload: ReplyRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      comment: 'content',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: false
    });
    postsSvc.upsertReply.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReaction - post id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: ReactionRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      type: 'comment',
      reaction: 'like',
      replyId: undefined,
      language: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertReaction(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReaction - create reaction', async () => {
    const expRes = {
      isSuccess: true,
      isException: false,
      value: {
        communities: [
          "60e2e7277c37b43a668a32f2",
        ],
        content: {
          title: "hi parenting",
          body: "hello",
          link: "",
          deepLink: "",
          image: "",
        },
        createdDate: {
        },
        updatedDate: {
        },
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: true,
        flagged: false,
        removed: false,
        editedAfterPublish: false,
        author: {
          firstName: "",
          lastName: "",
          displayName: "Sydney Community",
          role: "scadmin",
          id: "6197d6364b8aa1e7702a13e3",
          profileImage: "",
          displayTitle: "",
        },
        comments: [
          {
            comment: "Hey admin",
            createdAt: {
            },
            updatedAt: {
            },
            flagged: false,
            removed: false,
            isCommentTextProfane: false,
            author: {
              id: "61cd9b906ed9ad001cdbc708",
              firstName: "JULISSA",
              lastName: "PRIOLO",
              displayName: "Juli",
              profileImage: "https://sit.api.sydney-community.com/v2/users/profileImageString/61cd9b906ed9ad001cdbc708",
            },
            replies: [
              {
                comment: "heyy",
                createdAt: {
                },
                updatedAt: {
                },
                flagged: false,
                removed: false,
                author: {
                  id: "6197d6364b8aa1e7702a13e3",
                  firstName: "",
                  lastName: "",
                  displayName: "Sydney Community",
                  displayTitle: "",
                  profileImage: "",
                  role: "scadmin",
                },
                reactionCount: {
                  like: 1,
                  care: 0,
                  celebrate: 0,
                  good_idea: 0,
                  total: 1,
                },
                userReaction: "like",
                id: "61cd9b906ed9ad001cdbc708"
              },
            ],
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 1,
              total: 1,
            },
            userReaction: "null",
            id: postId
          },
        ],
        reactionCount: {
          like: 1,
          care: 0,
          celebrate: 0,
          good_idea: 0,
          total: 1,
        },
        userReaction: "null",
        commentCount: 2,
        id: postId
      }
    };
    const payload: ReactionRequest = {
      postId: postId,
      commentId: '61cd9b906ed9ad001cdbc708',
      type: 'comment',
      reaction: 'like',
      replyId: undefined,
      language: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    postsSvc.upsertReaction.mockReturnValue(expRes);
    const res = await ctrl.upsertReaction(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReaction - remove reaction', async () => {
    const expRes = {
      isSuccess: true,
      isException: false,
      value: {
        communities: [
          "60e2e7277c37b43a668a32f2",
        ],
        content: {
          title: "hi parenting",
          body: "hello",
          link: "",
          deepLink: "",
          image: "",
        },
        createdDate: {
        },
        updatedDate: {
        },
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: true,
        flagged: false,
        removed: false,
        editedAfterPublish: false,
        author: {
          firstName: "",
          lastName: "",
          displayName: "Sydney Community",
          role: "scadmin",
          id: "6197d6364b8aa1e7702a13e3",
          profileImage: "",
          displayTitle: "",
        },
        comments: [
          {
            comment: "Hey admin",
            createdAt: {
            },
            updatedAt: {
            },
            flagged: false,
            removed: false,
            isCommentTextProfane: false,
            author: {
              id: "61cd9b906ed9ad001cdbc708",
              firstName: "JULISSA",
              lastName: "PRIOLO",
              displayName: "Juli",
              profileImage: "https://sit.api.sydney-community.com/v2/users/profileImageString/61cd9b906ed9ad001cdbc708",
            },
            replies: [
              {
                comment: "heyy",
                createdAt: {
                },
                updatedAt: {
                },
                flagged: false,
                removed: false,
                author: {
                  id: "6197d6364b8aa1e7702a13e3",
                  firstName: "",
                  lastName: "",
                  displayName: "Sydney Community",
                  displayTitle: "",
                  profileImage: "",
                  role: "scadmin",
                },
                reactionCount: {
                  like: 0,
                  care: 0,
                  celebrate: 0,
                  good_idea: 0,
                  total: 0,
                },
                userReaction: "null",
                id: "61cd9b906ed9ad001cdbc708"
              },
            ],
            reactionCount: {
              like: 0,
              care: 0,
              celebrate: 0,
              good_idea: 1,
              total: 1,
            },
            userReaction: "null",
            id: postId
          },
        ],
        reactionCount: {
          like: 1,
          care: 0,
          celebrate: 0,
          good_idea: 0,
          total: 1,
        },
        userReaction: "null",
        commentCount: 2,
        id: postId
      }
    };
    const payload: ReactionRequest = {
      postId: postId,
      commentId: '61cd9b906ed9ad001cdbc708',
      type: 'comment',
      reaction: 'remove',
      replyId: undefined,
      language: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    postsSvc.upsertReaction.mockReturnValue(expRes);
    const res = await ctrl.upsertReaction(payload);
    expect(res).toEqual(expRes);
  });

  it('RemoveComment - post id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.removeComment(payload);
    expect(res).toEqual(expRes);
  });

  it('RemoveComment - reply id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID'
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.removeComment(payload);
    expect(res).toEqual(expRes);
  });

  it('RemoveComment - delete comment successfully', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID'
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    postsSvc.removeComment.mockReturnValue(expRes);
    const res = await ctrl.removeComment(payload);
    expect(res).toEqual(expRes);
  });

  it('ReportComment - post id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.reportComment(payload);
    expect(res).toEqual(expRes);
  });

  it('ReportComment - reply id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID'
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.reportComment(payload);
    expect(res).toEqual(expRes);
  });

  it('ReportComment - report comment successfully', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID'
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    postsSvc.reportComment.mockReturnValue(expRes);
    const res = await ctrl.reportComment(payload);
    expect(res).toEqual(expRes);
  });
});
