import { PostsService } from 'api/communityresources/services/postsService';
import { Mockify } from './mockify';

export const mockPostsServ: Mockify<PostsService> = {
  postsHelper: jest.fn(),
  reactionHelper: jest.fn(),
  getAllPosts: jest.fn(),
  getAllPostsForCommunity: jest.fn(),
  getPostById: jest.fn(),
  upsertComment: jest.fn(),
  upsertReaction: jest.fn(),
  upsertReply: jest.fn(),
  removeComment: jest.fn(),
  reportComment: jest.fn(),
  checkForKeyWords: jest.fn(),
  createActivityObject: jest.fn(),
  pollService: jest.fn()
};
