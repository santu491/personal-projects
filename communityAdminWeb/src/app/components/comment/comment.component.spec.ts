import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCommentResponse } from 'src/app/core/models';
import { imports } from 'src/app/tests/app.imports';
import { CommentComponent } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  const inputComment: ExistingCommentResponse = {
    _id: 'id',
    authorId: 'authorId',
    comment: 'Test Comment',
    createdAt: '',
    updatedAt: '',
    flagged: false,
    removed: false,
    isCommentTextProfane: false,
    author: {
      id: 'commentAuthor',
      firstName: 'Test',
      lastName: 'User',
      displayName: '',
      displayTitle: 'Sydney Community',
      profileImage: '',
      role: 'scadmin'
    },
    reactions: {
      log: [
        {
          userId: 'userId',
          reaction: 'like',
          createdDate: '',
          updatedDate: ''
        }
      ],
      count: {
        like: 1,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 1
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [CommentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.comment = inputComment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
