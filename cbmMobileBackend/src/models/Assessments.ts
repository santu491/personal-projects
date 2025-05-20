import {IsArray, IsOptional, IsString} from 'class-validator';

export class AssessmentRequest {
  @IsString() iamguid!: string;
  @IsString() surveyId!: string;
  @IsString() calibrateHostName!: string;
  @IsOptional() @IsString() clientURI?: string;
  @IsString() domainName!: string;
  @IsOptional() @IsString() clientLogoFileName?: string;
  @IsOptional() @IsString() parentLogoFileName?: string;
  @IsOptional() @IsString() favIconFileName?: string;
  @IsString() assistantPhoneNumber!: string;
  @IsArray() bannerText!: BannerText[];
  @IsOptional() @IsString() programName?: string;
}

export type BannerText = {
  text: string;
  value: string;
};

export interface CalibrateParticipantIdResponse {
  surveyParticipantId: string;
}

export interface ClientAssessmentConfig {
  surveyId: string;
  calibrateHostName: string;
  clientURI: string;
  domainName: string;
  clientLogoFileName: string;
  parentLogoFileName: string;
  favIconFileName: string;
  assistantPhoneNumber: string;
  bannerText: BannerText[];
  programName: string;
  userAssessmentConfig: string;
  memberAssessmentBasePath: string;
  userAssessmentBasePath: string;
}
