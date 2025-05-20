import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsInt,
} from 'class-validator';

export class UpdateUserRequest {
  @IsString() @IsNotEmpty() @IsOptional() firstName?: string;
  @IsString() @IsNotEmpty() @IsOptional() lastName?: string;
  @IsString() @IsNotEmpty() @IsOptional() secret?: string;
}

export class NotificationReadRequest {
  @IsArray() @IsNotEmpty() readNotificationId!: string[];
}

export class InstallationTokenModel {
  @IsInt() @IsNotEmpty() count!: number;
  @IsString() @IsNotEmpty() deviceToken!: string;
}
