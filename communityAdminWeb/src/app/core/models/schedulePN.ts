export interface SchedulePNPayload {
  id?: string;
  title: string;
  body: string;
  sendOn: string;
  communities: Array<string>;
  nonCommunityUsers: boolean;
  allUsers: boolean;
  bannedUsers: boolean;
  deepLink: {
    url: string;
    label: string;
  };
  usersWithNoStory: boolean;
  usersWithDraftStory: boolean;
  usersWithNoRecentLogin: boolean;
  numberOfLoginDays: number;
  isScheduled: boolean;
}

export enum PnAudienceType {
  allUsers = 'allUsers',
  nonCommunityUsers = 'nonCommunityUsers',
  bannedUsers = 'bannedUsers',
  usersWithNoStory = 'usersWithNoStory',
  usersWithDraftStory = 'usersWithDraftStory',
  usersWithNoRecentLogin = 'usersWithNoRecentLogin'
}

export interface EditPNResult {
  isSuccess: boolean;
}

export enum PNStatus {
  cancelled = 'Cancelled',
  scheduled = 'Scheduled',
  sent = 'Sent'
}

export enum PostStatus {
  published = 'Published',
  scheduled = 'Scheduled',
  darft = 'Draft'
}

export interface TargetAudience {
  communities: Array<string>;
  nonCommunityUsers: boolean;
  usersWithNoStory: boolean;
  usersWithDraftStory: boolean;
  usersWithNoRecentLogin: boolean;
  numberOfLoginDays: number;
  bannedUsers: boolean;
  allUsers: boolean;
}
