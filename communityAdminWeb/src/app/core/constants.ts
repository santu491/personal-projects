import { env } from 'src/environments/environment';
import { api, communityApis, communityPublicApi, publicApi } from './apiUtils';
import { MonitoringElement } from './models/dashboard';

// Community V2 Environments EndPoints
export const v2Env = {
  dev: 'https://dev.api.sydney-community.com',
  dev1: 'https://dev1.api.sydney-community.com',
  dev2: 'https://dev2.api.sydney-community.com',
  sit: 'https://sit1.api.sydney-community.com',
  sit1: 'https://sit1.api.sydney-community.com',
  sit2: 'https://sit2.api.sydney-community.com',
  uat: 'https://uat1.api.sydney-community.com',
  uat1: 'https://uat1.api.sydney-community.com',
  uat2: 'https://uat2.api.sydney-community.com',
  perf: 'https://perf.api.sydney-community.com',
  prod_internal: 'https://prod.api.sydney-community.com',
  prod: 'https://api.sydney-community.com',
  dr: 'https://dr.api.sydney-community.com'
};

export const communityData: MonitoringElement[] = [
  {
    position: 1,
    name: 'CommunitiesV2 - DEV1',
    envGrp: 'DEV',
    appGrp: 'API',
    env: 'dev1',
    url: v2Env['dev1'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 2,
    name: 'CommunitiesV2 - DEV2',
    envGrp: 'DEV',
    appGrp: 'API',
    env: 'dev2',
    url: v2Env['dev2'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 3,
    name: 'ADMIN API - DEV',
    envGrp: 'DEV',
    appGrp: 'ADMIN',
    env: 'dev',
    url: env['dev'] + publicApi + api.version,
    version: '-',
    status: false
  },
  {
    position: 4,
    name: 'Community Scheduler - DEV',
    envGrp: 'DEV',
    appGrp: 'SCHEDULER',
    env: 'dev',
    url: env['dev'] + api.schedulerVersion,
    version: '-',
    status: false
  },
  {
    position: 5,
    name: 'CommunitiesV2 - SIT1',
    envGrp: 'SIT',
    appGrp: 'API',
    env: 'sit1',
    url: v2Env['sit1'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 6,
    name: 'CommunitiesV2 - SIT2',
    envGrp: 'SIT',
    appGrp: 'API',
    env: 'sit2',
    url: v2Env['sit2'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 7,
    name: 'ADMIN API - SIT',
    envGrp: 'SIT',
    appGrp: 'ADMIN',
    env: 'sit',
    url: env['sit'] + publicApi + api.version,
    version: '-',
    status: false
  },
  {
    position: 8,
    name: 'Community Scheduler - SIT',
    envGrp: 'SIT',
    appGrp: 'SCHEDULER',
    env: 'sit',
    url: env['sit'] + api.schedulerVersion,
    version: '-',
    status: false
  },
  {
    position: 9,
    name: 'CommunitiesV2 - UAT1',
    envGrp: 'UAT',
    appGrp: 'API',
    env: 'uat1',
    url: v2Env['uat1'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 10,
    name: 'CommunitiesV2 - UAT2',
    envGrp: 'UAT',
    appGrp: 'API',
    env: 'uat2',
    url: v2Env['uat2'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 11,
    name: 'ADMIN API - UAT',
    envGrp: 'UAT',
    appGrp: 'API',
    env: 'uat2',
    url: env['uat'] + publicApi + api.version,
    version: '-',
    status: false
  },
  {
    position: 12,
    name: 'Community Scheduler - UAT',
    envGrp: 'UAT',
    appGrp: 'SCHEDULER',
    env: 'uat',
    url: env['uat'] + api.schedulerVersion,
    version: '-',
    status: false
  },
  {
    position: 13,
    name: 'CommunitiesV2 - PERF',
    envGrp: 'PERF',
    appGrp: 'API',
    env: 'perf',
    url: v2Env['perf'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 14,
    name: 'ADMIN API - PERF',
    envGrp: 'PERF',
    appGrp: 'ADMIN',
    env: 'perf',
    url: env['perf'] + publicApi + api.version,
    version: '-',
    status: false
  },
  {
    position: 15,
    name: 'Community Scheduler - PERF',
    envGrp: 'PERF',
    appGrp: 'SCHEDULER',
    env: 'perf',
    url: env['perf'] + api.schedulerVersion,
    version: '-',
    status: false
  },
  {
    position: 16,
    name: 'CommunitiesV2 - PROD INTERNAL',
    envGrp: 'PROD',
    appGrp: 'API',
    env: 'prod_internal',
    url: v2Env['prod_internal'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 17,
    name: 'CommunitiesV2 - PROD',
    envGrp: 'PROD',
    appGrp: 'API',
    env: 'prod',
    url: v2Env['prod'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 18,
    name: 'CommunitiesV2 - DR-PROD',
    envGrp: 'DR',
    appGrp: 'API',
    env: 'dr',
    url: v2Env['dr'] + communityPublicApi + communityApis.version,
    version: '-',
    status: false
  },
  {
    position: 19,
    name: 'ADMIN API - PROD',
    envGrp: 'PROD',
    appGrp: 'ADMIN',
    env: 'prod',
    url: env['prod'] + publicApi + api.version,
    version: '-',
    status: false
  },
  {
    position: 20,
    name: 'Community Scheduler - PROD',
    envGrp: 'PROD',
    appGrp: 'SCHEDULER',
    env: 'prod',
    url: env['prod'] + api.schedulerVersion,
    version: '-',
    status: false
  },
];

export const envGrp = ['ALL', 'DEV', 'SIT', 'UAT', 'PERF', 'PROD', 'DR'];
export const appGrp = ['ALL', 'API', 'ADMIN', 'SCHEDULER'];
export const MAX_IMAGE_UPLOAD_SIZE = 5;

export const generic = {
  somethingWentWrong: 'Oops! Something went wrong.',
  errorMessage: 'Oops! Something went wrong, Please try again.',
  pleaseTryAgain: 'Please try again.',
  processing: 'Processing! Please wait',
  imageSizeErr: `Image size must be less than ${MAX_IMAGE_UPLOAD_SIZE}MB!`,
  selectCommunity: 'Select a Community',
  imageFormat: 'Upload a valid image file.',
  updateSuccess: 'Successful update!'
};

export enum sortType {
  ASC = 'ASC',
  DESC = 'DESC'
}

export const roles = [
  {
    role: 'scadmin',
    name: 'Sydney Community'
  },
  {
    role: 'scadvocate',
    name: 'Community Advocate'
  },
  {
    role: 'sysadmin',
    name: 'System Admin'
  }
];

export const commentContentType = {
  comment: 'comment',
  reply: 'reply'
};

export const statusCodes = {
  477: 477
};
export interface SearchFilter {
  name: string;
  options: string[];
  defaultValue: string;
  displayName: string;
}

export const roleAccess = ['view', 'edit', 'delete'];

export const collections = {
  BINDER: 'Binder',
  COMMUNITY: 'Community',
  LIBRARY: 'Library',
  PROFILEIMAGES: 'ProfileImages',
  PROMPT: 'Prompt',
  QUESTIONS: 'Questions',
  STORY: 'Story',
  USERS: 'Users',
  BLOCKED: 'Blocked',
  ACTIVITY: 'Activity',
  APPVERSION: 'AppVersion',
  SEARCHTERM: 'SearchTerms',
  CONTENT: 'Content',
  REACTIONS: 'Reactions',
  INSTALLATIONS: 'Installations',
  POSTS: 'Posts',
  ADMINUSERS: 'AdminUsers',
  ADMINACTIVITY: 'AdminActivity',
  DEMOUSERS: 'DemoUsers',
  POSTIMAGES: 'PostImages'
};

export type EnvType = 'dev' | 'sit' | 'uat' | 'perf' | 'prod';

export const infoText =
  'Image will be visible in Tell Your Story Page of mobile APP.';

export const commercialMember = {
  title: 'Sydney Health',
  memberCode: 'eMember'
};

export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es'
}

export const messages = {
  addedToPrompts: 'Added to Prompts List',
  deletePrompt: 'Are you sure you want to delete the prompt?',
  editValues: 'Please Edit Value to update',
  fetchArticle: 'Article Fetched',
  contentLossWarning:
    'Are you sure you want to leave? All your progress will be lost.',
  contentNotFound: 'Content Not Found',
  noLibrary: 'No existing Library Content in Community',
  noPrompts: 'No existing prompts in Community',
  promptsCreated: 'Prompts created',
  removedFromPrompts: 'Removed From Prompts List',
  sectionCreated: 'Section Created Successfully',
  promptsPublished: 'Prompts Published',
  sectionDeleteWarning: 'Are you sure you want to delete the section',
  pnTemplatesNotFound: 'There are no Push Notification templates',
  templateUpdate: ' updated successfuly',
  emailTriggered: 'Email has been triggered successfully'
};

export const articleProviders = {
  healthwise: 'healthwise',
  meredith: 'meredith',
  other: 'other'
};

export const contentType = {
  article: 'HWReference',
  bucket: 'HWTopic',
  externalLink: 'HWExternalReference',
  partner: 'HWPartner',
  video: 'HWVideoReference',
  videoTile: 'HWVideo',
  videoLibrary: 'HWBTNVideoList'
};

export enum CharacterLimits {
  articleTitle = 80,
  articleDescription = 160
}

export const libraryType = {
  section: 'section',
  subSection: 'subSection'
};

export const helpfulInfo = {
  communityDescription: {
    en: 'Carefully selected content for you.',
    es: 'Contenidos seleccionados cuidadosamente para usted.'
  },
  communityHeaderTitle: {
    en: 'Library',
    es: 'Biblioteca'
  },
  htmlParameter: '?htmlDescription=true',
  isArticleParameter: '?isArticle=true',
  logo: '/logo',
  messages: {
    confirmDelete:
      'Are you sure you want to delete section / sub section? By choosing OK, entire content will be deleted permanently from SYDCOM mobile app',
    sectionSort: 'Section changes published successfully',
    subSectionError: 'Error creating a sub section'
  },
  partnerPath: '/v2/partner',
  referenceContentPath: '/v2/library/referenceContent/',
  referencePlaceholder: 'Reference Content',
  sectionListType: 'List',
  topicPath: '/v2/library/content/',
  videoArticle: '^(HWVideo|HWVideoReference)$',
  videoIconType: '^(HWVideo|HWVideoReference|HWBTNVideoList)$'
};

export enum ICON_TYPE {
  watch = 'watch',
  read = 'read',
  partner = 'partner'
}

export const partnerText = {
  uploadImage: 'Upload Image'
};

export enum DEEPLINK_LABEL {
  community = 'Community',
  library = 'Helpful Info',
  local = 'Local Services',
  me = 'ME Tab'
}

export enum CANCER_PROMPT_OPTION {
  cancer = 'cancer',
  other = 'otherCancer',
  select = 'select'
}

export enum PARTNER_FILTER {
  all = 'all',
  active = 'active',
  inactive = 'inactive',
  meredith = 'meredith',
  OtherPartner = 'OtherPartner'
}

export enum CONTENT_TYPE {
  library = 'helpfulInfo',
  tou = 'tou',
  trainingLinks = 'trainingLinks'
}

export const partnerTypes = [
  { key: 'meredith', value: 'Meredith' },
  { key: 'OtherPartner', value: 'Other Partner' }
];

export enum MODAL_STATE {
  hide = 'none',
  show = 'block'
}

export const pollStatusMsg = {
  created: 'Poll created successfully',
  initialised: 'Poll not added to the Post',
  updated: 'Poll updated successfully'
}

export enum COMMENT_TYPE {
  NEW_COMMENT = 'newComment',
  EDIT_COMMENT = 'editComment',
  ADD_NEW_REPLY = 'addNewReply',
  EDIT_REPLY = 'editReply'
}

export enum DEEPLINK_ICONS {
  FEEDBACK = 'feedback',
  JOIN_COMMUNITY = 'join',
  PROFILE = 'profile',
  NOTIFICATION = 'notifications',
  LOCAL_SERVICE = 'localServices',
  SHARE = 'share',
  READ = 'read',
  VIDEO = 'watch',
  PARTNER = 'partner'
}
