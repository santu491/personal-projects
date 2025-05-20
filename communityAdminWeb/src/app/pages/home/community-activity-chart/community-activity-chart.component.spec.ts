import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityActivityChartComponent } from './community-activity-chart.component';

describe('CommunityActivityChartComponent', () => {
  let component: CommunityActivityChartComponent;
  let fixture: ComponentFixture<CommunityActivityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityActivityChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityActivityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
