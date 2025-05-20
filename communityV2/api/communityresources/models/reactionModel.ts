import { IsArray, IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ReactionLog {
  @IsString() userId: string;
  @IsString() reaction: string;
  @IsDate() createdDate: Date;
  @IsDate() updatedDate: Date;
}

export class UserReaction {
  @IsString() entityId: string;
  @IsString() userId: string;
  @IsString() @IsOptional() type: string;
  @IsString() reaction: string;
}

export class ReactionFilter {
  @IsString() entityId: string;
  @IsString() userId: string;
}

export class ReactionCount {
  @IsNumber() like: number;
  @IsNumber() care: number;
  @IsNumber() celebrate: number;
  @IsNumber() good_idea: number;
  @IsNumber() total: number;
}

export class Reaction {
  @IsObject() count: ReactionCount;
  @IsArray() log: ReactionLog[];
}
