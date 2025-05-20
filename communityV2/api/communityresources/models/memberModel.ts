import { IHttpHeader, IUrlParam } from '@anthem/communityapi/http';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export interface ISearchUserFilter {
  username?: string;
  iamGuid?: string;
  repositoryEnum: string[];
  userRoleEnum: string[];
}

export interface IUpdateMedicaidSecretQA {
  requestContext: IRequestContext;
  identityInfo: IIdentityInfoUpdateGbdQA;
  modifyAttributes: IModifiledQuestion[];
  header?: IHttpHeader;
}

export interface IUserMedicaidSecretQA {
  requestContext: IRequestContext;
  dn?: string;
  repositoryEnum?: string;
  header?: IHttpHeader;
}

export interface IRequestContext {
  application: string;
  requestId: string;
  username: string;
}

export interface IIdentityInfoUpdateGbdQA {
  iamGuid: string;
  repositoryEnum: string;
  dn: string;
}

export interface IModifiledQuestion {
  modifyAttributeEnum: string;
  values: string[];
  modifyTypeEnum: string;
}

export class SaveCookieRequestDetails {
  token?: string;
  url: string;
  requestName: string;
  header: IHttpHeader[];
}
export interface IFullEmailAddress {
  email: IEmailDetails[];
}

export interface IEmailDetails {
  emailAddress: string;
  emailUid: string;
}

export interface IFullMobileNumber {
  textNumberDetails: IMobileDetails[];
}

export interface IMobileDetails {
  deviceNumber: string;
  textNumberUid: string;
}

export interface IMemberSearchRequest {
  searchUserFilter: ISearchUserFilter;
  requestContext: IRequestContext;
}

export interface IUpdatePasswordResponse {
  responseContext?: IRequestContext;
  requestContext: IRequestContext;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  username: string;
}

export class TreatRequestDetails {
  token?: string;
  url: string;
  requestName: string;
  header: IHttpHeader[];
}

export interface IMemberPasswordRequest {
  username?: string;
  iamGuid?: string;
  dn?: string;
  currentPassword?: string;
  newPassword?: string;
  repositoryEnum?: string;
  requestContext?: IRequestContext;
}

export interface IMemberQAValidateRequest {
  requestContext: IRequestContext;
  username: string;
  secretAnswerText1: string;
  secretAnswerText2?: string;
  secretAnswerText3?: string;
  secretAnswerText4?: string;
}

export interface IMemberAuthenticateRequest {
  requestContext?: IRequestContext;
  repositoryEnum?: string;
  userRoleEnum?: string;
  username?: string;
  userNm?: string;
  password?: string;
}
export interface IResponseContext {
  confirmationNumber: string;
}

export interface IUserAccountStatus {
  disabled: boolean;
  locked: boolean;
  forceChangePassword: boolean;
  badSecretAnsCount: number;
  badPasswordCount: number;
  isUserNameValid: boolean;
  isSecretQuestionValid: boolean;
}

export interface ISecretQuestionAnswer {
  question: string;
  answer?: string;
}

export interface IUpdateMedicaidSecretQAResponse {
  responseContext: IResponseContext;
  user: IUser;
  secretQuestionAnswers: ISecretQuestionAnswer;
}
export interface ISecurityQuestions {
  data?: ISecurityUpdateQuestions;
  usernm?: string;
  webguid?: string;
  memberId?: string;
  headers?: IHttpHeader[];
  secretQuestions?: ISecurityQuestionAnswer[];
  urlParams?: IUrlParam[];
  memberType?: string;
  dn?: string;
}

export interface ISecurityUpdateQuestions {
  secretQuestions?: ISecurityQuestionAnswer[];
}

export interface IMedicaidSecretQuestionsList {
  responseContext: IResponseContext;
  secretQuestions: string[];
}

export interface IMedicaidUsersSecretQAResponse {
  responseContext?: IResponseContext;
  user?: IUser;
}
export interface ISecurityQuestionAnswer {
  questionNo?: string;
  question: string;
  isAnswered?: string;
  answer?: string;
}

export interface IUser {
  emailAddress: string;
  username: string;
  iamGuid: string;
  repositoryEnum: string;
  userRoleEnum: string;
  firstName: string;
  lastName: string;
  dn: string;
  userAccountStatus: IUserAccountStatus;
  memberOf: string[];
  secretQuestionAnswers: ISecretQuestionAnswer[];
}

export interface IMemberSearchResponse {
  memberType?: MemberType;
  responseContext: IResponseContext;
  user: IUser[];
  status?: number;
}

export interface IMemberAuthenticateResponse {
  responseContext: IResponseContext;
  user: IUser;
  cookie: string;
  authenticated: boolean;
  cntrctTermDt: string;
  status: number;
}
export interface ICommercialAuthenticateRequest {
  userNm?: string;
  password?: string;
}

export interface IMemberTwoFAAuthenticateRequest {
  member: IMemberTwoFAParameters;
}

export interface IMemberTwoFAParameters {
  firstNm: string;
  lastNm: string;
  dob: string;
  hcid?: string;
  hcId?: string;
  mbrGenericId?: string;
  employeeId?: string;
  metaPersonType?: string;
  usernm?: string;
  email?: string;
}

export interface IMemberTwoFALoginThreatRequest {
  hcid?: string;
  cookieValue?: string;
  model: string;
  usernm: string;
  webguid?: string;
  metaIpaddress: string;
  togglests?: string;
  metaTransid?: string;
  brand?: string;
  brandCode?: string;
  marketingBrand?: string;
  deviceFingerprint?: IFingerPrintDetails;
  metaPersonType?: string;
  memberType?: string;
}

export interface IMemberTwoFALoginThreatResponse {
  body?: IMemberLoginThreatResponse;
  headers?: IMemberLoginCookieResponse;
}

export interface IMemberLoginThreatResponse {
  status: string;
  suggestedAction?: string;
  suggestedActionDesc?: string;
  metaIpaddress?: string;
  promptForDeviceUpdate?: string;
  fingerprintId?: string;
  pingRiskId?: string;
  cookieValue?: string;
}

export interface IMemberLoginCookieResponse {
  'set-cookie': string[];
}

export interface IMemberEncryptedCookieResponse {
  output: string;
}

export interface IMemberTwoFAAuthenticateResponse {
  individual: IIndividualEvent;
}

export interface IValidateOtpResponse {
  secureAuthResponse: ISecureAuthResponse;
  valid: boolean;
}

export interface IIndividualEvent {
  events: IToggleEvent[];
  member: ICommercialAuthenticateResponse;
  multifactorId: string;
}

export interface IContactList {
  channel: string;
  contactUid: string;
  contactValue: string;
}

export interface IMemberContactResponse {
  contact: IContactsDetail;
}

export interface IContactsDetail {
  contactUid: string;
  contactValue: string;
  channel: string;
}

export interface IToggleEvent {
  timePeriod: ITimeRange;
  status: string | boolean;
  toggleReason: string;
}

export interface IMemberInformation {
  mcId?: string;
  userNm?: string;
  webguid?: string;
  iamGuid?: string;
  enforceStrict2FA?: string;
  personType?: string;
}

export interface IPhoneNumber {
  phoneNbrDetails?: IRecoveryNumber;
  usernm?: string;
  status?: number;
}

export interface IProfileRecoveryNumber {
  data?: IPhoneNumber;
  requestName?: string;
  method?: string;
  usernm?: string;
  memberType?: string;
}

export interface IMedicaidARNRequest {
  data?: IMedicaidUpdateARN;
  header?: IHttpHeader;
}

export interface IMedicaidUpdateARN {
  hcId?: string;
  usernm?: string;
  phoneType?: string;
  phoneNumber?: string;
  status?: number;
  updatedStatus?: string;
}

export interface IProfilePhoneNumber {
  telephone: IProfilePhone[];
}

export interface ITextPhoneNumber {
  textNumberDetails: ITextPhone[];
}

export interface IProfilePhone {
  phoneNbr?: string;
  telephoneUid?: string;
  preferred?: boolean;
}

export interface ITextPhone {
  preferred?: boolean;
  deviceNumber?: string;
  textNumberUid?: string;
}

export interface IProfileContactNumbers {
  actualNumbers?: IProfileMobileType[];
  recoveryNumbers?: IProfileMobileType[];
}

export interface IProfileMobileType {
  phoneNbr?: string;
  phoneType?: string;
}

export interface IRecoveryNumber {
  phoneNbr?: string;
  phoneNbrUid?: string;
}

export interface IProfileCredentials {
  currentUsernm?: string;
  newUsernm?: string;
  currentPassword?: string;
  confirmPassword?: string;
  newPassword?: string;
  memberId?: string;
  webguid?: string;
  updateStatus?: string;
  status?: number;
  username?: string;
  memberType?: string;
  responseContext?: IRequestContext;
  body?: IResponseBody;
}

export interface IResponseBody {
  exceptions?: IExceptions[];
}

export interface IExceptions {
  type?: string;
  code?: string;
  message?: string;
  detail?: string;
}
export interface ITimeRange {
  startDateTime: string;
  endDateTime: string;
}

export interface ISendOtpResponse {
  secureAuthResponse: ISecureAuthResponse;
  pingDeviceId: string;
  pingUserId: string;
}

export interface ISecureAuthResponse {
  adhocOTPAudit?: IOTPAudit;
  id?: string;
  type?: string;
  status?: string;
}

export interface IOTPAudit {
  status: string;
}

export interface IIndicator {
  text: string;
  value: string;
}
export interface ICommercialAuthenticateResponse {
  authenticated: string;
  webguid: string;
  username: string;
  mcid: string;
  hcId: string;
  dob: string;
  firstNm: string;
  lastNm: string;
  mbrSeqNum: string;
  personType: string;
  sourceSystemId: string;
  groupId: string;
  cntrctEffDt: string;
  cntrctTermDt: string;
  webmdId: string;
  sessionIdentifier: string;
  lstLoginDt: string;
  indicators: IIndicator[];
  brandCd: string[];
  status: number;
}
export interface IGbdSummaryRequest {
  username?: string;
  migrationEligible?: boolean;
  hcids?: string[];
}
export interface IUserAccountSummary {
  type: string;
  userUuid: string;
  username: string;
  hcid: string;
  firstName: string;
  lastName: string;
  lastLoginDate: Date;
  createDate: Date;
  effectiveDate: Date;
  terminationDate: Date;
}

export interface IGbdSummaryResponse {
  userAccountSummaries: IUserAccountSummary[];
}

export interface IEligibility {
  groupId: string;
  subgroupId: string;
  type: string;
  mcid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  lobdId: string;
  homeZip: string;
  eligibilityStatusCode: string;
  activeStatus: string;
  brand: string;
  sourceSystem: string;
  mbuTypeCode: string;
  productName: string;
  market: string;
  marketingBrand: string;
  dateTermination: string;
}

export interface IEligibilityResponse {
  status: number;
  eligibilities: IEligibility[];
}

export interface ISecurityQAResponse {
  secretAnswerMatched: boolean;
  secretAnswerAttemptsLeft: number;
  responseContext: IQAValidateDetails;
}

export interface IQAValidateDetails {
  confirmationNumber: string;
}

export interface IFingerPrintDetails {
  uaString: string;
  uaPlatform: string;
  language: string;
  colorDepth: number;
  pixelRatio: number;
  screenResolution: string;
  availableScreenResolution: string;
  timezone: string;
  timezoneOffset: number;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDb: boolean;
  addBehavior: boolean;
  openDatabase: boolean;
  cpuClass: string;
  platform: string;
  doNotTrack: string;
  plugins: string;
  canvas: string;
  webGl: string;
  adBlock: boolean;
  userTamperLanguage: boolean;
  userTamperScreenResolution: boolean;
  userTamperOS: boolean;
  userTamperBrowser: boolean;
  marketingBrand: string;
  brandcode: string;
  cookieSupport: boolean;
  uaBrowser: IUaBrowser;
  uaDevice: IUaDevice;
  uaEngine: IUaEngineOs;
  uaOS: IUaEngineOs;
  uaCPU: IUaCPU;
  touchSupport: ITouchSupport;
}

export interface IUaBrowser {
  name: string;
  version: string;
  major: string;
}

export interface IUaDevice {
  model: string;
  type: string;
  vendor: string;
}

export interface IUaEngineOs {
  name: string;
  version: string;
}

export interface IUaCPU {
  architecture: string;
}

export interface ITouchSupport {
  maxTouchPoints: number;
  touchEvent: boolean;
  touchStart: boolean;
}

export interface ICookieSaveResponse {
  status: string;
  cookieValue: string;
}
export interface IGbdMemberContactRequest {
  hcId: string;
  activeInd: boolean;
}
export interface IContactDetail {
  contactType: string;
  contactSubType: string;
  contactValue: string;
  effectiveDate?: Date;
  terminationDate?: Date;
  source: string;
  sourceDescription: string;
}
export interface IGbdMemberContactResponse {
  hcId: string;
  contactDetails: IContactDetail[];
  status?: number;
}
export class WebUserRequestData {
  token: string;
  apiKey: string;
  header: IHttpHeader;
  isMedicaidUser: boolean;
}
export class SendOtpRequest {
  channel: string;
  contactUid?: string;
  recoveryContact?: string;
  recoveryNbr?: string;
}

export interface ISendOtpRequest {
  userName: string;
  model: string;
  metaBrandCode: string;
  metaPersonType: string;
  apiKey: string;
  cookie: string;
  requestName: string;
}
export class LoginModel {
  @IsString() acceptedTouVersion: string;
  @IsString() username: string;
  @IsString() password: string;
  @IsString() memberType: string;
  @IsString() metaIpaddress: string;
  @IsArray() market: string[];
  @IsOptional() @IsString() marketingBrand?: string;
  @IsOptional() @IsString() cookie: string;
  @IsOptional() @IsBoolean() isPNLogin?: boolean;
}

export class ForgotUserModel {
  @IsString() fname: string;
  @IsString() lname: string;
  @IsString() dob: string;
  @IsString() metaIpaddress?: string;
  @IsString() memberType: string;
  @IsOptional() @IsArray() market?: string[];
  @IsOptional() @IsString() marketingBrand?: string;
  @IsOptional() @IsString() hcid?: string;
  @IsOptional() @IsString() employeeId?: string;
  @IsOptional() @IsString() cookie: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() mbrGenericId?: string;
  @IsOptional() @IsString() digitalAuthenticationCode?: string;
  @IsOptional() @IsString() studentId?: string;
}

export class SendOTPRequest {
  @IsString() channel: string;
  @IsOptional() @IsString() contactUid?: string;
  @IsOptional() @IsString() recoveryContact?: string;
  @IsOptional() @IsString() encryptedContact?: string;
  @IsOptional() @IsString() metaPersonType?: string;
  @IsString() usernm: string;
  @IsString() memberType: string;
  @IsOptional() @IsString() metaBrandCode: string;
  @IsOptional() @IsString() model: string;
  @IsOptional() @IsString() applicationType?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() hcid?: string;
  @IsOptional() @IsString() cookie?: string;
  @IsOptional() @IsString() recoveryNbr?: string;
}

export class SendOtpModel {
  @IsString() channel: string;
  @IsString() contactUid: string;
  @IsString() userName: string;
  @IsString() memberType: string;
  @IsOptional() @IsString() metaPersonType?: string;
  @IsOptional() @IsString() cookie?: string;
}

export class ValidateOtpModel {
  @IsString() otp: string;
  @IsOptional() @IsString() pingRiskId: string;
  @IsOptional() @IsString() pingDeviceId: string;
  @IsOptional() @IsString() pingUserId: string;
  @IsOptional() @IsString() model: string;
  @IsString() memberType: string;
  @IsString() usernm: string;
  @IsOptional() @IsString() metaBrandCode: string;
  @IsOptional() @IsString() metaPersonType?: string;
  @IsOptional() @IsString() cookie: string;
  @IsOptional() @IsBoolean() isLogin: boolean;
  @IsOptional() @IsBoolean() isPNLogin?: boolean;
}

export class SaveCookieModel {
  @IsString() usernm: string;
  @IsString() saveDeviceOrCookieFlag: string;
  @IsString() memberType: string;
  @IsOptional() @IsString() cookieValue: string;
  @IsOptional() @IsString() transientUserNm: string;
  @IsOptional() @IsString() fingerprintId: string;
  @IsOptional() @IsString() fingerprint: IFingerPrintDetails;
  @IsOptional() @IsString() metaIpaddress: string;
  @IsOptional() @IsString() metaPersonType?: string;
}

export class QAValidationModel {
  @IsString() memberType: string;
  @IsString() username: string;
  @IsString() secretAnswerText1: string;
  @IsOptional() @IsString() secretAnswerText2?: string;
  @IsOptional() @IsString() secretAnswerText3?: string;
  @IsOptional() @IsString() secretAnswerText4?: string;
  @IsOptional() @IsBoolean() isPNLogin?: boolean;
}

export class UpdatePasswordModel {
  @IsString() memberType: string;
  @IsString() username: string;
  @IsString() newPassword: string;
  @IsOptional() @IsString() iamGuid: string;
  @IsOptional() @IsString() dn: string;
  @IsOptional() @IsString() currentPassword: string;
}

export class MemberType {
  @IsBoolean() isGbdMember: boolean;
}
