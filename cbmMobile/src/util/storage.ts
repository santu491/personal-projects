import AsyncStorage from '@react-native-async-storage/async-storage';

import { Storage } from '../../shared/src/utils/storage/storage';

export enum StorageNamespace {
  ChatSDK = 'ChatSDK',
  ClientSDK = 'ClientSDK',
  DeviceInstallation = 'DeviceInstallation',
  HomeSDK = 'HomeSDK',
  NotificationsSDK = 'NotificationsSDK',
  SecureStorage = 'SecureStorage',
}

const prefixedKey = (key: string, namespace?: string) => (namespace ? `${namespace}_${key}` : key);

export function storage(namespace?: string): Storage {
  const get = (key: string) => AsyncStorage.getItem(prefixedKey(key, namespace));
  const set = (key: string, encodedValue: string) => AsyncStorage.setItem(prefixedKey(key, namespace), encodedValue);

  return {
    setString: async (key: string, value: string): Promise<void> => set(key, value),
    getString: (async (key: string, defaultValue?: string): Promise<string | undefined> => {
      const returnedString = await get(key);
      return returnedString ?? defaultValue;
    }) as Storage['getString'],

    setBool: async (key: string, value: boolean): Promise<void> => set(key, value ? '1' : '0'),
    getBool: (async (key: string, defaultValue?: boolean): Promise<boolean | undefined> => {
      const returnedBool = await get(key);
      return returnedBool !== null ? returnedBool === '1' : defaultValue;
    }) as Storage['getBool'],

    setInt: async (key: string, value: number): Promise<void> => set(key, Math.floor(value).toString()),
    getInt: (async (key: string, defaultValue?: number): Promise<number | undefined> => {
      const returnedInt = await get(key);
      return returnedInt !== null ? parseInt(returnedInt, 10) : defaultValue;
    }) as Storage['getInt'],

    setNumber: async (key: string, value: number): Promise<void> => set(key, value.toString()),
    getNumber: (async (key: string, defaultValue?: number): Promise<number | undefined> => {
      const returnedNumber = await get(key);
      return returnedNumber !== null ? Number(returnedNumber) : defaultValue;
    }) as Storage['getNumber'],

    setObject: async (key: string, value: object): Promise<void> => set(key, JSON.stringify(value)),
    getObject: async <T>(key: string, defaultValue?: T): Promise<T | undefined> => {
      const json = await get(key);
      try {
        return json ? JSON.parse(json) : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    getAllKeys: async (): Promise<string[]> => {
      const allKeys = await AsyncStorage.getAllKeys();
      return namespace
        ? allKeys.filter((k) => k.startsWith(namespace)).map((k) => k.replace(namespace.concat('_'), ''))
        : [...allKeys];
    },

    removeItem: async (key: string): Promise<void> => AsyncStorage.removeItem(prefixedKey(key, namespace)),
  };
}
