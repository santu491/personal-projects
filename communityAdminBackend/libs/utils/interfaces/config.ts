import { IHttpHeader } from '@anthem/communityadminapi/http';
import { Agenda } from 'agenda/es';

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

interface IPublic {
  eGeneralSearch: string;
  eAutoComplete: string;
}

interface IMember {
  searchUrl: string;
  authenticationURL: string;
}

interface IOnPrem {
  apiKey: string;
  accesstoken: string;
}

interface IRestApi {
  apiKey: string;
  metaSender: string;
  keepAliveSocket: boolean;
  timeout: number;
  noSsl: boolean;
  proxy: string;
  public: IPublic;
  userInfo: string;
  customHeaders: { name: string; value: string }[];
  replaceHost: { default: string; new: string }[];
  strSessionId: string;
  member: IMember;
  onPrem: IOnPrem;
  webUserHeader: IHttpHeader;
  auntBertha: IAuntBertha;
  healthWise: IHealthWise;
  contentMod: IContentMod;
  internal: IInternal;
  userProfile: IUserProfile;
  meredithApi?: IMeredith;
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
export interface IConfig {
  app: IApp;
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
  demoUsers: string[];
  aws: IAws;
  wordList: IWords;
}

interface IAuntBertha {
  serviceTags: string;
  getProgramById: string;
  getProgramListByZipCode: string;
}

interface IHealthWise {
  token: string;
  authenticate: string;
  cacheValidity: number;
  topicById: string;
  topicByConceptIdAspectId: string;
}

interface IMeredith {
  getArticle: string;
  accessKey: string;
}

interface IContentMod{
  url: string
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

interface IMongoClientOptions {
  sslValidate: boolean,
  useUnifiedTopology: boolean,
  retryWrites: boolean
}

interface IDatabase {
  options: IMongoClientOptions;
  endpoint: string;
  certPath: string;
  name: string;
  username: string;
  secret: string;
  isLocal: boolean;
}

interface IUserProfile {
  BaseUrlPath: string;
}

interface ISmtp {
  service: string;
  username: string;
  password: string;
  smtpServer: string;
  flagReviewEmail: string;
  adminEmail: string;
  fromEmailAddress: string;
  fromEmailName: string;
  sendEmail: boolean;
  smtpPort: number;
  apiPath: string;
  adminUrl: string;
}

interface IMessageProducer {
  channel: string,
  id: string,
  activityIntent: string,
  storyIntent: string,
  sourceOfMessage: string
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
  iosArn: string;
  androidArn: string;
  profileBucket: string;
  postBucket: string;
  deleteProfileQueue: string;
  emailQueue: string;
}

interface IWords {
  badWords: string[];
  sensitiveWords: string[],
  exceptionMsgWords: string[]
}
