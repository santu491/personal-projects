import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPollComponent } from './post-poll.component';

describe('PostPollComponent', () => {
  let component: PostPollComponent;
  let fixture: ComponentFixture<PostPollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostPollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
