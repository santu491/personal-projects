/**
 * App urls are the path component of universal links (https://www.anthem.com/claims/hub) that we can
 * deeplink to from **outside the app** or that we can link to from **other features**
 * that don't know about the entire app's navigation structure.
 *
 * If a screen doesn't need to be a deeplink target or a destination from another feature, then it
 * should NOT have an AppUrl.
 *
 * AppUrls enumerated here should NOT include query strings; of course deeplinks and navigations to a screen
 * assigned to a particular AppUrl can have query strings.
 *
 * AppUrls should not have trailing slashes
 */
export enum AppUrl {
  APPOINTMENTS_HISTORY = '/appointments/history',
  APPOINTMENTS_TAB = '/appointments-tab',
  CHAT = '/chat',
  CLIENT_SEARCH = '/client-search',

  CLINICAL_QUESTIONNAIRE = '/clinical-questionnaire',
  CONFIRMED_REQUESTS = '/appointments/confirmed-requests',
  CONTENT = '/content',
  CREATE_ACCOUNT_MHSUD = '/create-account-mhsud',

  CREDIBLEMIND = '/crediblemind',
  CREDIBLEMIND_WELLBEING = '/crediblemind-wellbeing',

  FIND_COUNSELOR = '/find-counselor',
  HOME = '/home',

  HOME_SDK = '/home-sdk',

  INACTIVE_REQUESTS = '/appointments/inactive-requests',

  LANDING = '/landing',

  LOGIN = '/login',

  LOGIN_MHSUD = '/login-mhsud',

  MENU = '/menu',

  MENU_TAB = '/menu-tab',

  NOITFICATION_SETTINGS = '/notification-settings',

  NOTIFICATIONS = '/notifications',

  PENDING_REQUESTS = '/appointments/pending-requests',

  PERSONAL_DETAILS = '/personal-details',

  PROFILE = '/profile',
  PROVIDERS_SDK = '/providers-sdk',
  PROVIDERS_TAB = '/providers-tab',
  SCHEDULE_APPOINTMENT = '/schedule-appointment',
  START_CHAT = '/start-chat',
  TAB_NAVIAGTION = '/tab-navigation',
  UPDATE_PHONE_NUMBER = '/update-phone-number',

  WELLBEING = '/wellbeing',

  WELLBEING_TAB = '/wellbeing-tab',
}
