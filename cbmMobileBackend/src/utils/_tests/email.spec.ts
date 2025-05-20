import nodemailer from 'nodemailer';
import {emailContent, sendEmail} from '../email';
import {APP} from '../app';
import {decrypt} from '../security/encryptionHandler';
import {appConfig} from '../mockData';

jest.mock('nodemailer');

jest.mock('../security/encryptionHandler', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

describe('email', () => {
  beforeEach(() => {
    APP.config.security = appConfig.security;
    (nodemailer.createTransport as jest.Mock).mockClear();
    jest.clearAllMocks();
    APP.config.smtpSettings = {
      sendEmail: true,
      smtpPort: 1,
      service: 'service',
      tlsVersion: 'TLSv',
      smtpServer: 'smtp.com',
      fromEmail: 'noreply@carelon.com',
      fromEmailName: 'Carelon',
      subject:
        'Carelon Behavioral Health mobile app: one-time authentication code.',
      smtpAuthUser: 'user',
      smtpAuthValue: 'authValue',
    };
  });

  it('Should send Email', async () => {
    const sendMailMock = jest.fn((mailOptions, callback) => {
      callback(null, {response: 'Email sent succesfully'});
    });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
      close: jest.fn(),
    });
    (decrypt as jest.Mock).mockResolvedValue('accessToken');
    const response = await sendEmail('subject', 'body', 'test@example.com');
    expect(response).toBe(true);
  });

  it('Error while sending email', async () => {
    const sendMailMock = jest.fn((mailOptions, callback) => {
      callback(true, {});
    });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
    const response = await sendEmail('subject', 'body', 'test@example.com');
    expect(response).toBe(false);
  });
});

describe('emailContent', () => {
  it('Should return emailContent', async () => {
    const response = emailContent('123456', 'Test');
    expect(response).toBe(response);
  });
});
