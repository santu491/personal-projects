import { reactions } from '@anthem/communityadminapi/common';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsIn, IsNumber, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { CommentDeeplink, DeepLink, Reaction } from './commonModel';

export class ReactionRequest {
  @IsIn(reactions) reaction: string;
  @IsString() id: string;
  @IsString() authorId?: string;
  @IsString() @IsOptional() commentId: string;
  @IsString() @IsOptional() replyId: string;
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

export class OptionResult {
  @IsNumber() voteCount: number;
  @IsNumber() percentage: number;
}

export class PollOption {
  @IsString() id: string;
  @IsString() text: string;
  @IsObject() @IsOptional() result?: OptionResult;
}
export class Poll {
  @IsString() question: string;
  @IsNumber() endsOn: number;
  @IsObject() options: PollOption[];
}

export class Language {
  @IsString() title: string;
  @IsString() body: string;
  @IsOptional() @IsObject() deepLink: DeepLink | null;
  @IsOptional() @IsObject() poll: Poll | null;
}

export class PushNotificationDetails {
  @IsString() title: string;
  @IsString() body: string;
}
export class Content {
  @IsOptional() @Type(() => Language) en: Language;
  @IsOptional() @Type(() => Language) es: Language;
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() pnDetails: PushNotificationDetails;
  @IsOptional() @Type(() => Link) link: Link;
}
export class Author {
  @IsString() id: string;
  @IsString() @IsOptional() role: string;
  @IsString() @IsOptional() firstName: string;
  @IsString() @IsOptional() lastName: string;
  @IsString() @IsOptional() displayName: string;
  @IsString() @IsOptional() displayTitle: string;
  @IsString() @IsOptional() profileImage: string;
}
export class PostRequest {
  @IsOptional() @IsString() id: string;
  @IsArray() communities: string[];
  @Type(() => Content) content: Content;
  @IsBoolean() published: boolean;
  @IsString() @IsOptional() publishOn: string;
  @IsBoolean() isNotify: boolean;
  @IsObject() @IsOptional() author: Author;
  @IsBoolean() @IsOptional() isProfane: boolean;
}
export class BooleanResponse {
  @IsBoolean() operation: boolean;
}
export class CommentRequest {
  @IsOptional() @IsString() id: string;
  @IsString() postId: string;
  @IsString() comment: string;
  @IsBoolean() @IsOptional() isProfane: boolean;
  @IsObject() @IsOptional() deeplink?: CommentDeeplink;
}
export class ReplyRequest {
  @IsOptional() @IsString() id: string;
  @IsString() postId: string;
  @IsString() commentId: string;
  @IsString() comment: string;
  @IsBoolean() @IsOptional() isProfane: boolean;
  @IsObject() @IsOptional() deeplink?: CommentDeeplink;
}
export class ReplyModel extends ReplyRequest{
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsString() @IsOptional() removedBy: string;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsObject() author: Author;
  @IsObject() reactions: Reaction;
}
export class CommentModel extends CommentRequest{
  @IsOptional() @IsDate() createdAt: Date;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsString() @IsOptional() removedBy: string;
  @IsOptional() @IsString() createdBy: string;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsArray() replies: ReplyModel[];
  @IsObject() reactions: Reaction;
  @IsObject() author: Author;
}
export class Post extends PostRequest {
  @IsOptional() @IsDate() createdDate: Date;
  @IsOptional() @IsDate() updatedDate: Date;
  @IsBoolean() flagged: boolean;
  @IsBoolean() removed: boolean;
  @IsBoolean() editedAfterPublish: boolean;
  @IsBoolean() hasContentBeenPublishedOnce: boolean;
  @IsArray() comments: CommentModel[];
  @IsObject() reactions: Reaction;
  @IsOptional() @IsDate() publishedAt: Date;
  @IsOptional() @IsString() createdBy: string;
  @IsOptional() @IsString() updatedBy: string;
  @IsOptional() @IsString() status: string;
  @IsOptional() @IsNumber() numberOfVotes?: number;
  @IsOptional() @IsNumber() numberOfVoteEdit?: number;
}
export class ReportComment {
  @IsString() postId: string;
  @IsString() commentId: string;
  @IsBoolean() flagged: boolean;
}
export class ReportReply {
  @IsString() postId: string;
  @IsString() commentId: string;
  @IsString() replyId: string;
  @IsOptional() @IsBoolean() flagged: boolean;
}

export class PostImage {
  @IsString() postId: string;
  @IsString() postImageBase64: string;
  @IsBoolean() isLinkImage?: boolean;
}

export class LinkRequest {
  @IsUrl() url: string;
}

export class PostActivityArgs {
  @IsString() userId: string;
  @IsString() postId: string;
  @IsString() adminId: string;
  @IsString() @IsOptional() commentId: string;
  @IsString() @IsOptional() replyId: string;
}
