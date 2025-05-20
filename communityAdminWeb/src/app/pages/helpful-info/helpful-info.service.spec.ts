import { TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { HelpfulInfoService } from './helpful-info.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { baseURL } from 'src/environments/environment';
import { api, secureApi } from 'src/app/core/apiUtils';
import { LoadSectionData } from 'src/app/core/models/helpfulInfo';

describe('HelpfulInfoService', () => {
  let service: HelpfulInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports
    });
    service = TestBed.inject(HelpfulInfoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should call get Library By Id', () => {
    service.getLibraryById('libraryId').subscribe((res) => {
      console.log(res);
    });

    const req = httpMock.expectOne(
      baseURL +
        secureApi +
        api.helpfulInfo +
        api.library +
        '?id=libraryId'
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should call get Library By community Id', () => {
    service.getLibraryByCommunity('communityId').subscribe((res) => {
      console.log(res);
    });

    const req = httpMock.expectOne(
      baseURL +
        secureApi +
        api.helpfulInfo +
        api.communityLibrary +
        '?communityId=communityId'
    );
    expect(req.request.method).toEqual('GET');
  });

  it('should call edit section', () => {
    const input: LoadSectionData = {
      sectionIndex: 0,
      communityId: 'communityId',
      en: {
        title: 'New Data',
        description: '',
        content: []
      },
      es: {
        title: 'New Data',
        description: '',
        content: []
      }
    };
    service.editSection(input).subscribe((res) => {
      console.log(res);
    });

    const req = httpMock.expectOne(
      baseURL +
        secureApi +
        api.library +
        api.section +
        api.edit
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(input);
  });
});
