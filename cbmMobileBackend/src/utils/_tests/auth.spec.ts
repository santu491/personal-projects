import {Response} from 'express';
import jwt from 'jsonwebtoken';
import {generateOTP, generateToken} from '../auth';
import {decrypt} from '../security/encryptionHandler';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnThis(),
}));

jest.mock('../security/encryptionHandler', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

describe('generateToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (decrypt as jest.Mock).mockResolvedValue('accessToken');
  });
  it('Should return auth token', async () => {
    const token = 'yxq7pn6z826o8n7z3862z3j6x2o8';
    (jwt.sign as jest.Mock).mockResolvedValue(token);

    const payload = {
      userId: '98127sz1n289',
      userEmail: 'test@example.com',
      roles: ['USER', 'BH_USER'],
    };

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res);
    res.cookie = jest.fn();
    (res.cookie as jest.Mock).mockResolvedValue('');
    const response = await generateToken(payload, '', res);

    expect(response).toEqual(token);
  });

  it('Should return auth token without expiry', async () => {
    const token = 'yxq7pn6z826o8n7z3862z3j6x2o8';
    (jwt.sign as jest.Mock).mockResolvedValue(token);

    const payload = {
      userId: '98127sz1n289',
      userEmail: 'test@example.com',
      roles: ['USER', 'BH_USER'],
    };

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res);
    res.cookie = jest.fn();
    (res.cookie as jest.Mock).mockResolvedValue('');
    const response = await generateToken(payload);

    expect(response).toEqual(token);
  });
});

describe('generateOTP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (decrypt as jest.Mock).mockResolvedValue('accessToken');
  });
  it('Should return six digit OTP', async () => {
    generateOTP();
  });
});
