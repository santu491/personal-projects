export enum reactionType {
  like = "like",
  care = "care",
  celebrate = "celebrate",
  good_idea = "good_idea",
  remove = "remove",
}
export interface ReactionCount {
  like: number;
  care: number;
  celebrate: number;
  good_idea: number;
  total: number;
}

export interface PostReactionPayload {
  authorId: string;
  reaction: string;
  id: string;
}

export interface CommentReactionPayload {
  authorId: string | null;
  reaction: string;
  id: string;
  commentId: string;
}

export interface ReplyReactionPayload {
  userId: string | null;
  reaction: string;
  id: string;
  commentId: string;
  replyId: string;
}

export interface ReactionLog {
  userId: string;
  reaction: reactionType;
  createdDate: string;
  updatedDate: string;
}
