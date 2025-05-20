import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeChartComponent } from './user-type-chart.component';

describe('UserTypeChartComponent', () => {
  let component: UserTypeChartComponent;
  let fixture: ComponentFixture<UserTypeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTypeChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTypeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
