import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { EmailService } from 'api/communityresources/services/emailService';

export const mockEmailService: Mockify<EmailService> = {
  sendEmailMessage: jest.fn(),
  htmlForComment: jest.fn(),
  htmlForReply: jest.fn(),
  htmlForReplyForStory: jest.fn(),
  htmlForFlagComment: jest.fn(),
  htmlForKeywords: jest.fn(),
  htmlForFlagStoryComment: jest.fn(),
  htmlForStoryModeration: jest.fn()
};
