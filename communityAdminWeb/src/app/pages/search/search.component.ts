import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ReactionContainerService } from 'src/app/components/reaction-container/reaction-container.service';
import {
  COMMENT_TYPE,
  ICON_TYPE,
  generic,
  roles,
  sortType
} from 'src/app/core/constants';
import {
  commentData,
  icons,
  persona,
  postsModule,
  replyData,
  searchModule
} from 'src/app/core/defines';
import {
  CommentDeepLinkData,
  CommentToFlag,
  DeepLinkData,
  ExistingComment,
  ExistingCommentResponse,
  ExistingPosts,
  NewComment,
  reactionType
} from 'src/app/core/models';
import {
  CommentReactionPayload,
  PostReactionPayload,
  ReactionLog,
  ReplyReactionPayload
} from 'src/app/core/models/reactions';
import {
  ExistingReply,
  ExistingReplyResponse,
  NewReply,
  ReplyToDelete,
  ReplyToFlag
} from 'src/app/core/models/reply';
import { SharedService } from 'src/app/core/services/shared.service';
import {
  checkIfEdited,
  dateDifference,
  emojiFilter,
  getDeepLinkIcon,
  sortBasedOnCreatedTime
} from 'src/app/core/utils';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DraftContentService } from '../draft-content/draft-content.service';
import { ViewDraftsService } from '../view-drafts/view-drafts.service';
import { SearchService } from './search.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() parentPostData: any = null;
  @Input() communityList: any = [];
  @Output() handleRefresh = new EventEmitter();
  public commentAuthorImage: string = icons.users.defaultUser;
  public scadminImage: string = icons.users.scadmin;
  public scadvocateImage: string = icons.users.defaultUser;
  public currentReaction: string = icons.reactions.default;
  public currentReactionText: string = searchModule.en.likeBtn;

  public searchText: string = '';
  public searchResponse: ExistingPosts | any;
  public noSearchLine1 = searchModule.defaultLine1;
  public noSearchLine2 = searchModule.defaultLine2;
  public noPostFoundLine1 = searchModule.noPostFoundLine1;
  public showCard: boolean = false;
  public isSpanishAvailable: boolean = false;
  public viewSpanishLabel: string = postsModule.en.viewSpanish;
  public updatedDate: string = '';
  public profilePicture: string = '';
  public authorLine1: string = '';
  public authorLine2: string = '';
  public showComments: boolean = false;
  public commentToAdd: string = '';
  public visibleComments: any = [];
  public commentsCount: number = 0;
  public showReactionContainerForPost: boolean = false;
  public reactions: any = {};
  public postId: string = '';
  public currentAdminReaction: reactionType | any;
  public isPostEdited: boolean = false;
  public postCreator: string = '';
  public postPersonaAuthor: string = '';
  public search = searchModule;
  private eventSubscription: Subscription;
  public postImage: any = '';
  isEmojiShown = false;

  isCommentModalVisible = false;
  existingValue = '';
  commentType: string = '';
  deeplinkLabel!: DeepLinkData;
  selectedComment!: ExistingCommentResponse;
  selectedReply!: ExistingReplyResponse;
  commentDeepLink!: CommentDeepLinkData;
  commentTitle!: string;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private _searchService: SearchService,
    private _viewDraftsService: ViewDraftsService,
    private _draftContentService: DraftContentService,
    private _reactionService: ReactionContainerService,
    private _sharedService: SharedService,
    private _toastrService: ToastrService
  ) {
    this.eventSubscription = this._sharedService.getEvent().subscribe(() => {
      this.onSearch();
    });
  }

  onSearch() {
    this.callGetPostById(this.searchText);
  }

  callGetPostById(postId: string) {
    if (postId) {
      const isPublished =
        this.activatedRoute?.snapshot?.queryParams?.published ?? true;
      this._searchService.getAdminPosts(this.searchText, isPublished).subscribe(
        (data: any) => {
          this.setPostResponse(data?.data?.value);
        },
        (_error: any) => {
          this.showCard = false;
          this.noSearchLine1 = searchModule.noPostFoundLine1 + this.searchText;
          this.noSearchLine2 = searchModule.noPostFoundLine2;

          this.showNotFoundError(searchModule.postNotfound, searchModule.postNodata, 'info');
        }
      );
    }
  }

  private setPostResponse(data: any) {
    this.searchResponse = data ?? [];
    if (this.searchResponse.length == 0) {
      this.showCard = false;
      this.noSearchLine1 = searchModule.noPostFoundLine1 + this.searchText;
      this.noSearchLine2 = searchModule.noPostFoundLine2;
    } else {
      this.postImage = '';
      this.showCard = true;
      this.noSearchLine1 = searchModule.postFoundLine1 + this.searchText;
      this.noSearchLine2 = '';
      this.postId = this.searchResponse?.id;

      this.isPostEdited = checkIfEdited(
        this.searchResponse?.createdDate,
        this.searchResponse?.updatedDate,
        this.searchResponse?.editedAfterPublish
      );

      this.updatedDate = dateDifference(this.searchResponse?.updatedDate);
      this.handlePostAuthorDetails(this.searchResponse);

      if (this.searchResponse?.comments?.length > 0) {
        this.handleComments(this.searchResponse?.comments);
      } else {
        this.visibleComments = [];
        this.commentsCount = 0;
      }

      this.checkReactionForPost();
      this.postCreator = this.searchResponse?.createdBy;
      this.postPersonaAuthor = this.searchResponse?.author.id;
    }
  }

  checkReactionForPost() {
    if (this.searchResponse?.reactions?.log?.length > 0) {
      this.reactions = this.searchResponse?.reactions;
      this.handleReactionForPost(this.searchResponse?.reactions?.log);
    } else {
      this.currentReactionText = searchModule.en.likeReactionText;
    }
  }

  pollStatus() {
    return this.isPollClosed()
      ? postsModule.closed
      : `${postsModule.endsOn} : ${moment(this.getPollEndDate()).format(
          'MM/DD/YYYY'
        )}`;
  }

  isPollClosed() {
    return new Date(this.getPollEndDate()) < new Date();
  }

  getPollEndDate() {
    return moment(this.searchResponse?.publishedAt)
      .add(this.searchResponse?.content?.en?.poll?.endsOn, 'days')
      .format();
  }

  handlePostAuthorDetails(searchResponse: any) {
    if (searchResponse?.author?.role == 'scadvocate') {
      this.profilePicture = this.scadvocateImage;
      this.authorLine1 =
        searchResponse?.author?.displayName ||
        searchResponse?.author?.firstName;
      this.authorLine2 =
        searchResponse?.author?.displayTitle || persona.communityAdvocate;
    } else {
      this.profilePicture = this.scadminImage;
      this.authorLine1 =
        searchResponse?.author?.displayName ||
        searchResponse?.author?.firstName;
      this.authorLine2 = '';
    }
  }

  handleReactionForPost(postReactionLogArray: any) {
    this.currentAdminReaction = this.getCurrentReaction(postReactionLogArray);
    if (this.currentAdminReaction) {
      // Update Current Admin Reaction
      this.getCurrentReactionData(this.currentAdminReaction);
    }
  }

  handleComments(commentsArray: Array<ExistingCommentResponse>) {
    // Filter Comments which are Not Deleted
    this.visibleComments = commentsArray;
    // Sort Comments based on updatedAt Time (most recent at bottom)
    this.visibleComments.sort(sortBasedOnCreatedTime(sortType.DESC));

    // Comments Count excluding Reply Count
    this.commentsCount = this.visibleComments?.filter(
      (comment: ExistingCommentResponse) => !comment.removed
    ).length;

    this.visibleComments.map((commentItem: any, i: number) => {
      // Adding Flag for ReactionContainer
      commentItem.showReactionContainer = false;

      // Handle Reactions for Comment
      if (
        commentItem?.reactions?.log?.length > 0 &&
        this.getCurrentReaction(commentItem.reactions.log) !==
          reactionType.remove
      ) {
        // Check Current Admin Reaction on Comment
        commentItem.currentAdminReaction = this.getCurrentReaction(
          commentItem.reactions.log
        );

        // Update Current Admin Reaction Text for Comment
        commentItem.reactionText = this.updateReactionText(
          commentItem.currentAdminReaction
        );
        commentItem.hasCurrentAdminReacted = true;
      } else {
        commentItem.currentAdminReaction = reactionType.remove;
        commentItem.reactionText = searchModule.en.likeReactionText;
        commentItem.hasCurrentAdminReacted = false;
      }

      // Converting ISO Date to Relative Time for Comments
      this.visibleComments[i].updatedAt = commentItem.updatedAt;

      // Handle Replies if Available
      if (commentItem?.replies?.length > 0) {
        this.handleReplies(commentItem);
      }
    });
  }

  handleReplies(commentItem: ExistingCommentResponse | any) {
    commentItem.replyCount = commentItem.replies.filter(
      (reply: ExistingReplyResponse) => !reply.removed
    ).length;

    // Comment Count Including Reply Count
    this.commentsCount = this.commentsCount + commentItem.replyCount;

    // Converting ISO Date to Relative Time for Replies
    commentItem.replies.map((replyItem: any, replyItemIndex: number) => {
      replyItem.showReactionContainer = false;

      // Check Current Admin Reaction on Reply
      if (
        replyItem?.reactions?.log?.length > 0 &&
        this.getCurrentReaction(replyItem.reactions.log) !== reactionType.remove
      ) {
        replyItem.currentAdminReaction = this.getCurrentReaction(
          replyItem.reactions.log
        );
        // Update Current Admin Reaction Text for Reply
        replyItem.reactionText = this.updateReactionText(
          replyItem.currentAdminReaction
        );
        replyItem.hasCurrentAdminReacted = true;
      } else {
        replyItem.currentAdminReaction = reactionType.remove;
        replyItem.reactionText = searchModule.en.likeReactionText;
        replyItem.hasCurrentAdminReacted = false;
      }
      // Converting ISO Date to Relative Time for Reply
      commentItem.replies[replyItemIndex].updatedAt = replyItem.updatedAt;
    });
  }

  onChangeSearchText(searchText: string) {
    if (searchText.length == 0) {
      this.showCard = false;
      this.noSearchLine1 = searchModule.defaultLine1;
      this.noSearchLine2 = searchModule.defaultLine2;
      this.showComments = false;
    }
  }

  onClickViewSpanish() {
    this.isSpanishAvailable = !this.isSpanishAvailable;
    if (this.isSpanishAvailable) {
      this.viewSpanishLabel = postsModule.en.hideSpanish;
    } else {
      this.viewSpanishLabel = postsModule.en.viewSpanish;
    }
  }

  onDeletePost(id: string) {
    if (confirm(searchModule.confirmDelete)) {
      this._viewDraftsService.deleteDraftById(id).subscribe((data: any) => {
        if (data?.data?.isSuccess) {
          this._toastrService.success(searchModule.deleteSuccess);
          this.onSearch();
        }
      });
    }
  }

  onEditPost(postData: ExistingPosts) {
    this._viewDraftsService.setDraftData(postData);
    this._router.navigate(['/ui/pages/engage/draft-content', Object]);
  }

  // Flagging/UnFlagging an Existing Post
  onFlagOrUnFlagPost(postId: string, flagValue: boolean) {
    if (
      flagValue
        ? confirm(searchModule.confirmFlag)
        : confirm(searchModule.confirmUnFlag)
    ) {
      this._searchService.flagPost(postId, flagValue).subscribe(
        (data: any) => {
          if (data?.data?.isSuccess) {
            this._toastrService.success(
              flagValue ? searchModule.flagSuccess : searchModule.unFlagSuccess
            );
            this.onSearch();
          }
        },
        (_error: any) => {
          this._toastrService.error(generic.errorMessage);
        }
      );
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  showCommentsSection() {
    this.showComments = true;
  }

  sendComment(eventData: { comment: string; deepLink: any }) {
    switch (this.commentType) {
      case COMMENT_TYPE.NEW_COMMENT:
        this.onAddComment(eventData.comment, eventData.deepLink);
        break;
      case COMMENT_TYPE.EDIT_COMMENT:
        this.onEditComment(eventData.comment, eventData.deepLink);
        break;
      case COMMENT_TYPE.ADD_NEW_REPLY:
        this.onAddNewReply(eventData.comment, eventData.deepLink);
        break;
      case COMMENT_TYPE.EDIT_REPLY:
        this.sendEditReply(eventData.comment, eventData.deepLink);
        break;
    }
    this.commentType = '';
  }

  toggleCommentModal(isToggle: boolean) {
    this.isCommentModalVisible = isToggle;
  }

  onPressAddComment() {
    this.commentType = COMMENT_TYPE.NEW_COMMENT;
    this.commentTitle = 'Add Comment';
    this.existingValue = '';
    this.deeplinkLabel = {
      en: '',
      es: '',
      spanishRequired: true
    };
    this.isCommentModalVisible = true;
  }

  onClickEditComment(comment: ExistingCommentResponse) {
    this.commentType = COMMENT_TYPE.EDIT_COMMENT;
    this.commentTitle = 'Editing the comment';
    this.existingValue = comment.comment;
    this.isCommentModalVisible = true;
    this.selectedComment = comment;
    this.deeplinkLabel = {
      en: comment?.deeplink?.label?.en ?? '',
      es: comment?.deeplink?.label?.es ?? '',
      spanishRequired: true
    };
    if (comment?.deeplink) {
      this.commentDeepLink = comment?.deeplink;
    }
  }

  onClickAddNewReply(parentComment: ExistingCommentResponse) {
    this.commentType = COMMENT_TYPE.ADD_NEW_REPLY;
    this.commentTitle = parentComment?.author?.displayName
      ? `Adding new reply to  ${parentComment?.author?.displayName}'s comment...`
      : parentComment?.author?.firstName
      ? `Adding new reply to ${parentComment?.author?.firstName}'s comment...`
      : 'Adding new reply to comment...';
    this.existingValue = '';
    this.deeplinkLabel = {
      en: '',
      es: '',
      spanishRequired: true
    };
    this.isCommentModalVisible = true;
    this.selectedComment = parentComment;
  }

  onClickEditReply(
    parentComment: ExistingCommentResponse,
    reply: ExistingReplyResponse
  ) {
    this.commentType = COMMENT_TYPE.EDIT_REPLY;
    this.commentTitle = 'Editing the reply';
    this.existingValue = reply.comment;
    this.isCommentModalVisible = true;
    this.selectedComment = parentComment;
    this.selectedReply = reply;
    this.deeplinkLabel = {
      en: reply?.deeplink?.label?.en ?? '',
      es: reply?.deeplink?.label?.es ?? '',
      spanishRequired: true
    };
    if (reply?.deeplink) {
      this.commentDeepLink = reply?.deeplink;
    }
  }

  onAddComment(commentToAdd: string, deepLink: any) {
    let payload: NewComment;
    if (commentToAdd.trim().length > 0) {
      payload = {
        postId: this.searchResponse.id,
        comment: commentToAdd.trim(),
        deeplink: deepLink
      };
      this._searchService.addComment(payload).subscribe(
        (_data: any) => {
          this.isEmojiShown = false;
          this.handleRefresh.emit();
          this.commentToAdd = '';
          this.onSearch();
        },
        (_error: any) => {
          this.showKeyWordContentWarning(
            _error?.error?.data?.errors[0]?.title,
            postsModule.en.warning as SweetAlertIcon,
            payload as NewComment,
            false,
            false
          );
        }
      );
    }
  }

  onEditComment(updatedComment: string, deepLink: any) {
    if (!!this.selectedComment) {
      let payload: ExistingComment | any;
      payload = {
        postId: this.searchResponse.id,
        comment: updatedComment,
        id: this.selectedComment._id,
        deeplink: deepLink
      };
      this._searchService.editComment(payload).subscribe(
        (data: any) => {
          this.refreshPostOnSuccess(data);
        },
        (_error: any) => {
          this.showKeyWordContentWarning(
            _error?.error?.data?.errors[0]?.title,
            postsModule.en.warning as SweetAlertIcon,
            payload,
            true,
            false
          );
        }
      );
    }
  }

  onAddNewReply(comment: string, deepLink: any) {
    if (!!this.selectedComment) {
      let payload: NewReply;
      payload = {
        postId: this.searchResponse.id,
        commentId: this.selectedComment._id,
        comment: comment.trim(),
        deeplink: deepLink
      };
      this._searchService.addReply(payload).subscribe(
        (_data: any) => {
          this.onSearch();
        },
        (_error: any) => {
          this.showKeyWordContentWarning(
            _error?.error?.data?.errors[0]?.title,
            postsModule.en.warning as SweetAlertIcon,
            payload as NewComment,
            false,
            true
          );
        }
      );
    }
  }

  sendEditReply(reply: string, deepLink: any) {
    if (!!this.selectedReply && this.selectedComment) {
      let payload: ExistingReply | any;

      payload = {
        id: this.selectedReply._id,
        postId: this.searchResponse.id,
        commentId: this.selectedComment._id,
        comment: reply,
        deeplink: deepLink
      };
      this._searchService.editReply(payload).subscribe(
        (data: any) => {
          this.refreshPostOnSuccess(data);
        },
        (_error: any) => {
          this.showKeyWordContentWarning(
            _error?.error?.data?.errors[0]?.title,
            postsModule.en.warning as SweetAlertIcon,
            payload as NewComment,
            true,
            true
          );
        }
      );
    }
  }

  onDeleteComment(comment: ExistingCommentResponse, isBanUser?: boolean) {
    if (
      confirm(
        isBanUser ? commentData.removeAndBanUser : commentData.confirmDelete
      )
    ) {
      this._searchService
        .deleteComment(this.searchResponse.id, comment)
        .subscribe(
          (data: any) => {
            this.handleRefresh.emit();
            if (data?.data?.isSuccess && !isBanUser) {
              this._toastrService.success(commentData.deleteSuccess);
              this.onSearch();
            } else if (data?.data?.isSuccess && isBanUser) {
              this.banUser(comment.author.id, false);
            } else this._toastrService.error(generic.errorMessage);
          },
          (_error: any) => {
            this._toastrService.error(generic.errorMessage);
          }
        );
    }
  }

  onFlagOrUnFlagComment(comment: ExistingCommentResponse, flagValue: boolean) {
    let payload: CommentToFlag;
    payload = {
      postId: this.searchResponse.id,
      commentId: comment._id,
      flagged: flagValue
    };
    if (
      flagValue
        ? confirm(commentData.confirmFlag)
        : confirm(commentData.confirmUnFlag)
    ) {
      this._searchService.reportComment(payload).subscribe(
        (data: any) => {
          if (data?.data?.isSuccess) {
            this._toastrService.success(
              flagValue ? commentData.flagSuccess : commentData.unFlagSuccess
            );
            this.onSearch();
          }
        },
        (_error: any) => {
          this._toastrService.error(generic.errorMessage);
        }
      );
    }
  }

  ngOnInit(): void {
    if (this._router.url.includes('/ui/pages/engage/search/')) {
      let postId = this.activatedRoute?.snapshot?.params?.postId ?? '';
      this.searchText = postId;
      if (this.searchText) {
        this.callGetPostById(postId);
      }
    }
    this.getPost();
    this.getCommentsList();
  }

  getCommentsList() {
    if (!this.parentPostData) {
      this._draftContentService
        .getAllCommunities(true, false)
        .subscribe((response: any) => {
          if (response.data.isSuccess) {
            this.communityList = response?.data?.value ?? [];
          }
        });
    }
  }

  getPost() {
    if (!!this.parentPostData) {
      this.searchText = this.parentPostData.id;
      this.setPostResponse(this.parentPostData);
    }
  }
  onMouseOverLikePost(_elem: any) {
    setTimeout(() => {
      this.showReactionContainerForPost = true;
    }, 1000);
  }

  onMouseOutLikePost(_elem: any) {
    setTimeout(() => {
      this.showReactionContainerForPost = false;
    }, 1000);
  }

  onClickLikeButton() {
    let payload: PostReactionPayload;
    if (
      this.currentAdminReaction &&
      this.currentAdminReaction != reactionType.remove
    ) {
      payload = {
        authorId: localStorage.getItem('id') || '',
        reaction: reactionType.remove,
        id: this.postId
      };
    } else {
      payload = {
        authorId: localStorage.getItem('id') || '',
        reaction: reactionType.like,
        id: this.postId
      };
    }
    this._reactionService.reactOnAdminPost(payload).subscribe(
      (data: any): void => {
        this.handleRefresh.emit();
        this.refreshPostOnSuccess(data);
        this.handleRefresh.emit();
      },
      (_error: any): void => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  onClickLikeComment(comment: ExistingCommentResponse) {
    let reactionLog = comment?.reactions?.log || [];
    let currentCommentReaction: reactionType;
    let payload: CommentReactionPayload | any;

    if (reactionLog?.length > 0) {
      currentCommentReaction =
        this.getCurrentReaction(reactionLog) || reactionType.remove;
      if (currentCommentReaction) {
        if (currentCommentReaction !== reactionType.remove) {
          payload = {
            authorId: localStorage.getItem('id'),
            reaction: reactionType.remove,
            id: this.searchResponse.id,
            commentId: comment._id
          };
        } else if (currentCommentReaction === reactionType.remove) {
          payload = {
            authorId: localStorage.getItem('id'),
            reaction: reactionType.like,
            id: this.searchResponse.id,
            commentId: comment._id
          };
        }
      }
    } else {
      payload = {
        authorId: localStorage.getItem('id'),
        reaction: reactionType.like,
        id: this.searchResponse.id,
        commentId: comment._id
      };
    }
    this._reactionService.reactOnComment(payload).subscribe(
      (data: any): void => {
        this.refreshPostOnSuccess(data);
      },
      (_error: any): void => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  onClickLikeReply(commentId: string, reply: ExistingReplyResponse) {
    let reactionLog = reply?.reactions?.log || [];
    let currentReplyReaction: reactionType;
    let payload: ReplyReactionPayload | any;

    if (reactionLog?.length > 0) {
      currentReplyReaction =
        this.getCurrentReaction(reactionLog) || reactionType.remove;
      if (currentReplyReaction !== reactionType.remove) {
        payload = {
          authorId: localStorage.getItem('id'),
          reaction: reactionType.remove,
          id: this.searchResponse.id,
          commentId: commentId,
          replyId: reply?._id
        };
      } else if (currentReplyReaction === reactionType.remove) {
        payload = {
          authorId: localStorage.getItem('id'),
          reaction: reactionType.like,
          id: this.searchResponse.id,
          commentId: commentId,
          replyId: reply?._id
        };
      }
    } else {
      payload = {
        authorId: localStorage.getItem('id'),
        reaction: reactionType.like,
        id: this.searchResponse.id,
        commentId: commentId,
        replyId: reply?._id
      };
    }
    this._reactionService.reactOnReply(payload).subscribe(
      (data: any): void => {
        this.refreshPostOnSuccess(data);
      },
      (_error: any): void => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  onMouseOverLikeComment(_elem: any, item: any) {
    localStorage.setItem('commentId', item._id);
    setTimeout(() => {
      item.showReactionContainer = true;
    }, 1000);
  }

  onMouseOutLikeComment(_elem: any, item: any) {
    localStorage.removeItem('commentId');
    setTimeout(() => {
      item.showReactionContainer = false;
    }, 1000);
  }

  onMouseOverLikeReply(_elem: any, commentId: string, reply: any) {
    localStorage.setItem('commentId', commentId);
    localStorage.setItem('replyId', reply._id);
    setTimeout(() => {
      reply.showReactionContainer = true;
    }, 1000);
  }

  onMouseOutLikeReply(_elem: any, reply: any) {
    localStorage.removeItem('commentId');
    localStorage.removeItem('replyId');
    setTimeout(() => {
      reply.showReactionContainer = false;
    }, 1000);
  }

  refreshPostOnSuccess = (data: any): void => {
    if (data?.data?.isSuccess) {
      this.onSearch();
    }
  };

  // Deleting an Existing Reply
  onDeleteReply(
    parentComment: ExistingCommentResponse | ExistingComment,
    reply: ExistingReplyResponse,
    isBanUser?: boolean
  ) {
    let payload: ReplyToDelete | any;
    if (
      confirm(isBanUser ? replyData.removeAndBanUser : replyData.confirmDelete)
    ) {
      payload = {
        postId: this.searchResponse.id,
        commentId: parentComment._id,
        replyId: reply._id,
        flagged: reply.flagged
      };
      this._searchService.deleteReply(payload).subscribe(
        (data: any) => {
          this.handleRefresh.emit();
          if (data?.data?.isSuccess && !isBanUser) {
            this._toastrService.success(replyData.deleteSuccess);
            this.onSearch();
          }
        },
        (_error: any) => {
          this._toastrService.error(generic.errorMessage);
        }
      );
      if (isBanUser) {
        this.banUser(reply.author.id, true);
      }
    }
  }

  // Flagging/UnFlagging an Existing Reply
  onFlagOrUnFlagReply(
    parentComment: ExistingCommentResponse,
    reply: ExistingReplyResponse,
    flagValue: boolean
  ) {
    let payload: ReplyToFlag;
    if (
      flagValue
        ? confirm(replyData.confirmFlag)
        : confirm(replyData.confirmUnFlag)
    ) {
      payload = {
        postId: this.searchResponse.id,
        commentId: parentComment._id,
        replyId: reply._id,
        flagged: flagValue
      };
      this._searchService.flagReply(payload).subscribe(
        (data: any) => {
          if (data?.data?.isSuccess) {
            this._toastrService.success(
              flagValue ? replyData.flagSuccess : replyData.unFlagSuccess
            );
            this.onSearch();
          }
        },
        (_error: any) => {
          this._toastrService.error(generic.errorMessage);
        }
      );
    }
  }

  // Get Current Admin Reaction
  getCurrentReaction = (reactionLog: Array<ReactionLog> | any) => {
    let currentUserId = localStorage.getItem('id');
    let flag: boolean = false;
    let reaction: reactionType | any;
    function sameUserCheck(item: ReactionLog) {
      return item.userId === currentUserId;
    }
    flag = reactionLog.some(sameUserCheck);
    if (flag) {
      reaction = reactionLog.find(sameUserCheck)?.reaction;
    }
    return reaction;
  };

  // Update Current Admin Reaction Data on Post
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

  // Update Current Admin Reaction Text for Comment/Reply
  updateReactionText = (reaction: reactionType | any) => {
    switch (reaction) {
      case 'like':
        return searchModule.en.likedReactionText;
      case 'care':
        return searchModule.en.careReactionText;
      case 'celebrate':
        return searchModule.en.celebrateReactionText;
      case 'good_idea':
        return searchModule.en.goodIdeaReactionText;
      case 'remove':
      default:
        return searchModule.en.likeReactionText;
    }
  };

  // Check if Comment/Reply is from Same Post's Author
  checkIfAuthor(
    comment: ExistingCommentResponse | ExistingReplyResponse
  ): boolean {
    if (comment?.author?.id === this.searchResponse?.author?.id) {
      return true;
    } else return false;
  }

  // Admin CAN only Edit his own Comment
  checkEditPrivilege(
    comment: ExistingCommentResponse | ExistingReplyResponse
  ): boolean {
    if (
      // Edit option is available only for the owner of the comment or SCAdmin with the persona comment.
      comment?.author?.id === localStorage.getItem('id') ||
      (this.postCreator === localStorage.getItem('id') &&
        comment?.author?.role === roles[1].role &&
        comment?.author?.id === this.postPersonaAuthor)
    ) {
      return true;
    } else return false;
  }

  // Admin CAN only Delete his own Comment/Reply or if his role is SCAdmin
  checkDeletePrivilege(
    comment: ExistingCommentResponse | ExistingReplyResponse
  ): boolean {
    if (
      comment?.author?.id === localStorage.getItem('id') ||
      localStorage.getItem('role') === roles[0].role
    ) {
      return true;
    } else return false;
  }

  // Admin CAN'T Report his own comment/reply or when the comment/reply is Already Flagged
  checkFlagPrivilege(
    comment: ExistingCommentResponse | ExistingReplyResponse
  ): boolean {
    if (
      comment?.author?.id === localStorage.getItem('id') ||
      comment?.flagged
    ) {
      return false;
    } else return true;
  }

  // Admin CAN only UnFlag a comment/reply when it's Already Flagged
  checkUnFlagPrivilege(comment: ExistingCommentResponse): boolean {
    if (comment?.flagged) {
      return true;
    } else return false;
  }

  // Admin CAN NOT Ban his own or other Admin's Comment/Reply, SCAdvocate shouldn't be able to Remove and Ban
  checkBanPrivilege(
    comment: ExistingCommentResponse | ExistingReplyResponse
  ): boolean {
    if (
      comment?.author?.id === localStorage.getItem('id') ||
      comment?.author?.role ||
      localStorage.getItem('role') === roles[1].role
    ) {
      return false;
    } else return true;
  }

  public removeAndBanUser = (
    isReply: boolean,
    comment: ExistingCommentResponse,
    reply?: ExistingReplyResponse
  ) => {
    if (isReply && reply) {
      this.onDeleteReply(comment, reply, true);
    } else {
      this.onDeleteComment(comment, true);
    }
  };

  public banUser = (authorId: string, isReply: boolean) => {
    this._searchService.banUser(authorId).subscribe(
      (data: any) => {
        if (data?.data?.isSuccess) {
          this._toastrService.success(
            isReply
              ? replyData.replyRemovedAndUserBanned
              : commentData.commentRemovedAndUserBanned
          );
          this.onSearch();
        }
      },
      (_error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  };

  getComments(comment: string) {
    return comment.replaceAll('/n', '<br />');
  }

  getDateDifference(date: string) {
    return dateDifference(date);
  }

  getLinkContent(data: any) {
    return {
      ...data,
      ...this.searchResponse.content.link
    };
  }

  onToggleEmoji() {
    this.isEmojiShown = !this.isEmojiShown;
  }

  onSelectEmoji($event: any) {
    this.commentToAdd = this.commentToAdd + $event.emoji.native;
  }

  getEmojis(e: any) {
    return emojiFilter(e);
  }

  // Promts while adding comments with bad words.
  showBadWordContentError(
    title: string,
    message: string,
    icon: SweetAlertIcon
  ) {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  }

  showKeyWordContentWarning(
    title: string,
    icon: SweetAlertIcon,
    payload: NewComment | ExistingComment | ExistingReply,
    isEdit: boolean,
    isReply: boolean
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
        if (isEdit) {
          if (isReply) {
            this._searchService.editReply(payload as ExistingReply).subscribe(
              (data: any) => {
                this.refreshPostOnSuccess(data);
              },
              (_error: any) => {
                this._toastrService.error(generic.errorMessage);
              }
            );
          } else {
            this._searchService
              .editComment(payload as ExistingComment)
              .subscribe(
                (data: any) => {
                  this.refreshPostOnSuccess(data);
                },
                (_error: any) => {
                  this._toastrService.error(generic.errorMessage);
                }
              );
          }
        } else {
          if (isReply) {
            this._searchService.addReply(payload as NewReply).subscribe(
              (_data: any) => {
                this.onSearch();
              },
              (_error: any) => {
                this._toastrService.error(generic.errorMessage);
              }
            );
          } else {
            this._searchService.addComment(payload as NewComment).subscribe(
              (_data: any) => {
                this.isEmojiShown = false;
                this.handleRefresh.emit();
                this.commentToAdd = '';
                this.onSearch();
              },
              (_error: any) => {
                this._toastrService.error(generic.errorMessage);
              }
            );
          }
        }
      } else if (result.isDenied) {
        Swal.fire(postsModule.en.postError, '', 'info');
      }
    });
  }

  getCommentDeepLinkIcon(comment: any) {
    if (!!comment.deeplink?.iconType) {
      return getDeepLinkIcon(
        comment.deeplink?.iconType === ICON_TYPE.partner
          ? comment.deeplink?.articleType ?? comment.deeplink?.iconType
          : comment.deeplink?.iconType
      );
    }
    return '';
  }

  showNotFoundError(
    title: string,
    message: string,
    icon: SweetAlertIcon,
  ) {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  }
}
