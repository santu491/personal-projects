import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ViewAllPushNotificationsService } from './view-all-push-notifications.service';

describe('ViewAllPushNotificationsService', () => {
  let service: ViewAllPushNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ViewAllPushNotificationsService ]
    });
    service = TestBed.inject(ViewAllPushNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
