import { collections, contentKeys, mongoDbTables, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Service } from 'typedi';
import { AppVersionModel } from '../models/appVersionModel';
import { ContentModel } from '../models/contentModel';
import { PromptRequest, PromptRequestData } from '../models/promptModel';
import { BaseResponse } from '../models/resultModel';

@Service()
export class PromptsService {

  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private _result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getByCommunityId(communityId: string): Promise<BaseResponse> {
    try {
      const contentData = await this.getCommunityContent(communityId);
      const content = contentData.prompts;

      content.forEach((c: ContentModel) => {
        const module = c.data[contentKeys.createStoryModule].filter(
          (community) => community.communityId === communityId);
        c.data = module;
      });

      return this._result.createSuccess(content);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }

  public async setPromptData(promptsData: PromptRequest) {
    try {
      const contentData = await this.getCommunityContent(promptsData.communityId);
      const content: ContentModel[] = contentData.prompts;
      const prompts = this.changePromptData(promptsData);

      const query = {
        [mongoDbTables.content.version]: contentData.version,
        [mongoDbTables.content.contentType]: contentKeys.prompts
      };
      let valueEn = {};
      let valueEs = {};
      let arrayFilters = undefined;
      if (content.length > 0) {
        valueEn = {
          $set: {
            [mongoDbTables.content.promptsFilter]: prompts.en
          }
        };
        valueEs = {
          $set: {
            [mongoDbTables.content.promptsFilter]: prompts.es
          }
        };
        arrayFilters = {
          'arrayFilters': [
            { [mongoDbTables.content.communityIdFilter]: promptsData.communityId }
          ]
        };
      }
      else {
        valueEn = {
          $push: {
            [mongoDbTables.content.createStoryModule]: {
              [mongoDbTables.content.communityId]: promptsData.communityId,
              [mongoDbTables.content.prompts]: prompts.en
            }
          }
        };
        valueEs = {
          $push: {
            [mongoDbTables.content.createStoryModule]: {
              [mongoDbTables.content.communityId]: promptsData.communityId,
              [mongoDbTables.content.prompts]: prompts.es
            }
          }
        };
        arrayFilters = { upsert: true };
      }

      await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        {
          ...query,
          [mongoDbTables.content.language]: contentKeys.english
        },
        valueEn,
        arrayFilters
      );

      await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        {
          ...query,
          [mongoDbTables.content.language]: contentKeys.spanish
        },
        valueEs,
        arrayFilters
      );

      return this._result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this._result.createException((error as Error).message);
    }
  }

  private changePromptData(promptsData: PromptRequest) {
    const prompts: PromptRequestData = {
      en: [],
      es: []
    };
    promptsData.prompts.forEach((prompt) => {
      prompts.en.push({
        promptId: prompt.promptId,
        ...prompt.en
      });
      prompts.es.push({
        promptId: prompt.promptId,
        ...prompt.es
      });
    });
    return prompts;
  }

  private async getCommunityContent(communityId: string) {
    const appVersions: AppVersionModel[] = await this._mongoSvc.readAll(collections.APPVERSION);
    const search = {
      [mongoDbTables.content.version]: appVersions[0].content.prompts,
      [mongoDbTables.content.contentType]: contentKeys.prompts,
      [mongoDbTables.content.createStoryModule]: {
        $elemMatch: {
          [mongoDbTables.content.communityId]: communityId
        }
      }
    };
    const content: ContentModel[] = await this._mongoSvc.readAllByValue(
      collections.CONTENT,
      search
    );

    return {
      version: appVersions[0].content.prompts,
      prompts: content
    };
  }
}
