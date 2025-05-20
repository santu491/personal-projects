import {
  IsArray,
  IsBoolean,
  IsInt,
  IsString,
  ValidateNested
} from 'class-validator';

export type ValueType = [];

export class Results {
  @IsBoolean() isSuccess: boolean;
  @IsBoolean() isException: boolean;
  @ValidateNested() value?: ValueType;
  @IsArray() errors?: ErrorModel[];
}

export class BaseResponse {
  @ValidateNested() data: Results;
}

export class ErrorModel {
  @IsString() id?: string;
  @IsInt() errorCode: number;
  @IsString() title: string;
  @IsString() detail: string;
}
