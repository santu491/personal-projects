import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from 'src/app/core/apiUtils';
import { DateRange } from 'src/app/core/models/common';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  marketBrandData!: any;
  constructor(private http: HttpClient) {}

  getMetricsData(envUrl: string, marketFilter?: string, dateRange?: DateRange) {
    const params: { [x: string]: string } = {};
    if (marketFilter) {
      params['market'] = marketFilter;
    }

    if (dateRange) {
      params['from'] = dateRange?.start ?? '';
      params['to'] = dateRange?.end ?? '';
    }

    return this.http.get(`${envUrl}${api.appMetrics}`, {
      params: params
    });
  }

  getVersion(url: string) {
    return this.http.get(url, { observe: 'response' });
  }

  getProxyStatus(url: string) {
    return this.http.get(url, { observe: 'response' });
  }

  getPublicContent(url: string) {
    return this.http.get(url);
  }
}
