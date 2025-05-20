import * as CryptoJS from 'crypto-js';
import Keychain from 'react-native-keychain';

import {
  GetSecureStorageOptions,
  SecureStorage,
  SecureStorageOptions,
} from '../../shared/src/utils/storage/secureStorage';
import { storage, StorageNamespace } from './storage';

export enum SecureStorageNamespace {
  AuthSDK = 'AuthSDK',
}

interface KeyData {
  iv: number[];
  key: number[];
}

const getEncryptionKey = async (name: string, options?: GetSecureStorageOptions): Promise<KeyData> => {
  const encryptionKeyData = await Keychain.getGenericPassword({ ...options, service: name });
  if (!encryptionKeyData) {
    throw new Error(`no encrpytion key found ${name}`);
  }
  const iv = encryptionKeyData.username.split(',').map((i) => parseInt(i, 10));
  const key = encryptionKeyData.password.split(',').map((i) => parseInt(i, 10));
  if (iv.length !== 128 / 8 || key.length !== 256 / 8) {
    throw new Error('invalid encryption key data');
  }
  return { iv, key };
};

export const createEncryptionKey = async (name: string, options?: SecureStorageOptions): Promise<KeyData> => {
  const key: number[] = [...global.crypto.getRandomValues(new Uint8Array(256 / 8))];
  const iv: number[] = [...global.crypto.getRandomValues(new Uint8Array(128 / 8))];

  await Keychain.setGenericPassword(iv.join(','), key.join(','), { ...options, service: name });
  return { iv, key };
};

const removeEncryptionKey = async (name: string) => {
  return Keychain.resetGenericPassword({ service: name });
};

export const encrypt = (data: string, key: number[], iv: number[]): string => {
  const keyWA = CryptoJS.lib.WordArray.create(key);
  const ivWA = CryptoJS.lib.WordArray.create(iv);
  const encryptWA = CryptoJS.enc.Utf8.parse(data);
  return CryptoJS.AES.encrypt(encryptWA, keyWA, {
    iv: ivWA,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString();
};

export const decrypt = (cipherText: string, key: number[], iv: number[]): string => {
  const keyWA = CryptoJS.lib.WordArray.create(key);
  const ivWA = CryptoJS.lib.WordArray.create(iv);
  const decrypted = CryptoJS.AES.decrypt(cipherText, keyWA, {
    iv: ivWA,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const encryptedStorage = storage(StorageNamespace.SecureStorage);

const prefixedKey = (key: string, namespace?: string) => (namespace ? `${namespace}.${key}` : key);
export function getSecureStorage(namespace: SecureStorageNamespace): SecureStorage {
  const secureStorage = {
    getSecureData: async <T>(name: string, options?: GetSecureStorageOptions): Promise<T | undefined> => {
      try {
        // the key is encrypted within the the storage, need to encrypt to retrive properly
        const { iv, key } = await getEncryptionKey(prefixedKey(name, namespace), options);
        const encryptedName = encrypt(JSON.stringify(name), key, iv);
        // see if there are any keys in the old format
        let encryptedData = await encryptedStorage.getString(prefixedKey(name, namespace), '');
        if (encryptedData !== '') {
          // an old formatted key was found
          // store the data under the new key
          await encryptedStorage.setString(prefixedKey(encryptedName, namespace), encryptedData);
          // remove the old format key from storage
          await encryptedStorage.removeItem(prefixedKey(name, namespace));
        } else {
          // check for new format data
          encryptedData = await encryptedStorage.getString(prefixedKey(encryptedName, namespace), '');
        }
        // before returning the data, check if it is empty
        if (encryptedData === '') {
          return undefined;
        }
        return JSON.parse(decrypt(encryptedData, key, iv));
      } catch (err) {
        console.warn(err);
        return undefined;
      }
    },
    resetSecureData: async (name: string): Promise<void> => {
      await Promise.all([
        removeEncryptionKey(prefixedKey(name, namespace)),
        encryptedStorage.removeItem(prefixedKey(name, namespace)),
      ]);
    },
    setSecureData: async <T>(name: string, value: T, options?: SecureStorageOptions): Promise<void> => {
      try {
        if (value === undefined) {
          console.warn(`cant set no data for key: ${name}`);
          return secureStorage.resetSecureData(prefixedKey(name, namespace));
        }
        const { key, iv } = await createEncryptionKey(prefixedKey(name, namespace), options);
        // encrypt the key to prevent accidents when storing sensitive information
        const encryptedName = encrypt(JSON.stringify(name), key, iv);
        const encryptedData = encrypt(JSON.stringify(value), key, iv);
        await encryptedStorage.setString(prefixedKey(encryptedName, namespace), encryptedData);
      } catch (err) {
        console.error(err);
      }
    },
  };

  return secureStorage;
}
