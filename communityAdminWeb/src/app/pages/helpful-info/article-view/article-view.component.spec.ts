import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleViewComponent } from './article-view.component';

describe('ArticleViewComponent', () => {
  let component: ArticleViewComponent;
  let fixture: ComponentFixture<ArticleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleViewComponent);
    component = fixture.componentInstance;
    component.article = {
      type: 'HWReference',
      title: 'Article Title',
      link: '/content/articleId'
    };
    component.parentId = 'partnerId';
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
