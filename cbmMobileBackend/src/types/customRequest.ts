import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import {Request as ExpressRequest} from 'express';

interface UserBasicInfo {
  _id: string;
  email: string;
  roles: string[];
}

export interface Request extends ExpressRequest {
  user?: UserBasicInfo | null;
}
export class ErrorModel {
  @IsString() id?: string;
  @IsInt() errorCode?: number;
  @IsString() title?: string;
  @IsString() detail?: string;
}

export type GeneralKeyValue = {
  key: string;
  value: string;
};

export class Value {
  @IsString() token?: string;
  @IsArray() headers?: GeneralKeyValue[];
}

// export class Results {
//   @IsBoolean() isSuccess!: boolean;
//   @IsBoolean() isException!: boolean;
//   @ValidateNested() value?: Value;
//   @IsArray() errors?: ErrorModel[];
//   @IsInt() statusCode?: number;
// }

export class ResponseData {
  @ValidateNested() data?: Value;
  @IsArray() errors?: ErrorModel[];
  @IsInt() statusCode?: number;
}

export class MemberOAuthPayload {
  @IsString() clientId!: string;
  @IsString() userName?: string;
  @IsString() iamguid?: string;
  @IsArray() @IsNotEmpty() permissions?: string[];
  @IsString() clientName?: string;
  @IsString() installationId?: string;
  @IsString() sessionId?: string;
}
