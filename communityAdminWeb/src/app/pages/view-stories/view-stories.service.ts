import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { api, secureApi } from 'src/app/core/apiUtils';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewStoriesService {
  constructor(private httpClient: HttpClient) {}

  getAllStories(
    pageNumber: number,
    pageSize: number,
    sort: number,
    payload: any
  ): Observable<any> {
    return this.httpClient.post(
      baseURL +
        secureApi +
        api.getAllStories +
        `?pageNumber=${pageNumber}&pageSize=${pageSize}&sort=${sort}`,
      payload
    );
  }

  removeStory(id: string): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.removeStory + '/' + id,
      {}
    );
  }

  flagUnflagStory(id: string, flagged: boolean): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.getStory + api.flag + '/' + id + `?flag=${flagged}`,
      {}
    );
  }

  banUser(userId: string): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.banUser + "/" + userId,
      {}
    );
  }

  getStory(
    id: string
  ): Observable<any> {
    return this.httpClient.get(
      `${baseURL}${secureApi}${api.getStory}?id=${id}`
    );
  }

  getSubCommunities(communityId: string) {
    return this.httpClient.get(
      `${baseURL}${secureApi}${api.subCommunities}/${communityId}`
    );
  }
}
