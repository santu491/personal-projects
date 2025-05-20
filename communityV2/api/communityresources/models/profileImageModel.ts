import { IsString } from 'class-validator';

export class ProfileImage {
  @IsString() id: string;
  @IsString() userId: string;
  @IsString() profileImageBase64: string;
}
