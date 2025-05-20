import { EncryptionUtil } from './encryptionUtil';

describe('EncryptionUtil UTest', () => {
  beforeEach(() => {
    //nop
  });

  it('should encrypt and decrypt aes symmetric data', () => {
    const val = EncryptionUtil.encrypt('M27311', 'aes-bouncy');
    expect(val).toBe('hXNjP1XMyBtGyP1vSV+TTQ==');
    expect(EncryptionUtil.decrypt(EncryptionUtil.encrypt('test'))).toBe('test');
  });

  it('should encrypt and decrypt aes data', () => {
    expect(
      EncryptionUtil.decrypt(
        EncryptionUtil.encrypt('20ClaimsIn3Months', 'aes'),
        'aes'
      )
    ).toBe('20ClaimsIn3Months');
  });
});
