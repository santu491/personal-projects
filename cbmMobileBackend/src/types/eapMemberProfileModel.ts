import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  EMPLOYMENT_STATUS_VALUES,
  FlowNames,
  GENDER_VALUES,
  JOB_TITLE_VALUES,
  RELATIONSHIP_STATUS_VALUES,
} from '../constants';

/**
 * Represents a generic response structure from services.
 * @template T The type of the `value` property in the data object.
 */
export interface ServiceResponse<T = unknown> {
  /** The HTTP status code of the response, if applicable. */
  statusCode?: number;
  /** Details about any errors that occurred during the operation. */
  errors?: T;
  data?: T;
}

export class Address {
  @IsString() @IsNotEmpty() addressOne!: string;
  @IsString() @IsOptional() addressTwo?: string;
  @IsString() @IsNotEmpty() city!: string;
  @IsString() @IsNotEmpty() state!: string;
  @IsString() @IsNotEmpty() stateCode!: string;
  @IsString() @IsNotEmpty() @Length(5, 5) zipcode!: string;
}

export class Communication {
  @IsString() @IsNotEmpty() @Length(12, 12) mobileNumber!: string;
  @IsBoolean() @IsNotEmpty() consent!: boolean;
  @IsOptional() @IsDateString() updatedDateForMobileNumber?: string;
}

export class CreateUserRequest {
  @IsString() @IsNotEmpty() employerType!: string;
  @IsString() @IsNotEmpty() userRole!: string;
  @IsString() @IsNotEmpty() firstName!: string;
  @IsString() @IsNotEmpty() lastName!: string;
  @IsString() @IsNotEmpty() dob!: string;
  @IsString() @IsNotEmpty() @IsIn(GENDER_VALUES) gender!: string;
  @IsString()
  @IsNotEmpty()
  @IsIn(RELATIONSHIP_STATUS_VALUES)
  relStatus!: string;
  @IsString() @IsNotEmpty() @IsIn(EMPLOYMENT_STATUS_VALUES) empStatus!: string;
  @IsString() @IsNotEmpty() @IsIn(JOB_TITLE_VALUES) jobTitle!: string;
  @IsString() @IsNotEmpty() userType!: string;
  @IsString() @IsNotEmpty() @IsEmail() emailAddress!: string;
  @ValidateNested() address!: Address;
  @IsString() @IsNotEmpty() clientName!: string;
  @IsString() @IsNotEmpty() password?: string;
  @ValidateNested() communication!: Communication;
  @IsBoolean() @IsNotEmpty() isMigrated!: boolean;
  @IsBoolean() @IsNotEmpty() isTempPasswordChanged!: boolean;
  @IsBoolean() @IsNotEmpty() isMobVerified!: boolean;
  @IsBoolean() @IsNotEmpty() isEmailVerified!: boolean;
  @IsBoolean() @IsNotEmpty() isQuickTutorialSkipped!: boolean;
  @IsString() @IsNotEmpty() departmentName!: string;
  @IsBoolean() @IsNotEmpty() isPrivacyConsent!: boolean;
  @IsString() @IsNotEmpty() clientGroupId!: string;
  @IsBoolean() @IsNotEmpty() isFrontDesk!: boolean;
}

export class UpdateUserRequest {
  @IsOptional() iamguid!: string;
  @IsString() @IsNotEmpty() employerType!: string;
  communication!: Communication;
}

export class UserProfileResponse {
  @IsDateString() @IsNotEmpty() dob?: string;
  communication?: Communication;
  @IsDateString() @IsNotEmpty() createdDate!: string;
  @IsString() @IsNotEmpty() iamguid!: string;
  @IsDateString() @IsNotEmpty() lastLoginDateTime!: string;
  @IsString() @IsOptional() parentCode?: string;
  @IsString() @IsNotEmpty() userType!: string;
  @IsString() @IsNotEmpty() clientGroupId!: string;
  @IsBoolean() @IsNotEmpty() isTempPasswordChanged!: boolean;
  @IsBoolean() @IsNotEmpty() isPrivacyConsent!: boolean;
  @IsString() @IsNotEmpty() relStatus!: string;
  @IsString() @IsNotEmpty() emailAddress?: string;
  @IsString() @IsOptional() maxNoOfEapSessions?: string;
  @IsBoolean() @IsNotEmpty() isQuickTourSkipped!: boolean;
  @IsString() @IsNotEmpty() departmentName!: string;
  @IsBoolean() @IsNotEmpty() isFrontDesk!: boolean;
  @IsString() @IsNotEmpty() groupName!: string;
  @IsOptional() latestHipResponse?: unknown;
  @IsString() @IsNotEmpty() userRole!: string;
  @IsString() @IsOptional() benefitPackage?: string;
  @IsBoolean() @IsNotEmpty() isMobVerified!: boolean;
  @IsString() @IsNotEmpty() jobTitle!: string;
  @IsString() @IsNotEmpty() employerType!: string;
  @IsString() @IsNotEmpty() createdBy!: string;
  @IsString() @IsNotEmpty() updatedBy!: string;
  @IsString() @IsNotEmpty() pingRiskId!: string;
  @IsBoolean() @IsNotEmpty() isMigrated!: boolean;
  @IsString() @IsOptional() mdLiveOU?: string;
  @IsBoolean() @IsNotEmpty() isEmailVerified!: boolean;
  @IsString() @IsNotEmpty() emailTemplateDomain!: string;
  @IsString() @IsNotEmpty() firstName?: string;
  @IsString() @IsNotEmpty() gender!: string;
  @IsDateString() @IsNotEmpty() updatedDate!: string;
  @IsString() @IsNotEmpty() lastName?: string;
  address?: Address;
  @IsString() @IsNotEmpty() _id!: string;
  @IsString() @IsOptional() latestSmSessionCookie?: string;
  @IsString() @IsNotEmpty() empStatus!: string;
  @IsString() @IsNotEmpty() clientName!: string;
  @IsOptional() @IsNumber() notificationCount?: number;
}

export class AuthenticationRequest {
  @IsString() @IsNotEmpty() @IsEmail() username!: string;
  @IsString() @IsNotEmpty() pdsw!: string;
}

class ResponseContext {
  @IsString()
  confirmationNumber!: string;
}

export class AuthenticationResponse {
  @IsString() token!: string;
  @IsString() createdAt!: Date;
  @IsString() expiresAt!: Date;
  @IsString() expiresIn!: number;
  @IsString() status!: string;
  @IsString() mfaStatus!: string;
  @IsString() pingRiskId!: string;
  @IsBoolean() isSubgroupValid!: boolean;
  @IsBoolean() isConsentExpired!: boolean;
  @IsString() cookie!: string;
  @IsBoolean() authenticated!: boolean;
  @IsString() secureToken!: string;
  @IsObject()
  @ValidateNested()
  responseContext!: ResponseContext;
  @IsObject()
  @ValidateNested()
  profile!: UserProfileResponse;
}

export class ForgotUserNameOrPasswordRequest {
  @IsNotEmpty() @IsString() firstName!: string;
  @IsNotEmpty() @IsString() lastName!: string;
  @IsNotEmpty() @IsString() dob!: string;
  @IsNotEmpty() @IsString() @IsEmail() emailAddress!: string;
}

export class ChangePasswordRequest {
  @IsNotEmpty() @IsString() @IsEmail() userName!: string;
  @IsNotEmpty() @IsString() newPassword!: string;
}

export class SendOtpRequest {
  @IsString() @IsNotEmpty() channel!: string;
  @IsString() @IsNotEmpty() @IsEmail() userName!: string;
  @IsString() @IsNotEmpty() pingRiskId!: string;
}

export class ValidateOtpRequest {
  @IsString() @IsNotEmpty() @Length(6, 6) otp!: string;
  @IsString() @IsNotEmpty() rememberDevice!: string;
  @IsString() @IsNotEmpty() pingRiskId!: string;
  @IsString() @IsNotEmpty() pingDeviceId!: string;
  @IsString() @IsNotEmpty() pingUserId!: string;
  @IsString() @IsNotEmpty() @IsEmail() userName!: string;
  @IsString() @IsNotEmpty() @IsIn(Object.values(FlowNames)) flowName!: string;
}
export class NotificationsPreference {
  @IsBoolean() enabled?: boolean;
  @IsArray() topics?: string[];
}
export class MemberPreferences {
  @IsObject() pushNotifications!: NotificationsPreference;
}

export class ClientDetails {
  @IsString() userName?: string;
  @IsString() clientName?: string;
  @IsArray() alias?: string[];
  @IsString() benefitPackage?: string;
  @IsString() mdLiveOU?: string;
  @IsString() onboardType?: string;
  @IsString() organizationName?: string;
  @IsString() groupId?: string;
  @IsString() groupName?: string;
  @IsString() planId?: string;
  @IsString() brandCode?: string;
  @IsString() subGroupName?: string;
  @IsString() brandName?: string;
  @IsString() sessionsProvide?: string;
  @IsString() parentCode?: string;
  @IsString() livePersonChat?: boolean;
  @IsString() updatedBy?: string;
  @IsString() createdDate?: Date;
  @IsString() updatedDate?: Date;
  @IsString() createdBy?: string;
  @IsString() isSameParentCode?: boolean;
  @IsString() footerDisclosureNote?: string;
  @IsString() clientId?: string;
  @IsString() logoUrl?: string;
}
