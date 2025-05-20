import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { ExternalReferenceViewComponent } from './external-reference-view.component';

describe('ExternalReferenceViewComponent', () => {
  let component: ExternalReferenceViewComponent;
  let fixture: ComponentFixture<ExternalReferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ExternalReferenceViewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalReferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
