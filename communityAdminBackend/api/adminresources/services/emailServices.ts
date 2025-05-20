import { headers } from '@anthem/communityadminapi/common';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP } from '@anthem/communityadminapi/utils';
import * as nodemailer from 'nodemailer';
import { Service } from 'typedi';
import { SMTPSettings } from '../models/smptModel';

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
}
