import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SchedulePnService } from './schedule-pn.service';

describe('SchedulePnService', () => {
  let service: SchedulePnService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SchedulePnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
