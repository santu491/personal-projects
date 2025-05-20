import {IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator';

export class NotificationActionReq {
  @IsString() notificationId!: string;
  @IsBoolean() isRemove!: boolean;
  @IsBoolean() @IsOptional() isClearAll?: boolean;
}

export class ManualPN {
  @IsBoolean() test!: boolean;
  @IsString() env!: string;
  @IsNumber() month?: number;
}
