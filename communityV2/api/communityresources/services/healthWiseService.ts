import { API_RESPONSE, collections, contentKeys, mongoDbTables, Result, TranslationLanguage, Validation } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { CacheUtil } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { HealthwiseGateway } from '../gateways/healthwiseGateway';
import {
  ArticleTopic,
  HealthWiseAuthResponse,
  HealthWiseTopicResponse,
  Item,
  Root,
  Topic,
  Topic2,
  VideoRoot
} from '../models/healthWiseModel';
import { HelpfulInfo } from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { HealthwiseTokenService } from './healthwiseTokenService';

@Service()
export class HealthWiseService {
  constructor(
    private gateway: HealthwiseGateway,
    private healthwiseTokenService: HealthwiseTokenService,
    private validate: Validation,
    private _cacheUtil: CacheUtil,
    private result: Result,
    private mongodb: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getTopic(topicId: string, language: string): Promise<BaseResponse> {
    try {
      let cache: HealthWiseAuthResponse = this._cacheUtil.getCache(
        'healthwise:token'
      ) as HealthWiseAuthResponse;
      if (!cache) {
        cache = await this.healthwiseTokenService.postAuth();
        this._cacheUtil.setCache('healthwise:token', cache, cache.expires_in);
      }
      const topicResponse = await this.gateway.getTopicById(
        cache.access_token,
        topicId,
        language
      );
      if (topicResponse !== null) {
        if (
          topicResponse.data &&
          topicResponse.data.topics !== null &&
          topicResponse.data.topics.length > 0
        ) {

          // If the helpfulInfo present in the database then only form the rsponse.

          const removedKeys = [
            'toLearnMoreHtml',
            'yourUseOfThisInformationHtml'
          ];
          topicResponse.data.topics.forEach((response) => {
            if (response.legal !== undefined && response.legal !== null) {
              const legalKeys = Object.keys(response.legal);
              removedKeys.forEach((d) => {
                const isAvailable = legalKeys.includes(d);
                if (isAvailable) {
                  delete response.legal[d];
                }
              });
            }
          });
        }

        try {
          const stringfyData = JSON.stringify(topicResponse);
          const updatedData = stringfyData
            .replace(this.findAll('class'), 'hclass')
            .replace(this.findAll('xml:'), '')
            .replace(this.findAll('X-HW-Version'), 'Version')
            .replace(this.findAll('en-us'), 'enus');
          const parseData: HealthWiseTopicResponse = JSON.parse(updatedData);
          if (
            parseData === null ||
            parseData.status === 404 ||
            parseData.data.topics === null ||
            parseData.data.topics.length === 0
          ) {
            this.result.errorInfo.title = API_RESPONSE.messages.notFound;
            this.result.errorInfo.detail =
              API_RESPONSE.messages.noDocumentFound;
            return this.result.createError([this.result.errorInfo]);
          }
          return this.result.createSuccess(this.buildTopicFromTopic2(parseData.data.topics[0]));
        } catch (error) {
          const stringfyData = JSON.stringify(topicResponse);
          const updatedData = stringfyData
            .replace(this.findAll('class'), 'hclass')
            .replace(this.findAll('xml:'), '')
            .replace(this.findAll('X-HW-Version'), 'Version')
            .replace(this.findAll('en-us'), 'enus');
          const parseData: Root = JSON.parse(updatedData);

          if (
            parseData === null ||
            parseData.status === 404 ||
            parseData.data.topics === null ||
            parseData.data.topics.length === 0
          ) {
            this.result.errorInfo.title = API_RESPONSE.messages.notFound;
            this.result.errorInfo.detail =
              API_RESPONSE.messages.noDocumentFound;
            return this.result.createError([this.result.errorInfo]);
          }
          return this.result.createSuccess(
            this.buildTopicFromTopic2(parseData.data.topics[0])
          );
        }
      }
      this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;
      return this.result.createError([this.result.errorInfo]);
    } catch (error) {
      if (language !== TranslationLanguage.ENGLISH
        && error['httpCode'] === 404) {
        return this.getTopic(topicId, TranslationLanguage.ENGLISH);
      } else if (error['httpCode'] === 404 && error['message']['status'] === 404) {
        this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];

        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createException(error);
    }
  }

  public async getVideoTopic(topicId: string, language: string, link): Promise<BaseResponse> {
    try {
      let cache: HealthWiseAuthResponse = this._cacheUtil.getCache(
        'healthwise:token'
      ) as HealthWiseAuthResponse;
      if (!cache) {
        cache = await this.healthwiseTokenService.postAuth();
        this._cacheUtil.setCache('healthwise:token', cache, cache.expires_in);
      }
      const topicResponse = await this.gateway.getTopicById(
        cache.access_token,
        topicId, language
      );
      if (topicResponse !== null) {
        if (
          topicResponse.data &&
          topicResponse.data.topics !== null &&
          topicResponse.data.topics.length > 0
        ) {
          // If the video present in the healthwise then check in DB.
          if (!(await this.getTheContentBasedOnTheLink(link))) {
            this.result.errorInfo.title = API_RESPONSE.messages.healthWiseDataDeleted;
            this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseDataDeletedDetail;
            this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];

            return this.result.createError(this.result.errorInfo);
          }
          const removedKeys = [
            'toLearnMoreHtml',
            'yourUseOfThisInformationHtml'
          ];
          topicResponse.data.topics.forEach((response) => {
            if (response.legal !== undefined && response.legal !== null) {
              const legalKeys = Object.keys(response.legal);
              removedKeys.forEach((d) => {
                const isAvailable = legalKeys.includes(d);
                if (isAvailable) {
                  delete response.legal[d];
                }
              });
            }
          });
        }

        try {
          const stringfyData = JSON.stringify(topicResponse);
          const updatedData = stringfyData
            .replace(this.findAll('class'), 'hclass')
            .replace(this.findAll('xml:'), '')
            .replace(this.findAll('X-HW-Version'), 'Version')
            .replace(this.findAll('en-us'), 'enus');
          const parseData: HealthWiseTopicResponse = JSON.parse(updatedData);
          if (
            parseData === null ||
            parseData.status === 404 ||
            parseData.data.topics === null ||
            parseData.data.topics.length === 0
          ) {
            this.result.errorInfo.title = API_RESPONSE.messages.notFound;
            this.result.errorInfo.detail =
              API_RESPONSE.messages.noDocumentFound;
            return this.result.createError([this.result.errorInfo]);
          }
          return this.result.createSuccess(parseData.data.topics[0]);
        } catch (error) {
          const stringfyData = JSON.stringify(topicResponse);
          const updatedData = stringfyData
            .replace(this.findAll('class'), 'hclass')
            .replace(this.findAll('xml:'), '')
            .replace(this.findAll('X-HW-Version'), 'Version')
            .replace(this.findAll('en-us'), 'enus');
          const parseData: VideoRoot = JSON.parse(updatedData);

          if (
            parseData === null ||
            parseData.status === 404 ||
            parseData.data.topics === null ||
            parseData.data.topics.length === 0
          ) {
            this.result.errorInfo.title = API_RESPONSE.messages.notFound;
            this.result.errorInfo.detail =
              API_RESPONSE.messages.noDocumentFound;
            return this.result.createError([this.result.errorInfo]);
          }
          return this.result.createSuccess(
            this.buildTopicFromTopic2(parseData.data.topics[0])
          );
        }
      }
      this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;

      return this.result.createError([this.result.errorInfo]);
    } catch (error) {
      if (error['httpCode'] === 404) {
        if (language !== TranslationLanguage.ENGLISH) {
          return this.getVideoTopic(topicId, TranslationLanguage.ENGLISH, link);
        }
        //TODO:  If the topic is not present in healthwise then delete from the Database.
        this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];

        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createException(error);
    }
  }

  public async getArticleTopic(conceptId: string, aspectId: string, detailLevel: string, language: string, link): Promise<BaseResponse> {
    try {
      let cache: HealthWiseAuthResponse = this._cacheUtil.getCache(
        'healthwise:token'
      ) as HealthWiseAuthResponse;
      if (!cache) {
        cache = await this.healthwiseTokenService.postAuth();
        this._cacheUtil.setCache('healthwise:token', cache, cache.expires_in);
      }
      const topicResponse = await this.gateway.getArticleTopic(
        cache.access_token,
        conceptId,
        aspectId,
        language
      );
      if (topicResponse !== null) {
        if (
          topicResponse.data &&
          topicResponse.data.topics !== null &&
          topicResponse.data.topics.length > 0
        ) {
          const removedKeys = [
            'toLearnMoreHtml',
            'yourUseOfThisInformationHtml'
          ];
          topicResponse.data.topics.forEach((response) => {
            if (response.legal !== undefined && response.legal !== null) {
              const legalKeys = Object.keys(response.legal);
              removedKeys.forEach((d) => {
                const isAvailable = legalKeys.includes(d);
                if (isAvailable) {
                  delete response.legal[d];
                }
              });
            }
          });
        }

        try {
          const stringfyData = JSON.stringify(topicResponse);
          const updatedData = stringfyData
            .replace(this.findAll('class'), 'hclass')
            .replace(this.findAll('xml:'), '')
            .replace(this.findAll('X-HW-Version'), 'Version')
            .replace(this.findAll('en-us'), 'enus');
          const parseData: HealthWiseTopicResponse = JSON.parse(updatedData);
          if (
            parseData === null ||
            parseData.status === 404 ||
            parseData.data.topics === null ||
            parseData.data.topics.length === 0
          ) {
            this.result.errorInfo.title = API_RESPONSE.messages.notFound;
            this.result.errorInfo.detail =
              API_RESPONSE.messages.noDocumentFound;
            return this.result.createError([this.result.errorInfo]);
          }
          return this.result.createSuccess(parseData.data.topics[0]);
        } catch (error) {
          const stringfyData = JSON.stringify(topicResponse);
          const updatedData = stringfyData
            .replace(this.findAll('class'), 'hclass')
            .replace(this.findAll('xml:'), '')
            .replace(this.findAll('X-HW-Version'), 'Version')
            .replace(this.findAll('en-us'), 'enus');
          const parseData: Root = JSON.parse(updatedData);

          if (
            parseData === null ||
            parseData.status === 404 ||
            parseData.data.topics === null ||
            parseData.data.topics.length === 0
          ) {
            this.result.errorInfo.title = API_RESPONSE.messages.notFound;
            this.result.errorInfo.detail = API_RESPONSE.messages.noDocumentFound;

            return this.result.createError([this.result.errorInfo]);
          }

          const res = await this.validatearticleTopicObject(parseData, detailLevel, language, link);
          return res;
        }
      }
      this.result.errorInfo.title =
        API_RESPONSE.messages.healthWiseNoResponseTitle;
      this.result.errorInfo.detail =
        API_RESPONSE.messages.healthWiseNoResponseDetailedError;
      return this.result.createError([this.result.errorInfo]);
    } catch (error) {
      return this.result.createException(error);
    }
  }

  public async getArticleTopicByTopicId(topicId: string, language: string, link: string): Promise<BaseResponse> {
    try {
      const topic = await this.getTopic(topicId, language);

      if (!topic.data.value) {
        if (topic.data.errors && topic.data.errors.length > 0) {
          this.result.errorInfo.title = topic.data.errors[0].title;
          this.result.errorInfo.detail = topic.data.errors[0].detail;
          return this.result.createError([this.result.errorInfo]);
        }

        this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;
        return this.result.createError([this.result.errorInfo]);
      }

      // If the topic present in the healthwise then check in DB.
      if (!(await this.getTheContentBasedOnTheLink(link))) {
        this.result.errorInfo.title = API_RESPONSE.messages.healthWiseDataDeleted;
        this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseDataDeletedDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];

        return this.result.createError(this.result.errorInfo);
      }
      const topicValue: Topic = topic.data.value as Topic;
      const articleTopic = this.buildArticleTopicFromTopic(topicValue);

      return this.result.createSuccess(articleTopic);
    } catch (error) {
      return this.result.createException(error);
    }
  }

  public async getArticleById(articleId: string, language: string): Promise<BaseResponse> {
    try {
      const topic = await this.getArticle(articleId, language);

      if (!topic.data.value) {
        if (topic.data.errors && topic.data.errors.length > 0) {
          this.result.errorInfo.title = topic.data.errors[0].title;
          this.result.errorInfo.detail = topic.data.errors[0].detail;
          return this.result.createError([this.result.errorInfo]);
        }

        this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;
        return this.result.createError([this.result.errorInfo]);
      }

      const articleValue: Topic = topic.data.value as Topic;
      const articleTopic = this.buildArticleTopicFromTopic(articleValue);

      return this.result.createSuccess(articleTopic);
    } catch (error) {
      return this.result.createException(error);
    }
  }

  public async getTheContentBasedOnTheLink(link: string): Promise<boolean> {
    try {
      const helpfulData: HelpfulInfo = await this.getHelpfulInfoContent();
      for (const lib of helpfulData.data.helpfulInfoModule) {
        for (const section of lib.sections) {
          for (const content of section.content) {
            if (content.link === link) {
              return true;
            }
          }
        }
      }
      return false;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async getContent(contentId: string): Promise<BaseResponse> {
    try{
      const helpfulData: HelpfulInfo = await this.getHelpfulInfoContent();
      for (const lib of helpfulData.data.helpfulInfoModule) {
        for (const section of lib.sections) {
          for (const content of section.content) {
            const possibleLink = `/v2/healthWise/videoTopic/${contentId}`;
            if (content.link === contentId || content.link === possibleLink) {
              return this.result.createSuccess(true);
            }
          }
        }
      }
      this.result.errorInfo.title = API_RESPONSE.messages.healthWiseDataDeleted;
      this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseDataDeletedDetail;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];

      return this.result.createError(this.result.errorInfo);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException(error);
    }
  }

  private async getArticle(articleId: string, language: string): Promise<BaseResponse> {
    try {
      let cache: HealthWiseAuthResponse = this._cacheUtil.getCache('healthwise:token') as HealthWiseAuthResponse;
      if (!cache) {
        cache = await this.healthwiseTokenService.postAuth();
        this._cacheUtil.setCache('healthwise:token', cache, cache.expires_in);
      }
      const articleResponse = await this.gateway.getArticleById(
        cache.access_token,
        articleId,
        language
      );
      if (articleResponse === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;

        return this.result.createError([this.result.errorInfo]);
      }

      if (
        articleResponse.data &&
        articleResponse.data.topics !== null &&
        articleResponse.data.topics.length > 0
      ) {
        const removedKeys = [
          'toLearnMoreHtml',
          'yourUseOfThisInformationHtml'
        ];
        articleResponse.data.topics.forEach((response) => {
          if (response.legal !== undefined && response.legal !== null) {
            const legalKeys = Object.keys(response.legal);
            removedKeys.forEach((d) => {
              const isAvailable = legalKeys.includes(d);
              if (isAvailable) {
                delete response.legal[d];
              }
            });
          }
        });
      }

      try {
        const stringfyData = JSON.stringify(articleResponse);
        const updatedData = stringfyData
          .replace(this.findAll('class'), 'hclass')
          .replace(this.findAll('xml:'), '')
          .replace(this.findAll('X-HW-Version'), 'Version')
          .replace(this.findAll('en-us'), 'enus');
        const parseData: HealthWiseTopicResponse = JSON.parse(updatedData);
        if (
          parseData === null ||
          parseData.status === 404 ||
          parseData.data.topics === null ||
          parseData.data.topics.length === 0
        ) {
          this.result.errorInfo.title = API_RESPONSE.messages.notFound;
          this.result.errorInfo.detail = API_RESPONSE.messages.noDocumentFound;

          return this.result.createError([this.result.errorInfo]);
        }
        const data = this.buildTopicFromTopic2(parseData.data.topics[0]);
        return this.result.createSuccess(data);
      } catch (error) {
        const stringfyData = JSON.stringify(articleResponse);
        const updatedData = stringfyData
          .replace(this.findAll('class'), 'hclass')
          .replace(this.findAll('xml:'), '')
          .replace(this.findAll('X-HW-Version'), 'Version')
          .replace(this.findAll('en-us'), 'enus');
        const parseData: Root = JSON.parse(updatedData);

        if (
          parseData === null ||
          parseData.status === 404 ||
          parseData.data.topics === null ||
          parseData.data.topics.length === 0
        ) {
          this.result.errorInfo.title = API_RESPONSE.messages.notFound;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.noDocumentFound;
          return this.result.createError([this.result.errorInfo]);
        }
        return this.result.createSuccess(
          this.buildTopicFromTopic2(parseData.data.topics[0])
        );
      }

    } catch (error) {
      if (language !== TranslationLanguage.ENGLISH && error['httpCode'] === 404) {
        return this.getTopic(articleId, TranslationLanguage.ENGLISH);
      }
      return this.result.createException(error);
    }
  }

  private async validatearticleTopicObject(parseData, detailLevel, language, link) {
    let item = new Item();

    if (parseData && parseData.items) {
      if (this.validate.isNullOrWhiteSpace(detailLevel)) {
        parseData.items.forEach((i) => {
          if (this.validate.isNullOrWhiteSpace(i.detailLevel)) {
            item = i;
          }
        });
      }
      else {
        parseData.items.forEach((i) => {
          if (item.detailLevel === detailLevel) {
            item = i;
          }
        });
      }
    }

    if (item == null) {
      this.result.errorInfo.title = API_RESPONSE.messages.notFound;
      this.result.errorInfo.detail =
        API_RESPONSE.messages.noDocumentFound;
      return this.result.createError([this.result.errorInfo]);
    }

    const articleTopicObject = await this.getArticleTopicByTopicId(item.id, language, link);

    if (articleTopicObject.data.value == null) {
      if (articleTopicObject.data.errors && articleTopicObject.data.errors.length > 0) {
        this.result.errorInfo.title = articleTopicObject.data.errors[0].title;
        this.result.errorInfo.detail = articleTopicObject.data.errors[0].detail;
        return this.result.createError([this.result.errorInfo]);
      }

      this.result.errorInfo.title = API_RESPONSE.messages.healthWiseNoResponseTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.healthWiseNoResponseDetailedError;
      return this.result.createError([this.result.errorInfo]);
    }

    const articleTopic = articleTopicObject.data.value;
    return this.result.createSuccess(articleTopic);
  }

  private findAll(element: string) {
    return new RegExp(element, 'g');
  }

  private buildArticleTopicFromTopic(topic: Topic): ArticleTopic {
    const articleTopic = new ArticleTopic();

    articleTopic.topicId = topic.id;
    articleTopic.type = topic.type;
    articleTopic.navigable = topic.navigable;
    articleTopic.title = (topic.taxonomy && topic.taxonomy.length > 0) ? topic?.taxonomy[0]?.aspect.label : null;
    articleTopic.subTitle = topic.title?.consumer;
    articleTopic.taxonomy = topic.taxonomy;
    articleTopic.aspect = topic.aspect;
    articleTopic.detailLevel = topic.detailLevel;
    articleTopic.hwid = topic.hwid;
    articleTopic.audience = topic.audience;

    if (Array.isArray(topic.html)) {
      articleTopic.html = topic.html;
    }
    else {
      articleTopic.html = [];
      articleTopic.html.push(topic.html);
    }

    return articleTopic;
  }

  private buildTopicFromTopic2(topic2: Topic2): Topic {
    const topic = new Topic();
    topic.certifiedDate = topic2.certifiedDate;
    topic.detailLevel = topic2.detailLevel;
    topic.audience = topic2.audience;
    topic.behaviorChange = topic2.behaviorChange;
    topic.id = topic2.id;
    topic.version = topic2.version;
    topic.hash = topic2.hash;
    topic.lang = topic2.lang;
    topic.type = topic2.type;
    topic.title = topic2.title;
    topic.legal = topic2.legal;
    topic.navigable = topic2.navigable;
    topic.credits = topic2.credits;
    topic.taxonomy = topic2.taxonomy;
    topic.aspect = topic2.aspect;
    topic.hwid = topic2.hwid;

    if (Array.isArray(topic2.html)) {
      topic.html = topic2.html;
    }
    else {
      topic.html = [];
      topic.html.push(topic2.html);
    }

    return topic;
  }

  private async getHelpfulInfoContent(search?, projection = {}): Promise<HelpfulInfo> {
    const appVersion = await this.mongodb.readByValue(collections.APPVERSION, {});
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
    const helpfulInfo: HelpfulInfo[] = await this.mongodb.readAllByValue(collections.CONTENT, searchData, {}, null, null, projection);
    return helpfulInfo[0];
  }
}
