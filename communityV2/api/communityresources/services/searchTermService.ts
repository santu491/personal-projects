import {
  collections,
  mongoDbTables,
  recommenededResources,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { ProgramListResponse } from '../models/programsModel';
import { BaseResponse } from '../models/resultModel';
import { SearchTerm, UserLocalCategoryModel } from '../models/searchTermModel';
import { User } from '../models/userModel';
import { ProgramService } from './programService';

@Service()
export class SearchTermService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger,
    private validate: Validation,
    private programmeService: ProgramService
  ) {}

  public async getAllSearchTerms(language): Promise<BaseResponse> {
    try {
      const searchTermsList: SearchTerm[] = await this._mongoSvc.readAll(
        collections.SEARCHTERM
      );
      searchTermsList.forEach((searchTerm) => {
        if (language in searchTerm.displayName && searchTerm.displayName[language] !== '') {
          searchTerm.term = searchTerm.displayName[language];
        }
      });
      return this.result.createSuccess(searchTermsList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAllLocalCategoriesByUser(
    userId: string,
    language: string
  ): Promise<BaseResponse> {
    try {
      const user: User = await this._mongoSvc.readByID(
        collections.USERS,
        userId
      );
      const userLocalCategoryIds = user.localCategories;
      let userLocalCategoryModel = new UserLocalCategoryModel();
      const serarchTermsObject = await this.getAllSearchTerms(language);
      const serarchTerms = serarchTermsObject.data.value as SearchTerm[];
      const data: UserLocalCategoryModel[] = [];
      if (serarchTerms.length > 0) {
        for (const searchTerm of serarchTerms) {
          userLocalCategoryModel = {
            id: searchTerm[mongoDbTables.searchTerm.id],
            category: searchTerm.displayName.en,
            displayName: language === TranslationLanguage.ENGLISH ? searchTerm.displayName.en : searchTerm.displayName.es,
            isSelected:
              userLocalCategoryIds && userLocalCategoryIds.length > 0
                ? userLocalCategoryIds.includes(searchTerm.id)
                : false
          };
          data.push(userLocalCategoryModel);
        }
      }
      let count = 0;
      let sortedData = [];
      if (data.length > 0) {
        sortedData = this.validate.alphabeticalSort(
          data,
          1,
          mongoDbTables.searchTerm.category
        );
        count = data.filter((category) => category.isSelected).length;
      }

      const categoryInfo = {
        count: count,
        allCategories: sortedData
      };

      return this.result.createSuccess(categoryInfo);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getUserRecommendedResources(
    userId: string,
    zipcode: number,
    resources: string[],
    language: string
  ): Promise<BaseResponse> {
    try {
      const resourcesList = await this.combinedResources(
        zipcode,
        resources
      );
      let sortedResourceList = [];

      if (resourcesList.length > 0) {
        sortedResourceList = this.validate.alphabeticalSort(
          resourcesList,
          1,
          recommenededResources.NAME
        );

        //Adding language parameter
        if (language !== TranslationLanguage.ENGLISH) {
          const query = {
            [mongoDbTables.community.title]: {
              $in: resources
            }
          };

          const communityDetailList = await this._mongoSvc.readAllByValue(collections.COMMUNITY, query);
          communityDetailList.forEach((community) => {
            sortedResourceList[0].forEach((c) => {
              if (c.name === community.title) {
                c.displayName = community.displayName[language];
              }
            });
          });
        }

        //Adding language parameter
        const lowerCaseResources = resources.map((res) => {
          return res.toLowerCase();
        });
        if (language !== TranslationLanguage.ENGLISH) {
          const query = {
            [mongoDbTables.searchTerm.term]: {
              $in: lowerCaseResources
            }
          };

          const resourceDetailList = await this._mongoSvc.readAllByValue(collections.SEARCHTERM, query);
          resourceDetailList.forEach((resource) => {
            sortedResourceList[0].forEach((r) => {
              if (r.name.toLowerCase() === resource.term) {
                r.displayName = resource.displayName[language];
              }
            });
          });
        }
      }

      const data = {
        userId,
        zipcode,
        resources: sortedResourceList[0]
      };

      return this.result.createSuccess(data);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async combinedResources(
    zipcode: number,
    resources: string[]
  ) {
    return Promise.all([
      this.getResourcesWithCount(resources, zipcode)
    ]);
  }

  private async getResourcesWithCount(data: string[], zipcode: number) {
    return Promise.all(
      data.map(async (resource) => {
        let count = await this.getProgrammeCount(zipcode, resource);
        if (count === undefined) {
          count = await this.getProgrammeCount(zipcode, resource);
        }
        return {
          displayName: resource,
          name: resource,
          count: !count || count === 0 ? '--' : count
        };
      })
    );
  }

  private async getProgrammeCount(zipcode: number, term: string) {
    const programmeObject = await this.programmeService.getProgramsListByZipCode(
      zipcode,
      0,
      1,
      term,
      null,
      null,
      null,
      null
    );
    const programme = programmeObject.data.value as ProgramListResponse;
    return programme ? programme.count : 0;
  }
}
