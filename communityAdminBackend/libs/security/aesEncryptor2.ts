import { StringUtils } from '@anthem/communityadminapi/utils';
import * as crypto from 'crypto';
import { Service } from 'typedi';
import { KEYS } from '../common';
import { IEncryptor } from './interfaces/iEncryptor';
/**
 * same as java AESSymmetricCipherUtil.java
 */
@Service()
export class AesEncryptor2 implements IEncryptor {
  private _key: Buffer;
  private _salt = '';
  private _secret = '';
  private _iterations = 65536;
  private _keyLength = 256;
  private _iv = '';
  constructor(salt: string, secret: string, iv: string) {
    this._salt = salt;
    this._secret = secret;
    this._iv = iv;
  }

  encrypt(textToEncrypt: string): string {
    this.createKey();
    const e = crypto.createCipheriv(KEYS.AES_256_GCM, this._key, Buffer.from(this._iv, KEYS.UTF16));
    //e.setAutoPadding(true);
    const ciphertext = Buffer.concat([e.update(Buffer.from(textToEncrypt, KEYS.UTF8)), e.final()]);
    const authTag = e.getAuthTag();
    const encrypted = Buffer.concat([ciphertext, authTag]);
    return StringUtils.makeBase64UrlSafe(encrypted.toString(KEYS.B64));
  }

  decrypt(textToDecrypt: string): string {
    this.createKey();
    const d = crypto.createDecipheriv(KEYS.AES_256_GCM, this._key, Buffer.from(this._iv, KEYS.UTF16));
    //d.setAutoPadding(true);
    const encrypted = Buffer.from(textToDecrypt, KEYS.B64);
    const authTag = encrypted.slice(encrypted.length - 16);
    const cypherText = encrypted.slice(0, encrypted.length - 16);
    d.setAuthTag(authTag);
    const plainText = Buffer.concat([d.update(cypherText), d.final()]);
    return plainText.toString(KEYS.UTF8);
  }

  private createKey() {
    if (!this._key) {
      this._key = crypto.pbkdf2Sync(this._secret, Buffer.from(this._salt, KEYS.HEX), this._iterations, this._keyLength / 8, KEYS.SHA1);
    }
  }
}
