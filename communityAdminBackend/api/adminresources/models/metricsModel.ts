import { IsNumber, IsObject } from 'class-validator';

export class CommunityUserCount {
  @IsNumber() totalUsers: number;
  @IsNumber() usersThisMonth: number;
}

export class StoriesCount {
  @IsNumber() totalShared: number;
  @IsNumber() publishedThisMonth: number;
  @IsNumber() totalDraft: number;
  @IsNumber() total: number;
}

export class PostsCount {
  @IsNumber() totalShared: number;
  @IsNumber() postedThisMonth: number;
  @IsNumber() postByType: number;
}

export class CommunityMetrics {
  @IsObject() usersCount: CommunityUserCount;
  @IsObject() storiesCount: StoriesCount;
  @IsObject() postsCount: PostsCount;
  @IsNumber() pnEnabledUsers: number;

  constructor() {
    this.usersCount = new CommunityUserCount();
    this.storiesCount = new StoriesCount();
    this.postsCount = new PostsCount();
    this.pnEnabledUsers = 0;
  }
}

export class Metrics {
  @IsObject() usersCount: {};
  @IsObject() usersByCommunity: {};
  @IsObject() usersJoinedMoreThanOneCommunity: {};
  @IsNumber() storiesCount: number | void;
  @IsNumber() publishedStoriesCount: number | void;
  @IsNumber() unPublishedStoriesCount: number | void;
  @IsObject() storiesPerCommunity: {};
  @IsObject() unPublishedStoriesPerCommunity: {};
  @IsNumber() usersOptedForPn: number | void;
}
