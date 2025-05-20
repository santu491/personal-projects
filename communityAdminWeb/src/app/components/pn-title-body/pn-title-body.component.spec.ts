import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { PnTitleBodyComponent } from './pn-title-body.component';

describe('PnTitleBodyComponent', () => {
  let component: PnTitleBodyComponent;
  let fixture: ComponentFixture<PnTitleBodyComponent>;

  beforeEach(async () => {
    const fb = new FormBuilder()
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      title: fb.control(null),
      body: fb.control(null)
    });
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [PnTitleBodyComponent],
      providers: [FormGroupDirective, {provide: FormGroupDirective, useValue: formGroupDirective}]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PnTitleBodyComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      title: new FormControl(),
      body: new FormControl()
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
