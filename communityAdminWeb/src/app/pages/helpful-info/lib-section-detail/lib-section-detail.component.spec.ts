import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { LibSectionDetailComponent } from './lib-section-detail.component';

describe('LibSectionDetailComponent', () => {
  let component: LibSectionDetailComponent;
  let fixture: ComponentFixture<LibSectionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [LibSectionDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibSectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
