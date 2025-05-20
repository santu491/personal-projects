import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ForceAppUpdateService } from './force-app-update.service';

describe('ForceAppUpdateService', () => {
  let service: ForceAppUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ForceAppUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
