import { StringUtils } from '@anthem/communityapi/utils';
import * as crypto from 'crypto';
import { Service } from 'typedi';
import { KEYS } from '../common';
import { IEncryptor } from './interfaces/iEncryptor';

/**
 * same as java AESSymmetricCipherUtil.java
 */
@Service()
export class AesEncryptor implements IEncryptor {
  private _key: Buffer;
  private _salt = '';
  private _secret = '';
  private _iterations = 65536;
  private _keyLength = 256;

  constructor(salt: string, secret: string) {
    this._salt = salt;
    this._secret = secret;
  }

  encrypt(textToEncrypt: string): string {
    this.createKey();
    const e = crypto.createCipheriv(KEYS.AES_256_ECB, this._key, Buffer.from([]));
    e.setAutoPadding(true);
    const ciphertext = Buffer.concat([ e.update(Buffer.from(textToEncrypt, KEYS.UTF8)), e.final() ]);

    return StringUtils.makeBase64UrlSafe(ciphertext.toString(KEYS.B64));
  }

  decrypt(textToDecrypt: string): string {
    this.createKey();
    const d = crypto.createDecipheriv(KEYS.AES_256_ECB, this._key, Buffer.from([]));
    d.setAutoPadding(true);
    const plainText = Buffer.concat([ d.update(Buffer.from(textToDecrypt, KEYS.B64)), d.final() ]);

    return plainText.toString(KEYS.UTF8);
  }

  private createKey() {
    if (!this._key) {
      this._key = crypto.pbkdf2Sync(this._secret, Buffer.from(this._salt, KEYS.HEX), this._iterations, this._keyLength / 8, KEYS.SHA1);
    }
  }
}
