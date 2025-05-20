import * as crypto from 'crypto';
import { KEYS } from '../common';
import { AesSymmetricEncryptor } from './aesSymmetricEncryptor';
import { KeyStoreUtil } from './keyStoreUtil';

describe('KeyStoreUtil UTest', () => {
  beforeEach(() => {
      //nop
  });

  it('default passthrough', () => {
    let secret = 'decaffeinated';
    let salt = 'Sn43R28*893bnheDJf79L43_';
    let iv = '72&r_SwC';
    let iterations = 1000;
    let keyLenght = 256;

    /*salt = KeyStoreUtil.getKey('dev/keystore2.jceks', 'encryption', KEYS.SECRET);
    console.log(salt)
    salt = KeyStoreUtil.getKey('dev/keystore.jceks', 'encryption', KEYS.SECRET);
    console.log(salt)
    salt = KeyStoreUtil.getKey('prod/keystore2.jceks', 'encryption', KEYS.SECRET);
    console.log(salt)
    salt = KeyStoreUtil.getKey('prod/keystore.jceks', 'encryption', KEYS.SECRET);
    console.log(salt)*/

    const key = crypto.pbkdf2Sync(secret, salt, iterations, keyLenght / 8, KEYS.SHA1);
    let e = crypto.createCipheriv(KEYS.AES_ALGO, key, Buffer.from(iv, KEYS.UTF16));
    let encrypted = e.update('test', KEYS.UTF8, KEYS.B64);
    encrypted += e.final(KEYS.B64);
    console.log(encrypted);

    let d = crypto.createDecipheriv(KEYS.AES_ALGO, key, Buffer.from(iv, KEYS.UTF16));
    let decrypted = d.update('02MqhVXVOjXfeAnUPeaHUQ==', KEYS.B64, KEYS.UTF8);
    decrypted += d.final();
    console.log(decrypted);

    salt = KeyStoreUtil.getKey('dev/keystore2.jceks', 'encryption', KEYS.SECRET);
    secret = KEYS.SECRET;

    const key2 = crypto.pbkdf2Sync(secret, Buffer.from(salt, KEYS.HEX), 1024, 256 / 8, KEYS.SHA1);
    let iv2 = crypto.randomBytes(16);
    //Buffer.alloc(16) - 0 initialize
    e = crypto.createCipheriv(KEYS.AES_ALGO, key2, iv2);
    encrypted = e.update('test', KEYS.UTF8, KEYS.HEX);
    encrypted += e.final(KEYS.HEX);
    console.log(encrypted);
    console.log(iv2.toString(KEYS.HEX) + encrypted);
    console.log(iv2.toString(KEYS.HEX).length);

    const key3 = crypto.pbkdf2Sync(secret, Buffer.from(salt, KEYS.HEX), 1024, 256 / 8, KEYS.SHA1);
    d = crypto.createDecipheriv(KEYS.AES_ALGO, key3, iv2);
    decrypted = d.update(encrypted, KEYS.HEX, KEYS.UTF8);
    decrypted += d.final();
    console.log(decrypted);

    let aes = new AesSymmetricEncryptor(salt, secret);
    let e1 = aes.encrypt('test');
    console.log(e1);
    let d1 = aes.decrypt(e1);
    console.log(d1);
    //
  });
});
