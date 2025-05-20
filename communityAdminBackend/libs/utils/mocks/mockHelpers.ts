import { MetricsHelper } from 'api/adminresources/helpers/metricsHelper';
import { StoryHelperService } from 'api/adminresources/helpers/storyHelper';
import { Mockify } from './mockify';

export const mockStoryHelper: Mockify<StoryHelperService> = {
  emailService: jest.fn(),
  adminUserService: jest.fn(),
  userNotification: jest.fn(),
  handleUserActivityForStory: jest.fn(),
  notifyUserOverStory: jest.fn(),
  getStoryAuthor: jest.fn(),
  readStoryCollection: jest.fn(),
  handleReactions: jest.fn(),
  formateComments: jest.fn()
};

export const mockMetricsHelper: Mockify<MetricsHelper> = {
  getUsersCount: jest.fn(),
  getUsersWhoJoinedMoreThanOneCommunity: jest.fn(),
  getPNEnabledUserCount: jest.fn()
};
