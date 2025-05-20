import { BcryptHash } from './bcryptHash';

describe('AesEncryptor UTest', () => {

  beforeEach(() => {
    //noop
  });

  it('should encrypt data', async () => {
    const test = await BcryptHash.compare('lakmaltest', await BcryptHash.hash('lakmaltest', 10));
    expect(test).toBeTruthy();
  });
});
