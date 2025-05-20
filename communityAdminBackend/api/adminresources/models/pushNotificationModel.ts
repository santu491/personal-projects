import { ObjectID } from 'bson';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';
import { PostLink, StoryLink } from './activityModel';
import { DeepLink } from './commonModel';
import { AdminUser } from './userModel';

export class PushNotificationRequest {
  @IsString() @IsOptional() id: string;
  @IsString() title: string;
  @IsString() @IsOptional() body: string;
  @IsString() @IsOptional() sendOn: string;
  @IsArray() @IsOptional() communities: string[];
  @IsBoolean() @IsOptional() nonCommunityUsers: boolean;
  @IsBoolean() @IsOptional() allUsers: boolean;
  @IsBoolean() @IsOptional() bannedUsers: boolean;
  @IsObject() deepLink: DeepLink;
  @IsBoolean() @IsOptional() isScheduled: boolean;
  @IsBoolean() @IsOptional() usersWithNoStory: boolean;
  @IsBoolean() @IsOptional() usersWithDraftStory: boolean;
  @IsBoolean() @IsOptional() usersWithNoRecentLogin: boolean;
  @IsNumber() @IsOptional() numberOfLoginDays: number;
}

export class PushNotification extends PushNotificationRequest {
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() updatedBy: string;
  @IsDate() author: AdminUser;
  @IsBoolean() removed: boolean;
  @IsBoolean() isSent: boolean;
}

export class NotificationQueue {
  @IsString() type: string;
  @IsString() deepLink: string;
  @IsString() senderId: string;
  @IsString() title: string;
  @IsString() body: string;
  @IsString() env: string;
  @IsDate() createdDate: Date;
  @IsBoolean() postWithPoll?: boolean;
  @IsObject() @IsOptional() deepLinkInApp?: PostLink | StoryLink;
  @IsString() @IsOptional() communities?: string[];
  @IsString() @IsOptional() postId?: string;
  @IsString() @IsOptional() activityId?: string;
  @IsString() @IsOptional() receiverId?: string;
  @IsString() @IsOptional() activityObjId?: string;
  @IsObject() @IsOptional() activityDeepLink?: PostLink;
}

export class NotificationQueueData {
  @IsString() type: string;
  @IsString() deepLink?: string;
  @IsString() senderId?: string;
  @IsString() title: string;
  @IsString() body: string;
  @IsString() env: string;
  @IsDate() createdDate: Date;
  @IsString() @IsOptional() communities?: string[];
  @IsBoolean() @IsOptional() nonCommunityUsers?: boolean;
  @IsBoolean() @IsOptional() allUsers?: boolean;
  @IsBoolean() @IsOptional() bannedUsers?: boolean;
  @IsBoolean() postWithPoll: boolean;
  @IsDate() @IsOptional() sendOn?: Date;
  @IsObject() @IsOptional() activityDeepLink?: DeepLink;
  @IsBoolean() @IsOptional() usersWithNoStory?: boolean;
  @IsBoolean() @IsOptional() usersWithDraftStory?: boolean;
  @IsBoolean() @IsOptional() usersWithNoRecentLogin?: boolean;
  @IsNumber() @IsOptional() numberOfLoginDays?: number;
}

export class PollClosingPN {
  @IsString() type: string;
  @IsString() senderId: string;
  @IsString() title: string;
  @IsString() body: string;
  @IsString() env: string;
  @IsString() postId: string;
  @IsString() createdDate: Date;
  @IsString() activityText: string;
  @IsBoolean() postWithPoll: boolean;
  @IsBoolean() postClosingSoon?: boolean;
  @IsBoolean() isSent?: boolean;
  @IsString() @IsOptional() communities?: string[];
  @IsDate() @IsOptional() sendOn?: Date;
  @IsObject() @IsOptional() activityDeepLink?: {};

}

export class ViewPNRequest {
  @IsArray() communities: string[];
  @IsArray() status: string[];
}

export class TargetAudience {
  @IsArray() communities: string[];
  @IsOptional() @IsBoolean() bannedUsers: boolean;
  @IsOptional() @IsBoolean() nonCommunityUsers: boolean;
  @IsOptional() @IsBoolean() usersWithDraftStory: boolean;
  @IsOptional() @IsBoolean() usersWithNoRecentLogin: boolean;
  @IsOptional() @IsBoolean() usersWithNoStory: boolean;
  @IsOptional() @IsNumber() numberOfLoginDays: number;
  @IsOptional() @IsBoolean() allUsers: boolean;
}

export class Subscription {
  @IsNumber() communityNotification: number | void;
  @IsNumber() commentNotification: number | void;
  @IsNumber() replyNotification: number | void;
  @IsNumber() commentReactionNotification: number | void;
  @IsNumber() reactionNotification: number | void;
  @IsNumber() maternityNotification: number | void;
}

export class PNMetricsResponse {
  @IsNumber() activeOptInUsers: number | void;
  @IsNumber() @IsOptional() activeOptInCommunityUsers: number | void;
  @IsObject() subscription: Subscription;
}

export class EmailNotification {
  @IsNumber() skip: number;
  @IsNumber() limit: number;
  @IsDate() createdDate: Date;
  @IsString() env: string;
}

export class PushNotificationTemp {
  @IsObject() @IsOptional() deepLink: DeepLink;
  @IsString() @IsOptional() title: string;
  @IsString() @IsOptional() body: string;
  @IsString() @IsOptional() activityText: string;
  @IsBoolean() @IsOptional() active: boolean;
  @IsString() @IsOptional() id: string;
}

export class PushNotificationTemplate extends PushNotificationTemp {
  @IsObject() @IsOptional() deepLink: DeepLink;
  @IsString() @IsOptional() name: string;
  @IsString() @IsOptional() title: string;
  @IsString() @IsOptional() body: string;
  @IsString() @IsOptional() activityText: string;
  @IsBoolean() @IsOptional() active: boolean;
  @IsString() @IsOptional() communityId: string;
  @IsBoolean() @IsOptional() checkStoryStatus: boolean;
  @IsBoolean() @IsOptional() userJoinedCommunity: boolean;
}

export class PushNotificationContent {
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsString() createdBy: string;
  @IsString() updatedBy: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsArray() pushNotificationTemplate: PushNotificationTemplate[];
}

export class PushNotifiationTemplatePayload {
  @IsObject() en: PushNotificationTemp;
}

export class UserSearchData {
  @IsArray() demoUsers: string[] | RegExp[];
  @IsArray() installationUsers: ObjectID[] | string[];
}

export class ScheduledPNData {
  @IsDate() createdAt: Date;
  @IsString() receiverId: string;
  @IsInt() weekCount: number;
  @IsString() name: string;
  @IsDate() sendOn: Date;
  @IsString() @IsOptional() env?: string;
  @IsString() @IsOptional() type?: string;
  @IsString() @IsOptional() activityText?: string;
  @IsString() @IsOptional() deepLink?: string;
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() body?: string;
  @IsString() @IsOptional() communityId?: string;
  @IsObject() @IsOptional() deepLinkInApp?: DeepLink;
  @IsBoolean() @IsOptional() checkStoryStatus?: boolean;
  @IsBoolean() @IsOptional() userJoinedCommunity?: boolean;
  @IsBoolean() @IsOptional() isSent: boolean;
}
