import {
  API_RESPONSE,
  collections,
  contentDataKey,
  ContentKey,
  mongoDbTables,
  Result
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Container, Service } from 'typedi';
import { Community } from '../models/communitiesModel';
import { ContentModel } from '../models/contentModel';
import { Content, HtmlReference, Library, ReferenceTopic, Section } from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { User } from '../models/userModel';
import { PublicService } from './publicService';

@Service()
export class LibraryService {
  publicService = Container.get(PublicService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getLibraryByCommunityId(communityId: string, userId: string, language: string): Promise<BaseResponse> {
    try {
      const libraryContent = await this.publicService.getAppTranslations(language, ContentKey.LIBRARY);
      const libraries: ContentModel = libraryContent.data.value as ContentModel;

      const library: Library = libraries.data[contentDataKey.HELPFUL_INFO].filter((libraryItem: Content) =>
        libraryItem.communityId === communityId
      )[0];

      if (library === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.libraryDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (communityId !== '000000000000000000000000'){
        const currentUser: User = await this._mongoSvc.readByID(
          collections.USERS,
          userId
        );
        if (currentUser.myCommunities == null ||
          !currentUser.myCommunities.includes(communityId))
        {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = API_RESPONSE.messages.userIsNotInCommunity;
          return this.result.createError([this.result.errorInfo]);
        }

        const community: Community = await this._mongoSvc.readByID(
          collections.COMMUNITY,
          communityId
        );
        library.title = community.title;
      }

      library.id = library.helpfulInfoId;
      delete library.helpfulInfoId;

      return this.result.createSuccess(library);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getReferenceContent(libraryId: string, title: string, htmlDescription: boolean, language: string, link: string): Promise<BaseResponse> {
    try {
      const library: Library = await this.getLibraryWithId(libraryId, language);
      if (!library) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.libraryDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (library.sections.length > 0) {
        const sections: Section = library.sections[0];
        let content: Content;
        sections.content.forEach((c) => {
          if (c.contentId === title) {
            content = c;
          }
        });

        if (!content) {
          this.result.errorInfo.title = API_RESPONSE.messages.notFound;
          this.result.errorInfo.detail = API_RESPONSE.messages.noDataResponseDetail;
          return this.result.createError([this.result.errorInfo]);
        }

        const referenceTopic = new ReferenceTopic();
        referenceTopic.title = content.title;
        referenceTopic.subTitle = content.title;
        referenceTopic.copyright = content?.copyright;
        referenceTopic.brandLogo = content?.brandLogo;
        referenceTopic.brand = content?.brand;
        referenceTopic.thumbnail = content?.thumbnail;
        referenceTopic.isPartnerArticle = content?.isPartnerArticle ?? false;
        referenceTopic.provider = content.provider;

        if (!htmlDescription)
        {
          const htmlRef = new HtmlReference();
          htmlRef.content = content.description;
          htmlRef.type = 'p';

          referenceTopic.html = [];
          referenceTopic.html.push(htmlRef);
        }
        else
        {
          referenceTopic.htmlToRender = content.description;
          if (content?.thumbnail) {
            referenceTopic.htmlToRender = `<img src='${content.thumbnail}'/>\n ${referenceTopic.htmlToRender}`;
          }
        }

        return this.result.createSuccess(referenceTopic);
      }
      this.result.errorInfo.title = API_RESPONSE.messages.notFound;
      this.result.errorInfo.detail = API_RESPONSE.messages.noDataResponseDetail;
      this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[404];

      return this.result.createError([this.result.errorInfo]);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getLibraryContent(libraryId: string, language: string): Promise<BaseResponse> {
    try {
      const library: Library = await this.getLibraryWithId(libraryId, language);
      if (library === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.libraryDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const libraryData = this.libraryData(library);
      libraryData.id = libraryData.helpfulInfoId;
      delete libraryData.helpfulInfoId;
      return this.result.createSuccess(libraryData);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private libraryData(data: Library) {
    data.sections.forEach((section) => {
      section.content.forEach((contentData) => {
        const id = contentData[mongoDbTables.library.id];
        delete contentData[mongoDbTables.library.id];
        contentData.id = id;

      });
    });
    return data;
  }

  private async getLibraryWithId(libraryId: string,language: string): Promise<Library> {
    const libraryContent = await this.publicService.getAppTranslations(language, ContentKey.LIBRARY);
    const libraries: ContentModel = libraryContent.data.value as ContentModel;

    const library: Library = libraries.data[contentDataKey.HELPFUL_INFO].filter((libraryItem: Library) =>
      libraryItem.helpfulInfoId === libraryId
    )[0];
    return library;
  }
}
