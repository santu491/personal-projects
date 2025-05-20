import { reactionType } from './reactions';

export interface DeepLink {
  url: string;
  label: string;
}

export interface PollOption {
  id: string;
  text: string;
  result?: any;
}

export interface Poll {
  question: string;
  endsOn: number;
  options: PollOption[];
}

export interface PollData {
  en: Poll;
  es: Poll;
  isEdit?: boolean;
  isEditAllowed?: boolean;
}

export interface NewPost {
  isProfane?: boolean;
  communities: Array<string>;
  content: {
    en: {
      title: string;
      body: string;
      deepLink: DeepLink;
      poll?: Poll;
    };
    es: {
      title: string;
      body: string;
      deepLink: DeepLink;
      poll?: Poll;
    };
    image?: string;
    link?: LinkEvent;
    pnDetails?: {
      title: string;
      body: string;
    };
  };
  published: boolean;
  isNotify: boolean;
  author?: {
    id: string;
  };
  isLinkAdded?: boolean;
  publishOn?: Date;
}

export interface ExistingPosts {
  communities: Array<{
    displayName: {
      en: string;
      es: string;
    };
    id: string;
  }>;
  content: {
    en: {
      title: string;
      body: string;
      deepLink: DeepLink;
    };
    es: {
      title: string;
      body: string;
      deepLink: DeepLink;
    };
    image?: string;
    link?: LinkEvent;
    pnDetails?: {
      title: string;
      body: string;
    };
  };
  createdDate: string;
  updatedDate: string;
  published: boolean;
  isNotify: boolean;
  hasContentBeenPublishedOnce: boolean;
  flagged: boolean;
  removed: boolean;
  author: {
    firstName: string;
    lastName: string;
    displayName: string;
    role: string;
    id: string;
    profileImage: string;
    displayTitle: string;
  };
  reactions: {
    log: Array<{
      userId: string;
      reaction: reactionType;
      createdDate: string;
      updatedDate: string;
    }>;
    count: {
      like: number;
      care: number;
      celebrate: number;
      good_idea: number;
      total: number;
    };
  };
  comments: Array<{
    _id: string;
    authorId: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
    flagged: boolean;
    removed: boolean;
    replies: Array<{
      _id: string;
      authorId: string;
      comment: string;
      createdAt: string;
      updatedAt: string;
      flagged: boolean;
      removed: boolean;
    }>;
  }>;
  editedAfterPublish: boolean;
  id: string;
  commentCount?: number;
}

export interface PersonaDetailsResponse {
  data: {
    isException: boolean;
    isSuccess: boolean;
    value: PersonaDetails[];
  };
}
export interface PersonaDetails {
  aboutMe: string;
  active: boolean;
  communities: string[];
  createdAt: string;
  displayName: string;
  displayTitle: string;
  firstName: string;
  id: string;
  interests: string;
  isPersona: boolean;
  lastName: string;
  location: string;
  profileImage: string;
  role: string;
  updatedAt: string;
  username: string;
}

export interface LinkPreview {
  url: string;
  images: string[];
  title: string;
  description: string;
  videos: string[];
}

export interface LinkPreviewResponse {
  data: {
    isSuccess: boolean;
    isException: boolean;
    value?: LinkPreview;
    errors?: any;
  };
}

export interface LinkData {
  url: string;
  title: string;
  description: string;
}

export interface ImageLinkData {
  isImageUploaded: boolean;
  imageLink?: string;
  imageBase64?: string;
}

export interface LinkEvent {
  en: LinkData;
  es: LinkData;
  isImageUploaded: boolean;
  imageLink?: string;
  imageBase64?: string;
}
