import { headers } from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import * as nodemailer from 'nodemailer';
import { Service } from 'typedi';
import { SMTPSettings } from '../models/smtpModel';

@Service()
export class EmailService {
  constructor(@LoggerParam(__filename) private _log: ILogger) {}

  public async sendEmailMessage(
    smtpSettings: SMTPSettings,
    email: string,
    subject: string,
    body: string
  ): Promise<boolean> {
    try {
      if (smtpSettings.sendEmail) {
        const mailOptions = {
          from: smtpSettings.fromEmailAddress,
          to: email,
          subject: subject,
          html: body
        };
        const transport = await nodemailer.createTransport({
          host: smtpSettings.smtpServer,
          port: smtpSettings.smtpPort,
          service: APP.config.smtpSettings.service,
          secure: true,
          tls: {
            rejectUnauthorized: false,
            minVersion: headers.TLS_VERSION
          },
          auth: {
            user: APP.config.smtpSettings.username,
            pass: APP.config.smtpSettings.password
          }
        });
        await transport.sendMail(mailOptions);
      }

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public htmlForComment(postId: string, apiPath: string): string {
    return `<p>Member commented on your post. Please click the link to view: <a href=\"${apiPath}ui/pages/engage/search/${postId}\">CLICK HERE</a></p>`;
  }

  public htmlForReply(postId: string, apiPath: string): string {
    return `<p>Member replied on your comment. Please click the link to view: <a href=\"${apiPath}ui/pages/engage/search/${postId}\">CLICK HERE</a></p>`;
  }

  public htmlForReplyForStory(story: string, url: string, storyId: string): string {
    return `<p>Member replied to you on Story: ${story}. \n
    Please click the link to view: <a href=\"${url}ui/pages/engage/view-stories;storyId=${storyId}\">CLICK HERE</a>
    </p>`;
  }

  public htmlForFlagComment(postId: string, apiPath: string, type: string): string {
    return `<h1>Flagged content warning</h1><br><p>A ${type} has been flagged. To review <a href=\"${apiPath}ui/pages/engage/search/${postId}\">CLICK HERE</a></p>`;
  }

  public htmlForKeywords(postId: string, apiPath: string): string {
    return `<h1>Sensitive Keyword used.</h1><br><p>Please click the link to review <a href=\"${apiPath}ui/pages/engage/search/${postId}\">CLICK HERE</a></p>`;
  }

  public htmlForFlagStoryComment(storyId: string, apiPath: string, type: string): string {
    return `<h1>Flagged content warning</h1><br><p>${type.charAt(0).toUpperCase() + type.slice(1)} flagged. Please click the <a href=\"${apiPath}ui/pages/engage/view-stories;storyId=${storyId}\">link</a> to review.</p>`;
  }

  public htmlForStoryModeration(storyId: string, apiPath: string): string {
    return `<h1>Sensitive Keyword used.</h1><br><p>Please click the link to review <a href=\"${apiPath}ui/pages/engage/view-stories;storyId=${storyId}\">CLICK HERE</a></p>`;
  }
}
