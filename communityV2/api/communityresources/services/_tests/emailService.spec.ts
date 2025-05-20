import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { SMTPSettings } from 'api/communityresources/models/smtpModel';
import { EmailService } from '../emailService';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(() => {
    service = new EmailService(<any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should send email message', async () => {
    const nodemailer = require('nodemailer');
    const createTransport = jest.spyOn(nodemailer, 'createTransport');
    createTransport.mockImplementation(() => {
      return {
        'sendMail': jest.fn()
      };
    });
    const smtpSettings: SMTPSettings = {
      smtpServer: 'awsrelay.anthem.com',
      flagReviewEmail: 'communitymoderator@anthem.com',
      adminEmail: 'communityadvocate@anthem.com',
      fromEmailAddress: 'noreply@anthem.com',
      fromEmailName: 'SydneyCommunity',
      sendEmail: true,
      smtpPort: 587,
      apiPath: 'https://sit.api.sydney-community.com/public/v2/',
      adminUrl: ''
    };
    const body = `<h1>Flagged content warning</h1><br><p>A story has been flagged. To review <a href=\"https://sit.api.communitycareexplorer.com/communitiesapi/v1/v1/api/Story/Admin/5fc9fe96e3f3460007cb34f3\">CLICK HERE</a></p>`;
    await service.sendEmailMessage(smtpSettings, 'toEmailId', 'Test Email',  body);
  });

  it('Should skip sending email message', async () => {
    const smtpSettings: SMTPSettings = {
      smtpServer: 'awsrelay.anthem.com',
      flagReviewEmail: 'communitymoderator@anthem.com',
      adminEmail: 'communityadvocate@anthem.com',
      fromEmailAddress: 'noreply@anthem.com',
      fromEmailName: 'SydneyCommunity',
      sendEmail: false,
      smtpPort: 587,
      apiPath: 'https://sit.api.sydney-community.com/public/v2/',
      adminUrl: ''
    };
    const body = `<h1>Flagged content warning</h1><br><p>A story has been flagged. To review <a href=\"https://sit.api.communitycareexplorer.com/communitiesapi/v1/v1/api/Story/Admin/5fc9fe96e3f3460007cb34f3\">CLICK HERE</a></p>`;
    await service.sendEmailMessage(smtpSettings, 'toEmailId', 'Test Email',  body);
  });

  it('should return comment link', () => {
    expect(service.htmlForComment('postId', 'path')).toContain('Member commented on your post.');
  });

  it('should return reply link', () => {
    expect(service.htmlForReply('postId', 'path')).toContain('Member replied on your comment.');
  });

  it('should return replied on story', () => {
    expect(service.htmlForReplyForStory('postId', 'url', 'path')).toContain('Member replied to you on Story:');
  });

  it('should return flagged content', () => {
    expect(service.htmlForFlagComment('postId', 'path', 'path')).toContain('/pages/engage/search/');
  });

  it('should return keywords alert', () => {
    expect(service.htmlForKeywords('postId', 'path')).toContain('ui/pages/engage/search/');
  });

  it('should return flag story comment', () => {
    expect(service.htmlForFlagStoryComment('postId', 'path', 'post')).toContain('ui/pages/engage/view-stories;storyId=');
  });

  it('should return story moderation', () => {
    expect(service.htmlForStoryModeration('storyId', 'path')).toContain('ui/pages/engage/view-stories;storyId=');
  });
});
