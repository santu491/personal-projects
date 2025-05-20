export interface DeepLinks {
  contentType: string;
  language: string;
  version: string;
  deepLink: Array<{
    label: string;
    deepLink?: string;
    items?: Array<{
      communityId?: string;
      label: string;
      deepLink?: string;
      items?: Array<DeepLinkItem>;
    }>;
  }>;
  updatedAt: string;
  createdAt: string;
  id: string;
}

export interface DeepLinkItem {
  label: string;
  deepLink?: string;
}

export interface Library {
  headerTitle: string;
  headerDescription: string;
  communityId: string;
  title: string;
  description: string;
  isCommon?: boolean;
  sections: Array<{
    title: string;
    description: string;
    type?: string;
    content: Array<{
      _id: string;
      communityId: string;
      contentId: string;
      title: string;
      description: string;
      type: string;
      link: string;
      video: string;
      thumbnail: string;
    }>;
    backgroundColor?: string;
  }>;
  __v: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface DeepLinkData {
  en: string;
  es?: string;
  spanishRequired: boolean;
}

export interface CommentDeepLink {
  label?: {
    en?: string;
    es: string;
  };
  url?: string;
  copyright?: string;
  iconType?: string;
}
