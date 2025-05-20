import * as crypto from 'crypto';
import {APP} from '../app';
import {CommonConstants} from '../../constants';

let key: Buffer;
const iv = crypto.randomBytes(16);

const createKey = () => {
  if (!key) {
    key = crypto.pbkdf2Sync(
      APP.config.encryption.salt,
      APP.config.encryption.salt,
      CommonConstants.iterations,
      CommonConstants.keyLength / 8,
      CommonConstants.SHA1,
    );
  }
};

export const encrypt = (text: string): string => {
  createKey();
  const cipher = crypto.createCipheriv(
    APP.config.encryption.algorithm,
    Buffer.from(key),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const ivHex = iv
    ? iv.toString('hex')
    : crypto.randomBytes(16).toString('hex');
  const encryptedDataHex = encrypted.toString('hex');
  return ivHex + encryptedDataHex;
};

export const decrypt = (encryptedText: string): string => {
  createKey();
  const ivHex = encryptedText.slice(0, 32);
  const encryptedDataHex = encryptedText.slice(32);
  const ivBuffer = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedDataHex, 'hex');
  const decipher = crypto.createDecipheriv(
    APP.config.encryption.algorithm,
    Buffer.from(key),
    ivBuffer,
  );
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
