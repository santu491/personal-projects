import { IsArray, IsBoolean, IsDate, IsObject, IsOptional, IsString } from 'class-validator';
import { User } from './userModel';

export class StoryLink {
  @IsString() storyId: string;
  @IsString() @IsOptional() questionId: string;
  @IsString() @IsOptional() answerId: string;
  @IsString() @IsOptional() reactionId: string;
  @IsString() @IsOptional() genericId: string;
  @IsString() @IsOptional() articleId: string;
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
  @IsObject() @IsOptional() storyLink: StoryLink;
  @IsObject() @IsOptional() postLink: PostLink;
  @IsObject() activityInitiator: User;
  @IsBoolean() isCurrentUserAlsoAuthorOfLinkedStory: boolean;
  @IsBoolean() isHide: boolean;
  @IsBoolean() isDelete: boolean;
  @IsBoolean() isFlagged: boolean;
}

export class Activity {
  @IsString() id: string;
  @IsString() userId: string;
  @IsArray() activityList: ActivityList[];
}
