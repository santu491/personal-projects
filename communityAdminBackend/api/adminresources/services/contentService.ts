import {
  API_RESPONSE,
  collections,
  contentKeys,
  contentType,
  mongoDbTables,
  Result,
  Validation,
  variableNames
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectId } from 'bson';
import { getLinkPreview } from 'link-preview-js';
import { Service } from 'typedi';
import { CommunityModel } from '../models/communitiesModel';
import {
  CommunitySection,
  ContentModel,
  DeepLinkContent,
  TrainingLinkRequest
} from '../models/contentModel';
import { Content, Library } from '../models/libraryModel';
import { BaseResponse } from '../models/resultModel';
import { AdminUser } from '../models/userModel';

@Service()
export class ContentService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getAdminContent(): Promise<BaseResponse> {
    try {
      const search = {
        [mongoDbTables.content.contentType]: contentType
      };

      const content = await this._mongoSvc.readByValue(
        collections.CONTENT,
        search
      );

      if (content === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.noAdminContent;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.noAdminContentDetails;

        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(content);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateContent(
    file,
    userId: string,
    language: string,
    type: string
  ): Promise<BaseResponse> {
    try {
      const user: AdminUser = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const content = JSON.parse(file.buffer);
      const version = await this.getIncrementedVersion(language, type);
      if (version) {
        const payload: ContentModel = {
          language: language,
          version: version,
          contentType: type,
          updatedAt: new Date(),
          createdAt: new Date(),
          createdBy: userId,
          updatedBy: userId,
          data: content
        };
        await this._mongoSvc.insertValue(collections.CONTENT, payload);
        return this.result.createSuccess(payload);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
        return this.result.createError([this.result.errorInfo]);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getContent(
    language: string,
    version: string,
    type: string
  ): Promise<BaseResponse> {
    try {
      const search = {
        [mongoDbTables.content.language]: language,
        [mongoDbTables.content.version]: version,
        [mongoDbTables.content.contentType]: type
      };
      const content: ContentModel = await this._mongoSvc.readByValue(
        collections.CONTENT,
        search
      );
      if (content === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.contentNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(content);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getContentOptions(key: string): Promise<BaseResponse> {
    try {
      const content = await this._mongoSvc.getDistinct(
        collections.CONTENT,
        key
      );
      if (content === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.contentNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(content);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getContentVersions(contentType: string, language: string) {
    try {
      const search = {
        [mongoDbTables.content.contentType]: contentType,
        [mongoDbTables.content.language]: language
      };
      const data = await this._mongoSvc.readAllByValue(
        collections.CONTENT,
        search
      );
      if (data === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.contentNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      const versions = data
        .map((item) => item.version)
        ?.sort()
        ?.reverse();
      return this.result.createSuccess(versions);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getLatestContent(contentType: string, language = 'en') {
    try {
      const getAppVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const content = await this.getContent(
        language,
        getAppVersion.content[contentType],
        contentType
      );
      if (!content.data.value) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.contentNotFound;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(content.data.value);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getDeeplinkContent(
    communityId: string,
    lang: string
  ): Promise<BaseResponse> {
    try {
      const result = [];
      result.push(await this.getAppTranslations(lang, contentKeys.deepLink));

      if (communityId) {
        const content = await this.getAppTranslations(
          lang,
          contentKeys.helpfulInfo
        );
        if (content === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail =
            API_RESPONSE.messages.libraryDoesNotExist;
          return this.result.createError([this.result.errorInfo]);
        }
        const library: Library = content.data[
          contentKeys.helpfulInfoKey
        ].filter(
          (libraryItem: Content) => libraryItem.communityId === communityId
        )[0];
        await this.refineTheContent(library, communityId);
        result.push(library);
      }

      return this.result.createSuccess(result);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getLibContent(
    libId: string,
    communityId: string,
    lang: string
  ): Promise<BaseResponse> {
    try {
      const content = await this.getAppTranslations(
        lang,
        contentKeys.helpfulInfo
      );
      if (content === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.libraryDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const library: Library = content.data[contentKeys.helpfulInfoKey].filter(
        (libraryItem: Content) =>
          libraryItem[mongoDbTables.content.helpfulInfoId] === libId
      )[0];
      const result = await this.refineTheContent(library, communityId);
      return this.result.createSuccess(result);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPreviewImages(url: string) {
    try {
      const preview = await getLinkPreview(url);
      return this.result.createSuccess(preview);
    } catch (err) {
      return this.result.createError(err);
    }
  }

  public async refineContentReponse(library: Library) {
    if (library.sections.length > 0) {
      library.sections.forEach((section) => {
        section.content.forEach((contentItem) => {
          if (contentItem?.link) {
            const contentMatch = contentItem?.link.match(/content/);
            if (contentMatch && contentMatch.length > 0) {
              const idMatch = contentItem.link?.match(/(([a-z,0-9]){24})$/);
              contentItem.helpfulInfoId = idMatch[0];
            }
            const refMatch = contentItem?.link.match(/referenceContent/);
            if (refMatch && refMatch.length > 0) {
              const idMatch = contentItem.link?.match(/(([a-z,0-9]){24})/);
              contentItem.helpfulInfoId = idMatch[0];
            }
          } else if (contentItem?.types) {
            for (const type of contentItem.types) {
              const idMatch = type.link?.match(/(([a-z,0-9]){24})$/);
              type.helpfulInfoId = idMatch[0];
            }
          }
        });
      });
    }
    return library;
  }

  public async createDeepLinkContent(
    communityId: string,
    communityData: CommunityModel
  ) {
    const appVersion = await this._mongoSvc.readByValue(
      collections.APPVERSION,
      {}
    );
    const version = appVersion.content[contentKeys.deepLink];
    const deepLinkModel: DeepLinkContent[] =
      await this._mongoSvc.readAllByValue(collections.CONTENT, {
        [mongoDbTables.content.contentType]: contentKeys.deepLink,
        [mongoDbTables.content.version]: version
      });

    if (deepLinkModel.length === 0) {
      this._log.error(API_RESPONSE.messages.internalError);
    }
    deepLinkModel.forEach(async (deepLinkContent) => {
      const newSection = new CommunitySection();
      deepLinkContent.data.deepLinkModule.forEach(async (item) => {
        if (item.contentKey === variableNames.COMMUNITIES) {
          const section = item.sections[0];
          newSection.communityId = communityId;
          newSection.active = communityData.active;
          newSection.communityName = communityData.title;
          const regex = /[0-9a-fA-F]{24}/gm;
          newSection.options = section.options.map((sectionData) => {
            sectionData.url = sectionData.url.replace(regex, communityId);
            return sectionData;
          });

          item.sections.push(newSection);
          // Update the Deeplink content.
          const query = {
            [mongoDbTables.content.id]: new ObjectId(deepLinkContent.id),
            [mongoDbTables.content.data]: {
              $elemMatch: {
                [mongoDbTables.content.contentKey]: variableNames.COMMUNITIES
              }
            }
          };
          const setData = {
            $set: {
              [mongoDbTables.content.deepLinkModuleSection]: item.sections
            }
          };
          await this._mongoSvc.findAndUpdateOne(
            collections.CONTENT,
            query,
            setData
          );
        }
      });
    });
  }

  public async updateDeepLinkContent(
    communityId: string,
    isActive: boolean,
    communityName: string
  ) {
    const appVersion = await this._mongoSvc.readByValue(
      collections.APPVERSION,
      {}
    );
    const version = appVersion.content[contentKeys.deepLink];
    const deepLinkModel: DeepLinkContent[] =
      await this._mongoSvc.readAllByValue(collections.CONTENT, {
        [mongoDbTables.content.contentType]: contentKeys.deepLink,
        [mongoDbTables.content.version]: version
      });

    if (deepLinkModel.length === 0) {
      this._log.error(API_RESPONSE.messages.internalError);
    }
    deepLinkModel.forEach(async (deepLinkContent) => {
      deepLinkContent.data.deepLinkModule.forEach(async (item) => {
        if (item.contentKey === variableNames.COMMUNITIES) {
          const section = item.sections.filter(
            (section) => section.communityId === communityId
          )[0];
          section.active = isActive;
          section.communityName = communityName;
          // Update the Deeplink content.
          const query = {
            [mongoDbTables.content.id]: new ObjectId(deepLinkContent.id),
            [mongoDbTables.content.data]: {
              $elemMatch: {
                [mongoDbTables.content.contentKey]: variableNames.COMMUNITIES
              }
            }
          };
          const setData = {
            $set: {
              [mongoDbTables.content.deepLinkModuleSection]: item.sections
            }
          };
          await this._mongoSvc.updateByQuery(
            collections.CONTENT,
            query,
            setData
          );
        }
      });
    });
  }

  public async getTouContent(language: string) {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const touContent = await this._mongoSvc.readByValue(
        collections.CONTENT,
        {
          language: language,
          contentType: contentKeys.tou,
          version: appVersion.tou
        }
      );
      return this.result.createSuccess(touContent);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateLinkSection(linkPayload: TrainingLinkRequest) {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const version = appVersion.content[contentKeys.trainingLinks];

      const result = await this._mongoSvc.updateByQuery(collections.CONTENT, {
        [mongoDbTables.content.contentType]: contentKeys.trainingLinks,
        [mongoDbTables.content.version]: version,
        [mongoDbTables.content.language]: contentKeys.english,
        [mongoDbTables.content.linkSectionId]: linkPayload.sectionId
      }, {
        $set: {
          [mongoDbTables.content.linkSectionObject]: linkPayload
        }
      });
      return this.result.createSuccess(result > 0);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async createLinkSection(linkPayload: TrainingLinkRequest) {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const version = appVersion.content[contentKeys.trainingLinks];

      // Format Section Data
      const section = {
        sectionId: new ObjectId().toString(),
        sectionTitle: linkPayload.sectionTitle,
        link: linkPayload.link
      };
      const result = await this._mongoSvc.updateByQuery(collections.CONTENT, {
        [mongoDbTables.content.contentType]: contentKeys.trainingLinks,
        [mongoDbTables.content.version]: version,
        [mongoDbTables.content.language]: contentKeys.english
      }, {
        $push: {
          [mongoDbTables.content.linkSection]: section
        },
        $set: {
          [mongoDbTables.content.updatedAt]: new Date()
        }
      });
      return this.result.createSuccess(result > 0);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async getIncrementedVersion(lang: string, type: string) {
    try {
      const query = {
        [mongoDbTables.content.language]: lang,
        [mongoDbTables.content.contentType]: type
      };
      const sort = {
        [mongoDbTables.content.version]: -1
      };
      const data = await this._mongoSvc.getMaxOrMinValues(
        collections.CONTENT,
        query,
        sort
      );
      return this.validate.incrementVersion(data[0].version);
    } catch (error) {
      this._log.error(error as Error);
      return '';
    }
  }

  private async getAppTranslations(language: string, contentType: string) {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const version = appVersion.content[contentType];
      const translations: ContentModel = await this._mongoSvc.readByValue(
        collections.CONTENT,
        {
          language: language,
          contentType: contentType,
          version: version
        }
      );
      return translations;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async refineTheContent(content: Library, communityId: string) {
    if (content.sections.length > 0) {
      content.sections.forEach((section) => {
        section.content.forEach((contentItem) => {
          if (
            contentItem?.type === 'HWVideo' ||
            (contentItem?.type === 'HWVideoReference' && contentItem?.video)
          ) {
            contentItem.link = `community/${communityId}/helpful-info/video/${contentItem.video}`;
          } else if (
            contentItem?.type === 'HWExternalReference' &&
            contentItem?.link
          ) {
            contentItem.link = `community/${communityId}/helpful-info/external-reference/${contentItem.link}`;
          } else if (contentItem?.link) {
            contentItem.link = `community/${communityId}/helpful-info${contentItem.link}`;
            const match = contentItem.link?.match(/(([a-z,0-9]){24})$/);
            if (match && match.length > 0) {
              contentItem.helpfulInfoId = match[0];
            }
          } else if (contentItem?.types && contentItem.types.length > 0) {
            contentItem.types.forEach((type) => {
              type.link = `community/${communityId}/helpful-info${type.link}`;
              const match = contentItem.link?.match(/(([a-z,0-9]){24})$/);
              if (match && match.length > 0) {
                contentItem.helpfulInfoId = match[0];
              }
            });
          } else {
            contentItem.link = `community/${communityId}/helpful-info${contentItem.link}`;
          }
        });
      });
    }
    return content;
  }
}
