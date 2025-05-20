import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDetailsComponent } from './section-details.component';
import { imports } from 'src/app/tests/app.imports';

describe('SectionDetailsComponent', () => {
  let component: SectionDetailsComponent;
  let fixture: ComponentFixture<SectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionDetailsComponent ],
      imports: imports
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
