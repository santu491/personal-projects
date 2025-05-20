import { TestBed } from '@angular/core/testing';
import { TouAndPrivacyPolicyService } from './tou-and-privacy-policy.service';
import { imports } from 'src/app/tests/app.imports';

describe('TouAndPrivacyPolicyService', () => {
  let service: TouAndPrivacyPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: imports
    });
    service = TestBed.inject(TouAndPrivacyPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
