import { collections, contentKeys, mongoDbTables, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Service } from 'typedi';
import { AppVersionModel } from '../models/appVersionModel';
import { SectionEditRequest } from '../models/libraryModel';

@Service()
export class LibSectionService {

  constructor(
    private result: Result,
    private mongoSvc: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async editSectionDetails(data: SectionEditRequest) {
    try {
      const appVersions: AppVersionModel[] = await this.mongoSvc.readAll(collections.APPVERSION);
      const query = {
        [mongoDbTables.content.version]: appVersions[0].content.helpfulInfo,
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo
      };
      const enUpdateQuery = {
        $set: {
          [mongoDbTables.content.communitySectionTitle.replace('index', data.sectionIndex.toString())]: data.en.title,
          [mongoDbTables.content.communitySectionDescription.replace('index', data.sectionIndex.toString())]: data.en.description
        }
      };
      const esUpdateQuery = {
        $set: {
          [mongoDbTables.content.communitySectionTitle.replace('index', data.sectionIndex.toString())]: data.es.title,
          [mongoDbTables.content.communitySectionDescription.replace('index', data.sectionIndex.toString())]: data.es.description
        }
      };
      const arrayFilters = {
        'arrayFilters': [
          { [mongoDbTables.content.communityIdFilter]: data.communityId }
        ]
      };

      await this.updateSectionContent(query, enUpdateQuery, esUpdateQuery, arrayFilters);

      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createError(error);
    }
  }

  public async editSubSectionDetails(data: SectionEditRequest) {
    try {
      const appVersions: AppVersionModel[] = await this.mongoSvc.readAll(collections.APPVERSION);
      const query = {
        [mongoDbTables.content.version]: appVersions[0].content.helpfulInfo,
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo
      };
      const title = mongoDbTables.content.communityContentTitle.replace('sectionIndex', data.sectionIndex.toString())
        .replace('subSectionIndex', data.subSectionIndex.toString());
      const description = mongoDbTables.content.communityContentDescription.replace('sectionIndex', data.sectionIndex.toString())
        .replace('subSectionIndex', data.subSectionIndex.toString());
      const enUpdateQuery = {
        $set: {
          [title]: data.en.title,
          [description]: data.en.description
        }
      };
      const esUpdateQuery = {
        $set: {
          [title]: data.es.title,
          [description]: data.es.description
        }
      };
      const arrayFilters = {
        'arrayFilters': [
          { [mongoDbTables.content.communityIdFilter]: data.communityId }
        ]
      };

      await this.updateSectionContent(query, enUpdateQuery, esUpdateQuery, arrayFilters);

      if (data?.subSectionId) {
        const enSectionUpdate = {
          $set: {
            [mongoDbTables.content.subSectionTitle]: data.en.title,
            [mongoDbTables.content.subSectionDescription]: data.en.description,
            [mongoDbTables.content.subSectionHeaderTitle]: data.en.title,
            [mongoDbTables.content.subSectionHeaderDescription]: data.en.description
          }
        };
        const esSectionUpdate = {
          $set: {
            [mongoDbTables.content.subSectionTitle]: data.es.title,
            [mongoDbTables.content.subSectionDescription]: data.es.description,
            [mongoDbTables.content.subSectionHeaderTitle]: data.es.title,
            [mongoDbTables.content.subSectionHeaderDescription]: data.es.description
          }
        };
        const filter = {
          'arrayFilters': [
            { [mongoDbTables.content.helpfulInfoIdFilter]: data.subSectionId }
          ]
        };
        await this.updateSectionContent(query, enSectionUpdate, esSectionUpdate, filter);
      }
      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error((error as Error).message);
      return this.result.createError(error);
    }
  }

  private async updateSectionContent(query, enUpdate, esUpdate, filters) {
    await this.mongoSvc.updateByQuery(
      collections.CONTENT,
      {
        ...query,
        [mongoDbTables.content.language]: contentKeys.english
      },
      enUpdate,
      filters
    );

    await this.mongoSvc.updateByQuery(
      collections.CONTENT,
      {
        ...query,
        [mongoDbTables.content.language]: contentKeys.spanish
      },
      esUpdate,
      filters
    );
  }
}
