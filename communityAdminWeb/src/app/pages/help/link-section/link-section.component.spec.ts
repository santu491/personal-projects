import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSectionComponent } from './link-section.component';
import { imports } from 'src/app/tests/app.imports';

describe('LinkSectionComponent', () => {
  let component: LinkSectionComponent;
  let fixture: ComponentFixture<LinkSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [LinkSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSectionComponent);
    component = fixture.componentInstance;
    component.section = {
      sectionId: 'sectionId',
      sectionTitle: 'test',
      link: [{ title: 'test', url: 'url-link' }],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
