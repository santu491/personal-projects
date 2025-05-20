import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { generic } from "src/app/core/constants";
import { icons, searchModule } from "src/app/core/defines";
import { reactionType, StoryCommentReaction } from "src/app/core/models";
import { SharedService } from "src/app/core/services/shared.service";
import { ReactionContainerService } from "./reaction-container.service";
@Component({
  selector: "app-reaction-container",
  templateUrl: "./reaction-container.component.html",
  styleUrls: ["./reaction-container.component.scss"],
})
export class ReactionContainerComponent implements OnInit {
  // Reaction Image
  public likeOn: string = icons.reactions.like;
  public care: string = icons.reactions.care;
  public celebrate: string = icons.reactions.celebrate;
  public idea: string = icons.reactions.good_idea;

  // Labels
  public search = searchModule;

  public reactingOn: string = "";
  public postIdToReact: string = "";
  public userId: any;
  public commentIdToReact: any;

  // Parent Properties
  @Input() contentType: any;
  @Input() postId: any;
  @Input() commentId: any;
  @Input() currentAdminReaction!: reactionType;
  @Input() adminUser: string | null = "";

  constructor(
    private _reactionService: ReactionContainerService,
    private _sharedService: SharedService,
    private _toastrService: ToastrService
  ) {}

  onReactionClicked(type: string) {
    let payload: any;

    if(localStorage.getItem("reactionEntity")) {
      this.reactOnStoryContent(type);
      return;
    }
    // Call Reaction API Here..
    if (this.reactingOn == "post") {
      // React on Admin Post Payload
      payload = {
        authorId: localStorage.getItem("id"),
        reaction:
          type === this.currentAdminReaction ? reactionType.remove : type,
        id: this.postIdToReact,
      };
      this._reactionService.reactOnAdminPost(payload).subscribe(
        (data: any): void => {
          this.refreshPostOnSuccess(data);
        },
        (_error: any): void => {
          this._toastrService.error(generic.errorMessage);
        }
      );
    } else if (this.reactingOn == "comment") {
      // React on Comment Payload
      payload = {
        authorId: localStorage.getItem("id"),
        reaction:
          type === this.currentAdminReaction ? reactionType.remove : type,
        id: this.postIdToReact,
        commentId: localStorage.getItem("commentId"),
      };
      this._reactionService.reactOnComment(payload).subscribe(
        (data: any): void => {
          this.refreshPostOnSuccess(data);
        },
        (_error: any): void => {
          this._toastrService.error(generic.errorMessage);
        }
      );
    } else if (this.reactingOn == "reply") {
      // React on Reply
      payload = {
        authorId: localStorage.getItem("id"),
        reaction:
          type === this.currentAdminReaction ? reactionType.remove : type,
        id: this.postIdToReact,
        commentId: localStorage.getItem("commentId"),
        replyId: localStorage.getItem("replyId"),
      };
      this._reactionService.reactOnReply(payload).subscribe(
        (data: any): void => {
          this.refreshPostOnSuccess(data);
        },
        (_error: any): void => {
          this._toastrService.error(generic.errorMessage);
        }
      );
    }
  }

  refreshPostOnSuccess = (data: any): void => {
    if (data?.data?.isSuccess) {
      // Refresh Post Data via Shared Service
      this._sharedService.sendEvent();
    }
  };

  ngOnInit(): void {
    this.reactingOn = this.contentType;
    this.postIdToReact = this.postId;
    this.userId = localStorage.getItem("id") || "";
    this.commentIdToReact = this.commentId;
  }

  reactOnStoryContent(reaction: string) {
    const commentId = localStorage.getItem("commentId");
    const replyId = localStorage.getItem("replyId");
    const storyId = this.postIdToReact;
    const userReaction = reaction === this.currentAdminReaction ? reactionType.remove : reaction
    let payload !: StoryCommentReaction;
    if(!commentId && !replyId){
      //Story Reaction
      payload = {
        id: storyId,
        reaction: userReaction,
        authorId: this.adminUser
      };
    }
    if(!replyId && commentId) {
      //Comment Reaction
      payload = {
        reaction:
        reaction === this.currentAdminReaction ? reactionType.remove : reaction,
        id: this.postIdToReact,
        commentId: commentId,
        authorId: this.adminUser
      };
    }
    if(replyId && commentId) {
      //Reply Reactions
      payload = {
        reaction: userReaction,
        id: this.postIdToReact,
        commentId: commentId,
        authorId: this.adminUser,
        replyId: replyId
      };
    }

    this._reactionService.reactOnStory(payload)
      .subscribe(
        (res: any) => {
          if(res?.data?.isSuccess) {
            this._sharedService.sendEvent();
            this._toastrService.success("Successful!");
          }
          else {
            this._toastrService.error(generic.pleaseTryAgain);
          }
        }
      )
  }

  getUserReactionInType(reaction: string) {
    switch(reaction) {
      case "like":
        return reactionType.like;
      case "care":
        return reactionType.care;
      case "celebrate":
        return reactionType.celebrate;
      case "good_idea":
        return reactionType.good_idea;
      case "remove":
      default:
        return reactionType.remove;
    }
  }
}
