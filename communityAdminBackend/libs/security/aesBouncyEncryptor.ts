import * as crypto from 'crypto';
import { Service } from 'typedi';
import { KEYS } from '../common';
import { IEncryptor } from './interfaces/iEncryptor';

/**
 * Java corresponding class AESSymmetricEncryption
 */
@Service()
export class AesBouncyEncryptor implements IEncryptor {
  private _salt = '';
  private _secret = '';
  private _iv = '';
  private _iterations: number;
  private _keyLength: number;
  private _key: Buffer;

  constructor(salt: string, secret: string, iv: string, iterations = 1000, keyLength = 256) {
    this._salt = salt;
    this._secret = secret;
    this._iv = iv;
    this._iterations = iterations;
    this._keyLength = keyLength;
  }

  /**
   * encrypt utf8 text to base64
   * @param textToEncrypt
   */
  encrypt(textToEncrypt: string): string {
    this.createKey();
    const encryptor = crypto.createCipheriv(KEYS.AES_ALGO, this._key, Buffer.from(this._iv, KEYS.UTF16));
    let encrypted = encryptor.update(textToEncrypt, KEYS.UTF8, KEYS.B64);
    encrypted += encryptor.final(KEYS.B64);

    return encrypted;
  }

  /**
   * decrypt base64 encoded text
   * @param textToDecrypt base64 encoded text
   */
  decrypt(textToDecrypt: string): string {
    this.createKey();
    const decryptor = crypto.createDecipheriv(KEYS.AES_ALGO, this._key, Buffer.from(this._iv, KEYS.UTF16));
    let decrypted = decryptor.update(textToDecrypt, KEYS.B64, KEYS.UTF8);
    decrypted += decryptor.final();

    return decrypted;
  }

  private createKey() {
    if (!this._key) {
      this._key = crypto.pbkdf2Sync(this._secret, this._salt, this._iterations, this._keyLength / 8, KEYS.SHA1);
    }
  }
}
