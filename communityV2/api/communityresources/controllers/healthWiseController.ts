import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { OpenAPI2, Param2, QueryParam2 } from '@anthem/communityapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { HealthWiseService } from '../services/healthWiseService';

@JsonController(API_INFO.securePath)
export class HealthwiseController extends BaseController {
  constructor(
    private healthWiseService: HealthWiseService,
    private result: Result,
    private validate: Validation,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/healthWise/topic/:id')
  @OpenAPI2({
    description: 'Get the HealthWise Topic',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getTopic(@Param2('id') id: string, @QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (this.validate.isNullOrWhiteSpace(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const topic = await this.healthWiseService.getTopic(id, language);
      return topic;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/healthWise/videoTopic/:id')
  @OpenAPI2({
    description: 'Get the HealthWise Video Topic',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getVideoTopic(@Param2('id') id: string, @QueryParam2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (this.validate.isNullOrWhiteSpace(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const link = `/v2/healthWise/videoTopic/${id}`;
      const videoTopic = await this.healthWiseService.getVideoTopic(id, language, link);
      return videoTopic;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/healthWise/articleTopic/:conceptId/:aspectId')
  @OpenAPI2({
    description: 'Get Article Topic by ConceptId, AspectId and DetailLevel',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getArticleTopic(
    @Param2('conceptId') conceptId: string,
      @Param2('aspectId') aspectId: string,
      @QueryParam2('detailLevel') detailLevel: string,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (this.validate.isNullOrWhiteSpace(conceptId) || this.validate.isNullOrWhiteSpace(aspectId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const link = `/v2//healthWise/articleTopic/${conceptId}/${aspectId}`;
      const articleTopic = await this.healthWiseService.getArticleTopic(conceptId, aspectId, detailLevel, language, link);
      return articleTopic;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/healthWise/articleTopic/:topicId')
  @OpenAPI2({
    description: 'Get Article Topic by topicId',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getArticleTopicByTopicId(
    @Param2('topicId') topicId: string,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (this.validate.isNullOrWhiteSpace(topicId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const link = `/v2/healthWise/articleTopic/${topicId}`;
      const articleTopic = await this.healthWiseService.getArticleTopicByTopicId(topicId, language, link);
      return articleTopic;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/healthWise/article/:articleId')
  @OpenAPI2({
    description: 'Get Article by Article Id',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getArticleById(
    @Param2('articleId') articleId: string,
      @QueryParam2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      if (this.validate.isNullOrWhiteSpace(articleId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const articleTopic = await this.healthWiseService.getArticleById(articleId, language);
      return articleTopic;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/helpfulInfo/validContent/:contentId')
  @OpenAPI2({
    description: 'Check the content status',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getContent(
    @Param2('contentId', { required: true }) contentId: string
  ): Promise<BaseResponse> {
    try {
      const contentStatus = await this.healthWiseService.getContent(contentId);
      return contentStatus;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
