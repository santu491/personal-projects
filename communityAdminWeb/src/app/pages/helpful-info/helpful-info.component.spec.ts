import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { HelpfulInfoComponent } from './helpful-info.component';

describe('HelpfulInfoComponent', () => {
  let component: HelpfulInfoComponent;
  let fixture: ComponentFixture<HelpfulInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ HelpfulInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpfulInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
