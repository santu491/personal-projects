import {
  API_RESPONSE,
  Result,
  articleLiterals,
  articleProvider,
  collections,
  contentKeys,
  mongoDbTables
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { CacheUtil } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';
import { HealthwiseGateway } from '../gateways/healthwiseGateway';
import { MeredithGateway } from '../gateways/meredithGateway';
import { AppVersionModel } from '../models/appVersionModel';
import { ContentModel } from '../models/contentModel';
import { HealthWiseAuthResponse } from '../models/healthWiseModel';
import {
  ArticleRequest,
  ArticleResponse,
  Content,
  Library,
  LibraryResponse,
  SectionRequest
} from '../models/libraryModel';
import { HealthwiseTokenService } from './healthwiseTokenService';

@Service()
export class LibraryService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private _cacheUtil: CacheUtil,
    private healthwiseTokenService: HealthwiseTokenService,
    private hwGateway: HealthwiseGateway,
    private result: Result,
    private meredithGateway: MeredithGateway
  ) {}

  public async getLibraryByCommunityId(communityId: string) {
    try {
      const value = {
        [mongoDbTables.library.communityId]: communityId
      };

      const library: Library = await this._mongoSvc.readByValue(
        collections.LIBRARY,
        value
      );

      if (library === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.libraryDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(library);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async createCommunitySection(model: SectionRequest) {
    try {
      const communityContent = await this.getCommunityContent(
        model.section.en.communityId
      );

      const query = {
        [mongoDbTables.content.version]: communityContent.version,
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo
      };
      let valueEn = {};
      let valueEs = {};
      let arrayFilters = undefined;
      if (communityContent.helpfulInfo.length === 0) {
        //New Community Logic
        valueEn = {
          $push: {
            [mongoDbTables.content.helpfulInfoModule]: model.section.en
          }
        };
        valueEs = {
          $push: {
            [mongoDbTables.content.helpfulInfoModule]: model.section.es
          }
        };
        arrayFilters = { upsert: true };
      } else {
        //Editing existing community
        valueEn = {
          $push: {
            [mongoDbTables.content.sections]: {
              $each: model.section.en.sections
            }
          }
        };
        valueEs = {
          $push: {
            [mongoDbTables.content.sections]: {
              $each: model.section.es.sections
            }
          }
        };
        arrayFilters = {
          arrayFilters: [
            {
              [mongoDbTables.content.communityIdFilter]:
                model.section.en.communityId
            }
          ]
        };
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

      const subSections =
        model.subSections.length > 0
          ? this.getSubSections(model)
          : { en: [], es: [] };

      if (subSections.en.length > 0) {
        await this._mongoSvc.updateByQuery(
          collections.CONTENT,
          {
            ...query,
            [mongoDbTables.content.language]: contentKeys.english
          },
          {
            $push: {
              [mongoDbTables.content.helpfulInfoModule]: {
                $each: subSections.en
              }
            }
          }
        );

        await this._mongoSvc.updateByQuery(
          collections.CONTENT,
          {
            ...query,
            [mongoDbTables.content.language]: contentKeys.spanish
          },
          {
            $push: {
              [mongoDbTables.content.helpfulInfoModule]: {
                $each: subSections.es
              }
            }
          }
        );
      }
      return this.result.createSuccess(true);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getHealthwiseArticle(articleData: ArticleRequest) {
    let cache: HealthWiseAuthResponse = this._cacheUtil.getCache(
      'healthwise:token'
    ) as HealthWiseAuthResponse;
    if (!cache) {
      cache = await this.healthwiseTokenService.postAuth();
      this._cacheUtil.setCache('healthwise:token', cache, cache.expires_in);
    }
    let topicResponse;
    try {
      topicResponse = await this.hwGateway.getTopicById(
        cache.access_token,
        articleData.articleId,
        contentKeys.english
      );
    } catch (error) {
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidContentKey;
      this.result.errorInfo.title = API_RESPONSE.messages.contentNotFound;
      return this.result.createError(this.result.errorInfo);
    }

    if (
      topicResponse !== null &&
      topicResponse.data &&
      topicResponse.data.topics !== null &&
      topicResponse.data.topics.length > 0
    ) {
      const type = topicResponse.data.topics[0].type;
      const response: ArticleResponse = new ArticleResponse();
      response.en = new Content();
      response.es = new Content();
      response.en.title = response.es.title =
        topicResponse.data.topics[0].title.consumer;
      response.en.contentId = response.es.contentId = articleData.articleId;
      response.en.provider = response.es.provider = articleProvider[0];
      let spanishResponse;
      try {
        spanishResponse = await this.hwGateway.getTopicById(
          cache.access_token,
          articleData.articleId,
          contentKeys.spanish
        );
      } catch (error) {
        spanishResponse = null;
      }

      if (type === articleLiterals.healthwise.video) {
        const videoReference =
          topicResponse.data.topics[0]?.sources?.mp4_288p_url ||
          topicResponse.data.topics[0]?.sources?.mp4_720p_url;
        response.en.link =
          response.es.link = `${articleLiterals.healthwise.videoPath}${articleData.articleId}`;
        response.en.type = response.es.type = articleLiterals.videoType;
        response.en.video = response.es.video = videoReference.split('?')[0];
        response.en.thumbnail = response.es.thumbnail =
          topicResponse.data.topics[0].thumbnail;
        response.en.description =
          topicResponse.data.topics[0]?.abstract?.consumer ?? '';
        response.es.description =
          spanishResponse?.data?.topics[0]?.abstract?.consumer ?? '';
      } else if (type === articleLiterals.healthwise.media) {
        const mediaBodyIndex =
          topicResponse.data.topics[0]?.html?.content?.findIndex(
            (c) => c.element === articleLiterals.healthwise.mediaBody
          );
        const imageSectionIndex = topicResponse.data.topics[0]?.html?.content[
          mediaBodyIndex
        ]?.content?.findIndex(
          (c) => c.element === articleLiterals.healthwise.mediaImageSection
        );
        const imageIndex = topicResponse.data.topics[0]?.html?.content[
          mediaBodyIndex
        ]?.content[imageSectionIndex]?.content?.findIndex(
          (c) => c.element === articleLiterals.healthwise.mediaImage
        );
        response.en.thumbnail =
          topicResponse.data.topics[0]?.html?.content[mediaBodyIndex]?.content[
            imageSectionIndex
          ]?.content[imageIndex]?.attributes?.href ?? '';
        response.en.link =
          response.es.link = `${articleLiterals.healthwise.articlePath}${articleData.articleId}`;
        response.en.type = response.es.type = articleLiterals.articleType;
      } else {
        response.en.link =
          response.es.link = `${articleLiterals.healthwise.articlePath}${articleData.articleId}`;
        response.en.type = response.es.type = articleLiterals.articleType;
      }

      if (spanishResponse?.data?.topics[0]?.title?.consumer) {
        response.es.title = spanishResponse?.data?.topics[0]?.title?.consumer;
      }
      return this.result.createSuccess(response);
    } else {
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidContentKey;
      this.result.errorInfo.title = API_RESPONSE.messages.contentNotFound;
      return this.result.createError(this.result.errorInfo);
    }
  }

  public async getMeredithArticle(articleData: ArticleRequest) {
    try {
      const articleResponse = await this.meredithGateway.getArticle(
        articleData.articleId
      );
      const image = articleResponse.result.images[0].previews?.wide
        ? articleResponse.result.images[0].previews?.wide?.uri
        : articleResponse.result.images[0].previews?.standard?.uri;
      const regex = /^(http)\b/;
      image.replace(regex, 'https');
      const response: Content = {
        title: articleResponse.result.title,
        type: '',
        communityId: '',
        contentId: articleResponse.result.id,
        description: articleResponse.result?.subtitle ?? '',
        link: articleResponse.result?.canonicalUrl ?? '',
        video: '',
        thumbnail: image ?? '',
        imgUrl: image ?? '',
        copyright: articleResponse.result?.copyright,
        brandLogo: articleResponse.result?.brandLogo ? articleResponse.result?.brandLogo.replace(regex, 'https') : '',
        brand: articleResponse.result?.brand ?? '',
        provider: articleProvider[1]
      };

      if (
        articleResponse.result.contentType === articleLiterals.meredithVideo
      ) {
        response.link = articleResponse.result.id;
        response.video = articleResponse.result.videos[0].url;
        response.type = articleLiterals.videoType;
      } else {
        response.description = articleResponse.result?.textWithHtml
          ? articleResponse.result?.textWithHtml
          : articleResponse.result?.text;
        response.type = articleLiterals.articleType;
      }

      return this.result.createSuccess({
        en: response,
        es: response
      });
    } catch (error) {
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidContentKey;
      this.result.errorInfo.title = API_RESPONSE.messages.contentNotFound;
      return this.result.createError(this.result.errorInfo);
    }
  }

  public async createLibrary(model: LibraryResponse) {
    try {
      const appVersions: AppVersionModel[] = await this._mongoSvc.readAll(
        collections.APPVERSION
      );
      const search = {
        [mongoDbTables.content.version]: appVersions[0].content.helpfulInfo,
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
        [mongoDbTables.content.helpfulInfoModule]: {
          $elemMatch: {
            [mongoDbTables.content.helpfulInfoId]: model.en.helpfulInfoId
          }
        }
      };
      const content: ContentModel[] = await this._mongoSvc.readAllByValue(
        collections.CONTENT,
        search
      );

      const query = {
        [mongoDbTables.content.version]: appVersions[0].content.helpfulInfo,
        [mongoDbTables.content.contentType]: contentKeys.helpfulInfo
      };
      if (content.length === 0) {
        const valueEn = {
          $push: {
            [mongoDbTables.content.helpfulInfoModule]: model.en
          }
        };
        const valueEs = {
          $push: {
            [mongoDbTables.content.helpfulInfoModule]: model.es
          }
        };
        const arrayFilters = { upsert: true };

        const enUpdate = await this._mongoSvc.updateByQuery(
          collections.CONTENT,
          {
            ...query,
            [mongoDbTables.content.language]: contentKeys.english
          },
          valueEn,
          arrayFilters
        );
        const esUpdate = await this._mongoSvc.updateByQuery(
          collections.CONTENT,
          {
            ...query,
            [mongoDbTables.content.language]: contentKeys.spanish
          },
          valueEs,
          arrayFilters
        );
        return this.result.createSuccess({
          en: enUpdate,
          es: esUpdate
        });
      } else {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[400];
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.duplicateId;
        return this.result.createError(this.result.errorInfo);
      }
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  private getSubSections(model: SectionRequest) {
    const enSections = model.subSections.map((s) => s.en);
    const esSections = model.subSections.map((s) => s.es);

    return {
      en: enSections,
      es: esSections
    };
  }

  private async getCommunityContent(communityId: string) {
    const appVersions: AppVersionModel[] = await this._mongoSvc.readAll(
      collections.APPVERSION
    );
    const search = {
      [mongoDbTables.content.version]: appVersions[0].content.helpfulInfo,
      [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
      [mongoDbTables.content.helpfulInfoModule]: {
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
      version: appVersions[0].content.helpfulInfo,
      helpfulInfo: content
    };
  }
}
