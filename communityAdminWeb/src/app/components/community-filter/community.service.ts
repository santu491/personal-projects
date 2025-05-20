import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import { Community } from 'src/app/core/models/communities';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
    public communityList: Array<Community> = [];
    public selectedCommunity: Community | undefined;

    constructor(private _httpClient: HttpClient) {}

    getAllCommunities(isActive: boolean = true, withImage: boolean = true): Observable<Community[]> {
      return this._httpClient.get<Community[]>(
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

    upsertCommunity(payload: any): Observable<Community> {
      return this._httpClient.put<Community>(
        baseURL + secureApi + api.createCommunity,
        payload
      );
    }
}
