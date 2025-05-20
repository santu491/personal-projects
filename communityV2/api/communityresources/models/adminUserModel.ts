import { IsDate, IsString } from 'class-validator';

export class Admin {
  @IsString() id: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() role: string;
  @IsString() username: string;
  @IsString() category: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() displayName: string;
  @IsString() displayTitle: string;
  @IsString() profileImage: string;
  @IsString() password: string;
}
