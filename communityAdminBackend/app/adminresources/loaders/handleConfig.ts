/* eslint-disable no-console */
import { DB_OPTIONS, collections, contentKeys, mongoDbTables } from '@anthem/communityadminapi/common';
import { EncryptionUtil } from '@anthem/communityadminapi/security';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import { promises as fs } from 'fs';
import { MongoClient, MongoClientOptions } from 'mongodb';
import { resolve } from 'path';
import { secretManager } from './secretManager';

let dbSecret;

export function getDBConfig(dbDetails, isLocal) {
  try {
    const endpoint = '@' + dbDetails.host + ':' + dbDetails.port + '/' + dbDetails.database + DB_OPTIONS.tlsEndPoint;
    const dbConfig = {
      'certPath': '/database.pem',
      'options': {
        'sslValidate': true,
        'useUnifiedTopology': true,
        'retryWrites': false
      },
      'username': dbDetails.username,
      'secret': dbDetails.password,
      'endpoint': endpoint,
      'name': dbDetails.database,
      'isLocal': isLocal
    };

    return dbConfig;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}

export async function getSecrets() {
  try {
    // eslint-disable-next-line no-console
    const secrets = dbSecret = JSON.parse(await secretManager(getArgument('env')));

    return secrets;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}

export async function loadDB(isLocal) {
  try {
    let endpoint;
    if (isLocal) {
      endpoint =
        'mongodb://' +
        APP.config.database.username +
        ':' +
        EncryptionUtil.decrypt(APP.config.database.secret, 'aes-bouncy') +
        APP.config.database.endpoint;
    } else {
      const secrets = await getSecrets();
      endpoint = 'mongodb://' + secrets.username
        + ':' + secrets.password
        + '@' + secrets.host
        + ':' + secrets.port
        + '/' + secrets.database
        + DB_OPTIONS.dbEndpoint;
    }

    const options = JSON.parse(JSON.stringify(DB_OPTIONS.options));
    if (DB_OPTIONS.certPath && !isLocal) {
      options.sslCA = [
        await fs.readFile(resolve(__dirname, '../../../libs/database/database.pem'))
      ];
    }

    const dbClient = await MongoClient.connect(
      endpoint,
      options as MongoClientOptions
    );

    return dbClient;
  } catch (error) {
    return null;
  }
}

export async function readByValue(isLocal, collectionName: string, value, projection?: {}) {
  const client = await loadDB(isLocal);
  if (client) {
    const db = (dbSecret) ? client.db(dbSecret.database) : client.db(APP.config.database.name);
    const collection = db.collection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.findOne(value, projection);
    if (result !== null) {
      result.id = result[mongoDbTables.users.id].toString();
      delete result[mongoDbTables.users.id];
      return result;
    }
  }
  return null;
}

export async function getWordList(isLocal, language: string = contentKeys.english) {
  const appVersion = await readByValue(isLocal, collections.APPVERSION, {});
  if (appVersion) {
    const translations = await readByValue(isLocal, collections.CONTENT,
      {
        language: language,
        contentType: contentKeys.wordList,
        version: appVersion.content[contentKeys.wordList]
      }
    );
    return translations;
  }
  return null;
}

export async function getConfig(isLocal, env) {
  const appVersion = await readByValue(isLocal, collections.APPVERSION, {});
  if (appVersion) {
    const value = {
      [mongoDbTables.appConfig.env]: env,
      [mongoDbTables.appConfig.project]: 'communityAdminApi',
      [mongoDbTables.appConfig.version]: appVersion.adminApiVersion
    };
    const config = await readByValue(isLocal, collections.APP_CONFIG, value);

    return config;
  }
  return null;
}
