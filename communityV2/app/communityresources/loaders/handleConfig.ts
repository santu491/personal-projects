/* eslint-disable no-console */
import { collections, contentKeys, DB_OPTIONS, mongoDbTables, TranslationLanguage } from '@anthem/communityapi/common';
import { EncryptionUtil } from '@anthem/communityapi/security';
import { APP, getArgument } from '@anthem/communityapi/utils';
import { WordListModel } from 'api/communityresources/models/contentModel';
import { promises as fs } from 'fs';
import { MongoClient, MongoClientOptions } from 'mongodb';
import { resolve } from 'path';
import { fetchDatabase } from './fetchDatabase';

let databaseCred;

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
      'databaseUser': dbDetails.username,
      'dbpswrd': dbDetails.password,
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

export async function getDatabaseCred() {
  try {
    // eslint-disable-next-line no-console
    databaseCred = JSON.parse(await fetchDatabase(getArgument('env')));

    return databaseCred;
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
        APP.config.database.databaseUser +
        ':' +
        EncryptionUtil.decrypt(APP.config.database.dbpswrd, 'aes-bouncy') +
        APP.config.database.endpoint;
    } else {
      const databaseAuth = await getDatabaseCred();
      endpoint = 'mongodb://' + databaseAuth.username
        + ':' + databaseAuth.password
        + '@' + databaseAuth.host
        + ':' + databaseAuth.port
        + '/' + databaseAuth.database
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
    const db = (databaseCred) ? client.db(databaseCred.database) : client.db(APP.config.database.name);
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

export async function getWordList(isLocal, language: string = TranslationLanguage.ENGLISH) {
  const appVersion = await readByValue(isLocal, collections.APPVERSION, {});
  if (appVersion) {
    const translations: WordListModel = await readByValue(isLocal, collections.CONTENT,
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
      [mongoDbTables.appConfig.project]: 'communitiesV2',
      [mongoDbTables.appConfig.version]: appVersion.apiVersion
    };
    const config = await readByValue(isLocal, collections.APP_CONFIG, value);

    return config;
  }
  return null;
}
