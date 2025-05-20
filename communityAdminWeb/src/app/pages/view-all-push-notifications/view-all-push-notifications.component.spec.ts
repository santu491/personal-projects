import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { ViewAllPushNotificationsComponent } from './view-all-push-notifications.component';

describe('ViewAllPushNotificationsComponent', () => {
  let component: ViewAllPushNotificationsComponent;
  let fixture: ComponentFixture<ViewAllPushNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ ViewAllPushNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllPushNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
