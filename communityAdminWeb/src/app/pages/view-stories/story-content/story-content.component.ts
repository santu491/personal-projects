import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StoryCommentService } from 'src/app/components/comment/story-comment.service';
import { generic } from 'src/app/core/constants';
import {
  icons,
  postsModule,
  searchModule,
  viewStoryModule
} from 'src/app/core/defines';
import {
  CommentReplyAddOrEdit,
  ExistingCommentResponse,
  reactionType
} from 'src/app/core/models';
import { StoryResponse } from 'src/app/core/models/story';
import { SharedService } from 'src/app/core/services/shared.service';
import { emojiFilter, getCurrentReaction, isHex } from 'src/app/core/utils';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ViewStoriesService } from '../view-stories.service';

@Component({
  selector: 'app-story-content',
  templateUrl: './story-content.component.html',
  styleUrls: ['./story-content.component.scss']
})
export class StoryContentComponent implements OnInit {
  @Input('storyId') storyId: string = '';
  @Input('communityName') community = '';
  @Input('adminUser') adminUser: string | null = '';

  @Input() communityList: any = [];

  public currentReaction = icons.reactions.default;
  currentReactionText = 'Like';
  storyValue!: StoryResponse;
  authorName: string = '';
  comments: ExistingCommentResponse[] = [];
  allowComments: boolean = true;
  commentsCount: number = 0;
  public commentToAdd: string = '';
  public showReactionContainerForStory = false;
  public currentAdminReaction!: reactionType;
  search = searchModule;
  viewStory = viewStoryModule;
  isEmojiShown = false;

  isEnabledAddCommentModal: boolean = false;

  constructor(
    private _viewStories: ViewStoriesService,
    private _toastrService: ToastrService,
    private _storyCommentService: StoryCommentService,
    private _sharedService: SharedService
  ) {
    this._sharedService.getEvent().subscribe(() => {
      this.getStory(this.storyId);
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.storyId = changes.storyId?.currentValue
      ? changes.storyId?.currentValue
      : this.storyId;
    if (this.storyId) {
      this.getStory(this.storyId);
      this.commentToAdd = '';
    }
  }

  getStory(id: string) {
    this._viewStories.getStory(id).subscribe((res) => {
      if (res?.data?.isSuccess) {
        this.storyValue = res.data.value;
        this.authorName =
          this.storyValue.displayName == ''
            ? this.storyValue?.author?.firstName
            : this.storyValue.displayName;
        this.comments = this.storyValue?.comments ?? [];
        this.allowComments = this.storyValue?.allowComments ?? true;
        this.commentsCount = this.getTotalCommentCount(this.comments);
        if (
          this.storyValue?.reaction?.log?.length > 0 &&
          getCurrentReaction(this.storyValue.reaction.log) !==
            reactionType.remove
        ) {
          this.currentAdminReaction = getCurrentReaction(
            this.storyValue.reaction.log
          );
          this.storyValue.hasCurrentAdminReacted = true;
        } else {
          this.currentAdminReaction = reactionType.remove;
          this.storyValue.hasCurrentAdminReacted = false;
        }
        this.getCurrentReactionData(this.currentAdminReaction);
      } else {
        this._toastrService.error(res.data.errors.detail);
      }
    });
  }

  getSubCommunityName(subCommunityId: string) {
    const subCommunitiesString = localStorage.getItem('subCommunities');
    let subCommunties;
    if (subCommunitiesString) {
      subCommunties = JSON.parse(subCommunitiesString);
      return subCommunties[subCommunityId]
        ? subCommunties[subCommunityId]
        : subCommunityId;
    } else {
      return subCommunityId;
    }
  }

  getTotalCommentCount(filteredComments: ExistingCommentResponse[]) {
    let totalNumberOfComments = 0;
    filteredComments = filteredComments.filter((c) => !c.removed);
    totalNumberOfComments += filteredComments.length;
    for (const comment of filteredComments) {
      if (comment.replies) {
        comment.replies = comment.replies.filter((reply) => !reply.removed);
        totalNumberOfComments += comment.replies.length;
      }
    }
    return totalNumberOfComments;
  }

  getAnswerText(response: string) {
    return isHex(response) ? this.getSubCommunityName(response) : response;
  }

  onAddComment(eventData: { comment: string; deepLink: any }) {
    let payload: CommentReplyAddOrEdit;
    if (eventData.comment.trim().length > 0) {
      payload = {
        storyId: this.storyId,
        comment: eventData.comment.trim(),
        authorId: this.adminUser,
        deeplink: eventData.deepLink
      };
      this._storyCommentService.upsertComment(payload).subscribe(
        (_data: any) => {
          this.commentToAdd = '';
          this.isEmojiShown = false;
          this.getStory(this.storyId);
        },
        (_error: any) => {
          this.showKeyWordContentWarning(
            _error?.error?.data?.errors[0]?.title,
            postsModule.en.warning as SweetAlertIcon,
            payload
          );
        }
      );
    }
  }

  onMouseOverLikeStory(_elem: any) {
    localStorage.setItem('reactionEntity', 'story');
    setTimeout(() => {
      this.showReactionContainerForStory = true;
    }, 1000);
  }

  onMouseOutLikeStory(_elem: any) {
    localStorage.removeItem('reactionEntity');
    setTimeout(() => {
      this.showReactionContainerForStory = false;
    }, 1000);
  }

  onSelectEmoji($event: any) {
    this.commentToAdd = this.commentToAdd + $event.emoji.native;
  }

  onClickEmoji() {
    this.isEmojiShown = !this.isEmojiShown;
  }

  getCurrentReactionData = (reaction: reactionType | any) => {
    switch (reaction) {
      case 'like':
        this.currentReaction = icons.reactions.like;
        this.currentReactionText = searchModule.en.likedReactionText;
        break;
      case 'care':
        this.currentReaction = icons.reactions.care;
        this.currentReactionText = searchModule.en.careReactionText;
        break;
      case 'celebrate':
        this.currentReaction = icons.reactions.celebrate;
        this.currentReactionText = searchModule.en.celebrateReactionText;
        break;
      case 'good_idea':
        this.currentReaction = icons.reactions.good_idea;
        this.currentReactionText = searchModule.en.goodIdeaReactionText;
        break;
      case 'remove':
      default:
        this.currentReaction = icons.reactions.default;
        this.currentReactionText = searchModule.en.likeReactionText;
        break;
    }
  };

  getEmojis(e: any) {
    return emojiFilter(e);
  }

  // Promts while adding comments with bad words.
  showKeyWordContentWarning(
    title: string,
    icon: SweetAlertIcon,
    payload: CommentReplyAddOrEdit
  ) {
    Swal.fire({
      title: title,
      icon: icon,
      showDenyButton: true,
      denyButtonText: 'Back',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        // Save the Comment on confirm
        payload.isProfane = true;
        this._storyCommentService.upsertComment(payload).subscribe(
          (data: any) => {
            this.getStory(this.storyId);
            this.commentToAdd = '';
            this.isEmojiShown = false;
          },
          (_error: any) => {
            this._toastrService.error(generic.errorMessage);
          }
        );
      } else if (result.isDenied) {
        Swal.fire(postsModule.en.postError, '', 'info');
      }
    });
  }

  onPressLink() {
    this.isEnabledAddCommentModal = true;
  }

  onCloseAddCommentModal() {
    this.isEnabledAddCommentModal = false;
  }
}
