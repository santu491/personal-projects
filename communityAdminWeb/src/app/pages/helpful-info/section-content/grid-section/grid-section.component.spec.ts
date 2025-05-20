import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { GridSectionComponent } from './grid-section.component';

describe('GridSectionComponent', () => {
  let component: GridSectionComponent;
  let fixture: ComponentFixture<GridSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [GridSectionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSectionComponent);
    component = fixture.componentInstance;
    component.subSections = {
      en: {
        sectionId: 'testId',
        content: []
      },
      es: {
        sectionId: 'testId',
        content: []
      }
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
