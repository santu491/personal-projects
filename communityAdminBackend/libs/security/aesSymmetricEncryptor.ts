import * as crypto from 'crypto';
import { Service } from 'typedi';
import { KEYS } from '../common';
import { IEncryptor } from './interfaces/iEncryptor';

/**
 * same as java SpringSymmetricCipherUtil.java
 */
@Service()
export class AesSymmetricEncryptor implements IEncryptor {
  private _salt = '';
  private _secret = '';
  private _iterations = 1024;
  private _keyLength = 256;
  private _key: Buffer;

  constructor(salt: string, secret: string) {
    this._salt = salt;
    this._secret = secret;
  }

  /**
   * encrypt utf8 string to hex
   * @param textToEncrypt hex string
   */
  encrypt(textToEncrypt: string): string {
    this.createKey();
    const iv = crypto.randomBytes(16);
    const encryptor = crypto.createCipheriv(KEYS.AES_ALGO, this._key, iv);
    let encrypted = encryptor.update(textToEncrypt, KEYS.UTF8, KEYS.HEX);
    encrypted += encryptor.final(KEYS.HEX);

    return iv.toString('hex') + encrypted;
  }

  /**
   * decrypt hex string to utf8
   * @param textToDecrypt utf8 string
   */
  decrypt(textToDecrypt: string): string {
    this.createKey();
    const decryptor = crypto.createDecipheriv(KEYS.AES_ALGO, this._key, Buffer.from(textToDecrypt.substring(0, 32), KEYS.HEX));
    let decrypted = decryptor.update(textToDecrypt.substring(32), KEYS.HEX, KEYS.UTF8);
    decrypted += decryptor.final();

    return decrypted;
  }

  private createKey() {
    if (!this._key) {
      this._key = crypto.pbkdf2Sync(this._secret, Buffer.from(this._salt, KEYS.HEX), this._iterations, this._keyLength / 8, KEYS.SHA1);
    }
  }
}
