/* eslint-disable no-underscore-dangle */
import * as crypto from 'crypto';

const AES_ALGO = 'aes-256-cbc';
const HEX = 'hex';
const SHA1 = 'sha1';
const UTF8 = 'utf8';
const salt = '';
const secret = '';
const iterations = 1024;
const keyLength = 256;
let key = null;

let _key = null;
const _salt = 'Sn43R28*893bnheDJf79L43_';
const _secret = 'decaffeinated';
const _iv = '72&r_SwC';
const _iterations = 1000;
const _keyLength = 256;
const UTF16 = 'utf16le';
const b64 = 'base64';

export const createKey = () => {
  if (key === null) {
    key = crypto.pbkdf2Sync(secret, Buffer.from(salt, HEX), iterations, keyLength / 8, SHA1);
  }
};

export const createUtilsKey = () => {
  if (_key === null) {
    _key = crypto.pbkdf2Sync(_secret, _salt, _iterations, _keyLength / 8, SHA1);
  }
};

/**
  * decrypt hex string to utf8
  * @param textToDecrypt utf8 string
  */
export const decrypt = (textToDecrypt) => {
  createKey();
  const decryptor = crypto.createDecipheriv(AES_ALGO, key, Buffer.from(textToDecrypt.substring(0, 32), HEX));
  let decrypted = decryptor.update(textToDecrypt.substring(32), HEX, UTF8);
  decrypted += decryptor.final();

  return decrypted;
};

export const utilsDecrypt =(textToDecrypt) => {
  createUtilsKey();
  const decryptor = crypto.createDecipheriv(AES_ALGO, _key, Buffer.from(_iv, UTF16));
  let decrypted = decryptor.update(textToDecrypt, b64, UTF8);
  decrypted += decryptor.final();

  return decrypted;
};
