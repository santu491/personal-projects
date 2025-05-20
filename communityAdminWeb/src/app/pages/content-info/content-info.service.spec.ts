import { TestBed } from '@angular/core/testing';
import { ContentInfoService } from './content-info.service';
import { imports } from 'src/app/tests/app.imports';

describe('ContentInfoService', () => {
  let service: ContentInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports
    });
    service = TestBed.inject(ContentInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
