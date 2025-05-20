import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api, secureApi } from 'src/app/core/apiUtils';
import {
  EditContentRequest,
  LibrarySectionRequest,
  LoadSectionData,
  UpdateSectionDetails,
  UpdateSectionRequest
} from 'src/app/core/models/helpfulInfo';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelpfulInfoService {
  communityHelpfulInfoId!: string;
  communityId!: string;

  constructor(private _httpClient: HttpClient) {}

  editSection(data: LoadSectionData) {
    return this._httpClient.post(
      `${baseURL}${secureApi}${api.library}${api.section}${api.edit}`,
      data
    );
  }

  getLibraryByCommunity(communityId: string) {
    return this._httpClient.get(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.communityLibrary}`,
      {
        params: {
          communityId: communityId
        }
      }
    );
  }

  getLibraryById(id: string) {
    return this._httpClient.get(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.library}`,
      {
        params: {
          id: id
        }
      }
    );
  }

  updateSectionContent(data: UpdateSectionRequest) {
    return this._httpClient.put(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.library}`,
      data
    );
  }

  updateSectionDetails(data: UpdateSectionDetails) {
    return this._httpClient.put(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.library}${api.details}`,
      data
    );
  }

  updateCommunitySection(data: LibrarySectionRequest) {
    return this._httpClient.put(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.communityLibrary}${api.section}`,
      data
    );
  }

  createLibrary(data: any) {
    return this._httpClient.post(`${baseURL}${secureApi}${api.library}`, data);
  }

  editArticle(data: EditContentRequest) {
    return this._httpClient.put(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.article}`,
      data
    );
  }

  editExternalLink(data: EditContentRequest, index: number) {
    return this._httpClient.put(
      `${baseURL}${secureApi}${api.helpfulInfo}${api.externalLink}/${index}`,
      data
    );
  }

  isReferenceArticle(link: string) {
    return link.includes('referenceContent');
  }
}
