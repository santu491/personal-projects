import { storyType } from '@anthem/communityadminapi/common';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';
import { CommentDeeplink, Reaction } from './commonModel';
import { CommentModel } from './postsModel';
import { Question } from './questionModel';
import { Author } from './userModel';

export class StoryCommentRequest {
  @IsOptional() @IsString() id: string;
  @IsString() storyId: string;
  @IsString() comment: string;
  @IsString() authorId: string;
  @IsBoolean() @IsOptional() isProfane: boolean;
  @IsOptional() @IsObject() deeplink?: CommentDeeplink;
}

export class StoryReplyRequest {
  @IsOptional() @IsString() id: string;
  @IsString() storyId: string;
  @IsString() commentId: string;
  @IsString() comment: string;
  @IsString() authorId: string;
  @IsBoolean() @IsOptional() isProfane: boolean;
  @IsOptional() @IsObject() deeplink?: CommentDeeplink;
}
export class ReplyModel extends StoryReplyRequest {
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsObject() author: Author;
  @IsObject() reactions: Reaction;
}
export class StoryCommentModel extends StoryCommentRequest {
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsArray() replies: ReplyModel[];
  @IsObject() reactions: Reaction;
  @IsObject() author: Author;
}

export class Story {
  @IsString() id: string;
  @IsString() communityId: string;
  @IsString() authorId: string;
  @IsInt() authorAgeWhenStoryBegan: number;
  @IsString() relation: string;
  @IsString() displayName: string;
  @IsInt() relationAgeWhenDiagnosed: number;
  @IsString() featuredQuote: string;
  @IsArray() answer: Answer[];
  @IsString() storyText: string;
  @IsDate() createdDate: Date;
  @IsDate() updatedDate: Date;
  @IsBoolean() published: boolean;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsBoolean() hasStoryBeenPublishedOnce: boolean;
  @IsArray() comments: CommentModel[];
  @IsOptional() @IsString() communityName: string;
}

export class Answer {
  @IsString() id: string;
  @IsString() promptId: string;
  @IsString() question: string;
  @IsString() questionAuthorId: string;
  @IsString() questionAuthorFirstName: string;
  @IsString() questionAuthorDisplayName: string;
  @IsString() questionAuthorProfilePicture: string;
  @IsString() sensitiveContentText: string;
  @IsString() response: string;
  @IsInt() order: number;
  @IsDate() createdDate: Date;
  @IsDate() updatedDate: Date;
  @IsString() type: string;
}

export class StoryResponse extends Story {
  @IsObject() author: Author;
  @IsString() communityName: string;
  @IsArray() questionsAskedByCurrentUser: Question[];
  @IsArray() @IsOptional() commentAuthors: [];
  @IsArray() @IsOptional() replyAuthors: [];
}
export class DeleteCommentRequest {
  @IsString() storyId: string;
  @IsString() commentId: string;
  @IsString() @IsOptional() replyId: string;
}
export class BooleanResponse {
  @IsBoolean() operation: boolean;
}
export class ViewStoryRequest {
  @IsArray() communities: string[];
  @IsString() @IsIn(storyType) type: string;
}

export class ReportComment {
  @IsString() id: string;
  @IsString() commentId: string;
  @IsBoolean() flagged: boolean;
  @IsOptional() @IsString() replyId: string;
}
