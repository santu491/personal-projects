import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PlanExpiredUsersService } from './plan-expired-users.service';

describe('PlanExpiredUsersService', () => {
  let service: PlanExpiredUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanExpiredUsersService]
    });
    service = TestBed.inject(PlanExpiredUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
