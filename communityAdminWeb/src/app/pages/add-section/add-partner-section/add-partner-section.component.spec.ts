import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { AddPartnerSectionComponent } from './add-partner-section.component';

describe('AddPartnerSectionComponent', () => {
  let component: AddPartnerSectionComponent;
  let fixture: ComponentFixture<AddPartnerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [AddPartnerSectionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartnerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
