import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { AddPartnerModalComponent } from './add-partner-modal.component';

describe('AddPartnerModalComponent', () => {
  let component: AddPartnerModalComponent;
  let fixture: ComponentFixture<AddPartnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [AddPartnerModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
