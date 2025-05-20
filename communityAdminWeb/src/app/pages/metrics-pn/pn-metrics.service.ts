import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import { BaseResponse } from 'src/app/core/models';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PnMetricsService {
  constructor(private _httpClient: HttpClient) {}

  getMetricsData(selectedCommunities: string[]): Observable<BaseResponse> {
    const url = baseURL + secureApi + api.pushNotification + api.metrics;
    if (selectedCommunities.length > 1) {
      return this._httpClient.get<BaseResponse>(url, {
        params: {
          communities: selectedCommunities
        }
      });
    } else {
      return this._httpClient.get<BaseResponse>(url, {
        params: {
          'communities[]': selectedCommunities[0]
        }
      });
    }
  }
}
