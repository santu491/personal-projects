import crypto from 'crypto';
import {Response} from 'express';
import jwt from 'jsonwebtoken';
import {SecureEnvironments, ServiceConstants} from '../constants';
import {APP} from './app';
import {decrypt} from './security/encryptionHandler';
import {setCache} from './cacheUtil';

interface TokenPayload {
  userId?: string;
  userEmail?: string;
  roles?: string[];
  clientId?: string;
  userName?: string;
  iamguid?: string;
  permissions?: string[];
  clientName?: string;
  installationId?: string;
  sessionId?: string;
}

const generateToken = (
  payload: TokenPayload,
  expiresIn?: string,
  res?: Response,
) => {
  const jwtSecret = decrypt(APP.config.JWT) ?? '';
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn ?? `${ServiceConstants.JWT_EXPIRY_60M}m`,
  });

  if (res) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure:
        !process.env.NODE_ENV ||
        SecureEnvironments.includes(process.env.NODE_ENV)
          ? true
          : false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
  }

  return token;
};

function generateOTP(): number {
  let otp: number;
  do {
    const hex = crypto.randomBytes(3).toString('hex');
    otp = parseInt(hex, 16) % 1000000;
  } while (otp < 100000);
  return otp;
}

export {generateOTP, generateToken};
