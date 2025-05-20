import { Activity } from 'api/communityresources/models/activityModel';
import { Binder } from 'api/communityresources/models/binderModel';
import { Blocked } from 'api/communityresources/models/blockedModel';
import { Community } from 'api/communityresources/models/communitiesModel';
import { Installations } from 'api/communityresources/models/internalRequestModel';
import { Library } from 'api/communityresources/models/libraryModel';
import { PollResponse } from 'api/communityresources/models/pollModel';
import { AdminActivity } from 'api/communityresources/models/postsModel';
import { ProfileImage } from 'api/communityresources/models/profileImageModel';
import { Prompt } from 'api/communityresources/models/promptModel';
import { Reaction } from 'api/communityresources/models/reactionModel';
import { SearchTerm } from 'api/communityresources/models/searchTermModel';
import { Answer, Story } from 'api/communityresources/models/storyModel';
import { User } from 'api/communityresources/models/userModel';
import {
  Collection,
  FilterQuery, MongoClient,
  MongoClientOptions,
  ObjectId,
  UpdateManyOptions,
  UpdateOneOptions
} from 'mongodb';
import { Service } from 'typedi';
import { mongoDbTables } from '../common';
import { ILogger, LoggerParam } from '../logger';
import { EncryptionUtil } from '../security';
import { APP } from '../utils';
import { IDatabaseClient } from './interfaces/iDatabaseClient';
import { IResponseItem } from './interfaces/iResponseItem';

@Service()
export class MongoDatabaseClient implements IDatabaseClient {
  public _client: MongoClient;

  constructor(@LoggerParam(__filename) private _log: ILogger) { }

  async add<T>(collectionName: string, data: IResponseItem<T>) {
    const collection = await this.getCollection(collectionName);
    await collection.replaceOne({ id: data.id }, data, { upsert: true });

    return true;
  }

  async read<T>(collectionName: string, key: string, value: string | number) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const i: FilterQuery<unknown> = {};
    if (key && value) {
      i[key] = value;
    }
    return collection.findOne<IResponseItem<T>>(i);
  }

  async readAll<T>(collectionName: string) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.find({}).toArray();
    if (result.length > 0) {
      result.forEach((element) => {
        element.id = element[mongoDbTables.users.id].toString();
        delete element[mongoDbTables.users.id];
      });
    }
    return result;
  }

  async readByValue<T>(collectionName: string, value, projection?: {}) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.findOne(value, projection);
    if (result !== null) {
      result.id = result[mongoDbTables.users.id].toString();
      delete result[mongoDbTables.users.id];
    }
    return result;
  }

  async readByID<T>(collectionName: string, id: string) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.findOne(new ObjectId(id));
    if (result !== null) {
      result.id = result[mongoDbTables.users.id].toString();
      delete result[mongoDbTables.users.id];
    }
    return result;
  }

  async insertValue<T>(
    collectionName: string,
    data:
    | User
    | Community
    | Binder
    | Prompt
    | Activity
    | Blocked
    | ProfileImage
    | Story
    | Answer
    | Library
    | SearchTerm
    | Reaction
    | Installations
    | AdminActivity
    | PollResponse
  ) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const [result] = (await collection.insertOne(data)).ops;
    result[mongoDbTables.users.id] = result[mongoDbTables.users.id].toString();
    return result;
  }

  async updateByQuery<T>(collectionName: string, query: {}, value: {}, arrayFilters?: UpdateOneOptions) {
    arrayFilters = (!arrayFilters) ? { upsert: true } : arrayFilters;
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    return (await collection.updateOne(query, value, arrayFilters)).modifiedCount;
  }

  async updateManyByQuery<T>(collectionName: string, value: {}, query: {}, arrayFilters?: UpdateManyOptions) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    arrayFilters = (!arrayFilters) ? { upsert: true } : arrayFilters;
    return (
      await collection.updateMany(value, query, arrayFilters)
    ).modifiedCount;
  }

  async replaceByQuery<T>(collectionName: string, value: {}, replacement) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    return (
      await collection.replaceOne(value, replacement, {
        upsert: true
      })
    ).modifiedCount;
  }

  async delete(collectionName: string, key: string, value: string | number) {
    const collection = await this.getCollection(collectionName);
    const params: { [key: string]: string | number } = {};
    params[key] = value;
    await collection.deleteOne(params);
    return true;
  }

  async readAllByValue<T>(collectionName: string, value, sort?: {}, limit?: number, skip?: number, projection?: {}) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }

    sort = sort ? sort : {};
    let result = [];
    if (limit && skip !== undefined) {
      result = await collection.find(value, projection).sort(sort).limit(limit).skip(skip).toArray();
    }
    else {
      result = await collection.find(value, projection).sort(sort).toArray();
    }
    if (result.length > 0) {
      result.forEach((element) => {
        element.id = element[mongoDbTables.users.id].toString();
        delete element[mongoDbTables.users.id];
      });
    }
    return result;
  }

  async deleteOneByValue<T>(collectionName: string, value) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.deleteOne(value);
    return result.deletedCount > 0 ? true : false;
  }

  async readByIDArray<T>(collectionName: string, idArray) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.find({ '_id': { $in: idArray } }).toArray();
    return result;
  }

  async getDistinct<T>(collectionName: string, field: string) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.distinct(field, {}, {});
    return result;
  }

  async readByAggregate<T>(collectionName: string, pipeline) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    let result;
    collection.aggregate(pipeline, (err, res) => {
      result = res.toArray();
    });
    return result;
  }

  async getDocumentCount(collectionName: string, value) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }

    return collection.countDocuments(value, {});
  }

  async findAndUpdateOne(collectionName: string, query, setValue) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const data = await (collection.findOneAndUpdate(query, setValue, { returnOriginal: false }));
    if (data?.value === null) {
      return null;
    }

    data.value.id = data?.value[mongoDbTables.users.id];
    delete data?.value[mongoDbTables.users.id];

    return data?.value;
  }

  async getDbClient() {
    if (this._client) {
      return this._client;
    } else {
      const dbClient = await this.initClient();

      return dbClient;
    }
  }

  private async initClient() {
    try {
      if (this._client) {
        return this._client;
      } else {
        const options = JSON.parse(JSON.stringify(APP.config.database.options));

        const secret = (APP.config.database.isLocal) ? EncryptionUtil.decrypt(APP.config.database.dbpswrd, 'aes-bouncy') : APP.config.database.dbpswrd;
        const endpoint = 'mongodb://' + APP.config.database.databaseUser + ':' + secret + APP.config.database.endpoint;
        this._client = await MongoClient.connect(
          endpoint,
          options as MongoClientOptions
        );
        return this._client;
      }
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  private async getCollection(collectionName: string): Promise<Collection> {
    await this.initClient();
    if (this._client) {
      const db = this._client.db(APP.config.database.name);
      return db.collection(collectionName);
    }

    return null;
  }
}
