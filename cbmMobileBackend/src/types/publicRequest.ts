import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class LogInRequest {
  @IsString() @IsEmail() @IsNotEmpty() email!: string;
  @IsString() @IsNotEmpty() secret!: string;
}

export class FupRequest {
  @IsString() @IsNotEmpty() version!: string;
}

export class PublicAuth {
  @IsString() @IsNotEmpty() clientId!: string;
  @IsString() @IsOptional() installationId?: string;
  @IsString() @IsOptional() sessionId?: string;
  @IsString() @IsOptional() deviceModel?: string;
  @IsString() @IsOptional() deviceOsVersion?: string;
  @IsString() @IsOptional() appVersion?: string;
}

export type Client = {
  userName: string;
  enabled: boolean;
  logoUrl: string;
  supportNumber: string;
};
