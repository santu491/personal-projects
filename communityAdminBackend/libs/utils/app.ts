import { IConfig } from './interfaces/config';

export interface IApp {
  readonly config: Partial<IConfig>;
}

export const APP: IApp = {
  config: {}
};
