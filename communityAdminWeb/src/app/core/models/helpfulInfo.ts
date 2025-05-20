export interface Base {
  title: string;
  description: string;
}

export interface ReferenceData extends Base {
  link: string;
  type: string;
  hasChildren: boolean;
}

export interface SubSectionData extends Base {
  type: string;
  helpfulInfoId: string;
  content: ReferenceData[];
}

export class Content implements Base {
  id?: string;
  communityId!: string;
  description!: string;
  title!: string;
  type!: string;
  contentId!: string;
  link!: string;
  video!: string;
  thumbnail!: string;
  backgroundColor?: string;
  types?: Content[];
  helpfulInfoId?: string;
  copyright?: string;
  imgUrl?: string;
  brandLogo?: string;
  brand?: string;
  isGridView?: boolean;
  provider?: string;
  commonSection?: boolean;
  isPartnerArticle?: boolean;

  constructor() {}
}

export interface Section {
  title: string;
  description: string;
  backgroundColor?: string;
  isGridView?: boolean;
  isPartner?: boolean;
  type?: string;
  content: Content[];
  sectionId?: string;
}

export interface Library {
  helpfulInfoId: string | null;
  headerTitle: string;
  headerDescription: string;
  title: string;
  description: string;
  communityId?: string;
  subDescription?: string;
  sections: Section[];
  brandLogo?: string;
}

export interface SectionData {
  en: Library;
  es: Library;
}

export interface ContentData {
  en: Content;
  es: Content;
}

export interface ArticleRequest {
  articleId: string;
  provider: string;
}

export interface ArticleResponse {
  isEdit?: boolean;
  id?: string;
  provider?: string;
  isGrid?: boolean;
  en: Content;
  es: Content;
}

export interface ExternalReferenceResponse {
  isEdit?: boolean;
  id?: string;
  en: Content;
  es: Content;
}

export interface LoadSectionData {
  sectionIndex: number;
  subSectionIndex?: number;
  subSectionId?: string;
  communityId: string;
  en: Section;
  es: Section;
}

export interface SectionContentArray {
  en: Content[];
  es: Content[];
}

export interface EditContentRequest {
  sectionId: string;
  helpfulInfoId: string;
  content: ContentData;
}

export interface SectionDetails {
  en: Base;
  es: Base;
  isEdit?: boolean;
}

export interface ExternalLinkData {
  sectionId: string;
  helpfulInfoId: string;
  contentIndex: number;
}

export interface UpdateSectionRequest {
  helpfulInfoId: string;
  en: Section[];
  es: Section[];
}

export interface LibrarySectionRequest {
  en: Section;
  es: Section;
  sectionId: string;
  communityId: string;
}

export interface NewLibrary {
  helpfulInfoId: string;
  data: SectionData;
}

export interface UpdateSectionDetails {
  helpfulInfoId: string;
  en: Base;
  es: Base;
}

export interface UpdateArticleRequest {
  helpfulInfoId: string;
  sectionId: string;
  content: ContentData;
}
