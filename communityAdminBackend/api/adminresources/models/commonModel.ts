import { IsArray, IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Author, Language, Link, PushNotificationDetails } from './postsModel';

export class ReactionCount {
  @IsNumber() like: number;
  @IsNumber() care: number;
  @IsNumber() celebrate: number;
  @IsNumber() good_idea: number;
  @IsNumber() total: number;
}

export class ReactionLog {
  @IsString() userId: string;
  @IsString() reaction: string;
  @IsDate() createdDate: Date;
  @IsDate() updatedDate: Date;
}
export class Reaction {
  @IsObject() count: ReactionCount;
  @IsArray() log: ReactionLog[];
}

export class DeepLink {
  @IsString() url: string;
  @IsString() label: string;
  @IsOptional() @IsString() copyright?: string;
  @IsOptional() @IsString() iconType?: string;
}

export class SetQuery {
  $set: {
    [x: string]: string | boolean | string[] | Language | Date | Link | Author | PushNotificationDetails;
  };
}

export class FindQuery {
  [x: string]: string | boolean | string[] | number | Language | Date | RegExp[] | FindQuery;
}

export class MultiLanguage {
  @IsString() en: string;
  @IsString() es: string;
}

export class CommentDeeplink {
  @IsString() url: string;
  @IsObject() label: MultiLanguage;
  @IsOptional() @IsString() copyright?: string;
  @IsOptional() @IsString() iconType?: string;
  @IsOptional() @IsString() brandLogo?: string;
}
