import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostQuickViewComponent } from './post-quick-view.component';

describe('PostQuickViewComponent', () => {
  let component: PostQuickViewComponent;
  let fixture: ComponentFixture<PostQuickViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostQuickViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostQuickViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
