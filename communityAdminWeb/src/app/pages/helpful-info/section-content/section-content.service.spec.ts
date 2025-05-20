import { TestBed } from '@angular/core/testing';

import { SectionContentService } from './section-content.service';

describe('SectionContentService', () => {
  let service: SectionContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
