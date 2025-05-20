import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { api, secureApi } from 'src/app/core/apiUtils';
import {
  CommentReplyAddOrEdit,
  CommentReplyFlag,
  DeleteStoryComment
} from 'src/app/core/models';
import { baseURL } from 'src/environments/environment';
import { StoryCommentService } from './story-comment.service';

describe('StoryCommentService', () => {
  let service: StoryCommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoryCommentService]
    });
    service = TestBed.inject(StoryCommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should toggle comment flag', () => {
    const input: CommentReplyFlag = {
      id: 'replyId',
      commentId: 'commentId',
      flagged: false
    };

    service.toggleCommentFlag(input).subscribe((res) => {
      expect(res).toBe(true);
    });
    const req = httpMock.expectOne(
      `${baseURL}${secureApi}${api.getStory}${api.flag}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toBe(input);
  });

  it('should call upsert comment api for comment', () => {
    const input: CommentReplyAddOrEdit = {
      storyId: 'storyId',
      comment: 'test'
    };

    service.upsertComment(input).subscribe((res) => {
      expect(res).toBe(true);
    });
    const req = httpMock.expectOne(
      `${baseURL}${secureApi}${api.getStory}${api.comment}`
    );
    expect(req.request.method).toEqual('PUT');
  });

  it('should call upsert comment api for reply', () => {
    const input: CommentReplyAddOrEdit = {
      storyId: 'storyId',
      commentId: 'commentId',
      comment: 'test'
    };

    service.upsertComment(input).subscribe((res) => {
      expect(res).toBe(true);
    });
    const req = httpMock.expectOne(
      `${baseURL}${secureApi}${api.getStory}${api.reply}`
    );
    expect(req.request.method).toEqual('PUT');
  });

  it('should call delete comment api', () => {
    const input: DeleteStoryComment = {
      storyId: 'storyId',
      commentId: 'commentId'
    };

    service.removeComment(input).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(
      `${baseURL}${secureApi}${api.getStory}${api.comment}`
    );
    expect(req.request.method).toEqual('DELETE');
  });
});
