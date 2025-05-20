import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api, secureApi } from 'src/app/core/apiUtils';
import { CommentReplyAddOrEdit, CommentReplyFlag, DeleteStoryComment } from 'src/app/core/models';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoryCommentService {

  constructor(private httpClient: HttpClient) { }

  toggleCommentFlag(payload: CommentReplyFlag) {
    return this.httpClient.put(
      `${baseURL}${secureApi}${api.getStory}${api.flag}`,
      payload
    );
  }

  upsertComment(payload: CommentReplyAddOrEdit) {
    let url:string = '';
    if(payload.commentId) {
      //reply
      url = `${baseURL}${secureApi}${api.getStory}${api.reply}`
    }
    else {
      url = `${baseURL}${secureApi}${api.getStory}${api.comment}`
    }
    return this.httpClient.put(
      url,
      payload
    );
  }

  removeComment(payload: DeleteStoryComment) {
    return this.httpClient.delete(
      `${baseURL}${secureApi}${api.getStory}${api.comment}`,
      { body: payload }
    );
  }
}
