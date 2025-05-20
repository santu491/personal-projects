import { API_RESPONSE, ContentKey, Result, collections, contentDataKey, contentType, mongoDbTables, translationLiterals } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { ContentModel } from '../models/contentModel';
import { Content, Library, PartnerResponseSection, Section } from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { PublicService } from './publicService';

@Service()
export class PartnerService {
  constructor(
    private mongoSvc: MongoDatabaseClient,
    private result: Result,
    private publicService: PublicService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getParterLogo(id: string, isArticle: boolean) {
    try {
      const partner = await this.mongoSvc.readByID(collections.PARTNERS, id);
      if (partner === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.missingImage;
        return this.result.createError([this.result.errorInfo]);
      }

      const responseImage = isArticle
        ? partner[mongoDbTables.partners.articleImage] && partner[mongoDbTables.partners.articleImage] !== ''
          ? partner[mongoDbTables.partners.articleImage]
          : partner[mongoDbTables.partners.logoImage]
        : partner[mongoDbTables.partners.logoImage];

      return this.result.createSuccess(responseImage);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPartnerList(
    communityId: string,
    sectionId: string,
    language: string
  ): Promise<BaseResponse> {
    const libraryContent = await this.publicService.getAppTranslations(language, ContentKey.LIBRARY);
    const libraries: ContentModel = libraryContent.data.value as ContentModel;

    const library: Library = libraries.data[contentDataKey.HELPFUL_INFO].filter((libraryItem: Content) =>
      libraryItem.communityId === communityId
    )[0];

    if (!library) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.libraryDoesNotExist;
      return this.result.createError([this.result.errorInfo]);
    }

    const sectionIndex = library.sections.findIndex((s: Section) =>
      s.sectionId === sectionId);

    if (sectionIndex < 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.bucketDoesNotExist;
      return this.result.createError([this.result.errorInfo]);
    }

    const partnerIds: string[] = [];
    library.sections[sectionIndex].content.forEach(
      (content: Content) => {
        if (content.type === contentType.partner) {
          partnerIds.push(this.getHelpfulInfoId(content.link));
        }
      }
    );
    const partners = libraries.data[contentDataKey.HELPFUL_INFO].filter(
      (lib: Library) => partnerIds.includes(lib.helpfulInfoId)
    );
    return this.result.createSuccess(this.buildPartnerResponse(partners, language));
  }

  buildPartnerResponse(libraries: Library[], language: string) {
    const responseLibrary = new Library(translationLiterals.ourPartners[language], '');
    libraries.forEach((library: Library) => {
      const section = new PartnerResponseSection(library.title, library.description, library.brandLogo);
      section.type = 'List';
      section.content = library.sections[0].content;
      responseLibrary.sections.push(section);
    });
    return responseLibrary;
  }

  private getHelpfulInfoId(link: string) {
    const paths = link.split('/');
    return paths[paths.length - 1];
  }
}
