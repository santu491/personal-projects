import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/tests/app.imports';

import { ViewAllPostsComponent } from './view-all-posts.component';

describe('ViewAllPostsComponent', () => {
  let component: ViewAllPostsComponent;
  let fixture: ComponentFixture<ViewAllPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ ViewAllPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
