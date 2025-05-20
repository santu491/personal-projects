import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StoryCommentService } from 'src/app/components/comment/story-comment.service';
import {
  commentContentType,
  COMMENT_TYPE,
  generic,
  sortType
} from 'src/app/core/constants';
import { icons, postsModule, searchModule } from 'src/app/core/defines';
import {
  CommentDeepLinkData,
  CommentReplyAddOrEdit,
  DeepLinkData,
  ExistingCommentResponse,
  reactionType,
  ReplyEvent
} from 'src/app/core/models';
import {
  getCurrentReaction,
  sortBasedOnCreatedTime,
  updateReactionText
} from 'src/app/core/utils';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ViewStoriesService } from '../view-stories/view-stories.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() comments!: ExistingCommentResponse[];
  @Input() id: string = '';
  @Input() authorId: string | undefined;
  @Input() selectedPersona: string | null = '';

  @Input() showComments!: boolean;
  @Input() communityList: any = [];
  @Input() isEnabledAddCommentModal!: boolean;
  @Output() onCloseAddCommentModal = new EventEmitter();

  @Output() onAddComment = new EventEmitter<{
    comment: string;
    deepLink: any;
  }>();
  public commentAuthorImage: string = icons.users.defaultUser;
  public scadminImage: string = icons.users.scadmin;
  public scadvocateImage: string = icons.users.defaultUser;
  public search = searchModule;

  commentDeepLink!: CommentDeepLinkData;
  commentTitle!: string;

  isCommentModalVisible = false;
  existingValue = '';
  commentType: string = '';
  deeplinkLabel!: DeepLinkData;
  selectedReply!: any;

  constructor(
    private _storyCommentSvc: StoryCommentService,
    private _toastrService: ToastrService,
    private _viewStories: ViewStoriesService
  ) {}

  ngOnInit(): void {
    this.handleAddComment();
  }

  ngOnChanges(): void {
    this.handleComments(this.comments);
    this.handleAddComment();
  }

  handleAddComment() {
    if (this.isEnabledAddCommentModal) {
      this.commentType = COMMENT_TYPE.NEW_COMMENT;
      this.commentTitle = 'Add Comment';
      this.existingValue = '';
      this.deeplinkLabel = {
        en: '',
        es: '',
        spanishRequired: true
      };
      this.isCommentModalVisible = this.isEnabledAddCommentModal;
    }
  }

  handleComments(commentsToProcess: ExistingCommentResponse[]) {
    // Sort Comments based on updatedAt Time (most recent at bottom)
    commentsToProcess.sort(sortBasedOnCreatedTime(sortType.DESC));

    commentsToProcess.forEach((commentItem: any, i: number) => {
      // Adding Flag for ReactionContainer
      commentItem.showReactionContainer = false;

      // Handle Reactions for Comment
      if (
        commentItem?.reactions?.log?.length > 0 &&
        getCurrentReaction(commentItem.reactions.log) !== reactionType.remove
      ) {
        commentItem.currentAdminReaction = getCurrentReaction(
          commentItem.reactions.log
        );
        commentItem.reactionText = updateReactionText(
          commentItem.currentAdminReaction
        );
        commentItem.hasCurrentAdminReacted = true;
      } else {
        commentItem.currentAdminReaction = reactionType.remove;
        commentItem.reactionText = searchModule.en.likeReactionText;
        commentItem.hasCurrentAdminReacted = false;
      }

      // Converting ISO Date to Relative Time for Comments
      commentsToProcess[i].updatedAt = commentItem.updatedAt;

      // Handle Replies if Available
      if (commentItem?.replies?.length > 0) {
        commentItem.replyCount = commentItem.replies.length;
        this.handleComments(commentItem.replies);
      }
    });
  }

  onMouseOverLikeComment(_elem: any, item: any) {
    localStorage.setItem('commentId', item._id);
    setTimeout(() => {
      item.showReactionContainer = true;
    }, 500);
  }

  onMouseOutLikeComment(_elem: any, item: any) {
    localStorage.removeItem('commentId');
    setTimeout(() => {
      item.showReactionContainer = false;
    }, 500);
  }

  getAuthorImage(authorRole: string | undefined) {
    return authorRole == 'scadmin'
      ? this.scadminImage
      : authorRole == 'scadvocate'
      ? this.scadvocateImage
      : this.commentAuthorImage;
  }

  isReplyExist(replyCount: number | undefined) {
    return replyCount && replyCount > 0;
  }

  checkIfAuthor(replyItem: ExistingCommentResponse) {
    return replyItem.authorId === localStorage.getItem('id');
  }

  // Promts while adding comments with bad words.
  showKeyWordContentWarning(
    title: string,
    icon: SweetAlertIcon,
    index: number,
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
        this._storyCommentSvc.upsertComment(payload).subscribe(
          (_data: any) => {
            const newReply = _data.data.value;
            newReply._id = newReply.id;
            const newComment = this.comments[index];
            if (newComment.replies) {
              newComment.replies.push(newReply);
            } else {
              newComment.replies = [newReply];
            }
            this.comments[index] = newComment;
            this.handleComments(this.comments);
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

  // Promts while adding comments with bad words.
  showKeyWordContentWarningwithAddComments(
    title: string,
    icon: SweetAlertIcon,
    payload: CommentReplyAddOrEdit,
    comment: ExistingCommentResponse,
    updatedComment: any
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
        this._storyCommentSvc.upsertComment(payload).subscribe((res: any) => {
          if (res?.data?.isSuccess) {
            comment.comment = updatedComment ?? '';
            comment.updatedAt = new Date().toISOString();
            this._toastrService.success('Comment Edited');
          } else {
            this._toastrService.error(generic.errorMessage);
          }
        });
      } else if (result.isDenied) {
        Swal.fire(postsModule.en.postError, '', 'info');
      }
    });
  }

  reload(isReload: any) {
    if (isReload) {
      this._viewStories.getStory(this.id).subscribe((res) => {
        if (res?.data?.isSuccess) {
          const storyValue = res.data.value;
          this.comments = storyValue?.comments ?? [];
          this.handleComments(this.comments);
        } else {
          this._toastrService.error(res.data.errors.detail);
        }
      });
    }
  }

  toggleCommentModal(isToggle: boolean) {
    this.isCommentModalVisible = isToggle;
    if (!isToggle) {
      this.onCloseAddCommentModal.emit();
    }
  }

  sendComment(comment: { comment: string; deepLink: any }) {
    this.onCloseAddCommentModal.emit();
    switch (this.commentType) {
      case COMMENT_TYPE.NEW_COMMENT:
        this.onAddComment.emit({
          comment: comment.comment,
          deepLink: comment.deepLink
        });
        break;
      case COMMENT_TYPE.EDIT_COMMENT:
        this.onEditComment(comment.comment, comment.deepLink);
        break;
      case COMMENT_TYPE.ADD_NEW_REPLY:
        this.sendOnAddNewReply(comment.comment, comment.deepLink);
        // this.sendOnAddNewReply(comment.comment, comment.deepLink);
        break;
    }
    this.commentType = '';
  }

  onAddNewReply(eventData: ReplyEvent) {
    this.commentType = COMMENT_TYPE.ADD_NEW_REPLY;
    this.existingValue = '';
    const author = eventData?.comment?.author;
    this.commentTitle = author?.displayName
      ? `Adding new reply to  ${author?.displayName}'s comment...`
      : author?.firstName
      ? `Adding new reply to ${author?.firstName}'s comment...`
      : 'Adding new reply to comment...';
    this.deeplinkLabel = {
      en: '',
      es: '',
      spanishRequired: true
    };
    this.isCommentModalVisible = true;
    this.selectedReply = eventData;
  }

  onPressEditComment(eventData: ReplyEvent) {
    this.commentType = COMMENT_TYPE.EDIT_COMMENT;
    this.existingValue = eventData.comment.comment;
    this.isCommentModalVisible = true;
    this.selectedReply = eventData;
    this.deeplinkLabel = {
      en: eventData.comment?.deeplink?.label?.en ?? '',
      es: eventData.comment?.deeplink?.label?.es ?? '',
      spanishRequired: true
    };

    this.commentTitle =
      this.selectedReply.type == commentContentType.comment
        ? `Editing the comment`
        : 'Editing the reply';
    if (eventData.comment.deeplink) {
      this.commentDeepLink = eventData?.comment?.deeplink;
    }
  }

  sendOnAddNewReply(comment: string, deepLink: any) {
    let payload: CommentReplyAddOrEdit;

    let index = -1;
    const parentComment = this.selectedReply.comment;

    if (this.selectedReply.type == commentContentType.comment) {
      payload = {
        storyId: this.id,
        commentId: parentComment._id,
        comment: comment.trim(),
        authorId: this.selectedPersona,
        deeplink: deepLink
      };
      index = this.comments.findIndex(
        (comment) => comment._id == parentComment._id
      );
    } else {
      payload = {
        storyId: this.id,
        commentId: this.selectedReply.parentId,
        comment: comment.trim(),
        authorId: this.selectedPersona,
        deeplink: deepLink
      };
      index = this.comments.findIndex(
        (comment) => comment._id == this.selectedReply.parentId
      );
    }
    this._storyCommentSvc.upsertComment(payload).subscribe(
      (_data: any) => {
        const newReply = _data.data.value;
        newReply._id = newReply.id;
        const newComment = this.comments[index];
        if (newComment.replies) {
          newComment.replies.push(newReply);
        } else {
          newComment.replies = [newReply];
        }
        this.comments[index] = newComment;
        this.handleComments(this.comments);
      },
      (_error: any) => {
        this.showKeyWordContentWarning(
          _error?.error?.data?.errors[0]?.title,
          postsModule.en.warning as SweetAlertIcon,
          index,
          payload
        );
      }
    );
  }

  onEditComment(comment: string, deepLink: any): void {
    let payload: CommentReplyAddOrEdit;

    if (this.selectedReply.type == commentContentType.comment) {
      payload = {
        id: this.selectedReply.comment._id,
        storyId: this.id,
        comment: comment,
        authorId: this.selectedPersona,
        deeplink: deepLink
      };
    } else {
      payload = {
        id: this.selectedReply.comment._id, //reply id
        storyId: this.id,
        comment: comment,
        commentId: this.selectedReply.parentId,
        authorId: this.selectedPersona,
        deeplink: deepLink
      };
    }

    this._storyCommentSvc.upsertComment(payload).subscribe(
      (res: any) => {
        if (res?.data?.isSuccess) {
          this._toastrService.success('Comment Edited');
          this.reload(true);
        } else {
          this._toastrService.error(generic.errorMessage);
        }
      },
      (_error: any) => {
        this.showKeyWordContentWarningwithAddComments(
          _error?.error?.data?.errors[0]?.title,
          postsModule.en.warning as SweetAlertIcon,
          payload,
          this.selectedReply.comment,
          comment
        );
      }
    );
  }
}
