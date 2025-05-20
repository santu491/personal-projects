import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHelpSectionComponent } from './create-help-section.component';
import { imports } from 'src/app/tests/app.imports';

describe('CreateHelpSectionComponent', () => {
  let component: CreateHelpSectionComponent;
  let fixture: ComponentFixture<CreateHelpSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ CreateHelpSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHelpSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
