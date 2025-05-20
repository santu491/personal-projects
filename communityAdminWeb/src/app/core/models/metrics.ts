export interface Filter {
  title: string;
  value: string;
}

export interface Subscription {
  communityNotification?: number;
  commentNotification?: number;
  replyNotification?: number;
  commentReactionNotification?: number;
  reactionNotification?: number;
  maternityNotification?: number;
}

export interface PNMetrics {
  activeOptInUsers: number;
  activeOptInCommunityUsers: number;
  subscription: Subscription;
}

export interface FilterText {
  text: string;
  communityText: string;
}
