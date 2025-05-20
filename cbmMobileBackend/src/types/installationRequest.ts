import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class InstallationRequest {
  @IsString()
  @IsNotEmpty()
  appVersion!: string;

  @IsString()
  locale!: string;

  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsString()
  @IsNotEmpty()
  deviceToken!: string;

  @IsNumber()
  timeZoneOffset?: number;

  @IsString()
  osVersion?: string;

  @IsNumber()
  badge?: number;
}

export class InstallationDeleteRequest {
  @IsString()
  @IsNotEmpty()
  deviceToken!: string;
}

export type DeviceDetails = {
  appVersion: string;
  locale: string;
  platform: string;
  deviceToken: string;
  timeZoneOffset?: number;
  osVersion?: string;
  createdTS: Date;
  updatedTS: Date;
  badge: number;
  endpointArn?: string;
};
