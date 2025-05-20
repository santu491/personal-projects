/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable custom-rules/no-restricted-assignments */
// eslint-disable-next-line no-restricted-imports
import { merge } from 'lodash';
import { APP } from './app';
import { IConfig } from './interfaces/config';

export function mergeConfigs(config1: Partial<IConfig> = {}, config2: Partial<IConfig> = {}, config3: Partial<IConfig> = {}, config4: Partial<IConfig> = {}, config5: Partial<IConfig> = {}) {
  return merge(config1, config2, config3, config4, config5);
}

export function setupAppConfig(defaultConfig: Partial<IConfig> = {}, envConfig: Partial<IConfig> = {}, envCommonConfig: Partial<IConfig> = {}, httpPort?: number, httpsPort?: number) {
  ((APP as unknown) as { config: Partial<IConfig> }).config = mergeConfigs(defaultConfig, envCommonConfig, envConfig);
  APP.config.app.port = httpPort || APP.config.app.port;
  APP.config.app.httpsPort = httpsPort || APP.config.app.httpsPort;
  return APP.config;
}
