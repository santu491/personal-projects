export enum ProfileData {
  'CONTACT' = 'Contact',
  'DEL_ACCOUNT' = 'DeleteAccount',
  'EMPLOYMENT' = 'Employment',
  'NOTIFICATIONS' = 'Notifications',
  'PASSWORD' = 'Password',
  'PERSONAL_INFO' = 'PesonalInfo',
}

export enum NavigationType {
  NATIVE = 'native',
  TAB = 'tab',
  WEB = 'web',
}

export enum ErrorType {
  ERROR = 'error',
  OPT_NOTIFICATIONS = 'optNotifications',
  SAVE_TOPICS = 'saveTopics',
}

export enum RedirectURLType {
  API = 'api',
  CREDIBLE_MIND = 'crediblemind',
  HTTPS = 'https',
  PAGE = 'page',
}

export const RE_DIRECT_URL_API_TYPE = {
  PROVIDERS_TELE_HEALTH: 'findACounselor.telehealth',
  WELLNESS: 'wellness',
  CARD_DETAILS: 'cardDetails',
};

export const MENU_ID = 'menu';
