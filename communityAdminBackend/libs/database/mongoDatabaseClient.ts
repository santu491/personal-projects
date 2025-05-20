import { Activity, AdminActivity } from 'api/adminresources/models/activityModel';
import { AdminImage } from 'api/adminresources/models/adminModel';
import { Admin } from 'api/adminresources/models/adminUserModel';
import { FindQuery } from 'api/adminresources/models/commonModel';
import { Community, CommunityImage } from 'api/adminresources/models/communitiesModel';
import { ContentModel } from 'api/adminresources/models/contentModel';
import { Partners } from 'api/adminresources/models/partnersModel';
import { Post, PostImage } from 'api/adminresources/models/postsModel';
import { SearchTerm } from 'api/adminresources/models/searchTermModel';
import { Answer, Story } from 'api/adminresources/models/storyModel';
import { Installations, User } from 'api/adminresources/models/userModel';
import {
  Collection,
  FilterQuery,
  MongoClient,
  MongoClientOptions,
  ObjectID, UpdateManyOptions, UpdateOneOptions
} from 'mongodb';
import { Service } from 'typedi';
import { collections, genericQueryValue, mongoDbTables } from '../common';
import { ILogger, LoggerParam } from '../logger';
import { EncryptionUtil } from '../security/encryptionUtil';
import { APP } from '../utils';
import { IDatabaseClient } from './interfaces/iDatabaseClient';
import { IResponseItem } from './interfaces/iResponseItem';

@Service()
export class MongoDatabaseClient implements IDatabaseClient {
  private _client: MongoClient;
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

  async readByValue<T>(collectionName: string, value) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.findOne(value);
    if (result !== null) {
      result.id = result[mongoDbTables.users.id].toString();
      delete result[mongoDbTables.users.id];
    }
    return result;
  }

  async readByID<T>(collectionName: string, id: string, projection?: {}) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.findOne(new ObjectID(id), projection);
    if (result !== null) {
      result.id = result[mongoDbTables.users.id].toString();
      delete result[mongoDbTables.users.id];
    }
    return result;
  }

  async updateByQuery<T>(collectionName: string, value: {}, query: {}, arrayFilters?: UpdateOneOptions) {
    arrayFilters = (!arrayFilters) ? { upsert: true } : arrayFilters;
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    return (
      await collection.updateOne(value, query, arrayFilters)
    ).modifiedCount;
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

  async findAndUpdateOne(collectionName: string, query, setValue) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const data = await (collection.findOneAndUpdate(query, setValue, { returnOriginal: false }));
    if (data?.value === null) {
      return null;
    }

    data.value.id = data?.value[mongoDbTables.users.id].toString();
    delete data?.value[mongoDbTables.users.id];

    return data?.value;
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

  async readByIDArray<T>(collectionName: string, idArray, options?: {}) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const result = await collection.find({ [mongoDbTables.users.id]: { $in: idArray } }, options).toArray();
    result.forEach((element) => {
      element.id = element[mongoDbTables.users.id].toString();
      delete element[mongoDbTables.users.id];
    });
    return result;
  }

  async getDistinct<T>(collectionName: string, field: string) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    return ((await collection.distinct(field, {}, {})).sort());
  }

  async getMaxOrMinValues<T>(collectionName: string, query: {}, sort: {}, limit = 1) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    return collection.find(query).sort(sort).limit(limit).toArray();
  }

  async insertValue<T>(
    collectionName: string,
    data:
    | User
    | Community
    | Story
    | Answer
    | SearchTerm
    | Post
    | Activity
    | Installations
    | Admin
    | ContentModel
    | PostImage
    | AdminActivity
    | AdminImage
    | CommunityImage
    | Partners

  ) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const [result] = (await collection.insertOne(data)).ops;
    result[mongoDbTables.users.id] = result[mongoDbTables.users.id].toString();
    return result;
  }

  async getUsersCountByMemberType<T>(collectionName: string, demoUsers?: RegExp[], memberType?: string, fromDate?: string, toDate?: string) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const query: FindQuery = { [mongoDbTables.users.username]: { [genericQueryValue.notIn]: demoUsers } };
    if (fromDate && toDate) {
      query[mongoDbTables.users.createdAt] = {
        [genericQueryValue.greaterThanEqual]: new Date(fromDate),
        [genericQueryValue.lessThan]: new Date(toDate)
      };
    }

    if (memberType) {
      query[mongoDbTables.users.memberType] = memberType;
    }
    const result = await collection.find(query).count();
    return result;
  }

  async getUsersPerCommunity<T>(demoUsers?: RegExp[], fromDate?: string, toDate?: string, memberType?: string) {
    const usersCol = await this.getCollection(collections.USERS);
    const communityCol = await this.getCollection(collections.COMMUNITY);
    if (!usersCol || !communityCol) {
      return null;
    }
    const result = [];
    await communityCol.find({}).forEach(async (comm) => {
      const query: FindQuery = memberType ?
        {
          [mongoDbTables.users.username]: {
            [genericQueryValue.notIn]: demoUsers
          },
          [mongoDbTables.users.memberType]: memberType,
          [mongoDbTables.users.myCommunities]: {
            [genericQueryValue.all]: [comm[mongoDbTables.community.id].toString()]
          }
        }
        :
        {
          [mongoDbTables.users.username]: {
            [genericQueryValue.notIn]: demoUsers
          },
          [mongoDbTables.users.myCommunities]: {
            [genericQueryValue.all]: [comm[mongoDbTables.community.id].toString()]
          }
        };
      if (fromDate && toDate) {
        query[mongoDbTables.users.createdAt] = {
          [genericQueryValue.greaterThanEqual]: new Date(fromDate),
          [genericQueryValue.lessThan]: new Date(toDate)
        };
      }
      const userCount = await usersCol.find(query).count();
      result.push({
        id: comm[mongoDbTables.community.id].toString(),
        title: comm.title,
        userCount: userCount
      });

    });
    return result;
  }

  async getStoriesPerCommunity<T>(published: boolean, userIds?: string[]) {
    const storyCol = await this.getCollection(collections.STORY);
    const communityCol = await this.getCollection(collections.COMMUNITY);
    if (!storyCol || !communityCol) {
      return null;
    }
    const result = [];
    await communityCol.find({}).forEach(async (comm) => {
      const storyQuery = userIds ?
        {
          [mongoDbTables.story.communityId]: comm[mongoDbTables.community.id].toString(),
          [mongoDbTables.story.published]: published,
          [mongoDbTables.story.authorId]: { $in: userIds }
        } :
        {
          [mongoDbTables.story.communityId]: comm[mongoDbTables.community.id].toString(),
          [mongoDbTables.story.published]: published
        };
      const storiesCount = await storyCol.find(storyQuery).count();
      result.push({
        id: comm[mongoDbTables.community.id].toString(),
        title: comm.title,
        storiesCount: storiesCount
      });
    });
    return result;
  }

  async readByAggregate<T>(collectionName: string, pipeline) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    let result;
    collection.aggregate(pipeline, (_err, res) => {
      result = res.toArray();
    });
    return result;
  }

  async getDbClient() {
    if (this._client) {
      return this._client;
    } else {
      const dbClient = await this.initClient();

      return dbClient;
    }
  }

  public async getDocumentCount(collectionName: string, value) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    return collection.countDocuments(value);
  }

  public async getRowCount(collectionName: string, value) {
    const collection = await this.getCollection(collectionName);
    if (!collection) {
      return null;
    }
    const count = await collection.find(value).count();

    return count;
  }

  private async initClient() {
    try {
      if (this._client) {
        return this._client;
      } else {
        const options = JSON.parse(JSON.stringify(APP.config.database.options));
        const secret = (APP.config.database.isLocal) ? EncryptionUtil.decrypt(APP.config.database.secret, 'aes-bouncy') : APP.config.database.secret;
        const endpoint = 'mongodb://' + APP.config.database.username + ':' + secret + APP.config.database.endpoint;
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
