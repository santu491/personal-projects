import { TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { SectionService } from './section.service';

describe('SectionService', () => {
  let service: SectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports
    });
    service = TestBed.inject(SectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
