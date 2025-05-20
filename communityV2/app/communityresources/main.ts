/* eslint-disable custom-rules/no-restricted-assignments */
/* eslint-disable no-console */
import { appConfigInit } from '@anthem/communityapi/bootstrap';
import { APP, getArgument, IConfig } from '@anthem/communityapi/utils';
import { resolve } from 'path';
import { decrypt } from './loaders/decrypt';
import { getConfig, getDatabaseCred, getDBConfig, getWordList } from './loaders/handleConfig';

const app = getArgument('app');
const env = getArgument('env');
const isLocal = (getArgument('islocal') === 'true') ? true : false;

export async function loadConfig(configPath: string) {
  try {
    let config;
    await import(configPath)
      .then((module) => (config = module))
      .catch((error) =>
        console.log(
          `config load error ${JSON.stringify(error)} ---> ${configPath}`
        )
      );
    return config;
  } catch (error) {
    console.log(
      `config load error ${JSON.stringify(error)} ---> ${configPath}`
    );
  }
  return {};
}

export async function loadConfigs() {
  if (!app) {
    throw Error(
      'missing api parameter. use --app to pass the app name to run. ex: npm start --app=tcp'
    );
  }

  if (isLocal) {
    const result = await loadConfig(resolve('./app/communityresources/config/config.local.json'));
    return appConfigInit(result, null);
  }

  // Load the AWS secret local with SAML setup Uncomment the below commented code line
  // await awsConfigLoader();

  const config = await getConfig(isLocal, env);
  if (config !== null) {
    // Decrypt the config
    const decryptedConfig: IConfig = JSON.parse(decrypt(config.configDetails));

    // Load the DB details into config.
    const databaseDetails = await getDatabaseCred();
    const dbDetails = getDBConfig(databaseDetails, isLocal);
    decryptedConfig.database = dbDetails;

    // Load the WordList into ENV.
    const response = await getWordList(isLocal);
    if (response) {
      decryptedConfig.wordList.badWords = response.data.badWords;
      decryptedConfig.wordList.sensitiveWords = response.data.sensitiveWords;
      decryptedConfig.wordList.exceptionMsgWords = response.data.exceptionMsgWords;
    }

    return appConfigInit(decryptedConfig, null);
  }

  return null;
}

loadConfigs().then(
  (result) => {
    import('./loaders/appInit').then(
      async (a) => {
        a.appInit();
        if (isLocal) {
          const response = await getWordList(isLocal);
          if (response) {
            APP.config.wordList.badWords = response.data.badWords;
            APP.config.wordList.sensitiveWords = response.data.sensitiveWords;
            APP.config.wordList.exceptionMsgWords = response.data.exceptionMsgWords;
          }
        }
      },
      (error) => {
        // tslint:disable
        // eslint-disable-next-line no-console
        console.error(error);
        // tslint:enable
      }
    );
  },
  (error) => {
    // tslint:disable
    // eslint-disable-next-line no-console
    console.error(error);
    // tslint:enable
  }
);
