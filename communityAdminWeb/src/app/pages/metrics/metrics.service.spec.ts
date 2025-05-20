import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { api } from 'src/app/core/apiUtils';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MetricsService]
    });
    service = TestBed.inject(MetricsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should call metrics data without parameters', () => {
    service.getMetricsData('envUrl').subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(`envUrl${api.appMetrics}`);
    expect(req.request.method).toEqual('GET');
  });

  it('should call metrics data with parameters', () => {
    service.getMetricsData('envUrl', 'eMember').subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(`envUrl${api.appMetrics}?market=eMember`);
    expect(req.request.method).toEqual('GET');
  });

  it('should call get version', () => {
    service.getVersion('someUrl').subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne('someUrl');
    expect(req.request.method).toEqual('GET');
  });

  it('should call get proxyStatus', () => {
    service.getProxyStatus('someUrl').subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne('someUrl');
    expect(req.request.method).toEqual('GET');
  });

  it('should call get public content', () => {
    service.getPublicContent('someUrl').subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne('someUrl');
    expect(req.request.method).toEqual('GET');
  });
});
