import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ViewDraftsService } from './view-drafts.service';

describe('ViewDraftsService', () => {
  let service: ViewDraftsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ViewDraftsService]
    });
    service = TestBed.inject(ViewDraftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
