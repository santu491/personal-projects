import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { SchedulePnComponent } from './schedule-pn.component';

describe('SchedulePnComponent', () => {
  let component: SchedulePnComponent;
  let fixture: ComponentFixture<SchedulePnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ SchedulePnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
