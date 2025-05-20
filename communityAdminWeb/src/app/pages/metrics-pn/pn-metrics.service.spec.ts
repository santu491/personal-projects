import { TestBed } from '@angular/core/testing';

import { HttpTestingController } from '@angular/common/http/testing';
import { api, secureApi } from 'src/app/core/apiUtils';
import { PNMetrics } from 'src/app/core/models';
import { imports } from 'src/app/tests/app.imports';
import { baseURL } from 'src/environments/environment';
import { PnMetricsService } from './pn-metrics.service';

describe('PnMetricsService', () => {
  let service: PnMetricsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports,
      providers: [PnMetricsService]
    });
    service = TestBed.inject(PnMetricsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should return metrics data for no communitites', () => {
    const metrics: PNMetrics = {
      activeOptInUsers: 10,
      activeOptInCommunityUsers: 10,
      subscription: {}
    };
    service.getMetricsData(['noCommunity']).subscribe((res) => {
      expect(res.data.value).toBe(metrics);
    });

    const req = httpMock.expectOne(
      baseURL +
        secureApi +
        api.pushNotification +
        api.metrics +
        '?communities%5B%5D=noCommunity'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({
      data: {
        isSuccess: true,
        isException: false,
        value: metrics
      }
    });

    httpMock.verify();
  });

  it('should return metrics data for many communities', () => {
    const metrics: PNMetrics = {
      activeOptInUsers: 12,
      activeOptInCommunityUsers: 12,
      subscription: {}
    };
    service.getMetricsData(['noCommunity', 'community1']).subscribe((res) => {
      expect(res.data.value).toBe(metrics);
    });

    const req = httpMock.expectOne(
      baseURL +
        secureApi +
        api.pushNotification +
        api.metrics +
        '?communities=noCommunity&communities=community1'
    );
    expect(req.request.method).toEqual('GET');
    req.flush({
      data: {
        isSuccess: true,
        isException: false,
        value: metrics
      }
    });

    httpMock.verify();
  });
});
