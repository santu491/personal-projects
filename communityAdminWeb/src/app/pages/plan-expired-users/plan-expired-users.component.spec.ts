import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { PlanExpiredUsersComponent } from './plan-expired-users.component';

describe('PlannedExpiredUsersComponent', () => {
  let component: PlanExpiredUsersComponent;
  let fixture: ComponentFixture<PlanExpiredUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      declarations: [PlanExpiredUsersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanExpiredUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
