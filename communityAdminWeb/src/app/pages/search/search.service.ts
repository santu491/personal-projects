import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import {
  CommentToFlag,
  ExistingComment,
  ExistingCommentResponse,
  NewComment
} from 'src/app/core/models';
import { ExistingPosts } from 'src/app/core/models/posts';
import {
  ExistingReply,
  NewReply,
  ReplyToDelete,
  ReplyToFlag
} from 'src/app/core/models/reply';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private httpClient: HttpClient) {}

  // Get Post Published by Admin from Server
  getAdminPosts(postId: string, published = true): Observable<ExistingPosts[]> {
    return this.httpClient.get<ExistingPosts[]>(
      baseURL + secureApi + api.getPost + `/${postId}?published=${published}`
    );
  }

  // Flag a Post
  flagPost(postId: string, flagValue: boolean) {
    return this.httpClient.put(
      baseURL + secureApi + api.flagAPost + `/${postId}?flagged=${flagValue}`,
      ""
    );
  }

  // Adding New Comment to a Post
  addComment(newCommentBody: NewComment): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.comment,
      newCommentBody
    );
  }

  // Editing Existing Comment on a Post
  editComment(existingCommentBody: ExistingComment): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.comment,
      existingCommentBody
    );
  }

  // Deleting a Comment
  deleteComment(postId: string, comment: ExistingCommentResponse) {
    return this.httpClient.delete(
      baseURL +
        secureApi +
        api.post +
        "/" +
        postId +
        api.comment +
        "/" +
        comment._id +
        `?flagged=${comment.flagged}`
    );
  }

  // Reporting a Comment
  reportComment(payload: CommentToFlag) {
    return this.httpClient.put(baseURL + secureApi + api.flagAComment, payload);
  }

  // Adding New Reply under a comment
  addReply(newReplyBody: NewReply): Observable<any> {
    return this.httpClient.put(baseURL + secureApi + api.reply, newReplyBody);
  }

  // Editing Existing Reply under a comment on a Post
  editReply(existingReplyBody: ExistingReply): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.reply,
      existingReplyBody
    );
  }

  // Deleting a Reply
  deleteReply(payload: ReplyToDelete): Observable<any> {
    const options = {
      body: {
        ...payload,
      },
    };
    return this.httpClient.delete(
      baseURL + secureApi + api.deleteReply,
      options
    );
  }

  // Reporting a Reply
  flagReply(payload: ReplyToFlag) {
    return this.httpClient.put(baseURL + secureApi + api.flagAReply, payload);
  }

  banUser(userId: string): Observable<any> {
    return this.httpClient.put(
      baseURL + secureApi + api.banUser + "/" + userId,
      {}
    );
  }
}
