import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import { Library } from 'src/app/core/models';
import { Community } from 'src/app/core/models/communities';
import {
  ExistingPosts,
  LinkPreviewResponse,
  NewPost,
  PersonaDetailsResponse
} from 'src/app/core/models/posts';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DraftContentService {
  constructor(private httpClient: HttpClient) {}

  getAllCommunities(isActive: boolean = true, withImage: boolean = true): Observable<Community[]> {
    return this.httpClient.get<Community[]>(
      baseURL + secureApi + api.communities,
      {
        params: {
          pageNumber: 1,
          pageSize: 10,
          sort: -1,
          active: isActive,
          withImage: withImage
        }
      }
    );
  }

  createAdminPost(updatedBody: NewPost): Observable<any> {
    return this.httpClient.put(baseURL + secureApi + api.post, updatedBody);
  }

  updateAdminPost(updatedBody: ExistingPosts): Observable<any> {
    return this.httpClient.put(baseURL + +secureApi + api.post, updatedBody);
  }

  // getAllDeepLinks(): Observable<DeepLinks> {
  //   return this.httpClient.get<DeepLinks>(baseURL + secureApi + api.deepLink);
  // }

  getContentForCommunity(communityId: string): Observable<Library> {
    return this.httpClient.get<Library>(
      baseURL + secureApi + api.library + `/${communityId}`
    );
  }

  getPersonaDetails(isPersona = true): Observable<PersonaDetailsResponse> {
    return this.httpClient.get<PersonaDetailsResponse>(
      baseURL + secureApi + api.persona,
      {
        params: {
          isPersona: isPersona
        }
      }
    );
  }

  getAllPosts(
    commnityIds: string[],

    status: string[],
    pageNumber: number,
    pageSize: number,
    sort: number,
    published: boolean
  ): Observable<any> {
    const url = `${baseURL}${secureApi}${api.getAllPosts}`;
    let statusData = status.length > 1 ? 'status' : 'status[]';
    if (commnityIds.length > 1) {
      return this.httpClient.get(url, {
        params: {
          communities: commnityIds,
          [statusData]: status,
          pageNumber: pageNumber,
          pageSize: pageSize,
          sort: sort
        }
      });
    } else {
      return this.httpClient.get(url, {
        params: {
          'communities[]': commnityIds[0],
          [statusData]: status,
          pageNumber: pageNumber,
          pageSize: pageSize,
          sort: sort,
          published: published
        }
      });
    }
  }

  getLinkPreview(url: string): Observable<LinkPreviewResponse> {
    return this.httpClient.post<LinkPreviewResponse>(
      baseURL + secureApi + api.content + api.linkPreview,
      {
        url: url
      }
    );
  }
}
