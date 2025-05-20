import { IsArray, IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class LoginModel {
  @IsString() username: string;
  @IsString() password: string;
}

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
  @IsBoolean() active: boolean;
  @IsBoolean() isPersona: boolean;
  @IsOptional() @IsArray() communities: string[];
  @IsOptional() @IsString() location: string;
  @IsOptional() @IsString() aboutMe: string;
}

export class ActivityAuthor {
  @IsString() id: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() displayName: string;
  @IsString() profilePicture: string;
}
