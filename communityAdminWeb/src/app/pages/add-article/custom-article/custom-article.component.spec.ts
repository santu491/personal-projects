import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { CustomArticleComponent } from './custom-article.component';

describe('CustomArticleComponent', () => {
  let component: CustomArticleComponent;
  let fixture: ComponentFixture<CustomArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CustomArticleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomArticleComponent);
    component = fixture.componentInstance;
    component.articleData = {
      en: {
        title: 'Test',
        description: 'Test DESC',
        communityId: 'test community',
        type: 'HWReference',
        contentId: 'TESTID',
        link: '',
        video: '',
        thumbnail: ''
      },
      es: {
        title: 'Test',
        description: 'Test DESC',
        communityId: 'test community',
        type: 'HWReference',
        contentId: 'TESTID',
        link: '',
        video: '',
        thumbnail: ''
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
