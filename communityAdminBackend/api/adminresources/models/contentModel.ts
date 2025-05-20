import { IsArray, IsBoolean, IsDate, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { DeepLink } from './commonModel';

export class ContentModel {
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsObject() data: {};
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() createdBy: string;
  @IsString() updatedBy: string;
}

export class ContentData {
  @IsOptional() @IsString() communityId: string;
  @IsOptional() @IsString() contentId: string;
  @IsOptional() @IsString() title: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsString() type: string;
  @IsOptional() @IsString() link: string;
}

export class Sections {
  @IsOptional() @IsString() title: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsString() type: string;
  @IsArray() content: object[];
}

export class ContentHelpfulInfo {
  @IsOptional() @IsString() helpfulInfoId: string;
  @IsOptional() @IsString() headerTitle: string;
  @IsOptional() @IsString() headerDescription: string;
  @IsOptional() @IsString() communityId: string;
  @IsOptional() @IsString() title: string;
  @IsOptional() @IsString() description: string;
  @IsArray() sections: Sections[];
}

export class WordList {
  @IsArray() badWords: string[];
  @IsArray() sensitiveWords: string[];
  @IsArray() exceptionMsgWords: string[];
}

export class WorlListModel {
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsObject() data: WordList;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() createdBy: string;
  @IsString() updatedBy: string;
}

export class ValidationModel {
  @IsOptional() @IsBoolean() isBadWord: boolean;
  @IsOptional() @IsBoolean() isKeyword: boolean;
  @IsOptional() @IsArray() errorFields: string[];
}

export class CommunitySection {
  @IsString() communityId: string;
  @IsString() communityName: string;
  @IsBoolean() active: boolean;
  @IsString() description?: string;
  @IsArray() options: DeepLink[];
}

export class DeepLinkModel {
  @IsString() title; string;
  @IsString() contentKey: string;
  @IsString() description: string;
  @IsArray() sections: CommunitySection[];
  @IsString() _id: string;
}

export class DeepLinkData {
  @IsArray() deepLinkModule: DeepLinkModel[];
}

export class DeepLinkContent {
  @IsString() id: string;
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsObject() data: DeepLinkData;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() createdBy: string;
  @IsString() updatedBy: string;
}

export class Link {
  @IsString() title: string;
  @IsUrl() url: string;
}

export class TrainingLinkRequest {
  @IsString() sectionTitle: string;
  @IsOptional() @IsString() sectionId: string;
  @IsOptional() @IsArray() link: Link[];
}
