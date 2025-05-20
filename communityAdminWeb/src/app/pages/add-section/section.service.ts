import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api, secureApi } from 'src/app/core/apiUtils';
import { helpfulInfo } from 'src/app/core/constants';
import {
  ArticleRequest,
  Content,
  ContentData,
  NewLibrary,
  SectionData,
  SectionDetails
} from 'src/app/core/models/helpfulInfo';
import { generateHexId } from 'src/app/core/utils';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  constructor(private _httpClient: HttpClient) {}

  getArticleData(data: ArticleRequest) {
    return this._httpClient.post(
      `${baseURL}${secureApi}${api.library}${api.getArticle}`,
      data
    );
  }

  createSection(data: any) {
    return this._httpClient.post(
      `${baseURL}${secureApi}${api.library}${api.section}`,
      data
    );
  }

  getCommonSection() {
    return this._httpClient.get(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.commonLibrary}`
    );
  }

  // NON API Methods
  initSectionDetails(): SectionDetails {
    return {
      en: {
        title: '',
        description: ''
      },
      es: {
        title: '',
        description: ''
      },
      isEdit: false
    };
  }

  initCommunityLibrary(communityId: string, communityTitle: string) {
    const newId = generateHexId();
    const newSectionId = generateHexId();
    return {
      en: {
        title: communityTitle,
        description: '',
        helpfulInfoId: newId,
        headerDescription: helpfulInfo.communityDescription.en,
        headerTitle: helpfulInfo.communityHeaderTitle.en,
        communityId: <string>communityId,
        sections: [
          {
            title: '',
            description: '',
            content: [],
            sectionId: newSectionId
          }
        ]
      },
      es: {
        title: communityTitle,
        description: '',
        helpfulInfoId: newId,
        headerDescription: helpfulInfo.communityDescription.es,
        headerTitle: helpfulInfo.communityHeaderTitle.es,
        communityId: <string>communityId,
        sections: [
          {
            title: '',
            description: '',
            content: [],
            sectionId: newSectionId
          }
        ]
      }
    };
  }

  initOtherLibrary(data: SectionDetails): NewLibrary {
    const libraryId = generateHexId();
    const subSectionId = generateHexId();
    const section: SectionData = {
      en: {
        title: data.en.title,
        description: data.en.description,
        helpfulInfoId: libraryId,
        headerDescription: data.en.description,
        headerTitle: data.en.title,
        communityId: '',
        sections: [
          {
            title: '',
            description: '',
            sectionId: subSectionId,
            type: helpfulInfo.sectionListType,
            content: []
          }
        ]
      },
      es: {
        title: data.es.title,
        description: data.es.description,
        helpfulInfoId: libraryId,
        headerDescription: data.es.description,
        headerTitle: data.es.title,
        communityId: '',
        sections: [
          {
            title: '',
            description: '',
            sectionId: subSectionId,
            type: helpfulInfo.sectionListType,
            content: []
          }
        ]
      }
    };

    return {
      helpfulInfoId: libraryId,
      data: section
    };
  }

  initPartnerLibrary(data: SectionDetails, logo: string) {
    const library = this.initOtherLibrary(data);
    library.data.en.brandLogo = logo;
    library.data.es.brandLogo = logo;
    return library;
  }

  getTopicContent(
    data: SectionDetails,
    sectionType: string,
    libraryId: string
  ): ContentData {
    const commonData: Content = {
      communityId: '',
      type: sectionType,
      contentId: '',
      link: `${helpfulInfo.topicPath}${libraryId}`,
      video: '',
      thumbnail: '',
      title: '',
      description: ''
    };
    return {
      en: {
        ...commonData,
        title: data.en.title,
        description: data.en.description
      },
      es: {
        ...commonData,
        title: data.es.title,
        description: data.es.description
      }
    };
  }

  getLinkId(link: string) {
    if (link.trim() === '') {
      return '';
    }
    const paths = link.split('/');
    return paths[paths.length - 1];
  }

  getPartnerId(link: string) {
    if (link.trim() === '') {
      return '';
    }
    const paths = link.split('/');
    return paths[paths.length - 2];
  }
}
