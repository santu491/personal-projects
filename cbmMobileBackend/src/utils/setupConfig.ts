import {APP, IConfig} from './app';

export const setupAPP = (commonConfig: IConfig, envConfig: IConfig) => {
  const configData = Object.assign({}, commonConfig, envConfig);
  (APP as {config: Partial<IConfig>}).config = configData;
  return APP.config;
};

export const loadConfigData = async (configPath: string): Promise<IConfig> => {
  try {
    let config;
    await import(configPath)
      .then(module => (config = module as IConfig))
      .catch(error =>
        console.log(
          `catch block: config load error from the ${JSON.stringify(error)} ---> ${configPath}`,
        ),
      );
    return config as unknown as IConfig;
  } catch (error) {
    console.log(
      `config load error ${JSON.stringify(error)} ---> ${configPath}`,
    );
    throw new Error('Config load error');
  }
};
