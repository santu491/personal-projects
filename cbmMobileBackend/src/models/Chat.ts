import {IsEmail, IsString} from 'class-validator';

export class ChatInitRequest {
  @IsEmail() email!: string;
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsString() phone!: string;
  @IsString() lob!: string;
}

export type ChatInitPayload = {
  Email: string;
  firstName: string;
  lastName: string;
  phone: string;
  lob: string;
  latitude: string | null;
  longitude: string | null;
  ip: string;
  browser: string;
  region: string;
  timezone: string;
  websiteorgin: string;
  websitetitle: string;
  gc_route: string;
};

export type UserBaseData = {
  username: string;
  secureToken: string;
};
