import { IsDate, IsString } from 'class-validator';

export class Blocked {
  @IsString() id: string;
  @IsString() blockingUser: string;
  @IsString() blockedUser: string;
  @IsDate() createdDate: Date;
}
