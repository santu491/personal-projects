import { IsBoolean, IsInt, IsString } from 'class-validator';

export class SMTPSettings {
  @IsString() smtpServer: string;
  @IsString() fromEmailAddress: string;
  @IsString() adminEmail: string;
  @IsString() fromEmailName: string;
  @IsBoolean() sendEmail: boolean;
  @IsInt() smtpPort: number;
  @IsString() flagReviewEmail: string;
  @IsString() apiPath: string;
  @IsString() adminUrl: string;
}
