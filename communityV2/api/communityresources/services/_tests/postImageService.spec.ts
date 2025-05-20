import {
  mockMongo,
  mockResult,
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Post } from 'api/communityresources/models/postsModel';
import { ObjectId } from 'mongodb';
import { PostImageService } from '../postImageService';

describe('Activity Service', () => {
  let service: PostImageService;
  beforeEach(() => {
    service = new PostImageService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const response = {
    postId: "postId",
    id: "id",
    postImageBase64: ""
  };

  const post = {
    id: new ObjectId(),
    content: {
      link: {
        isImageUploaded: true
      }
    }
  }

  const post2= {
    id: new ObjectId(),
    content: {
      link: {
        isImageUploaded: false
      }
    }
  }

  describe('getPostImage', async () => {
    it('error', async () => {
      mockMongo.readByValue.mockReturnValue(null);

      await service.getPostImage("postId");
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('success', async () => {
      mockMongo.readByValue.mockReturnValue(response);

      await service.getPostImage("postId");
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('exception', async () => {
      mockMongo.readByValue.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);

      await service.getPostImage("postId");
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('buildPostImagePath', async () => {
    it('null', async () => {
      mockMongo.readByValue.mockReturnValue(null);

      await service.buildPostImagePath('postId');
    });

    it('null', async () => {
      mockMongo.readByValue.mockReturnValue(response);

      await service.buildPostImagePath(null);
    });

    it('success', async () => {
      mockMongo.readByValue.mockReturnValue(response);

      await service.buildPostImagePath('postId');
    });
  });

  describe('setPostImage', async () => {
    it('success', async () => {
      mockMongo.readByValue.mockReturnValue(response);

      await service.setPostImage(post as unknown as Post);
    });

    it('success', async () => {
      mockMongo.readByValue.mockReturnValue(response);

      await service.setPostImage(post2 as unknown as Post);
    });


  });
});
