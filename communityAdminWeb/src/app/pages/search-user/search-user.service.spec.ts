import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SearchUserService } from './search-user.service';

describe('SearchUserService', () => {
  let service: SearchUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ SearchUserService ]
    });
    service = TestBed.inject(SearchUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
