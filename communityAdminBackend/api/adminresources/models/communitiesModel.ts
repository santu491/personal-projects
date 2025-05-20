import { communityType } from '@anthem/communityadminapi/common';
import { IsBoolean, IsDate, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class Title {
  @IsString() en: string;
  @IsString() es: string;
}

export class Community {
  @IsString() @IsOptional() id: string;
  @IsString() title: string;
  @IsObject() displayName: Title;
  @IsString() category: string;
  @IsBoolean() isNew: boolean;
  @IsBoolean() active: boolean;
  @IsString() @IsOptional() image: string;
  @IsString() @IsIn(communityType) type: string;
  @IsString() @IsOptional() categoryId: string;
  @IsString() @IsOptional() parent: string;
  @IsDate() @IsOptional() updatedDate: Date;
  @IsString() @IsOptional() updatedBy: string;
  @IsDate() @IsOptional() createdDate: Date;
  @IsString() @IsOptional() createdBy: string;
  @IsString() @IsOptional() color: string;
}
export class CommunityModel {
  @IsString() title: string;
  @IsObject() displayName: Title;
  @IsString() category: string;
  @IsBoolean() isNew: boolean;
  @IsBoolean() active: boolean;
  @IsString() @IsOptional() image: string;
  @IsString() @IsOptional() id: string;
  @IsString() @IsOptional() color: string;
  @IsDate() @IsOptional() updatedDate: Date;
  @IsString() @IsOptional() updatedBy: string;
  @IsString() @IsIn(communityType) type: string;
}

export class CommunityImage {
  @IsString() communityId: string;
  @IsString() imageBase64: string;
}
