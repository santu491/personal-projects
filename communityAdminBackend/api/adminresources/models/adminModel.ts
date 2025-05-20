import { roles } from '@anthem/communityadminapi/common';
import { IsArray, IsBoolean, IsDate, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateProfileRequest {
  @IsString() @IsOptional() id: string;
  @IsString() @IsOptional() role: string;
  @IsString() @IsOptional() displayTitle: string;
  @IsOptional() @IsDate() updatedAt: Date;
  @IsString() @IsOptional() firstName: string;
  @IsString() @IsOptional() lastName: string;
  @IsString() @IsOptional() displayName: string;
  @IsString() @IsOptional() aboutMe: string;
  @IsString() @IsOptional() interests: string;
  @IsString() @IsOptional() location: string;
  @IsOptional() @IsArray() communities: string[];
  @IsOptional() @IsString() profileImage?: string;
}

export class CreateProfileRequest {
  @IsString() @IsOptional() username: string;
  @IsIn(roles) role: string;
  @IsBoolean() @IsOptional() isPersona: boolean;
  @IsOptional() @IsArray() communities: string[];
  @IsString() @IsOptional() firstName: string;
  @IsString() @IsOptional() lastName: string;
  @IsString() @IsOptional() displayName: string;
  @IsString() @IsOptional() aboutMe: string;
  @IsString() @IsOptional() interests: string;
  @IsString() @IsOptional() location: string;
}

export class AdminIdentity {
  @IsString() id: string;
  @IsString() username: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() role: string;
  @IsString() active: string;
}

export class AdminImage {
  @IsString() adminId: string;
  @IsString() imageBase64: string;
}
