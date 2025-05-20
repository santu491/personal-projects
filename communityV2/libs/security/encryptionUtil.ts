import { APP } from '@anthem/communityapi/utils';
import { bouncyEncryption, encryption } from '../common';
import { AesBouncyEncryptor } from './aesBouncyEncryptor';
import { AesEncryptor2 } from './aesEncryptor2';
import { AesSymmetricEncryptor } from './aesSymmetricEncryptor';
import { KeyStoreUtil } from './keyStoreUtil';

export class EncryptionUtil {
  private static _aesBouncy: AesBouncyEncryptor;
  private static _aesSymmetric: AesSymmetricEncryptor;
  private static _aes: AesEncryptor2;

  static init() {
    if (!this._aesBouncy) {
      this._aesBouncy = new AesBouncyEncryptor(
        bouncyEncryption.salt ?? APP.config.security.encryption.bouncyEncryption.salt,
        bouncyEncryption.secret ?? APP.config.security.encryption.bouncyEncryption.secret,
        bouncyEncryption.iv ?? APP.config.security.encryption.bouncyEncryption.iv,
        1000,
        256
      );
    }
    if (!this._aesSymmetric) {
      this._aesSymmetric = new AesSymmetricEncryptor(
        this.getSalt(encryption.storePath, this.getPassword(encryption.storeSecret)),
        this.getPassword(encryption.aesSymmetric.secret)
      );
    }

    if (!this._aes) {
      this._aes = new AesEncryptor2(encryption.aes.salt, this.getPassword(encryption.aes.secret), encryption.aes.iv);
    }
  }

  static encrypt(textToEncrypt: string, encryptor: 'aes-symmetric' | 'aes' | 'aes-bouncy' = 'aes-symmetric'): string {
    const startDate = new Date();
    let result = '';
    this.init();
    if (encryptor === 'aes-symmetric') {
      result = this._aesSymmetric.encrypt(textToEncrypt);
    } else if (encryptor === 'aes') {
      result = this._aes.encrypt(textToEncrypt);
    } else if (encryptor === 'aes-bouncy') {
      result = this._aesBouncy.encrypt(textToEncrypt);
    } else {
      throw Error(`Encryptor ${encryptor} not supported`);
    }

    const elapsed = ((new Date() as unknown) as number) - ((startDate as unknown) as number);
    // tslint:disable
    // eslint-disable-next-line no-console
    console.debug(`ENCRYPT=${encryptor} Elapsed=${elapsed}`);
    // tslint:enable
    return result;
  }

  static decrypt(textToDecrypt: string, decryptor: 'aes-symmetric' | 'aes' | 'aes-bouncy' = 'aes-symmetric'): string {
    const startDate = new Date();
    let result = '';
    this.init();
    if (decryptor === 'aes-symmetric') {
      result = this._aesSymmetric.decrypt(textToDecrypt);
    } else if (decryptor === 'aes') {
      result = this._aes.decrypt(textToDecrypt);
    } else if (decryptor === 'aes-bouncy') {
      result = this._aesBouncy.decrypt(textToDecrypt);
    } else {
      throw Error(`Decryptor ${decryptor} not supported`);
    }

    const elapsed = ((new Date() as unknown) as number) - ((startDate as unknown) as number);
    // tslint:disable
    // eslint-disable-next-line no-console
    console.debug(`DECRYPT=${decryptor} Elapsed=${elapsed}`);
    // tslint:enable
    return result;
  }

  private static getPassword(secret: string): string {
    return this._aesBouncy.decrypt(secret);
  }

  private static getSalt(keyStorePath: string, storeSecret: string): string {
    return KeyStoreUtil.getKey(keyStorePath, 'encryption', storeSecret);
  }
}
