import { ErrorResponseDTO } from './error';

/* eslint-disable @typescript-eslint/naming-convention */
export interface AddressDTO {
  addressOne: string;
  addressTwo: string;
  city: string;
  state: string;
  stateCode: string;
  zipcode: string;
}

export interface CommunicationDTO {
  consent: boolean;
  mobileNumber: string;
}

export interface SignUpRequestDTO {
  address: AddressDTO;
  clientGroupId: string;
  clientName: string;
  communication: CommunicationDTO;
  departmentName?: string;
  dob: string;
  emailAddress: string;
  empStatus: string;
  employerType: string;
  firstName: string;
  gender: string;
  isEmailVerified: boolean;
  isFrontDesk: boolean;
  isMigrated: boolean;
  isMobVerified: boolean;
  isPrivacyConsent: boolean;
  isQuickTutorialSkipped: boolean;
  isTempPasswordChanged: boolean;
  jobTitle: string;
  lastName: string;
  password: string;
  relStatus: string;
  userRole: string;
  userType: string;
}

export interface PersonalDetails {
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  dateOfBirth: Date;
  firstName: string;
  gender: string;
  lastName: string;
  relationshipStatus: string;
  state: string;
  zipcode: string;
}

export interface PersonalInformationMhsud {
  confirmEmailAddress: string;
  dateOfBirth: Date;
  emailAddress: string;
  firstName: string;
  lastName: string;
  memberId: string;
  notificationCheckBox: boolean;
  phoneExtension: string;
  phoneNumber: string;
}

export interface AccountSetUpData {
  email: string;
  phoneNumber: string;
  reEnterSecret: string;
  secret: string;
  voiceEmail: boolean;
}

export interface ConfirmStatus {
  employeeStatus: string;
  jobCategory: string;
  privacyPolicy: boolean;
  statementOfUnderstanding: boolean;
  subscriber: string;
  termsOfUse: boolean;
}

export interface VerifyPersonalDetails {
  dateOfBirth: Date;
  email: string;
  firstName: string;
  lastName: string;
}

export type SignUpData = PersonalDetails & AccountSetUpData & ConfirmStatus;

export type MhsudSignUpData = PersonalInformationMhsud;

export enum PersonalDetailFieldNames {
  ADDRESS_LINE_ONE = 'addressLineOne',
  ADDRESS_LINE_TWO = 'addressLineTwo',
  CITY = 'city',
  DATE_OF_BIRTH = 'dateOfBirth',
  FIRST_NAME = 'firstName',
  GENDER = 'gender',
  LAST_NAME = 'lastName',
  RELATIONSHIP_STATUS = 'relationshipStatus',
  STATE = 'state',
  ZIPCODE = 'zipcode',
}

export enum CreateAccountMhsudFieldNames {
  CONFIRM_EMAIL_ADDRESS = 'confirmEmailAddress',
  DATE_OF_BIRTH = 'dateOfBirth',
  EMAIL_ADDRESS = 'emailAddress',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  MEMBER_ID = 'memberId',
  NOTIFICATION_CHECK_BOX = 'notificationCheckBox',
  PHONE_EXTENSION = 'phoneExtension',
  PHONE_NUMBER = 'phoneNumber',
}

export enum AccountSetUpFieldNames {
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  RE_ENTER_SECRET = 'reEnterSecret',
  SECRET = 'secret',
  VOICE_EMAIL = 'voiceEmail',
}

export enum ConfirmStatusFieldNames {
  EMPLOYEE_STATUS = 'employeeStatus',
  JOB_CATEGORY = 'jobCategory',
  PRIVACY_POLICY = 'privacyPolicy',
  STATEMENT_OF_UNDERSTANDING = 'statementOfUnderstanding',
  SUBSCRIBER = 'subscriber',
  TERMS_OF_USE = 'termsOfUse',
}

export interface RememberDevice {
  rememberDevice: boolean;
}

export interface SignUpResponseDTO {
  data: MessageDTO | RegistrationResponseDTO;
  errors: ErrorResponseDTO[];
}

export interface MessageDTO {
  messages: string;
}

export interface RegistrationResponseDTO {
  DFD_id: string;
  benefit_package: string;
  group_number: string;
  isEmailVerified: boolean;
  parent_code: string;
  pingRiskId: string;
  status: string;
  success: boolean;
  user_id: string;
  username: string;
}

export interface UpdatePhoneNumber {
  phoneNumber: string;
}

export interface ResetSecret {
  reEnterSecret: string;
  secret: string;
}

export enum LoginSetUpFieldNames {
  EMAIL = 'email',
  SECRET = 'secret',
}

export interface Login {
  email: string;
  secret: string;
}

export interface lookUpResponseDTO {
  data: MessagesDTO;
  errors: ErrorDetailDTO[];
}

export interface MessagesDTO {
  message: string;
}

export interface ErrorDetailDTO {
  message: string;
}

export interface MhsudSignupResponseDTO {
  message: string;
  status: string;
}

export interface MhsudSignupRequest {
  clientUri: string;
  confirmEmail: string;
  dateOfBirth: string;
  email: string;
  firstName: string;
  lastName: string;
  memberId: string;
  messageCenterOptIn: boolean;
  phone: string;
  phoneExt: string;
}
