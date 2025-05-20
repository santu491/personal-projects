import { IResponseItem } from './iResponseItem';

export interface IDatabaseClient {
  add<T>(collectionName: string, data: IResponseItem<T>): Promise<boolean>;
  read<T>(collectionName: string, key: string, value: string | number): Promise<IResponseItem<T>>;
  delete(collectionName: string, key: string, value: string | number): Promise<boolean>;
}
