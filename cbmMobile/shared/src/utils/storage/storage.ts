/* eslint-disable typescript-sort-keys/interface */

interface GetOptionalOrWithDefault<T> {
  (key: string, defaultValue: T): Promise<T>;
  (key: string): Promise<T | undefined>;
}

export interface Storage {
  setString: (key: string, value: string) => Promise<void>;
  getString: GetOptionalOrWithDefault<string>;

  setBool: (key: string, value: boolean) => Promise<void>;
  getBool: GetOptionalOrWithDefault<boolean>;

  setInt: (key: string, value: number) => Promise<void>;
  getInt: GetOptionalOrWithDefault<number>;

  setNumber: (key: string, value: number) => Promise<void>;
  getNumber: GetOptionalOrWithDefault<number>;

  setObject: (key: string, value: object) => Promise<void>;
  getObject<T extends object>(key: string, defaultValue: T): Promise<T>;
  getObject<T extends object>(key: string): Promise<T | undefined>;

  getAllKeys: () => Promise<string[]>;

  removeItem: (key: string) => Promise<void>;
}
