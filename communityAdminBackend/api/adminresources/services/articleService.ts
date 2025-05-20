import {
  API_RESPONSE,
  Result,
  collections,
  contentKeys,
  mongoDbTables
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Service } from 'typedi';
import {
  ArticleResponse,
  Content,
  EditContentRequest,
  HelpfulInfo,
  HelpfulInfoModule,
  Library
} from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { HelpfulInfoService } from './helpfulInfoService';

@Service()
export class ArticleService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private helpfulInfoService: HelpfulInfoService,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async editArticle(payload: EditContentRequest): Promise<BaseResponse> {
    try {
      let enHelpfulInfo;
      let esHelpfulInfo;
      let enSection;
      let esSection;
      const libraryContent =
        await this.helpfulInfoService.getHelpfulInfoContent({
          [mongoDbTables.content.helpfulInfoIdData]: payload.helpfulInfoId
        });

      if (libraryContent[0].length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      const helpfulInfo: HelpfulInfo[] = libraryContent[0];
      for (const helpInfo of helpfulInfo) {
        if (helpInfo.language === contentKeys.english) {
          const enIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === payload.helpfulInfoId
          );
          enHelpfulInfo = helpInfo.data.helpfulInfoModule;
          enSection = enHelpfulInfo[enIndex];
        } else {
          const esIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === payload.helpfulInfoId
          );
          esHelpfulInfo = helpInfo.data.helpfulInfoModule;
          esSection = esHelpfulInfo[esIndex];
        }
      }

      const enSectionIndex = enSection.sections.findIndex(
        (s) => s.sectionId === payload.sectionId
      );
      const esSectionIndex = esSection.sections.findIndex(
        (s) => s.sectionId === payload.sectionId
      );

      if (enSectionIndex < 0 || esSectionIndex < 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      enSection.sections[enSectionIndex].content.forEach((content) => {
        if (
          content?.link === payload.content.en?.link &&
          content?.contentId === payload.content.en?.contentId
        ) {
          this.setArticleData(content, payload.content.en);
        }
      });
      esSection.sections[esSectionIndex].content.forEach((content) => {
        if (
          content?.link === payload.content.es?.link &&
          content?.contentId === payload.content.es?.contentId
        ) {
          this.setArticleData(content, payload.content.es);
        }
      });

      if (payload.content.en?.link?.includes('referenceContent')) {
        this.updateReferenceContent(
          payload.content,
          enHelpfulInfo,
          esHelpfulInfo
        );
      }

      const enCount = await this.updateSectionContent(contentKeys.english, libraryContent[1], enHelpfulInfo);
      const esCount = await this.updateSectionContent(contentKeys.spanish, libraryContent[1], esHelpfulInfo);

      if (enCount === 0 && esCount === 0) {
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

  public async editContentBasedOnIndex(payload: EditContentRequest, index: number) {
    try {
      let enHelpfulInfo;
      let esHelpfulInfo;
      let enSection;
      let esSection;
      const libraryContent =
        await this.helpfulInfoService.getHelpfulInfoContent({
          [mongoDbTables.content.helpfulInfoIdData]: payload.helpfulInfoId
        });

      if (libraryContent[0].length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      const helpfulInfo: HelpfulInfo[] = libraryContent[0];
      for (const helpInfo of helpfulInfo) {
        if (helpInfo.language === contentKeys.english) {
          const enIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === payload.helpfulInfoId
          );
          enHelpfulInfo = helpInfo.data.helpfulInfoModule;
          enSection = enHelpfulInfo[enIndex];
        } else {
          const esIndex = helpInfo.data.helpfulInfoModule.findIndex(
            (lib) => lib.helpfulInfoId === payload.helpfulInfoId
          );
          esHelpfulInfo = helpInfo.data.helpfulInfoModule;
          esSection = esHelpfulInfo[esIndex];
        }
      }

      const enSectionIndex = enSection.sections.findIndex(
        (s) => s.sectionId === payload.sectionId
      );
      const esSectionIndex = esSection.sections.findIndex(
        (s) => s.sectionId === payload.sectionId
      );

      if (enSectionIndex < 0 || esSectionIndex < 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      enSection.sections[enSectionIndex].content[index] = payload.content.en;
      esSection.sections[enSectionIndex].content[index] = payload.content.es;

      const enCount = await this.updateSectionContent(contentKeys.english, libraryContent[1], enHelpfulInfo);
      const esCount = await this.updateSectionContent(contentKeys.spanish, libraryContent[1], esHelpfulInfo);

      if (enCount === 0 && esCount === 0) {
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

  private setArticleData(sectionContent: Content, article: Content) {
    sectionContent.title = article.title;
    if (!sectionContent?.link?.includes('referenceContent')) {
      sectionContent.description = article.description;
    }
    sectionContent.imgUrl = article?.imgUrl ?? '';
    sectionContent.thumbnail = article.thumbnail;
    sectionContent.brandLogo = article?.brandLogo ?? '';
    sectionContent.copyright = article?.copyright ?? '';
    sectionContent.isPartnerArticle = article?.isPartnerArticle ?? false;
  }

  private updateReferenceContent(
    article: ArticleResponse,
    enLibrary: Library[],
    esLibrary: Library[]
  ) {
    const isolatedUrl = article.en.link.split('?');
    const referencePaths = isolatedUrl[0].split('/');
    const referenceLibraryId = referencePaths[referencePaths.length - 2];
    const contentId = referencePaths[referencePaths.length - 1];

    const enIndex = enLibrary.findIndex(
      (library) => library.helpfulInfoId === referenceLibraryId
    );
    const esIndex = esLibrary.findIndex(
      (library) => library.helpfulInfoId === referenceLibraryId
    );

    enLibrary[enIndex].sections[0].content.forEach((content) => {
      if (content.contentId === contentId) {
        this.setArticleData(content, article.en);
      }
    });

    esLibrary[esIndex].sections[0].content.forEach((content) => {
      if (content.contentId === contentId) {
        this.setArticleData(content, article.en);
      }
    });
  }

  private async updateSectionContent(language: string, version: string, helpfulInfoModule: HelpfulInfoModule) {
    const searchQuery = {
      [mongoDbTables.content.contentType]: contentKeys.helpfulInfo,
      [mongoDbTables.content.version]: version,
      [mongoDbTables.content.language]: language
    };
    const updateValue = {
      $set: {
        [mongoDbTables.content.helpfulInfoModule]: helpfulInfoModule
      }
    };
    const updateCount = await this._mongoSvc.updateByQuery(
      collections.CONTENT,
      searchQuery,
      updateValue
    );
    return updateCount;
  }
}
