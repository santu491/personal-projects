import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {APP} from './app';
import {capitalizeStr} from './common';
import {decrypt} from './security/encryptionHandler';

/*
 * Send email
 * @param subject: string
 * @param body: string
 * @param toEmail: string
 * @returns Promise<boolean>
 */
export const sendEmail = async (
  subject: string,
  body: string,
  toEmail: string,
): Promise<boolean> => {
  try {
    const smtpSettings = APP.config.smtpSettings;
    if (smtpSettings.sendEmail) {
      const mailOptions = {
        from: smtpSettings.fromEmail,
        to: toEmail,
        subject: subject,
        html: body,
      };
      const transport: nodemailer.Transporter = nodemailer.createTransport({
        auth: {
          user: decrypt(APP.config.smtpSettings.smtpAuthUser),
          pass: decrypt(APP.config.smtpSettings.smtpAuthValue),
        },
        host: smtpSettings.smtpServer,
        port: smtpSettings.smtpPort,
        service: smtpSettings.service,
        // secure: true,
        secureConnection: false,
        tls: {
          ciphers: APP.config.security.SMTP_TLS,
        },
      } as SMTPTransport.Options);
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log('Email sent: ' + info.response);
          return true;
        }
      });
      transport.close();
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const emailContent = (code: string, firstName: string): string => {
  const emailTemplate = `
  <p>Verify your identity to log in.</p> 
  <p>Here’s your one-time authentication code.</p>
  <p>Hello ${capitalizeStr(firstName.toLowerCase())},</p><br>
  <p>Use this code to verify your identity: </p><h3>${code}</h3>
  <p>Once we know it’s you, you’ll have full access to the app.</p>
  <p>Thank you for using Carelon Behavioral Health member app.</p><br>
  <p><i>Carelon Behavioral Health</i></p>
  <p><i>©2024 Carelon Behavioral Health, Inc</i></p>
  `;

  return emailTemplate;
};
