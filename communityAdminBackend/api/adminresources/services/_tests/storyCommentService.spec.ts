import { API_RESPONSE } from "@anthem/communityadminapi/common";
import { mockLogger, mockMongo, mockPostHelper, mockResult } from "@anthem/communityadminapi/common/baseTest";
import { mockStoryHelper } from "@anthem/communityadminapi/utils/mocks/mockHelpers";
import { DeleteCommentRequest, StoryCommentRequest, StoryReplyRequest } from "api/adminresources/models/storyModel";
import { ObjectID } from "bson";
import { PostsService } from "../postsService";
import { StoryCommentService } from "../storyCommentService";

describe('StoryCommentService', () => {
  let svc: StoryCommentService;
  let moderationOnFieldLevel;
  const adminUser = require('test/data-sample/adminUser.json');

  beforeEach(() => {
    svc = new StoryCommentService(<any>mockMongo, <any>mockResult, <any>mockPostHelper, <any>mockStoryHelper, <any>mockLogger);
    moderationOnFieldLevel = jest.spyOn(PostsService.prototype as any, 'moderationOnFieldLevel');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertReply', () => {
    it('should add a reply to story', async () => {
      const input: StoryReplyRequest = {
        id: "",
        storyId: "6197d7664b8aa1e7702a13e5",
        commentId: "620f560cd76b9b002374b8a4",
        comment: "Test Reply",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };

      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: false
        };
      });
      mockMongo.readByID.mockReturnValue(adminUser);
      mockPostHelper.createCommentObject.mockReturnValue({ ...input, id: undefined });
      mockMongo.updateByQuery.mockReturnValue(1);
      mockStoryHelper.userNotification.mockReturnValue(true);
      await svc.upsertReply(input, adminUser);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return a bad word error', async () => {
      const input: StoryReplyRequest = {
        id: "",
        storyId: "6197d7664b8aa1e7702a13e5",
        commentId: "620f560cd76b9b002374b8a4",
        comment: "Test Reply",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: true,
          errorFields: {body: 1}
        };
      });
      await svc.upsertReply(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['title']).toBe(API_RESPONSE.messages.invalidContent);
    });

    it('should edit a reply', async () => {
      const input: StoryReplyRequest = {
        id: "6197d7764b8aa1e7802a13e5",
        storyId: "6197d7664b8aa1e7702a13e5",
        commentId: "620f560cd76b9b002374b8a4",
        comment: "Test Reply",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: false
        };
      });
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByValue.mockReturnValue({ 'story': { 'mock': true } });
      mockPostHelper.personaAdminAuthor.mockReturnValue({ admin: 'data' });
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.upsertReply(input, adminUser);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return story does not exist error', async () => {
      const input: StoryReplyRequest = {
        id: "6197d7764b8aa1e7802a13e5",
        storyId: "6197d7664b8aa1e7702a13e5",
        commentId: "620f560cd76b9b002374b8a4",
        comment: "Test Reply",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: false
        };
      });
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByValue.mockReturnValue(null);
      await svc.upsertReply(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.storyReplyDoesNotExist);
    });

    it('should throw an exception', async () => {
      const input: StoryReplyRequest = {
        id: "6197d7764b8aa1e7802a13e5",
        storyId: "6197d7664b8aa1e7702a13e5",
        commentId: "620f560cd76b9b002374b8a4",
        comment: "Test Reply",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      mockMongo.readByID.mockRejectedValue({message: 'error'});
      await svc.upsertReply(input, adminUser);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('upsertComment', () => {
    it('should create a new comment', async () => {
      const input: StoryCommentRequest = {
        id: undefined,
        storyId: "6197d7664b8aa1e7702a13e5",
        comment: "Test",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: false
        };
      });
      mockPostHelper.createCommentObject.mockReturnValue({...input, _id: new ObjectID()});
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue(adminUser);
      mockStoryHelper.userNotification.mockReturnValue(true);
      await svc.upsertComment(input, adminUser);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return bad word error', async () => {
      const input: StoryCommentRequest = {
        id: undefined,
        storyId: "6197d7664b8aa1e7702a13e5",
        comment: "Test",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: true,
          errorFields: {body: 1}
        };
      });
      await svc.upsertComment(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should update comment', async () => {
      const input: StoryCommentRequest = {
        id: "6197d7664b8aa1e8802a13e5",
        storyId: "6197d7664b8aa1e7702a13e5",
        comment: "Test",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: false
        };
      });
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByValue.mockReturnValue({ story: 'mock' });
      mockPostHelper.personaAdminAuthor.mockReturnValue({ fake: 'user' });
      mockMongo.updateByQuery.mockReturnValue(1);
      await svc.upsertComment(input, adminUser);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return story does not exist', async () => {
      const input: StoryCommentRequest = {
        id: "6197d7664b8aa1e8802a13e5",
        storyId: "6197d7664b8aa1e7702a13e5",
        comment: "Test",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      moderationOnFieldLevel.mockImplementation(() => {
        return {
          isBadWord: false
        };
      });
      mockMongo.readByID.mockReturnValue(adminUser);
      mockMongo.readByValue.mockReturnValue(null);
      await svc.upsertComment(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should throw an exception', async () => {
      const input: StoryCommentRequest = {
        id: "6197d7664b8aa1e8802a13e5",
        storyId: "6197d7664b8aa1e7702a13e5",
        comment: "Test",
        authorId: "62065e392715d2002aa45fba",
        isProfane: false
      };
      mockMongo.readByID.mockRejectedValue({message: 'error'});
      await svc.upsertComment(input, adminUser);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('removeComment', () => {
    const mockStoryData = {
      comments: [
        {
          _id: "6197d7254b8aa1e7502a13e5",
          author: {
            id: "62065e392715d2002aa45fba"
          }
        },
        {
          _id: "6234d7664b8aa1e8802a13e5",
          author: {
            id: "62067e392725d2002aa45fba"
          },
          replies: [
            {
              _id: "6197d7254b8aa1e7502b13e5",
              author: {
                id: "62067e392725d2002aa45fba"
              }
            },
            {
              _id: "6197d7664b8aa1e9992a13e5",
              author: {
                id: "62065e392715d2002aa45fba"
              }
            }
          ]
        }
      ]
    };

    it('should return success', async () => {
      const input: DeleteCommentRequest = {
        storyId: "6197d7664b8aa1e8902a13e5",
        commentId: "6234d7664b8aa1e8802a13e5",
        replyId: "6197d7664b8aa1e9992a13e5"
      };
      mockMongo.readByValue.mockReturnValue(mockStoryData);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue({});
      mockStoryHelper.handleUserActivityForStory.mockReturnValue(true);
      await svc.removeComment(input, adminUser);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return not allowed', async () => {
      const input: DeleteCommentRequest = {
        storyId: "6197d7664b8aa1e8902a13e5",
        commentId: "6234d7664b8aa1e8802a13e5",
        replyId: "6197d7254b8aa1e7502b13e5"
      };
      mockMongo.readByValue.mockReturnValue(mockStoryData);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue({});
      mockStoryHelper.handleUserActivityForStory.mockReturnValue(true);
      await svc.removeComment(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.notAllowedDeleteDetails);
    });

    it('should return comment does not exist', async () => {
      const input: DeleteCommentRequest = {
        storyId: "6197d7664b8aa1e8902a13e5",
        commentId: "6234d7664b8aa1e8802a13e5",
        replyId: "6197d7254b8aa1e7502b13e5"
      };
      mockMongo.readByValue.mockReturnValue(null);
      await svc.removeComment(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.commentDoesNotExist);
    });

    it('should return reply does not exist', async () => {
      const input: DeleteCommentRequest = {
        storyId: "6197d7664b8aa1e8902a13e5",
        commentId: "6234d7664b8aa1e8802a13e5",
        replyId: "6197d7254b8aa1e7502b13e5"
      };
      mockMongo.readByValue.mockReturnValueOnce(mockStoryData).mockReturnValue(null);
      await svc.removeComment(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.replyDoesNotExists);
    });

    it('should remove comment', async () => {
      const input: DeleteCommentRequest = {
        storyId: "6197d7664b8aa1e8902a13e5",
        commentId: "6197d7254b8aa1e7502a13e5",
        replyId: undefined
      };
      mockMongo.readByValue.mockReturnValue(mockStoryData);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue({});
      mockStoryHelper.handleUserActivityForStory.mockReturnValue(true);
      await svc.removeComment(input, adminUser);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should throw an exception', async () => {
      const input: DeleteCommentRequest = {
        storyId: "6197d7664b8aa1e8902a13e5",
        commentId: "6197d7254b8aa1e7502a13e5",
        replyId: undefined
      };
      mockMongo.readByValue.mockRejectedValue({ message: 'errpr' });
      await svc.removeComment(input, adminUser);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });

    it('should throw not allowed to remove comment', async () => {
      const input: DeleteCommentRequest = {
        storyId: "6197d7664b8aa1e8902a13e5",
        commentId: "6234d7664b8aa1e8802a13e5",
        replyId: undefined
      };
      mockMongo.readByValue.mockReturnValue(mockStoryData);
      await svc.removeComment(input, adminUser);
      expect(mockResult.createError.mock.calls.length).toBe(1);
      expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.notAllowedDeleteDetails);
    });
  });
});
