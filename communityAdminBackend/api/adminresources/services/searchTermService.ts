import { collections, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { Service } from 'typedi';
import { BaseResponse } from '../models/resultModel';
import { SearchTerm } from '../models/searchTermModel';

@Service()
export class SearchTermService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result
  ) { }

  public async addSearchTerm(term: string): Promise<BaseResponse>{
    try {
      const searchTerm = new SearchTerm();
      searchTerm.term = term;
      searchTerm.createdDate = new Date();
      await this._mongoSvc.insertValue(collections.SEARCHTERM, searchTerm);
      return this.result.createSuccess(searchTerm);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
