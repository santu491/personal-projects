import { KEYS } from '../common';
import { AesEncryptor } from './aesEncryptor';

describe('AesEncryptor UTest', () => {
  let encryptor: AesEncryptor;

  beforeEach(() => {
    encryptor = new AesEncryptor('36623938313631306263663265396330', KEYS.SECRET);
  });

  it('should encrypt data', () => {
    expect(encryptor.encrypt('329191202001WGS20')).toBe('aNIMD-_lJ8ZhK3FFwvx34P7u2yZIoXgjHqF5YmpJA7U');
    expect(encryptor.encrypt('321723805')).toBe('rKtt8_3J_pL-B0RFfYm-YQ');
  });

  it('should decrypt data', () => {
    expect(encryptor.decrypt('aNIMD-_lJ8ZhK3FFwvx34P7u2yZIoXgjHqF5YmpJA7U')).toBe('329191202001WGS20');
    expect(encryptor.decrypt('rKtt8_3J_pL-B0RFfYm-YQ')).toBe('321723805');
  });
});
