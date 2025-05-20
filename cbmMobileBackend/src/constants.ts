export enum Roles {
  User = 'USER',
  BHUser = 'BH_USER',
  EAPUser = 'EAP_USER',
  Admin = 'ADMIN',
}

export const DB_TABLE_NAMES = {
  AUDIT: 'apm1018071-cbhm_app_audit',
  USERS: 'apm1018071-cbhm_users',
  CONFIG: 'apm1018071-cbhm_config',
  CONTENT: 'apm1018071-cbhm_content',
  NOTIFICATIONS: 'apm1018071-cbhm_notifications',
};

export enum SNSEnum {
  APNS = 'APNS',
  GCM = 'GCM',
  PROTOCOL = 'application',
  GENERIC_TOPIC = 'allusers',
}

export enum UserStatus {
  EMAIL_NOT_VERIFIED = 'email-not-verified',
  EMAIL_VERIFIED = 'email-verified',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export enum ValidationEvents {
  SIGN_UP = 'sign-up',
  LOGIN = 'login',
  RESET_AUTH = 'reset-auth',
}

export enum Category {
  PODCAST = 'Podcast',
  VIDEO = 'Video',
  INSIGHNTS = 'Insights',
}

export enum Platform {
  android = 'android',
  ios = 'ios',
}

export enum HeaderKeys {
  API_KEY = 'apiKey',
  APPSOURCE = 'appsource',
  X_API_KEY = 'x-api-key',
  AUTHORIZATION = 'Authorization',
  META_TRANS_ID = 'meta-transid',
  META_SENDER_APP = 'meta-senderapp',
  META_BRAND_CODE = 'meta-brandcd',
  META_PING_RISK_ID = 'meta-pingRiskId',
  META_PING_DEVICE_ID = 'meta-pingDeviceId',
  META_PING_USER_ID = 'meta-pingUserId',
  META_IP_ADDRESS = 'meta-ipaddress',
  USER_NAME = 'usernm',
  CONTENT_TYPE = 'Content-Type',
  COOKIE = 'cookie',
  SET_COOKIE = 'set-cookie',
  DFD_ORIGIN = 'dfd-origin',
  SMUNIVERSALID = 'SMUNIVERSALID',
  BEARER = 'Bearer',
  SECURETOKEN = 'securetoken',
  CLIENT_USER_NAME = 'clientUserName',
}

export const Messages = {
  allowedClientsError: 'Failed to fetch allowed clients',
  apiFailure: 'API Request Failed',
  appointmentError: 'Appointment creation failed',
  assessmentFailed: 'Assessment required check failed',
  badRequest: 'Bad Request',
  deviceAlreadyRegistered: 'Device is already registered to this user',
  duplicateDeviceRegistered: 'Device is already registered with other users.',
  endpointNotFound: 'Endpoint ARN is not received',
  chatInitError: 'Chat initiation failed',
  chatStatusError: 'Chat status fetch failed',
  clientUserNameNotFoundError: 'Client Username not found',
  clientNameNotFoundError: 'Client name not found',
  surveyIdNotFoundError: 'Survey ID not found',
  secureTokenNotFoundError: 'Secure token not found',
  fetchAppointmentError: 'Unable to retrieve appointment details',
  fetchAppointmentQuestionsError: 'Failed to fetch questionnaire',
  fetchAppointmentStatusError: 'Failed to fetch appointment status',
  generateAssessmentError: 'Failed to fetch assessment link',
  generateCalibrateParticipantIdError:
    'Failed to generate calibrate participant ID',
  updateAppointmentError: 'Failed to update appointment status',
  notificationNotFound: 'Notification not found',
  noNotificationNotFound: 'Notifications are not available for the users.',
  notificationActionSuccess: 'Notification action performed successfully',
  duplicateUser: 'SUCCESS',
  userBlocked: 'User is Blocked',
  userNotFound: 'User not found',
  memberExists: 'Member exists',
  memberDisabled: 'Member disabled',
  appVersionError: 'App version is not found.',
  installationNotFound: 'Installation not found',
  userAuthError: 'Incorrect username or password',
  invalidEmail: 'Invalid email id',
  invalidRequest: 'Invalid request body',
  invalidSource: 'Source is invalid',
  sentEmail: 'Email sent with one time password details successfully',
  expiredOTP: 'OTP expired, Please request for new OTP',
  otpValidationError1:
    'User exceeded the validation limit. Request resend OTP before validating again.',
  otpValidationError2:
    'User exceeded the validation limit. Sorry account will be blocked!!',
  invalidOTP: 'Invalid OTP',
  otpNotFound: 'Please generate the OTP before validating!!',
  sendNotificationFailure: 'Push notifications sending failed',
  somethingWentWrong: 'Something went wrong. Please try again later',
  updateError: 'An error occurred while updating record in the database',
  createError: 'An error occurred while adding record to the database',
  fetchError: 'An error occurred while fetching the record from database',
  deleteError: 'An error occurred while deleting the record from the database.',
  createSuccess: 'Record created successfully',
  deleteSuccess: 'Record deleted successfully',
  updateSuccess: 'Record updated successfully',
  notFoundError: 'Record not found',
  emailVerifyError: 'An error occured while verifying the email.',
  accessTokenError: 'Error while getting access token',
  providersError: 'Error while getting providers details',
  invalidClientId: 'Client is not authorized to perform the action',
  clientAuthSuccess: 'Client Authorized successfully',
  refreshAuthSuccess: 'Token refreshed successfully',
  authorizationError: 'Error while getting provider access token',
  addressError: 'Error while getting providers address details',
  sendEmailSuccess: 'Email sent successfully',
  sendEmailError: 'Error while sending email',
  clientSearchError: 'Error while searching client',
  registerError: 'Error during member registration',
  loginError: 'Error during member login',
  memberEAPauthorizationError: 'Error while fetching EAP member access token',
  forgotUserNameError: 'Error while fetching EAP member username',
  validateEAPMemberDetailsError: 'Error while validating EAP member details',
  changeUserPasswordError: 'Error while changing EAP member Password',
  sendOtpError: 'Error while sending OTP to the member',
  validateOtpError: 'Error while validating OTP',
  userLookupError: 'Error while fetching EAP member lookup details',
  registrationThreatError: 'Error while validating registration threat',
  registrationThreatScoreError:
    'Threat Score exceeds the limit. Cannot proceed with registration',
  userFetchError: 'Error while fetching EAP user details',
  invalidAuthError: 'Invalid Authorization Token',
  rememberDeviceError: 'Error while persisting device details',
  updateUserProfileError: 'Error while updating user profile details',
  fetchMemberStatusError: 'Error while fetching member status',
  fetchMemberDashboardFilterError:
    'Error while fetching member dashboard filter',
  fetchMemberPreferencesError: 'Error while fetching member preferences',
  saveMemberPreferencesError: 'Error while saving member preferences',
  WellnessTopicsMonthlyResourcesError: 'Error while fetching monthly resources',
  WellnessTopicsTopicsError: 'Error while fetching topics',
  invalidateSessionError: 'Error while invalidating session',
  disableMemberAccountError: 'Error while disabling member account',
  setMemberAccountStatusError: 'Error while setting member account status',
  noChangesToModify: 'No changes to modify',
  memberPreferencesUpdated: 'Member preferences updated successfully',
  memberSessionInvalidated: 'Member session invalidated successfully',
  memberAccountDeleted: 'Member account deleted successfully',
  setMemberAccountStatus: 'Member account status set successfully',
  invalidMemberStatus: 'Invalid Member Account Status',
  notificationActionError: 'Error while performing notification actions',
  platformError: 'Invalid platform. Only ios OR android are allowed.',
  contentError: 'Error while fetching content details',
  clientConfigurationError: 'Error while fetching client configuration details',
  userDisabledError:
    'Account disabled.  For assistance, please contact our Customer Support team.',
};

export const AllowedClients = ['client_CBHM'];

export const ServiceConstants = {
  STRING_EAP: 'eap',
  STRING_CARD: 'card',
  STRING_BEACON: 'beacon',
  STRING_ARTICLE: 'beacon',
  STRING_RESOURCES: 'resources',
  LANGUAGE_EN_US: 'en-US',
  CBHM_APPLICATION_NAME: 'CBHM',
  EMAIL: 'EMAIL',
  SECURE_TOKEN: 'SECURETOKEN=',
  CBHM_AUTH_CLIENT_NAME: 'client_CBHM',
  JWT_EXPIRY_15M: 15,
  JWT_EXPIRY_60M: 60,
  SKIP_MFA: 'Continue',
};

export const ReplaceStringKeyWords = {
  client: '{client}',
  clientUri: '{clientUri}',
  component: '{component}',
  month: '{month}',
  searchData: '{searchData}',
  emailId: '{emailId}',
  userName: '{userName}',
  bu: '{bu}',
  surveyId: '{surveyId}',
};

export const TemplateConstants = {
  CLIENT_URI: '{clientUri}',
  ITEM_PATH: '{path}',
  CONTENT_ID_ASSESSMENTS: 'assessments-configuration',
  CLIENT_NAME: '{clientName}',
  IS_TERMINATED: '{isTerminated}',
  SURVEY_PARTICIPANT_ID: '{surveyParticipantId}',
  ENCODED_CLIENT_ASSESSMENT_CONFIG: '{encodedClientAssessmentConfig}',
  CONTENTID_EAP_CLIENT_CONFIGURATION: 'eap-client-configuration',
  CONTENTID_MHSUD_CLIENT_CONFIGURATION: 'mhsud-client-configuration',
  CONTENTID_EAP_MHSUD_CLIENT_CONFIGURATION: 'eap-mhsud-client-configuration',
  CLIENT_CONFIG_REDIRECTURL_CREDIBLEMIND: `crediblemind:${ReplaceStringKeyWords.component}`,
  CLIENT_CONFIG_REDIRECTURL_ASSESSMENTS: `api:assessments?surveyId=${ReplaceStringKeyWords.surveyId}`,
};

export const MemberAccountStatus = {
  ACTIVE: 'A',
  INACTIVE: 'I',
  DELETED: 'D',
  CLOSED: 'C',
};

export const AllowedMemberAccountStatus = Object.values(MemberAccountStatus);

export const CacheAuthTokenKeys = {
  eapMemberAuthAccessToken: 'eapMemberAuthAccessToken',
  eapClientSearchAccessToken: 'eapClientSearchAccessToken',
};

export const CommonConstants = {
  dateFormateString: 'YYYY-MM-DD hh:mm:ss A',
  loggerLevel: 'debug',
  bearer: 'Bearer',
  YES: 'Y',
  NO: 'N',
  HEX: 'hex',
  SHA1: 'sha1',
  iterations: 1024,
  keyLength: 256,
  app: 'CBHM',
  cwAuthToken: 'cw_auth_token',
  https: 'https',
};

export const REGEX_CONSTANTS = {
  GLOBAL: 'g',
  CLIENT_CONFIG_SELF_PACED_CONTENT_MATCH:
    /self-paced-resources-and-courses\/[a-zA-Z0-9]+\?/,
  CLIENT_CONFIG_CREDIBLEMIND_MATCH: /\/cm-[a-zA-Z0-9]+\?/,
  CLIENT_CONFIG_ASSESSMENTS_MATCH: /\/survey\/anonymous\/([a-zA-Z0-9-]+)/,
};

export const PATH_CONSTANTS = {
  CONTENT_DAM: '/content/dam/',
  API_ASSETS: '/api/assets/',
  AEM_REDIRECTURL_REPLACEMENTS: [
    {
      pattern: '/content/careloneap/us/en/custom/',
      value: '',
    },
  ],
};

export enum APIResponseCodes {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  THRESHOLD_STATUS = 299,
}

export const APIResponseConstants = {
  authFailed: 'AUTH_FAILED',
  failed: 'FAILED',
  success: 'SUCCESS',
  user401: 'USER_401',
  memberDisabled: 'MEMBER_DISABLED',
};

export const SecureEnvironments = ['production', 'test', 'stage', 'dev1'];

export enum SQSParams {
  NOTIFICATION_MESSAGE_GROUP_ALL = 'NOTIFICATION_ALL_USERS',
}

export const ProviderFilters = {
  specialty: {
    displayName: 'Specialty',
    identifier: 'specialties.name',
    displayAttribute: 'specialties.name.keyword',
  },
  ethnicity: {
    displayName: 'Ethnicity',
    identifier: 'ethnicity',
    displayAttribute: 'ethnicity.keyword',
  },
  race: {
    displayName: 'Race',
    identifier: 'race',
    displayAttribute: 'race.keyword',
  },
  ageGroup: {
    displayName: 'Age Treated',
    identifier: 'ageGroups.name',
    displayAttribute: 'ageGroups.name.keyword',
  },
  languages: {
    displayName: 'Language Offered',
    identifier: 'languages.name',
    displayAttribute: 'languages.name.keyword',
  },
  transportation: {
    displayName: 'Public Transportation',
    identifier: 'publicTransportation.displayValue',
    displayAttribute: 'publicTransportation.displayValue.keyword',
  },
  gender: {
    displayName: 'Gender',
    identifier: 'gender.displayValue',
    displayAttribute: 'gender.displayValue.keyword',
  },
  handicap: {
    displayName: 'Wheelchair Access',
    identifier: 'handicap.displayValue',
    displayAttribute: 'handicap.displayValue.keyword',
  },
  telehealthType: {
    displayName: 'Telehealth Types',
    identifier: 'telehealthTypes.telehealthType',
    displayAttribute: 'telehealthTypes.telehealthType.keyword',
  },
  newPatients: {
    displayName: 'Accepting New Patients',
    identifier: 'insurances.acceptingNewPatients',
    displayAttribute: 'insurances.acceptingNewPatients.keyword',
  },
  productType: {
    displayName: 'Product Types',
    identifier: 'productType.name',
    displayAttribute: 'productType.name.keyword',
  },
  practiceTypes: {
    displayName: 'Provider Types',
    identifier: 'practiceTypes.name',
    displayAttribute: 'practiceTypes.name.keyword',
  },
  onlineAppointments: {
    displayName: 'Accepts online appointment requests',
    identifier: 'checkbox-onlineAppointmentScheduleFlag',
    displayAttribute: 'onlineAppointmentScheduleFlag',
  },
  boardCertified: {
    displayName: 'Board certification',
    identifier: 'checkbox-boardCertFlag',
    displayAttribute: 'boardCertFlag',
  },
  hospitalAffiliation: {
    displayName: 'Hospital privileges',
    identifier: 'checkbox-hospitalAffiliationsFlag',
    displayAttribute: 'hospitalAffiliationsFlag',
  },
  culturalcompetancy: {
    displayName: 'Cultural competancy',
    identifier: 'checkbox-culturallyCompetentFlag',
    displayAttribute: 'culturallyCompetentFlag',
  },
  accreditions: {
    displayName: 'Accreditations',
    identifier: 'checkbox-accreditationsFlag',
    displayAttribute: 'accreditationsFlag',
  },
  moreOptions: {
    displayName: 'More Options',
    identifier: 'moreOptions',
    displayAttribute: 'moreOptions',
  },
};

export const YellowLabels = [
  {
    label: 'Preferred Provider',
    key: 'preferredProvider',
  },
  {
    label: 'Unverified Provider',
    key: 'unVerifiedProvider',
  },
  {
    label: 'Autism',
    key: 'autismFlag',
  },
  {
    label: 'OUD',
    key: 'oudFlag',
  },
  {
    label: "Children's Preferred",
    key: 'pKIDFlag',
  },
  {
    label: 'Serious Mental Illness Preferred',
    key: 'pSMIFlag',
  },
  {
    label: 'Substance Use Disorder Preferred',
    key: 'pSUDFlag',
  },
  {
    label: 'Virtual counselor',
    key: 'teleHealthFlag',
  },
];

export enum ObjectKeys {
  BOTH = 'BOTH',
  DOC_COUNT = 'doc_count',
  ID = '_id',
  SOURCE = '_source',
  DATA = 'data',
  CHAT_STATUS = 'Flow.HOO_Data',
  OPEN = 'Open',
  KEY = 'Key',
}

export enum ResponseLabels {
  ACCEPT_PATIENT = 'Accepting new patients',
}

export enum FlowNames {
  LOGIN = 'login',
  FORGOT_PASSWORD = 'forgotPassword',
  FORGOT_USERNAME = 'forgotUsername',
  REGISTER = 'register',
}

export enum AppointmentTypes {
  pf = 'PF',
}

export enum AuditTypes {
  AUDIT = 'audit',
  LAST_LOGIN_TS = 'lastLoginTS',
  LAST_LOGOUT_TS = 'lastLogoutTS',
  TIME_STAMP = ':timeStamp',
}

export const LogLevels = {
  levels: {
    error: 0,
    info: 1,
    warn: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'green',
    silly: 'gray',
  },
};

export const APPOINTMENT_STATUSES = ['APPROVED', 'REJECTED', 'MBRCANCEL'];

export const GENDER_VALUES = ['Male', 'Female', 'Prefer not to say'];

export const EMPLOYMENT_STATUS_VALUES = [
  'Full Time',
  'Part Time',
  'Terminated',
  'Medical Leave',
  'Retired',
];

export const RELATIONSHIP_STATUS_VALUES = [
  'Never Married',
  'Married',
  'Widowed',
  'Divorced',
  'Separated',
];

export const JOB_TITLE_VALUES = [
  'Executive/Manager',
  'Professional',
  'Technical',
  'Sales',
  'Office/Clerical',
];

export const MEMBER_PREFERENCE_ATTRIBUTES = [
  'notificationsPreferred',
  'preferredTopics',
];

export const DB_PATH = {
  records: '/records',
  all: '/all',
  many: '/many',
  get: '/get',
  delete: '/delete',
  scanTable: '/table/scan',
  queryTable: '/table/query',
};

export enum DynamoDbConstants {
  SET = 'SET',
  UPDATED_NEW = 'UPDATED_NEW',
  TABLE_NAME = 'TableName',
  KEY = 'Key',
  EXPRESSION_ATTRIBUTE_VALUES = 'ExpressionAttributeValues',
  EXPRESSION_ATTRBUTE_NAMES = 'ExpressionAttributeNames',
  UPDATE_EXPRESSION = 'UpdateExpression',
  RETURN_VALUES = 'ReturnValues',
  REMOVE = 'REMOVE',
}

export enum AuditParam {
  INCOMING_TYPE = 'IncomingRequest',
  TYPE = 'Type',
  METHOD = 'Method',
  URL = 'URL',
  REQ = 'Request',
  RES = 'Response',
  STATUS = 'Status',
  HEADERS = 'Headers',
  TRACE_ID = 'TRACE_ID',
}

export const chatDefaultPayload = {
  latitude: null,
  longitude: null,
  ip: '0.0.0.0',
  browser: 'cbh_mobile',
  region: '',
  timezone: 'EST',
  websitetitle: 'Carelon Wellbeing',
};

export enum CHAT_GC_ROUTES {
  TEST = 'TST',
  DEV = 'DEV',
  PROD = 'PROD',
}

export const PROD_ENV = ['PROD', 'DR'];

export const DEMO_CLIENT = 'company-demo';

export const DEFAULT_NOTIFICATION_SIZE = 10;

export enum EVENT_TYPES {
  FAU = 'FAU',
  END_SESSION = 'EndSession',
  SCREEN = 'Screen',
}
