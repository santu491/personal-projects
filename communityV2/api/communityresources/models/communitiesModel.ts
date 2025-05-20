import { IsArray, IsDate, IsObject, IsOptional, IsString } from 'class-validator';
import { Library } from './libraryModel';
import { PromptModel } from './promptModel';

export class DisplayName{
  @IsString() en: string;
  @IsString() es: string;
}

export class Community {
  @IsString() id: string;
  @IsDate() createdAt: Date;
  @IsString() createdBy: string;
  @IsDate() updatedAt: Date;
  @IsString() updatedBy: string;
  @IsString() title: string;
  @IsString() category: string;
  @IsString() categoryId: string;
  @IsString() type: string;
  @IsString() image: string;
  @IsString() parent: string;
  @IsObject() displayName: DisplayName;
}

export class CommunityCategory {
  @IsString() category: string;
  @IsString() categoryId: string;
  @IsString() parent: string;
  @IsArray() communities: Community[];
}

export class CommunityModel {
  @IsString() createdBy: string;
  @IsString() title: string;
  @IsString() category: string;
  @IsOptional() @IsString() categoryId: string | null;
  @IsString() type: string;
}

export class CommunitiesCreationModel{
  @IsString() createdBy: string;
  @IsString() title: string;
  @IsString() category: string;
  @IsString() categoryId: string;
  @IsString() type: string;
  @IsArray() prompts: PromptModel[];
  @IsArray() libraries: Library[];
  @IsObject() communityLibrary: Library;
}
