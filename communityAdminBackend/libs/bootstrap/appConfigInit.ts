// Do NOT change this file in VS Code, as it will change the order of import statements below automatically.
// ORder of the import statements are important to intialize the logger properly
import { getArgument, IConfig, setupAppConfig } from '@anthem/communityadminapi/utils';
import 'reflect-metadata';
import { winstonLoader } from './winstonLoader';

export const appConfigInit = (defaultConfig: Partial<IConfig>, envConfig: Partial<IConfig>, envCommonConfig: Partial<IConfig> = {}) => {
  const httpPort = getArgument('httpPort');
  const httpsPort = getArgument('httpsPort');
  const config = setupAppConfig(defaultConfig, envConfig, envCommonConfig, httpPort ? parseInt(httpPort) : undefined, httpsPort ? parseInt(httpsPort) : undefined);
  winstonLoader();
  return config;
};
