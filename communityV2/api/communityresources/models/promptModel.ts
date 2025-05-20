import { IsDate, IsOptional, IsString } from 'class-validator';

export class Prompt {
  @IsString() id: string;
  @IsString() communityId: string;
  @IsString() question: string;
  @IsString() sectionTitle: string;
  @IsString() helpText: string;
  @IsString() sensitiveContentText: string;
  @IsDate() createdDate: Date;
  @IsOptional() promptId: string;
  @IsOptional() options: Option[];
  @IsOptional() otherCancer: boolean;
}

export class PromptModel {
  @IsString() id: string;
  @IsString() communityId: string;
  @IsString() question: string;
  @IsString() sectionTitle: string;
  @IsString() helpText: string;
  @IsString() sensitiveContentText: string;
}

class Option {
  @IsOptional() @IsString() id: string;
  @IsString() title: string;
  @IsOptional() @IsString() type: string;
}
