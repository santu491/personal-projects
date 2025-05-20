import { TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { PromptsService } from './prompts.service';

describe('PromptsService', () => {
  let service: PromptsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports
    });
    service = TestBed.inject(PromptsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
