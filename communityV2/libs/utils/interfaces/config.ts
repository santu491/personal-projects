/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHttpHeader } from '@anthem/communityapi/http';
import Agenda from 'agenda';

interface IApp {
  routePrefix: string;
  apiRoute: string;
  staticPath: string;
  port: number;
  keyFile: string;
  certFile: string;
  secret: string;
  https: boolean;
  httpsPort: number;
  framework: string;
  springCloudConfigUrl: string;
  configTimeout: number;
  virtualFileDownloadPath: string;
  apiRoots: string[];
  validateEnvironment: boolean;
  apiHost: string;
  appdHostParts: string;
  middlewares: string;
  keepAliveTimeout: number;
  headersTimeout: number;
  apiVersion: string;
  agenda: Agenda;
}

interface IWords {
  badWords: string[];
  sensitiveWords: string[];
  exceptionMsgWords: string[];
}

interface IPublic {
  eGeneralSearch: string;
  eAutoComplete: string;
}

interface IRestApi {
  apiKey: string;
  metaSender: string;
  keepAliveSocket: boolean;
  timeout: number;
  timeoutAuntBertha: number;
  noSsl: boolean;
  proxy: string;
  public: IPublic;
  userInfo: string;
  customHeaders: { name: string; value: string }[];
  replaceHost: { default: string; new: string }[];
  strSessionId: string;
  auntBertha: IAuntBertha;
  sydneyMemberTenant: ISydneyMemberTenant;
  psgbdTenant: IPSGBDTenant;
  healthWise: IHealthWise;
  contentMod: IContentMod;
  internal: IInternal;
  member: IMember;
  onPrem: IOnPrem;
  webUserGbdHeader: IHttpHeader;
  webUserCommercialHeader: IHttpHeader;
  gbdHeader: IHttpHeader;
  userProfile: IUserProfile;
  syntheticHeader: IHttpHeader;
}

interface ILogging {
  level: string;
  console: boolean;
  file: boolean;
  logFile: string;
  maxSize: number;
  maxFiles: number;
  showLineNumber: boolean;
}

interface IAudit {
  file: boolean;
  auditFile: string;
  maxSize: number;
  maxFiles: number;
  optionalUrls: string[];
  restMaskRequestUrls: string[];
  restMaskResponseUrls: string[];
  restBodyOptional: string[];
}

interface IMonitor {
  enable: boolean;
  route: string;
  username: string;
  secret: string;
}

interface ISession2 {
  secure: boolean;
  path: string;
  http: boolean;
  secret: string;
  siteminderCookie: string;
  smCookieLogOffValue: string;
}

interface ICors {
  enable: boolean;
  allowedOrigins: string;
  allowedRequestDomains: string;
  maxAge: number;
  allowedMethods: string;
  allowedHeaders: string;
  defaultOrigin: string;
}

interface IJwt {
  expiration: number;
  secret: string;
  algorithm: string;
  optionalUrls: string[];
  emulationUsername: string;
  publicAuthenticatedUrls: string;
}

interface IErrorMaps {
  [key: string]: string;
}

interface IHeaders {
  allowed: string[];
  blocked: string[];
  names: { maxLength: number; default: string };
  values: {
    maxLength: number;
    default: string;
    [key: string]: string | number;
  };
}

interface IUrlParams {
  names: { maxLength: number; default: string };
  values: {
    maxLength: number;
    default: string;
    [key: string]: string | number;
  };
}

interface IUrlQueries {
  names: { maxLength: number; default: string };
  values: {
    maxLength: number;
    default: string;
    [key: string]: string | number;
  };
}

interface ICookies {
  allowed: string[];
  names: { maxLength: number; default: string };
  values: { maxLength: number; default: string };
}

interface IBody {
  values: {
    maxLength: number;
    default: string;
    [key: string]: string | number;
  };
}

interface IWhitelist {
  headers: IHeaders;
  urlParams: IUrlParams;
  urlQueries: IUrlQueries;
  cookies: ICookies;
  body: IBody;
}

interface IAesSymmetric {
  secret: string;
}

interface IBouncyEncryption {
  secret: string;
  salt: string;
  iv: string;
}

interface IAes {
  secret: string;
  salt: string;
  iv: string;
}

interface IEncryption {
  aesSymmetric: IAesSymmetric;
  secret: string;
  storeSecret: string;
  bouncyEncryption: IBouncyEncryption;
  aes: IAes;
  storePath: string;
  keyStoreKey: string;
  encryptionKey: string;
}

interface IVirusScan {
  enable: boolean;
  ip: string;
  port: number;
  serviceName: string;
}

interface ISecurity {
  https: boolean;
  noSniff: boolean;
  noCache: boolean;
  hidePoweredBy: boolean;
  frameguardAction: string;
  optionalUrls: string[];
  errorMaps: IErrorMaps;
  suppressErrorProps: string[];
  outputEncryptedProps: string[];
  maskedProps: string[];
  encodeProps: string[];
  passthroughProps: string[];
  whitelist: IWhitelist;
  encryption: IEncryption;
  emulationAllowedUrls: string[];
  emulationAllowedGraphqlMutations: string[];
  userRoleAllowedUrls: string[];
  virusScan: IVirusScan;
  regexFeatureSubFeatureFromPath: string;
}

interface ICache {
  enabled: boolean;
  endpoint: string;
  port: number;
  authTokenPass: string;
  expiry: number;
  slotsRefreshTimeout: number;
  slotsRefreshInterval: number;
  timeout: number;
  cluster: boolean;
}

interface ICaas {
  enable: boolean;
}

interface IGraphql {
  enable: boolean;
  root: string;
  enableGraphiql: boolean;
}

interface ISwagger {
  enable: boolean;
}

interface IDistributedLockOptions {
  driftFactor: number;
  retryCount: number;
  retryDelay: number;
  retryJitter: number;
}

interface IDistributedLock {
  options: IDistributedLockOptions;
}

interface IAppInfo {
  name: string;
  root: string;
}

interface IEmulation {
  apikey: string;
}

interface IBing {
  locationUrl: string;
  apiKey: string;
}

export interface IConfig {
  app: IApp;
  awsEndpoints: IEksAws;
  sydneyMemberTenant: ISydneyMemberTenant;
  psgbdTenant: IPSGBDTenant;
  bing: IBing;
  restApi: IRestApi;
  logging: ILogging;
  audit: IAudit;
  monitor: IMonitor;
  session: ISession2;
  cors: ICors;
  jwt: IJwt;
  security: ISecurity;
  cache: ICache;
  caas: ICaas;
  graphql: IGraphql;
  swagger: ISwagger;
  distributedLock: IDistributedLock;
  appInfo: IAppInfo;
  emulation: IEmulation;
  env: string;
  database: IDatabase;
  smtpSettings: ISmtp;
  messageProducer: IMessageProducer;
  aws: IAws;
  wordList: IWords;
}
interface IAuntBertha {
  username: string;
  password: string;
  apiKeys: [{
    brand: string;
    apiKey: string;
  }]
  auntBerthaCacheExpiry: number;
  serviceTags: string;
  getProgramById: string;
  getProgramListByZipCode: string;
  accesstoken: string;
}

interface IHealthWise {
  token: string;
  authenticate: string;
  cacheValidity: number;
  topicById: string;
  topicByConceptIdAspectId: string;
  articleById: string;
}

interface IContentMod {
  url: string;
}

interface IInternal {
  apiKey: string;
  metaSender: string;
  basicTokenForAuth: string;
  termsofuse: string;
  authenticate: string;
  memberSummary: string;
  postInstallation: string;
  updateInstallation: string;
  deleteInstallation: string;
  resetBadge: string;
  tokenValidationUrlForAuth: string;
  tokenRevokeUrl: string;
  messageProducerUrl: string;
  tokenValidationPublicToken: string;
  cacheValidity: number;
  clientId: string;
  adminToken: string;
}

interface IMember {
  commercialSearch: string;
  gbdSearch: string;
  commercialAuthenticate: string;
  gbdAuthenticate: string;
  memberEligibilityInfo: string;
  commercialQnAValidate: string;
  gbdQnAValidate: string;
  gbdContactsDetails: string;
  gbdContactsDetailsSynthetic: string;
  commercialGeneratePassword: string;
  gbdGeneratePassword: string;
  commercialUpdatePassword: string;
  gbdUpdatePassword: string;
}
interface IOnPrem {
  commercialSendOtp: string;
  apiKey: string;
  accesstoken: string;
  commercialAuthenticate: string;
  gbdSummary: string;
  commercialLoginTreat: string;
  medicaidLoginTreat: string;
  commercialRecoveryTreat: string;
  medicaidRecoveryTreat: string;
  eligibility: string;
  eligibilitySynthetic: string;
  memberValidateOtp: string;
  medicaidSendOtp: string;
  medicaidValidateOtp: string;
  commercialSaveCookie: string;
  medicaidSaveCookie: string;
  recoveryContact: string;
  commercialSecurityQuestions: string;
  commercialTelephoneNumber: string;
  commercialTextNumber: string;
  commercialRecoveryNumber: string;
  medicaidRecoveryNumber: string;
  commercialCredentialUpdate: string;
  medicaidSecretQuestions: string;
  medicaidUserSecretQA: string;
  medicaidSecretQAUpdate: string;
  syntheticAPIKey?: string;
  syntheticAccessToken?: string;
  basicTokenForSyntheticAuth?: string;
  commercialSearch?: string;
}
interface IDatabase {
  databaseUser: string;
  dbpswrd: string;
  isLocal: boolean;
  options: {};
  endpoint: string;
  certPath: string;
  name: string;
}

interface IUserProfile {
  BaseUrlPath: string;
  PostImagePath: string;
  AdminImagePath: string;
  CommunityImagePath: string;
}

interface ISmtp {
  smtpServer: string;
  flagReviewEmail: string;
  adminEmail: string;
  fromEmailAddress: string;
  fromEmailName: string;
  sendEmail: boolean;
  smtpPort: number;
  apiPath: string;
  adminUrl: string;
  username: string;
  password: string;
  service: string;
}

interface IMessageProducer {
  channel: string;
  id: string;
  activityIntent: string;
  storyIntent: string;
  sourceOfMessage: string;
}

interface IAws {
  profile: string;
  roleArn: string;
  roleSessionName: string;
  durationSeconds: number;
  apiVersion: string;
  region1: string;
  region2: string;
  userActivityQueue: string;
  genericQueue: string;
  storyQueue: string;
  deleteProfileQueue: string;
  iosArn: string;
  androidArn: string;
  profileBucket: string;
  postBucket: string;
}

interface IEksAws {
  oauthAccessToken: string;
  loginAuthenticate: string;
  validateMemberInfo: string;
  gbdSearch: string;
  gbdAuthenticate: string;
  gbdQnAValidate: string;
  gbdGeneratePassword: string;
  gbdUpdatePassword: string;
  gbdSummary: string;
  medicaidSecretQuestions: string;
  medicaidUserSecretQA: string;
  medicaidSecretQAUpdate: string;
}

interface ISydneyMemberTenant {
  oauthAccessToken: string;
  memberSummary: string;
  memberEligibilityInfo: string;
  commercialGeneratePassword: string;
  commercialQnAValidate: string;
  commercialSearch: string;
  commercialUpdatePassword: string;
  gbdAuthenticate: string;
  gbdGeneratePassword: string;
  gbdQnAValidate: string;
  gbdSearch: string;
  loginAuthenticate: string;
  validateMemberInfo: string;
  gbdUpdatePassword: string;
  commercialLoginTreat: string;
  commercialRecoveryTreat: string;
  commercialSendOtp: string;
  commercialSaveCookie: string;
  memberValidateOtp: string;
  commercialSecurityQuestions: string;
  commercialTelephoneNumber: string;
  commercialTextNumber: string;
  commercialRecoveryNumber: string;
  commercialCredentialUpdate: string;
  memberContactsDetails: string;
}
interface IPSGBDTenant {
  oauthAccessToken: string;
  gbdContactsDetails: string;
  gbdSummary: string;
}
