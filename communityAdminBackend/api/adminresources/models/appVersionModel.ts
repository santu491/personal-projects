import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

export class Content {
  @IsString() @IsOptional() public: string;
  @IsString() @IsOptional() generic: string;
  @IsString() @IsOptional() helpfulInfo: string;
  @IsString() @IsOptional() prompts: string;
  @IsString() @IsOptional() pushNotification: string;
}

export class AppVersionModel {
  @IsString() @IsOptional() id: string;
  @IsString() @IsOptional() ios: string;
  @IsString() @IsOptional() android: string;
  @IsString() @IsOptional() tou: string;
  @IsString() @IsOptional() createdAt: Date;
  @IsString() @IsOptional() updatedAt: Date;
  @IsString() @IsOptional() createdBy: string;
  @IsString() @IsOptional() updatedBy: string;
  @IsBoolean() @IsOptional() imageFilter: boolean;
  @ValidateNested({ each: true })
  @Type(() => Content)
  @IsOptional() content: Content;
}
