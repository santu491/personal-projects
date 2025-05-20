import { IsArray, IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class Content{
  @IsString() @IsOptional() id: string;
  @IsString() communityId: string;
  @IsString() type: string;
  @IsString() contentId: string;
  @IsString() title: string;
  @IsString() description: string;
  @IsString() link: string;
  @IsString() video: string;
  @IsString() thumbnail: string;
  @IsString() @IsOptional() backgroundColor: string;
  @IsString() @IsOptional() copyright?: string;
  @IsString() @IsOptional() brandLogo?: string;
  @IsString() @IsOptional() brand?: string;
  @IsString() @IsOptional() imgUrl?: string;
  @IsString() @IsOptional() provider?: string;
  @IsBoolean() @IsOptional() isPartnerArticle?: boolean;
}

export class Section{
  @IsString() title: string;
  @IsString() description: string;
  @IsString() type: string;
  @IsString() @IsOptional() backgroundColor: string;
  @IsArray() content: Content[];
  @IsString() sectionId: string;
}

export class PartnerResponseSection {
  @IsString() title: string;
  @IsString() description: string;
  @IsString() type: string;
  @IsString() @IsOptional() backgroundColor: string;
  @IsArray() content: Content[];
  @IsString() sectionId: string;
  @IsString() @IsOptional() brandLogo?: string;

  constructor(title: string, description: string, logo: string) {
    this.title = title;
    this.description = description;
    this.brandLogo = logo;
  }
}

export class Library {
  @IsOptional() id: string | null;
  @IsString() headerTitle: string;
  @IsString() headerDescription: string;
  @IsString() title: string;
  @IsString() description: string;
  @IsString() communityId: string;
  @IsOptional() subDescription: string | null;
  @IsArray() sections: Section[] | PartnerResponseSection[];
  @IsOptional() helpfulInfoId: string;
  @IsString() @IsOptional() brandLogo?: string;

  constructor(title: string, description: string) {
    this.title = this.headerTitle = title;
    this.description = this.headerDescription = description;
    this.sections = [];
  }
}

export class ReferenceTopic{
  @IsString() title: string;
  @IsString() subTitle: string;
  @IsArray() html: HtmlReference[];
  @IsString() htmlToRender: string;
  @IsString() @IsOptional() copyright!: string;
  @IsString() @IsOptional() brandLogo!: string;
  @IsString() @IsOptional() brand!: string;
  @IsBoolean() @IsOptional() isPartnerArticle!: boolean;
  @IsString() @IsOptional() thumbnail!: string;
  @IsString() @IsOptional() provider!: string;
}

export class HtmlReference{
  @IsString() type: string;
  @IsString() content: string;
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
