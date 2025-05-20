import { IsArray, IsDate, IsObject, IsString } from 'class-validator';
import { Prompt } from './promptModel';

export class ContentModel {
  @IsString() id: string;
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsArray() data: [];
  @IsDate() updateAt: Date;
  @IsDate() createdAt: Date;
}

export class CommunityPromptModel {
  @IsString() communityId: string;
  @IsArray() prompts: Prompt[];
}

export class WordList {
  @IsArray() badWords: string[];
  @IsArray() sensitiveWords: string[];
  @IsArray() exceptionMsgWords: string[];
}

export class WordListModel {
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsObject() data: WordList;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() createdBy: string;
  @IsString() updatedBy: string;
}
