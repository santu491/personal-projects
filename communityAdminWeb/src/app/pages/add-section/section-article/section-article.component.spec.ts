import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { SectionArticleComponent } from './section-article.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('SectionArticleComponent', () => {
  let component: SectionArticleComponent;
  let fixture: ComponentFixture<SectionArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [SectionArticleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionArticleComponent);
    component = fixture.componentInstance;
    component.article = {
      communityId: 'communityId',
      description: '',
      title: 'Test Title',
      type: 'HWReference',
      contentId: 'contentId',
      link: 'item/link',
      video: '',
      thumbnail: ''
    };
    fixture.detectChanges();
  });

  it('should click on edit button', () => {
    spyOn(component.onEditArticle, 'emit');
    let icons: DebugElement[] = fixture.debugElement.queryAll(By.css('.icon-holder button'));
    icons[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.onEditArticle.emit).toHaveBeenCalled();
  });

  it('should click on delete button', () => {
    spyOn(component.onDeleteArticle, 'emit');
    let icons: DebugElement[] = fixture.debugElement.queryAll(By.css('.icon-holder button'));
    icons[1].nativeElement.click();
    fixture.detectChanges();
    expect(component.onDeleteArticle.emit).toHaveBeenCalled();
  });
});
