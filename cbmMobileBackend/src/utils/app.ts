export interface JsonObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export class AWS {
  profile!: string;
  roleArn!: string;
  roleSessionName!: string;
  durationSeconds!: number;
  apiVersion!: string;
  region!: string;
  iosArn!: string;
  notificationQueue!: string;
}
export class CredibleMind {
  host!: string;
  monthlyResources!: string;
  topics!: string;
  xApiKey!: string;
}

export class ClientConfig {
  eap!: EAPClientConfig;
  mhsud!: MHSUDClientConfig;
}
export class EAPClientConfig {
  consumerHost!: string;
  host!: string;
  articles!: string;
  cards!: string;
  resources!: string;
  clients!: string;
}

export class MHSUDClientConfig {
  consumerHost!: string;
  host!: string;
  clients!: string;
  resources!: string;
}
export class ProviderSearch {
  getAccessToken!: string;
  sendEmail!: string;
}
export interface ProviderSearchConfig {
  addresses: string;
  geocode: string;
  providerList: string;
  providerDetails: string;
}
export interface AppointmentConfig {
  assessmentRequired: string;
  create: string;
  tabStatus: string;
  fetchById: string;
  update: string;
  questionnaire: string;
  memberStatus: string;
  memberDashboard: string;
}

export interface AssessmentsConfig {
  calibrate: string;
}

export interface TelehealthConfig {
  mdLiveAppointment: string;
}

export interface GenesysChatConfig {
  init: string;
  getData: string;
}

export interface SurveyAssessmentConfig {
  link: string;
  calibrateHost: string;
  domainName: string;
}

export interface MemberAuthConfig {
  eap: {
    host: string;
    basePath: {
      public: string;
      secure: string;
      provider: string;
    };
    apiKey: string;
    dfdOrigin: string;
    accessToken: {
      url: string;
      scope: string;
      grantType: string;
      authorization: string;
      contentType: string;
    };
    clientSearch: string;
    registerMember: string;
    loginMember: string;
    forgotUserName: string;
    checkDetails: string;
    memberAccount: string;
    sendOtp: string;
    validateOtp: string;
    contactDetails: string;
    rememberDevice: string;
    userLookup: string;
    profileDetails: string;
    updateProfile: string;
    changeSecret: string;
    disableAccount: string;
    appointment: AppointmentConfig;
    provider: ProviderSearchConfig;
    assessments: AssessmentsConfig;
    telehealth: TelehealthConfig;
    genesysChat: GenesysChatConfig;
  };
}
export class Encryptor {
  algorithm!: string;
  salt!: string;
}
export class LoggerDetails {
  console!: boolean;
  level!: string;
}
export class Smtp {
  sendEmail!: boolean;
  smtpPort!: number;
  service!: string;
  tlsVersion!: string;
  smtpServer!: string;
  fromEmail!: string;
  fromEmailName!: string;
  subject!: string;
  smtpAuthUser!: string;
  smtpAuthValue!: string;
}
export interface IConfig {
  APP_VERSION: string;
  awsDetails: AWS;
  smtpSettings: Smtp;
  env: string;
  credibleMindDetails: CredibleMind;
  providerSearchDetails: ProviderSearch;
}

export interface DatabaseConfig {
  host: string;
  basePath: {
    secure: string;
    public: string;
  };
  apikey: string;
}

export interface SecurityConfig {
  maskedFields: string[];
  encryptedFields: string[];
  SMTP_TLS: string;
}

export class ConfigData {
  APP_VERSION!: string;
  JWT!: string;
  awsDetails!: AWS;
  database!: DatabaseConfig;
  smtpSettings!: Smtp;
  env!: string;
  logLevel!: string;
  credibleMindDetails!: CredibleMind;
  providerSearchDetails!: ProviderSearch;
  logger!: LoggerDetails;
  memberAuth!: MemberAuthConfig;
  assessmentsSurvey!: SurveyAssessmentConfig;
  encryption!: Encryptor;
  security!: SecurityConfig;
  clientConfiguration!: ClientConfig;
}
interface IApp {
  [x: string]: unknown;
  readonly config: ConfigData;
}

export const APP: IApp = {
  config: new ConfigData(),
};
