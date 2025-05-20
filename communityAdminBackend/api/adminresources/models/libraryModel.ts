import { articleProvider } from '@anthem/communityadminapi/common';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';

export class Content {
  @IsString() @IsOptional() id?: string;
  @IsString() communityId: string;
  @IsString() type: string;
  @IsString() contentId: string;
  @IsString() title: string;
  @IsString() description: string;
  @IsString() link: string;
  @IsString() video: string;
  @IsString() thumbnail: string;
  @IsString() @IsOptional() imgUrl?: string;
  @IsString() @IsOptional() backgroundColor?: string;
  @IsString() @IsOptional() types?: Content[];
  @IsString() @IsOptional() helpfulInfoId?: string;
  @IsString() @IsOptional() copyright?: string;
  @IsString() @IsOptional() brandLogo?: string;
  @IsString() @IsOptional() brand?: string;
  @IsString() @IsOptional() provider?: string;
  @IsBoolean() @IsOptional() isGridView?: boolean;
  @IsBoolean() @IsOptional() isPartnerArticle?: boolean;
  @IsBoolean() @IsOptional() commonSection?: boolean;
}

export class Section {
  @IsString() title: string;
  @IsString() @IsOptional() sectionId: string;
  @IsString() description: string;
  @IsString() @IsOptional() type?: string;
  @IsString() @IsOptional() backgroundColor: string;
  @IsBoolean() @IsOptional() isGridView?: boolean;
  @IsArray() content: Content[];
  @IsArray() @IsOptional() subSection: Section[];
  @IsArray() @IsOptional() communitiesList?: string;
}

export class Library {
  @IsOptional() @IsString() helpfulInfoId: string | null;
  @IsString() headerTitle: string;
  @IsString() headerDescription: string;
  @IsString() title: string;
  @IsString() description: string;
  @IsString() communityId: string;
  @IsString() @IsOptional() subDescription?: string | null;
  @IsArray() sections: Section[];
  @IsOptional() @IsBoolean() isCommon: boolean;
}

export class HtmlReference {
  @IsString() type: string;
  @IsString() content: string;
}

export class LibraryResponse {
  @IsObject() en: Library;
  @IsObject() es: Library;
}

export class SectionRequest {
  @IsObject() section: LibraryResponse;
  @IsArray() subSections: LibraryResponse[];
}

export class ArticleRequest {
  @IsString() articleId: string;
  @IsIn(articleProvider) provider: string;
}

export class ArticleResponse {
  @IsObject() en: Content;
  @IsObject() es: Content;
}

export class HelpfulInfoModule {
  @IsArray() helpfulInfoModule: Library[];
}

export class HelpfulInfo {
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsObject() data: HelpfulInfoModule;
}

export class HelpfulInfoLibRequest {
  @IsArray() en: Section[];
  @IsArray() es: Section[];
  @IsString() helpfulInfoId: string;
}

export class LibrarySectionRequest {
  @IsObject() en: Section;
  @IsObject() es: Section;
  @IsString() sectionId: string;
  @IsString() communityId: string;
}

export class SectionEditRequest {
  @IsNumber() sectionIndex: number;
  @IsNumber() @IsOptional() subSectionIndex: number;
  @IsString() @IsOptional() subSectionId: string;
  @IsString() communityId: string;
  @IsObject() en: Section;
  @IsObject() es: Section;
}

export class EditContentRequest {
  @IsString() sectionId: string;
  @IsString() helpfulInfoId: string;
  @IsObject() content: ArticleResponse;
}

export class LibraryData {
  @IsString() helpfulInfoId: string;
  @IsString() link: string;
  @IsObject() en: Library;
  @IsObject() es: Library;
}

export class BaseDetails {
  @IsString() title: string;
  @IsString() description: string;
}
export class LibraryDetail {
  @IsString() helpfulInfoId: string;
  @IsObject() en: BaseDetails;
  @IsObject() es: BaseDetails;
}
