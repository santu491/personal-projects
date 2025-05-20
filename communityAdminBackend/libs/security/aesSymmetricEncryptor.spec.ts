import { KEYS } from '../common';
import { AesSymmetricEncryptor } from './aesSymmetricEncryptor';

describe('AesSymmetricEncryptor UTest', () => {
  let encryptor: AesSymmetricEncryptor;

  beforeEach(() => {
    encryptor = new AesSymmetricEncryptor('289ad0b9ad300a8d4d9ca7ae0be8e1e5e261dfb8aa2196c790f940c4fc898e07', KEYS.SECRET);
  });

  it('should encrypt and decrypt data', () => {
    expect(encryptor.decrypt(encryptor.encrypt('test'))).toBe('test');
  });
});
