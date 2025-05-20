import {
  collections, Result
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { Reaction } from '../models/reactionModel';
import { BaseResponse } from '../models/resultModel';

@Service()
export class ReactionService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getEntityReactions(entityId: string): Promise<BaseResponse> {
    try {
      const filter = {
        entityId: entityId
      };

      let reactionsList: Reaction[] = await this._mongoSvc.readAllByValue(
        collections.REACTIONS,
        filter
      );

      if (!reactionsList) {
        reactionsList = [];
      }

      return this.result.createSuccess(reactionsList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
