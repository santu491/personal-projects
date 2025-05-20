import { TestBed } from '@angular/core/testing';

import { HttpTestingController } from '@angular/common/http/testing';
import { api, secureApi } from 'src/app/core/apiUtils';
import { PartnerRequest, Partners } from 'src/app/core/models/partners';
import { imports } from 'src/app/tests/app.imports';
import { baseURL } from 'src/environments/environment';
import { PartnersService } from './partners.service';

describe('PartnersService', () => {
  let service: PartnersService;
  let httpMock: HttpTestingController;
  const partners: Partners[] = [
    {
      id: 'partnerId',
      title: 'Test Partner',
      active: true,
      logoImage: 'logoImage',
      articleImage: 'articleImage'
    },
    {
      id: 'partnerId2',
      title: 'Test Partner 2',
      active: true,
      logoImage: 'logoImage2',
      articleImage: 'articleImage2'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports
    });
    service = TestBed.inject(PartnersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should return all partners', () => {
    service.getAllPartners(true).subscribe((res) => {
      expect(res).toBe(partners);
    });

    const req = httpMock.expectOne(
      baseURL + secureApi + api.partners + '?active=true'
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should return partner', () => {
    service.getPartner('partnerId').subscribe((res) => {
      expect(res).toBe(partners[0]);
    });

    const req = httpMock.expectOne(
      baseURL + secureApi + api.partners + '/partnerId'
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should return partner article images', () => {
    const result = service.getPartnerArticleImages(partners);
    expect(result.length).toBe(partners.length);
    expect(result[0].image).toBe('articleImage');
  });

  it('should add a partner', () => {
    const partnerInput: PartnerRequest = {
      title: 'New Partner',
      active: false,
      articleImage: 'article image'
    };
    service.addPartner(partnerInput).subscribe((res) => {
      expect(res).toBe(true);
    });
    const req = httpMock.expectOne(baseURL + secureApi + api.partners);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(partnerInput);
  });

  it('should edit a partner data', () => {
    const partnerInput: PartnerRequest = {
      title: 'New Partner',
      active: false,
      articleImage: 'article image'
    };
    service.editPartner('partnerId', partnerInput).subscribe((res) => {
      expect(res).toBe(true);
    });
    const req = httpMock.expectOne(
      baseURL + secureApi + api.partners + '/partnerId'
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toBe(partnerInput);
  });
});
