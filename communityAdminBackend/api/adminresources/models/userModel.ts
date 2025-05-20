import { IsArray, IsBoolean, IsDate, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UserGenderRoles {
  @IsString() genderPronoun: string;
  @IsString() genderPronounPossessive: string;
}

export class Attributes {
  @IsBoolean() communityNotificationFlag: boolean;
  @IsBoolean() questionNotificationFlag: boolean;
  @IsBoolean() answerNotificationFlag: boolean;
  @IsBoolean() reactionNotificationFlag: boolean;
  @IsBoolean() commentReactionNotificationFlag: boolean;
  @IsBoolean() replyNotificationFlag: boolean;
  @IsBoolean() commentNotificationFlag: boolean;
}

export class User {
  @IsString() id: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() username: string;
  @IsString() token: string;
  @IsString() gender: string;
  @IsObject() genderRoles: UserGenderRoles;
  @IsString() displayName: string;
  @IsInt() age: number;
  @IsString() profilePicture: string;
  @IsArray() myCommunities: string[];
  @IsBoolean() active: boolean;
  @IsBoolean() hasAgreedToTerms: boolean;
  @IsString() personId: string;
  @IsString() onBoardingState: string;
  @IsArray() localCategories: string[];
  @IsBoolean() optInMinor: boolean;
  @IsObject() attributes?: Attributes;
  @IsObject() createdAt?: Date;
}

export class UserIdModel {
  @IsString() userId: string;
}

export class AdminRoles {
  @IsArray() view: string[];
  @IsArray() edit: string[];
  @IsArray() delete: string[];
}

export class Author {
  @IsString() id: string;
  @IsString() profilePicture: string;
  @IsString() displayName: string;
  @IsString() fullName: string;
  @IsString() firstName: string;
  @IsString() gender: string;
  @IsInt() age: number;
  @IsObject() genderRoles: UserGenderRoles;
  @IsArray() communities: string[];
}

export class AdminUser {
  @IsString() id: string;
  @IsString() username: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() displayName: string;
  @IsString() profileImage: string;
  @IsString() role: string;
  @IsString() displayTitle: string;
}

export class AuthorizedAdminUser extends AdminUser {
  @IsString() password: string;
  @IsString() token: string;
  @IsObject() rolePermissions: AdminRoles;
}

export class Device {
  @IsString() id: string;
  @IsString() deviceToken: string;
  @IsString() endpointArn: string;
  @IsString() locale: string;
  @IsInt() timeZoneOffset: number;
  @IsString() platform: string;
  @IsString() osVersion: string;
  @IsDate() createdTimestamp: Date;
  @IsDate() updatedTimestamp: Date;
  @IsInt() badge: number;
}

export class Installations {
  @IsString() id: string;
  @IsString() userId: string;
  @IsArray() devices: Array<Device>;
}

export class DeleteUserRequest {
  @IsString() username: string;
  @IsString() userId: string;
  @IsString() @IsOptional() env: string;
  @IsDate() @IsOptional() createdDate: Date;
}
export class ExportUserData {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() displayName: string;
  @IsArray() publishedStories: StoryCountData[];
  @IsArray() unpublishedStories: StoryCountData[];
  @IsBoolean() profileImageExists: boolean;
}

export class ExportStoryData {
  @IsString() communityId: string;
  @IsString() id: string;
  @IsBoolean() published: boolean;
}

export class StoryCountData {
  @IsString() communityId: string;
  @IsString() communityTitle: string;
  @IsNumber() numberOfStories: number;
}

export class UserCleanUp {
  @IsBoolean() approved: boolean;
  @IsString() userId: string;
}
