import { AesBouncyEncryptor } from './aesBouncyEncryptor';

describe('AesBouncyEncryptor UTest', () => {
  let encryptor: AesBouncyEncryptor;

  beforeEach(() => {
    encryptor = new AesBouncyEncryptor('Sn43R28*893bnheDJf79L43_', 'decaffeinated', '72&r_SwC', 1000, 256);
  });

  it('should encrypt data', () => {
    expect(encryptor.encrypt('test')).toBe('lLYfg7MLSaegcN4Bcpowww==');
  });

  it('should decrypt data', () => {
    expect(encryptor.decrypt('lLYfg7MLSaegcN4Bcpowww==')).toBe('test');
    expect(encryptor.decrypt('ne7KfPlXDLXT93Y+3w1e+g==')).toBe('2142051');
  });
});
