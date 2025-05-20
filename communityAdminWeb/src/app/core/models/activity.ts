export enum activityType {
  post = "post",
  comment = "comment",
  reply = "reply",
  reaction = "reaction",
  story = "story",
}

export interface ActivityList {
  userId: string;
  list: [ActivityListItem];
  id: string;
}

export interface ActivityListItem {
  _id: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    profilePicture: string | null;
  };
  postId: string;
  storyId: string;
  adminUserId: string;
  commentId: string | null;
  replyId: string | null;
  reactionType: string | null;
  entityType: activityType;
  isRead: boolean;
  isRemoved: boolean;
  isFlagged: boolean;
  title: string;
  createdAt: string;
  updatedAt: string;
}
