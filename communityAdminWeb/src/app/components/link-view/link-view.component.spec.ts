import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LinkViewComponent } from './link-view.component';

describe('LinkViewComponent', () => {
  let component: LinkViewComponent;
  let fixture: ComponentFixture<LinkViewComponent>;
  let urlDe: DebugElement;
  let urlEl: HTMLElement;
  let linkData: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkViewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkViewComponent);
    component = fixture.componentInstance;
    urlDe = fixture.debugElement.query(By.css('a'));
    urlEl = urlDe.nativeElement;

    linkData = {
      url: 'https://sit.admin.sydney-community.com/ui/login',
      title: 'Admin',
      imageLink: 'linkToImage'
    };
    component.linkContent = linkData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Link should contain link title', () => {
    expect(urlEl.textContent).toBe(linkData.title);
  });
});
