import { IsArray, IsBoolean, IsDate, IsObject, IsOptional, IsString } from 'class-validator';
import { ActivityAuthor } from './adminUserModel';
import { AdminUser } from './userModel';

export class StoryLink {
  @IsString() storyId: string;
  @IsString() @IsOptional() commentId: string;
  @IsString() @IsOptional() replyId: string;
}

export class PostLink {
  @IsString() postId: string;
  @IsString() @IsOptional() commentId: string;
  @IsString() @IsOptional() replyId: string;
}

export class ActivityList {
  @IsString() id: string;
  @IsBoolean() isActivityNotificationRead: boolean;
  @IsDate() activityCreatedDate: Date;
  @IsString() activityText: string;
  @IsObject() @IsOptional() postLink: PostLink;
  @IsObject() @IsOptional() storyLink: StoryLink;
  @IsObject() activityInitiator: AdminUser;
  @IsBoolean() isHide: boolean;
  @IsBoolean() isDelete: boolean;
  @IsBoolean() @IsOptional() isTouContent: boolean;
  @IsString() @IsOptional() linkedText: string;
}

export class Activity {
  @IsString() id: string;
  @IsString() userId: string;
  @IsArray() activityList: ActivityList[];
}

export class AdminActivityList {
  @IsString() id: string;
  @IsBoolean() isRead: boolean;
  @IsBoolean() isRemoved: boolean;
  @IsBoolean() isFlagged: boolean;
  @IsString() title: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsObject() author: ActivityAuthor;
  @IsString() postId: string;
  @IsString() storyId: string;
  @IsString() commentId: string;
  @IsString() replyId: string;
  @IsString() reactionType: string;
  @IsString() entityId: string;
  @IsString() entityType: string;
  @IsString() adminUserId: string;
}
export class AdminActivity {
  @IsString() id: string;
  @IsString() userId: string;
  @IsArray() list: AdminActivityList[];
}
