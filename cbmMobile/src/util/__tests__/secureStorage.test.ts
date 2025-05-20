import * as CryptoJS from 'crypto-js';
import Keychain from 'react-native-keychain';

import { getSecureStorage, SecureStorageNamespace } from '../secureStorage';

describe('secureStorage', () => {
  const namespace = SecureStorageNamespace.AuthSDK;
  const secureStorage = getSecureStorage(namespace);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set and get secure data correctly', async () => {
    const name = 'testKey';
    const value = { data: 'testData' };
    const key = new Array(32).fill(1);
    const iv = new Array(16).fill(1);
    const encryptedName = 'encryptedName';

    (CryptoJS.lib.WordArray.create as jest.Mock).mockImplementation((arr) => arr);
    (CryptoJS.enc.Utf8.parse as jest.Mock).mockImplementation((data) => data);
    (CryptoJS.AES.encrypt as jest.Mock).mockImplementation(() => ({ toString: () => encryptedName }));
    (CryptoJS.AES.decrypt as jest.Mock).mockImplementation(() => ({ toString: () => JSON.stringify(value) }));

    (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: iv.join(','),
      password: key.join(','),
    });

    await secureStorage.setSecureData(name, value);
    const result = await secureStorage.getSecureData(name);

    expect(result).toEqual(value);
  });

  it('should return undefined for non-existing data', async () => {
    const name = 'nonExistingKey';

    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(null);

    const result = await secureStorage.getSecureData(name);

    expect(result).toBeUndefined();
  });

  it('should reset secure data correctly', async () => {
    const name = 'testKey';

    (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(true);

    await secureStorage.resetSecureData(name);

    expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({ service: `${namespace}.${name}` });
  });

  it('should handle errors gracefully', async () => {
    const name = 'testKey';
    const value = { data: 'testData' };

    (Keychain.setGenericPassword as jest.Mock).mockRejectedValue(new Error('Test error'));

    await secureStorage.setSecureData(name, value);

    const result = await secureStorage.getSecureData(name);

    expect(result).toBeUndefined();
  });
});
