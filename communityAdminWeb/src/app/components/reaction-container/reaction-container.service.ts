import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { baseURL } from "src/environments/environment";
import { api, secureApi } from "src/app/core/apiUtils";
import {
  CommentReactionPayload,
  PostReactionPayload,
  ReplyReactionPayload,
} from "src/app/core/models/reactions";
import { StoryCommentReaction } from "src/app/core/models";

@Injectable({
  providedIn: "root",
})
export class ReactionContainerService {
  constructor(private httpClient: HttpClient) {}

  // Post Reaction
  reactOnAdminPost(updatedBody: PostReactionPayload): Observable<any> {
    return this.httpClient.put(baseURL + secureApi + api.reaction, updatedBody);
  }

  // Comment Reaction
  reactOnComment(updatedBody: CommentReactionPayload): Observable<any> {
    return this.httpClient.put(baseURL + secureApi + api.reaction, updatedBody);
  }

  // Reply Reaction
  reactOnReply(updatedBody: ReplyReactionPayload): Observable<any> {
    return this.httpClient.put(baseURL + secureApi + api.reaction, updatedBody);
  }

  // Story/comment/reply reaction
  reactOnStory(payload: StoryCommentReaction): Observable<any> {
    return this.httpClient.put(
      `${baseURL}${secureApi}${api.getStory}${api.reaction}`,
      payload
    )
  }
}
