import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { SectionContentComponent } from './section-content.component';

describe('SectionContentComponent', () => {
  let component: SectionContentComponent;
  let fixture: ComponentFixture<SectionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ SectionContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionContentComponent);
    component = fixture.componentInstance;
    component.communityId = 'communityId';
    component.subSections = {
      en: {
        sectionId: 'sectionId',
        communitiesList: null,
        isGridView: false,
        content: [
          {
            isModified: false
          }
        ]
      },
      es: {
        sectionId: 'sectionId',
        communitiesList: null,
        isGridView: false,
        content: [
          {
            isModified: false
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
