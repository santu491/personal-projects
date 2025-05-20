import type { Options } from 'react-native-keychain';

export type SecureStorageOptions = Omit<Options, 'service'>;

export type GetSecureStorageOptions = Pick<SecureStorageOptions, 'authenticationPrompt'>;

export interface SecureStorage {
  getSecureData: <T>(key: string, options?: GetSecureStorageOptions) => Promise<T | undefined>;
  resetSecureData: (key: string) => Promise<void>;
  setSecureData: <T>(key: string, value: T, options?: SecureStorageOptions) => Promise<void>;
}
