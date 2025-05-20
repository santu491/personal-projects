import { reactions, reactionsType } from '@anthem/communityapi/common';
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
import { ObjectId } from 'mongodb';
import { CommentModel } from './postsModel';
import { Reaction } from './reactionModel';
import { Author } from './userModel';

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
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsDate() publishedAt: Date;
  @IsBoolean() published: boolean;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsBoolean() hasStoryBeenPublishedOnce: boolean;
  @IsObject() reaction: Reaction;
  @IsBoolean() allowComments: boolean;
  @IsArray() comments: CommentModel[];
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
  @IsOptional() @IsString() optionType: string;
}

export class StoryResponse extends Story {
  @IsObject() author: Author;
  @IsString() communityName: string;
  @IsInt() commentCount: number;
}

export class PromptAnswerModel {
  @IsString() storyId: string;
  @IsString() promptId: string;
  @IsString() currentUserId: string;
  @IsString() answer: string;
  @IsOptional() isPromptAnswerProfane: boolean;
  @IsOptional() languageData: string;
}

export class StoryModel {
  @IsOptional() id: string;
  @IsString() authorId: string;
  @IsInt() authorAgeWhenStoryBegan: number;
  @IsString() relation: string;
  @IsString() displayName: string;
  @IsInt() relationAgeWhenDiagnosed: number;
  @IsString() featuredQuote: string;
  @IsString() storyText: string;
  @IsString() communityId: string;
  @IsOptional() isFeatureQuoteProfane: boolean;
  @IsOptional() isStoryTextProfane: boolean;
  @IsArray() answers: StoryAnswers[];
  @IsOptional() @IsBoolean() allowComments: boolean;
}

export class StoryAnswers {
  @IsOptional() id: string;
  @IsString() promptId: string;
  @IsString() question: string;
  @IsOptional() sensitiveContentText: string;
  @IsString() response: string;
  @IsOptional() order: number;
  @IsOptional() type: string;
  @IsOptional() createdDate: Date;
  @IsOptional() isResponseProfane: boolean;
  @IsOptional() @IsString() optionType: string;
}

export class BooleanResponse {
  @IsBoolean() operation: boolean;
}

export class AuthorObject {
  @IsString() @IsOptional() role: string;
  @IsString() @IsOptional() firstName: string;
  @IsString() @IsOptional() lastName: string;
  @IsString() @IsOptional() displayName: string;
  @IsString() @IsOptional() displayTitle: string;
  @IsString() @IsOptional() profileImage: string;
}

export class StoryCommentAuthor extends AuthorObject {
  @IsObject() id: ObjectId;
}

export class StoryCommentRequest {
  @IsOptional() @IsString() id: string;
  @IsString() storyId: string;
  @IsString() comment: string;
  @IsBoolean() @IsOptional() isCommentTextProfane: boolean;
}

export class StoryReplyRequest {
  @IsOptional() @IsString() id: string;
  @IsString() storyId: string;
  @IsString() commentId: string;
  @IsString() comment: string;
  @IsBoolean() @IsOptional() isCommentTextProfane: boolean;
}

export class ReplyModel extends StoryReplyRequest {
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsObject() reactions: Reaction;
}

export class StoryCommentModel extends StoryCommentRequest {
  @IsObject() author: StoryCommentAuthor;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsObject() reactions: Reaction;
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsOptional() @IsArray() replies: StoryCommentModel[];
  @IsOptional() @IsBoolean() isCommentTextProfane: boolean;
  @IsOptional() @IsArray() flaggedUserLog: StoryFlaggedUserLog[];
}
export class StoryReactionRequest {
  @IsString() storyId: string;
  @IsIn(reactions) reaction: string;
  @IsIn(reactionsType) type: string;
  @IsString() @IsOptional() commentId: string;
  @IsString() @IsOptional() replyId: string;
  @IsString() @IsOptional() language: string;
}

export class StoryFlaggedUserLog {
  @IsString() userId: string;
  @IsDate() createdDate: Date;
}

export class DeleteStoryCommentRequest {
  @IsString() storyId: string;
  @IsString() commentId: string;
  @IsString() @IsOptional() replyId: string;
}
