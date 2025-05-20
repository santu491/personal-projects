const { merge } = require('lodash');
require('reflect-metadata');

let db;
let dbClient;

const initDb = async () => {
  if (db) {
    return;
  }
  const envDBDetails = dbDetails['sit1'];
  const endpoint = 'mongodb://' + envDBDetails.username + ':' + utilsDecrypt(envDBDetails.secret, 'aes-bouncy') + envDBDetails.endpoint;
  const options = JSON.parse(JSON.stringify(DB_OPTIONS.options));
  // eslint-disable-next-line @typescript-eslint/await-thenable
  dbClient = await MongoClient.connect(
    endpoint,
    options
  );
  db = dbClient.db(envDBDetails.name);
};

const readByValue = async (collectionName, value, isClose) => {
  await initDb();
  const collection = db.collection(collectionName);

  if (!collection) {
    return null;
  }
  const result = await collection.findOne(value);
  if (isClose) {
    dbClient.close();
  }

  return result;
};

module.exports = async () => {
  const appVersion = await readByValue(collections.APPVERSION, {}, false);
  if (appVersion) {
    const value = {
      [mongoDbTables.appConfig.env]: 'sit1',
      [mongoDbTables.appConfig.project]: 'communitiesV2',
      [mongoDbTables.appConfig.version]: appVersion.apiVersion
    };
    const config = await readByValue(collections.APP_CONFIG, value, true);

    if (config !== null) {
      // Decrypt the config
      const decryptedConfig = JSON.parse(decrypt(config.configDetails));

      // Load the DB details into config.
      const secret = dbDetails['sit1'];
      decryptedConfig.database = secret;

      const splits = JSON.stringify(decryptedConfig).match(/.{1,30000}/g);
      for (let index = 0; index < splits.length; index++) {
        process.env[`npm_config_appConfig${index}`] = splits[index];
      }
    }
  }
};
