import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ViewAllUsersService } from './view-all-users.service';

describe('ViewAllUsersService', () => {
  let service: ViewAllUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ViewAllUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
