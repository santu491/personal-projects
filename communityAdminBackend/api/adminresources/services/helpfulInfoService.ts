import {
  API_RESPONSE,
  Result,
  articleLiterals,
  collections,
  contentKeys,
  mongoDbTables
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Service } from 'typedi';
import { AppVersionModel } from '../models/appVersionModel';
import {
  HelpfulInfo,
  HelpfulInfoLibRequest,
  Library,
  LibraryData,
  LibraryDetail,
  LibraryResponse,
  LibrarySectionRequest
} from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { ContentService } from './contentService';

@Service()
export class HelpfulInfoService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private contentService: ContentService,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getCommunityHelpfulInfo(
    communityId: string
  ): Promise<BaseResponse> {
    try {
      const result = await this.getHelpfulInfoContent();
      const helpfulInfo: HelpfulInfo[] = result[0];

      const response = new LibraryResponse();

      for (const helpInfo of helpfulInfo) {
        const data: Library[] = helpInfo.data.helpfulInfoModule.filter(
          (libraryItem: Library) => libraryItem.communityId === communityId
        );
        if (data.length === 0) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

          return this.result.createError([this.result.errorInfo]);
        }
        await this.contentService.refineContentReponse(data[0]);
        if (helpInfo.language === contentKeys.english) {
          response.en = data[0];
        } else {
          response.es = data[0];
        }
      }

      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getHelpfulInfoById(
    helpfulInfoId: string
  ): Promise<BaseResponse> {
    try {
      const result = await this.getHelpfulInfoContent();
      const helpfulInfo: HelpfulInfo[] = result[0];
      const response = new LibraryResponse();
      for (const helpInfo of helpfulInfo) {
        const data: Library[] = helpInfo.data.helpfulInfoModule.filter(
          (libraryItem: Library) => libraryItem.helpfulInfoId === helpfulInfoId
        );
        await this.contentService.refineContentReponse(data[0]);
        if (helpInfo.language === contentKeys.english) {
          response.en = data[0];
        } else {
          response.es = data[0];
        }
      }
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateHelpfulInfo(
    helpfulInfoId: string,
    payload: HelpfulInfoLibRequest
  ): Promise<BaseResponse> {
    try {
      let enData;
      let esData;
      const search = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.helpfulInfoModule]: {
          $elemMatch: {
            [mongoDbTables.content.helpfulInfoId]: helpfulInfoId
          }
        }
      };

      const returnData = await this.getHelpfulInfoContent(search);
      const helpfulInfo: HelpfulInfo[] = returnData[0];
      if (helpfulInfo.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      for (const helpInfo of helpfulInfo) {
        if (helpInfo.language === contentKeys.english) {
          const enIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === helpfulInfoId
          );
          helpInfo.data.helpfulInfoModule[enIndex].sections = payload.en;
          enData = helpInfo.data.helpfulInfoModule;
        } else {
          const esIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === helpfulInfoId
          );
          helpInfo.data.helpfulInfoModule[esIndex].sections = payload.es;
          esData = helpInfo.data.helpfulInfoModule;
        }
      }

      const enSearch = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.version]: returnData[1],
        [mongoDbTables.content.language]: contentKeys.english
      };
      const updateEnData = {
        $set: {
          [mongoDbTables.content.helpfulInfoModule]: enData
        }
      };
      const enCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        enSearch,
        updateEnData
      );

      const esSearch = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.version]: returnData[1],
        [mongoDbTables.content.language]: contentKeys.spanish
      };
      const updateEsData = {
        $set: {
          [mongoDbTables.content.helpfulInfoModule]: esData
        }
      };
      const esCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        esSearch,
        updateEsData
      );

      if (enCount === 0 || esCount === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.updateFailedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.updateFaileDetail;

        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommonHelpfulInfo(): Promise<BaseResponse> {
    try {
      const search = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.helpfulInfoModule]: {
          $elemMatch: {
            [mongoDbTables.content.isCommon]: {
              $exists: true,
              $eq: true
            }
          }
        }
      };

      const response = await this.getHelpfulInfoContent(search);
      const resp: LibraryData[] = [];
      const library = {
        en: [],
        es: []
      };
      for (const helpInfo of response[0]) {
        if (helpInfo.language === contentKeys.english) {
          const enData = helpInfo.data.helpfulInfoModule.filter(
            (lib) => lib.isCommon
          );
          library.en.push(...enData);
        } else {
          const esData = helpInfo.data.helpfulInfoModule.filter(
            (lib) => lib.isCommon
          );
          library.es.push(...esData);
        }
      }

      library.en.forEach((lib) => {
        const newLib = new LibraryData();
        newLib.helpfulInfoId = lib.helpfulInfoId;
        newLib.link = articleLiterals.libraryPath.topic + lib.helpfulInfoId;
        newLib.en = lib;
        const esIndex = library.es.findIndex(
          (l) => l.helpfulInfoId === lib.helpfulInfoId
        );
        newLib.es = library.es[esIndex];
        resp.push(newLib);
      });

      return this.result.createSuccess(resp);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateLibrarySection(
    payload: LibrarySectionRequest
  ): Promise<BaseResponse> {
    try {
      let enData;
      let esData;
      const search = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.helpfulInfoModule]: {
          $elemMatch: {
            [mongoDbTables.content.communityId]: payload.communityId
          }
        }
      };
      const projection = {
        projection: {
          [mongoDbTables.content.helpfulInfoModule]: true,
          [mongoDbTables.content.language]: true
        }
      };
      const returnData = await this.getHelpfulInfoContent(search, projection);
      const helpfulInfo: HelpfulInfo[] = returnData[0];
      if (helpfulInfo.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      for (const helpInfo of helpfulInfo) {
        if (helpInfo.language === contentKeys.english) {
          const library: Library = helpInfo.data.helpfulInfoModule.filter(
            (lib) => lib.communityId === payload.communityId
          )[0];
          const enLibIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === library.helpfulInfoId
          );
          const sectionIndex = library.sections.findIndex(
            (section) => section.sectionId === payload.sectionId
          );
          payload.en.sectionId = payload.sectionId;
          library.sections[sectionIndex] = payload.en;
          helpInfo.data.helpfulInfoModule[enLibIndex] = library;
          enData = helpInfo.data.helpfulInfoModule;
        } else {
          const library: Library = helpInfo.data.helpfulInfoModule.filter(
            (lib) => lib.communityId === payload.communityId
          )[0];
          const esLibIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === library.helpfulInfoId
          );
          const sectionIndex = library.sections.findIndex(
            (section) => section.sectionId === payload.sectionId
          );
          payload.es.sectionId = payload.sectionId;
          library.sections[sectionIndex] = payload.es;
          helpInfo.data.helpfulInfoModule[esLibIndex] = library;
          esData = helpInfo.data.helpfulInfoModule;
        }
      }

      const enSearch = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.version]: returnData[1],
        [mongoDbTables.content.language]: contentKeys.english
      };
      const updateEnData = {
        $set: {
          [mongoDbTables.content.helpfulInfoModule]: enData
        }
      };
      const enCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        enSearch,
        updateEnData
      );

      const esSearch = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.version]: returnData[1],
        [mongoDbTables.content.language]: contentKeys.spanish
      };
      const updateEsData = {
        $set: {
          [mongoDbTables.content.helpfulInfoModule]: esData
        }
      };
      const esCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        esSearch,
        updateEsData
      );
      if (enCount === 0 || esCount === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.updateFailedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.updateFaileDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getHelpfulInfoContent(
    search?,
    projection = {}
  ): Promise<[HelpfulInfo[], string]> {
    const appVersion: AppVersionModel = await this._mongoSvc.readByValue(
      collections.APPVERSION,
      {}
    );
    let searchData = {
      [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
      [mongoDbTables.content.version]: appVersion.content.helpfulInfo
    };
    if (search) {
      searchData = {
        ...search,
        ...searchData
      };
    }
    const helpfulInfo: HelpfulInfo[] = await this._mongoSvc.readAllByValue(
      collections.CONTENT,
      searchData,
      {},
      null,
      null,
      projection
    );
    return [helpfulInfo, appVersion.content.helpfulInfo];
  }

  public async updateLibraryDetail(
    payload: LibraryDetail
  ): Promise<BaseResponse> {
    try {
      const appVersion: AppVersionModel = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const search = {
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.version]: appVersion.content.helpfulInfo,
        [mongoDbTables.content.language]: contentKeys.english,
        [mongoDbTables.content.helpfulInfoModule]: {
          $elemMatch: {
            [mongoDbTables.content.helpfulInfoId]: payload.helpfulInfoId
          }
        }
      };
      const updateEnData = {
        $set: {
          [mongoDbTables.content.helpfulInfoModuleTitle]: payload.en.title,
          [mongoDbTables.content.helpfulInfoModuleDescription]: payload.en.description
        }
      };
      const enCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        search,
        updateEnData
      );
      const updateEsData = {
        $set: {
          [mongoDbTables.content.helpfulInfoModuleTitle]: payload.es.title,
          [mongoDbTables.content.helpfulInfoModuleDescription]: payload.es.description
        }
      };
      const newSearch = {
        ...search,
        [mongoDbTables.content.language]: contentKeys.spanish
      };
      const esCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        newSearch,
        updateEsData
      );

      if (enCount === 0 || esCount === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.updateFailedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.updateFaileDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess({
        enUpdate: enCount,
        esUpdate: esCount
      });
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }
}
