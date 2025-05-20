import {
  API_RESPONSE,
  collections,
  contentDataKey,
  ContentKey,
  mongoDbTables,
  Result,
  Validation
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { Community } from '../models/communitiesModel';
import { CommunityPromptModel, ContentModel } from '../models/contentModel';
import { PageParam, PageParamModel } from '../models/pageParamModel';
import { Prompt, PromptModel } from '../models/promptModel';
import { BaseResponse } from '../models/resultModel';
import { PublicService } from './publicService';

@Service()
export class PromptService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    private publicService: PublicService,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getAllPrompt(pageParams: PageParam, language: string): Promise<BaseResponse> {
    try {
      let sortedPromptList = [];
      const pageParam = new PageParamModel();
      pageParam.setPageNumber(pageParams.pageNumber);
      pageParam.setPageSize(pageParams.pageSize);
      pageParam.sort = pageParams.sort;
      const promptList = await this.getPromptsWithCommunity(language);
      const start = (pageParams.pageNumber - 1) * pageParams.pageSize;
      const end = start + pageParams.pageSize;

      if (pageParam != null) {
        sortedPromptList = this.validate.sort(
          promptList,
          pageParam.sort,
          mongoDbTables.prompt.createdDate
        );
      }

      sortedPromptList = sortedPromptList.slice(start, end);

      return this.result.createSuccess(sortedPromptList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPromptById(id: string, language: string): Promise<BaseResponse> {
    try {
      const prompts = await this.getPromptsWithCommunity(language);
      const prompt = prompts.filter((p) => p.id === id);
      if (prompt.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.promptDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(prompt[0]);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getByCommunityId(communityId: string, language: string): Promise<BaseResponse> {
    try {
      const promptData = await this.publicService.getAppTranslations(language, ContentKey.PROMPTS );
      if (promptData === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.promptDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const allPrompts: ContentModel = promptData.data.value as ContentModel;
      const prompt = allPrompts.data[contentDataKey.CREATE_STORY].filter((data) => data.communityId === communityId);
      const promptResponse: Prompt[] = prompt[0].prompts;

      promptResponse.forEach((p: Prompt) => {
        p.id = p.promptId;
        delete p.promptId;
      });
      return this.result.createSuccess(promptResponse);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async create(promptModel: PromptModel): Promise<BaseResponse> {
    try {
      const community: Community = await this._mongoSvc.readByID(
        collections.COMMUNITY,
        promptModel.communityId
      );
      if (community === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.communityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const prompt = this.createPromptFromModel(promptModel);
      prompt.createdDate = new Date();
      await this._mongoSvc.insertValue(collections.PROMPT, prompt);
      return this.result.createSuccess(prompt);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommunitiesList(community: string, language: string): Promise<BaseResponse> {
    try {
      const promptContent = await this.publicService.getAppTranslations(language, ContentKey.PROMPTS);
      const promptData: ContentModel = promptContent.data.value as ContentModel;
      if (promptData === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidLanguage;
        return this.result.createError([this.result.errorInfo]);
      }
      const communitiesList = promptData.data[mongoDbTables.prompt.communitiesList];
      if (!(community in communitiesList)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.communityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(communitiesList[community]);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPromptsWithCommunity(language: string): Promise<Prompt[]> {
    const promptData = await this.publicService.getAppTranslations(language, ContentKey.PROMPTS);
    const allPromptData: ContentModel = promptData.data.value as ContentModel;
    const createdAt = allPromptData.createdAt;
    const communityPrompts = allPromptData.data[contentDataKey.CREATE_STORY] as CommunityPromptModel[];

    const prompts: Prompt[] = [];
    communityPrompts.forEach((communityPrompt) => {
      communityPrompt.prompts.forEach((prompt) => {
        prompt.communityId = communityPrompt.communityId;
        prompt.createdDate = createdAt;
        prompt.id = prompt.promptId;
        delete prompt.promptId;
      });
      prompts.push(...communityPrompt.prompts);
    });

    return prompts;
  }

  private createPromptFromModel(promptModel: PromptModel): Prompt {
    const prompt = new Prompt();

    prompt.communityId = promptModel.communityId;
    prompt.question = promptModel.question;
    prompt.helpText = promptModel.helpText;
    prompt.sectionTitle = promptModel.sectionTitle;
    prompt.sensitiveContentText = promptModel.sensitiveContentText;

    return prompt;
  }
}
