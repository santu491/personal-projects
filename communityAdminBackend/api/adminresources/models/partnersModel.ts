import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class Partners {
  @IsString() @IsOptional() id?: string;
  @IsString() title: string;
  @IsBoolean() active: boolean;
  @IsString() logoImage: string;
  @IsString() articleImage?: string | null;
  @IsString() type?: string;
}

export class PartnerRequest {
  @IsString() title: string;
  @IsString() @IsOptional() logoImage: string;
  @IsBoolean() @IsOptional() active: boolean;
  @IsString() @IsOptional() articleImage?: string | null;
  @IsString() @IsOptional() type?: string;
}
