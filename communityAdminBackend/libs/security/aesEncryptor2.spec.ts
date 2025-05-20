import { KEYS } from '../common';
import { AesEncryptor2 } from './aesEncryptor2';
describe('AesEncryptor UTest', () => {
  let encryptor: AesEncryptor2;
  beforeEach(() => {
    encryptor = new AesEncryptor2('36623938313631306263663265396330', KEYS.SECRET, '72&r_SwC');
  });
  it('should encrypt data', () => {
    expect(encryptor.encrypt('329191202001WGS20')).toBe('7nBAUl7eiNEl1rl3SgYDrBSOsgHafHF4WbeNhYVDaqb1');
    expect(encryptor.encrypt('321723805')).toBe('7nBIVFXcgtEipqWbwVPp4E1lHNV8FSTuSQ');
  });
  it('should decrypt data', () => {
    expect(encryptor.decrypt('7nBAUl7eiNEl1rl3SgYDrBSOsgHafHF4WbeNhYVDaqb1')).toBe('329191202001WGS20');
    expect(encryptor.decrypt('7nBIVFXcgtEipqWbwVPp4E1lHNV8FSTuSQ')).toBe('321723805');
  });
});
