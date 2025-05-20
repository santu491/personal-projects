import { reactions, reactionsType } from '@anthem/communityapi/common';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { DeepLink } from './pushNotificationModel';
import { Reaction } from './reactionModel';

export class OptionResult {
  @IsNumber() voteCount: number;
  @IsNumber() percentage: number;
  @IsBoolean() userResponse: boolean;
}

export class Options {
  @IsString() id: string;
  @IsString() text: string;
  @IsObject() @IsOptional() result?: OptionResult;
}
export class Poll {
  @IsString() question: string;
  @IsNumber() endsOn: number;
  @IsString() endsOnDate?: string;
  @IsArray() options: Options[];
}
export class Language {
  @IsString() title: string;
  @IsString() body: string;
  @IsOptional() @IsString() deepLink: DeepLink;
  @IsOptional() @IsString() poll: Poll;
}

export class LinkData {
  @IsString() url: string;
  @IsString() title: string;
  @IsString() description: string;
}

export class Link {
  @IsObject() @Type(() => LinkData) en: LinkData;
  @IsObject() @Type(() => LinkData) es: LinkData;
  @IsBoolean() isImageUploaded: boolean;
  @IsOptional() @IsString() imageLink: string | undefined;
  @IsOptional() @IsString() imageBase64: string | undefined;
}

export class Content {
  @IsOptional() @Type(() => Language) en: Language;
  @IsOptional() @Type(() => Language) es: Language;
  @IsOptional() @IsString() image: string;
  @IsOptional() @Type(() => Link) link: Link;
}

export class PostRequest {
  @IsOptional() @IsString() id: string;
  @IsArray() communities: string[];
  @IsString() authorId: string;
  @IsString() authorRole: string;
  @Type(() => Content) content: Content;
  @IsBoolean() published: boolean;
  @IsBoolean() isNotify: boolean;
}

export class Author {
  @IsString() @IsOptional() role: string;
  @IsString() @IsOptional() firstName: string;
  @IsString() @IsOptional() lastName: string;
  @IsString() @IsOptional() displayName: string;
  @IsString() @IsOptional() displayTitle: string;
  @IsString() @IsOptional() profileImage: string;
}

export class PostAuthor extends Author {
  @IsString() id: string;
}

export class CommentAuthor extends Author {
  @IsObject() id: ObjectId;
}
export class Post extends PostRequest{
  @IsOptional() @IsDate() createdDate: Date;
  @IsOptional() @IsDate() updatedDate: Date;
  @IsOptional() @IsDate() publishedAt: Date;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsBoolean() hasContentBeenPublishedOnce: boolean;
  @IsArray() comments: CommentModel[];
  @IsInt() commentCount: number;
  @IsObject() reactions: Reaction;
  @IsObject() author: PostAuthor;
}
export class CommentRequest {
  @IsOptional() @IsString() id: string;
  @IsString() postId: string;
  @IsString() comment: string;
  @IsBoolean() @IsOptional() isCommentTextProfane: boolean;
}

export class ReplyRequest {
  @IsOptional() @IsString() id: string;
  @IsString() postId: string;
  @IsString() commentId: string;
  @IsString() comment: string;
  @IsBoolean() @IsOptional() isCommentTextProfane: boolean;
}

export class ReplyModel extends ReplyRequest{
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsObject() reactions: Reaction;
}

export class CommentModel extends CommentRequest{
  @IsObject() author: CommentAuthor;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsObject() reactions: Reaction;
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsOptional() @IsArray() replies: CommentModel[];
  @IsOptional() @IsBoolean() isCommentTextProfane: boolean;
  @IsOptional() @IsArray() flaggedUserLog: FlaggedUserLog[];
  @IsOptional() @IsString() removedBy: string;
}
export class ReactionRequest {
  @IsString() postId: string;
  @IsIn(reactions) reaction: string;
  @IsIn(reactionsType) type: string;
  @IsString() @IsOptional() commentId: string;
  @IsString() @IsOptional() replyId: string;
  @IsString() @IsOptional() language: string;
}

export class ActivityAuthor {
  @IsString() id: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() displayName: string;
  @IsString() profilePicture: string;
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
  @IsIn(reactionsType) entityType: string;
}
export class AdminActivity {
  @IsString() id: string;
  @IsString() userId: string;
  @IsArray() list: AdminActivityList[];
}

export class DeleteCommentRequest {
  @IsString() postId: string;
  @IsString() commentId: string;
  @IsString() @IsOptional() replyId: string;
}

export class FlaggedUserLog {
  @IsString() userId: string;
  @IsDate() createdDate: Date;
}
