import Config from 'react-native-config';

export const API_HOST = Config.API_HOST || '';
export const API_BASE = '/v1';
export const BASE_URL = `${API_HOST}${API_BASE}`;
export const ENV = Config.ENV;
export const isProd = !!ENV?.includes('prod');

export enum ExperienceType {
  PUBLIC = 'public',
  SECURE = 'secure',
}

export enum Language {
  EN = 'en',
}

// from now please add endpoints in two formats later i will remove API_ENDPOINTS
export const API_ENDPOINTS = {
  VERIFY_EMAIL: `/public/verify/email`,
  VERIFY_OTP: `/public/verify/otp`,
  LOGIN: `/public/login`,
  USER: `/secure/user/info`,
  LOGOUT: `/auth/members/session`,
  NOTIFICATION_LIST: `/secure/user/notifications`,
  UPDATE_NOTIFICATION_STATUS: `/secure/user/notifications/read`,
  NOTIFICATION_INSTALLATION: `/secure/installations`,
  FAU: `/public/fau`,
  USER_DELETE: `/secure/user/delete`,
  NOTIFICATION_INSTALLATION_DELETE: `/secure/installations/delete`,
  ACCESS_TOKEN: `/public/auth`,
  PROVIDER_ADDRESS: `/provider/addresses`,
  GEOCODE_ADDRESS: `/provider/geoCode/address`,
  PROVIDER_LIST: `/provider/providers`,
  PROVIDER_DETAILS: `/provider/providerDetails`,
  PROVIDER_MEMBER_STATUS: `/secure/appointment/members/status`,
  PROVIDER_PLANS: `/provider/plans`,
  PN_RESET_BADGE_COUNT: '/secure/user/resetBadge',
  CLIENTS_LIST: '/auth/clients',
  LOGIN_AUTH: `/auth/members/authentication`,
  MEMBER_CONTACTS: `/auth/members/contacts`,
  SEND_OTP: `/auth/mfa/otp`,
  REMEMBER_DEVICE: `/auth/members/device`,
  MEMBER_CHECK: '/auth/members/lookup',
  REGISTRATION: '/auth/members/profile',
  REFRESH_TOKEN: '/auth/refresh',
  UPDATE_PHONE_NUMBER: '/auth/members/profile',
  FORGOT_USER_NAME: '/auth/members/forgot-username',
  FORGOT_SECRET: '/auth/members/forgot-secret',
  CHANGE_SECRET: '/auth/members/account',
  NOTIFICATION: '/secure/notifications',
  ASSESSMENT_STATUS: '/secure/appointment/assessment-status',
  ASSESSMENT_SURVEY: '/secure/assessments',
  CLINICAL_QUESTIONNAIRE: '/secure/appointment/questions',
  WELLNESS_TOPICS_LIST: '/wellness/topics',
  GET_MEMBER_PREFERENCES: '/auth/members/preferences',
  SAVE_MEMBER_PREFERENCES: '/auth/members/preferences',
  DELETE_ACCOUNT: '/auth/members/account',
  SUBMIT_APPOINTMENT: '/secure/appointment',
  APP_VERSION_CHECK: '/public/app/update',
  APPOINTMENT_REQUESTS: '/secure/appointment/members/dashboard',
  APPOINTMENT_TAB_STATUS: '/secure/appointment/status',
  APPOINTMENT_BY_ID: '/secure/appointment',
  EMOTIONAL_SUPPORT: '/secure/telehealth/md-live-appointment',
  CRISIS_SUPPORT: '/content/crisis-support/en-US',
  APPOINTMENT_DETAILS: '/secure/appointment/appointment-details',
  CLIENT: '/clients',
  CLIENT_RESOURCES: '/resources',
  CHAT_AVAILABILITY: '/chat/availability',
  CHAT_SESSION: '/chat/session',
  TELEHEALTH: '/clients/cards',
  PROFILE_DETAILS: '/auth/members/profile',
  PROFILE_CORRECTION_FORM: '/provider/feedback',
};

export const API_ENDPOINTS_JSON = {
  LOGIN: {
    endpoint: '/public/login',
    method: 'POST',
  },
  ASSESSMENT_SURVEY: {
    endpoint: '/secure/assessments',
    method: 'POST',
  },
  FORGOT_USER_NAME: {
    endpoint: '/auth/members/forgot-username',
    method: 'POST',
  },
  NOTIFICATION: {
    endpoint: '/secure/notifications',
    method: 'GET',
  },
  ASSESSMENT_STATUS: {
    endpoint: '/secure/appointment/assessment-status',
    method: 'GET',
  },
  UPDATE_PHONE_NUMBER: {
    endpoint: '/auth/members/profile',
    method: 'PUT',
  },
  WELLNESS_TOPICS_LIST: {
    endpoint: '/wellness/topics',
    method: 'GET',
  },
  GET_MEMBER_PREFERENCES: {
    endpoint: '/auth/members/preferences',
    method: 'GET',
  },
  SAVE_MEMBER_PREFERENCES: {
    endpoint: '/auth/members/preferences',
    method: 'PUT',
  },
  FORGOT_SECRET: {
    endpoint: '/auth/members/forgot-secret',
    method: 'POST',
  },
  CHANGE_SECRET: {
    endpoint: '/auth/members/account',
    method: 'PUT',
  },
  LOGOUT: {
    endpoint: '/auth/members/session',
    method: 'PUT',
  },
  DELETE_ACCOUNT: {
    endpoint: '/auth/members/account',
    method: 'POST',
  },
  CLINICAL_QUESTIONNAIRE: {
    endpoint: '/auth/members/questions',
    method: 'GET',
  },
  PROVIDER_MEMBER_STATUS: {
    endpoint: '/secure/appointment/members/status',
    method: 'GET',
  },
  PROVIDER_PLANS: {
    endpoint: `/provider/plans`,
    method: 'GET',
  },
  SUBMIT_APPOINTMENT: {
    endpoint: '/secure/appointment',
    method: 'POST',
  },
  CANCEL_APPOINTMENT: {
    endpoint: '/secure/appointment',
    method: 'PUT',
  },
  APP_VERSION_CHECK: {
    endpoint: '/public/app/update',
    method: 'GET',
  },
  APPOINTMENT_REQUESTS: {
    endpoint: '/secure/appointment/members/dashboard',
  },
  APPOINTMENT_TAB_STATUS: {
    endpoint: '/secure/appointment/status',
    method: 'GET',
  },
  APPOINTMENT_BY_ID: {
    endpoint: '/secure/appointment',
    method: 'GET',
  },
  EMOTIONAL_SUPPORT: {
    endpoint: '/secure/telehealth/md-live-appointment',
    method: 'POST',
  },
  PN_RESET_BADGE_COUNT: {
    endpoint: '/secure/user/resetBadge',
    method: 'PUT',
  },
  CRISIS_SUPPORT: {
    endpoint: '/content/crisis-support/en-US',
    method: 'GET',
  },
  APPOINTMENT_DETAILS: {
    endpoint: '/appointment/appointment-details',
    method: 'GET',
  },
  CLIENT: {
    endpoint: '/clients',
    method: 'GET',
  },
  CLIENT_RESOURCES: {
    endpoint: '/resources',
    method: 'GET',
  },
  TELEHEALTH: {
    endpoint: '/clients/cards',
    method: 'POST',
  },
  CHAT_AVAILABILITY: {
    endpoint: '/v1/chat/availability',
    method: 'GET',
  },
  CHAT_SESSION: {
    endpoint: '/v1/chat/session',
    method: 'POST',
  },
  PROFILE_DETAILS: {
    endpoint: '/auth/members/profile',
    method: 'GET',
  },
  PROFILE_CORRECTION_FORM: {
    endpoint: '/provider/feedback',
    method: 'POST',
  },
};
