import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  ICON_TYPE,
  commentContentType,
  generic,
  roles
} from 'src/app/core/constants';
import {
  commentData,
  icons,
  replyData,
  searchModule
} from 'src/app/core/defines';
import {
  CommentReplyFlag,
  DeleteStoryComment,
  ExistingCommentResponse,
  ReplyEvent
} from 'src/app/core/models';
import { dateDifference, getDeepLinkIcon } from 'src/app/core/utils';
import { SearchService } from 'src/app/pages/search/search.service';
import { StoryCommentService } from './story-comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment!: ExistingCommentResponse;
  @Input('id') entityId: string = '';
  @Input() commentId: string = '';
  @Input() selectedPersona: string | null = '';
  @Input() authorId: string | undefined;
  @Output() addNewReply = new EventEmitter<ReplyEvent>();
  @Output() reloadStory = new EventEmitter<boolean>();

  @Output() onPressEditComment = new EventEmitter<{
    comment: ExistingCommentResponse;
    parentId?: string;
    type: string;
  }>();
  public contentType: string = '';
  search = searchModule;
  commentLabels = commentData;
  public commentAuthorImage: string = icons.users.defaultUser;
  public scadminImage: string = icons.users.scadmin;
  public scadvocateImage: string = icons.users.defaultUser;

  constructor(
    private _storyCommentSvc: StoryCommentService,
    private _searchService: SearchService,
    private _toasterService: ToastrService
  ) {}

  public currentAdminRole = localStorage.getItem('role');
  public isAdvocate = this.currentAdminRole === roles[1].role ?? false;

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.contentType =
      this.commentId == ''
        ? commentContentType.comment
        : commentContentType.reply;
  }

  onMouseOverLikeComment(_elem: any, item: any) {
    localStorage.setItem('reactionEntity', 'story');
    if (this.contentType == commentContentType.comment) {
      localStorage.setItem('commentId', item._id);
    } else if (this.contentType == commentContentType.reply) {
      localStorage.setItem('commentId', this.commentId);
      localStorage.setItem('replyId', item._id);
    }
    setTimeout(() => {
      item.showReactionContainer = true;
    }, 500);
  }

  onMouseOutLikeComment(_elem: any, item: any) {
    localStorage.removeItem('commentId');
    localStorage.removeItem('replyId');
    localStorage.removeItem('reactionEntity');
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
    return (
      replyItem?.author?.id === localStorage.getItem('id') ||
      replyItem?.createdBy === localStorage.getItem('id')
    );
  }

  onFlagOrUnFlagComment(comment: ExistingCommentResponse): void {
    let payload: CommentReplyFlag;
    if (this.commentId == '') {
      payload = {
        id: this.entityId,
        flagged: !comment.flagged,
        commentId: comment._id
      };
    } else {
      payload = {
        id: this.entityId,
        flagged: !comment.flagged,
        commentId: this.commentId,
        replyId: comment._id
      };
    }
    this._storyCommentSvc.toggleCommentFlag(payload).subscribe((res: any) => {
      if (res?.data?.isSuccess) {
        comment.flagged = !comment.flagged;
        const msg = comment.flagged
          ? this.commentLabels.flagSuccess
          : this.commentLabels.unFlagSuccess;
        this._toasterService.success(msg);
      } else {
        this._toasterService.error(generic.errorMessage);
      }
    });
  }

  onEditComment(comment: ExistingCommentResponse): void {
    if (this.commentId == '') {
      this.onPressEditComment.emit({
        comment: comment,
        type: commentContentType.comment
      });
    } else {
      this.onPressEditComment.emit({
        type: commentContentType.reply,
        comment: this.comment,
        parentId: this.commentId
      });
    }
  }

  getDateDifference(date: string) {
    return dateDifference(date);
  }

  getComments(comment: string) {
    return comment.replaceAll('/n', '<br />');
  }

  checkBanPrivilege(comment: ExistingCommentResponse): boolean {
    if (
      comment?.author?.id === localStorage.getItem('id') ||
      !!comment?.author?.role
    ) {
      return false;
    } else return true;
  }

  onRemoveComment(comment: ExistingCommentResponse, banUser?: boolean): void {
    let payload: DeleteStoryComment;
    let isReply = false;
    if (this.commentId == '') {
      payload = {
        storyId: this.entityId,
        commentId: comment._id
      };
    } else {
      payload = {
        storyId: this.entityId,
        commentId: this.commentId,
        replyId: comment._id
      };
      isReply = true;
    }

    const alertMessage = banUser
      ? isReply
        ? replyData.removeAndBanUser
        : commentData.removeAndBanUser
      : isReply
      ? replyData.confirmDelete
      : commentData.confirmDelete;

    if (confirm(alertMessage)) {
      this._storyCommentSvc.removeComment(payload).subscribe((res: any) => {
        if (res?.data?.isSuccess) {
          comment.removed = true;
          this.reloadStory.emit(true);

          if (comment?.replies) {
            comment.replies.forEach((reply) => (reply.removed = true));
          }
          if (banUser) {
            this.banUser(comment.author.id, isReply);
          } else {
            this._toasterService.success(
              isReply ? replyData.deleteSuccess : commentData.deleteSuccess
            );
          }
        } else {
          this._toasterService.error(generic.errorMessage);
        }
      });
    }
  }

  public banUser = (authorId: string, isReply?: boolean) => {
    this._searchService.banUser(authorId).subscribe(
      (data: any) => {
        if (data?.data?.isSuccess) {
          this._toasterService.success(
            isReply
              ? replyData.replyRemovedAndUserBanned
              : commentData.commentRemovedAndUserBanned
          );
        }
      },
      (_error: any) => {
        this._toasterService.error(generic.errorMessage);
      }
    );
  };

  onAddNewReply() {
    if (this.commentId == '') {
      this.addNewReply.emit({
        type: commentContentType.comment,
        comment: this.comment
      });
    } else {
      this.addNewReply.emit({
        type: commentContentType.reply,
        comment: this.comment,
        parentId: this.commentId
      });
    }
  }

  checkReportPrivilege() {
    return this.checkIfAuthor(this.comment) ? false : !this.comment.flagged;
  }

  checkIfEntityAuthor() {
    return this.authorId
      ? this.authorId == this.comment.author.id
        ? true
        : false
      : false;
  }

  getCommentDeepLinkIcon() {
    if (!!this.comment.deeplink?.iconType) {
      return getDeepLinkIcon(
        this.comment.deeplink?.iconType === ICON_TYPE.partner
          ? this.comment.deeplink?.articleType ??
              this.comment.deeplink?.iconType
          : this.comment.deeplink?.iconType
      );
    }
    return '';
  }
}
