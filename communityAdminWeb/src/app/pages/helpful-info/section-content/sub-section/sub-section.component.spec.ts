import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { SubSectionComponent } from './sub-section.component';

describe('SubSectionComponent', () => {
  let component: SubSectionComponent;
  let fixture: ComponentFixture<SubSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [SubSectionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSectionComponent);
    component = fixture.componentInstance;
    component.subSections = {
      en: {
        sectionId: 'sectionId',
        communitiesList: null,
        isGridView: false,
        content: [
          {
            isModified: false,
            isOrderChanged: false,
            helpfulInfoId: 'helpfulInfoId',
            commonSection: false,
            type: 'HWReference'
          }
        ]
      },
      es: {
        sectionId: 'sectionId',
        communitiesList: null,
        isGridView: false,
        content: [
          {
            isModified: false,
            isOrderChanged: false,
            helpfulInfoId: 'helpfulInfoId',
            commonSection: false,
            type: 'HWReference'
          }
        ]
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
