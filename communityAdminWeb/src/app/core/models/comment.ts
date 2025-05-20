export interface NewComment {
  postId: string;
  comment: string;
  isProfane?: boolean;
  deeplink?: CommentDeepLinkData;
}

export interface ExistingComment {
  postId: string;
  comment: string;
  _id: string;
  isProfane?: boolean;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
  };
}

export interface ExistingCommentResponse {
  _id: string;
  authorId: string; // Only for User's Comment
  comment: string;
  createdAt: string;
  updatedAt: string;
  flagged: boolean;
  removed: boolean;
  isCommentTextProfane: boolean; // Only for User's Comment
  author: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    displayTitle: string;
    profileImage: string;
    role: string;
  };
  reactions: {
    log: [
      {
        userId: string;
        reaction: string;
        createdDate: string;
        updatedDate: string;
      }
    ];
    count: {
      like: number;
      care: number;
      celebrate: number;
      good_idea: number;
      total: number;
    };
  };
  currentAdminReaction?: any;
  showReactionContainer?: boolean;
  reactionText?: string;
  hasCurrentAdminReacted?: boolean;
  replyCount?: number;
  replies?: ExistingCommentResponse[];
  createdBy?: string;
  deeplink?: CommentDeepLinkData;
}

export interface CommentToFlag {
  postId: string;
  commentId: string;
  flagged: boolean;
}

export interface CommentReplyFlag {
  id: string;
  commentId: string;
  flagged: boolean;
  replyId?: string;
}

export interface CommentReplyAddOrEdit {
  storyId: string;
  commentId?: string;
  comment: string;
  id?: string;
  isProfane?: boolean;
  authorId?: string | null;
  deeplink?: CommentDeepLinkData;
}

export interface DeleteStoryComment {
  storyId: string;
  commentId: string;
  replyId?: string;
}

export interface StoryCommentReaction {
  reaction: string;
  id: string;
  commentId?: string;
  replyId?: string;
  authorId?: string | null;
}

export interface ReplyEvent {
  type: string;
  comment: ExistingCommentResponse;
  parentId?: string;
}

export interface CommentDeepLinkData {
  label?: {
    en?: string;
    es?: string;
  };
  url?: string;
  copyright?: string;
  iconType?: string;
  articleType?: string;
}
