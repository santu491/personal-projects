import { CommentDeepLinkData } from '.';

// To add a New Reply under a Comment
export interface NewReply {
  postId: string;
  commentId: string;
  comment: string;
  isProfane?: boolean;
  deeplink?: CommentDeepLinkData;
}

// To Update Reply under a Comment
export interface ExistingReply {
  id: string;
  postId: string;
  commentId: string;
  comment: string;
  isProfane?: boolean;
}

// Reply Response Structure from Post
export interface ExistingReplyResponse {
  _id: string;
  authorId: string; // Only for User's Reply
  comment: string;
  createdAt: string;
  updatedAt: string;
  flagged: boolean;
  removed: boolean;
  isCommentTextProfane: boolean; // Only for User's Reply
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
    log: Array<{
      userId: string;
      reaction: string;
      createdDate: string;
      updatedDate: string;
    }>;
    count: {
      like: number;
      care: number;
      celebrate: number;
      good_idea: number;
      total: number;
    };
  };
  deeplink?: CommentDeepLinkData;
}

// Reply to Delete
export interface ReplyToDelete {
  postId: string;
  commentId: string;
  replyId: string;
  flagged: boolean;
}

// Reply To Flag
export interface ReplyToFlag {
  postId: string;
  commentId: string;
  replyId: string;
  flagged: boolean;
}
