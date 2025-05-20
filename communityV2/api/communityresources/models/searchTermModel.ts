import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { DisplayName } from './communitiesModel';

export class SearchTerm {
  @IsString() id: string;
  @IsString() term: string;
  @IsDate() createdDate: Date;
  @IsObject() displayName: DisplayName;
}

export class LocalCategoryData {
  @IsArray() localCategories: string[];
}
export class UserLocalCategoryModel {
  @IsString() id: string;
  @IsString() category: string;
  @IsString() displayName: string;
  @IsBoolean() isSelected: boolean;
}

export class LocalCategoryResponseModel {
  @IsInt() count: number;
  @IsArray() allCategories: UserLocalCategoryModel[];
}

export class RecommenededResourcesData {
  @IsArray() resources: string[];
  @IsString() @IsOptional() language: string;
}

export class RequestToken {
  @IsString() @IsNotEmpty() username!: string;
  @IsString() @IsNotEmpty() password!: string;
  @IsString() @IsNotEmpty() api_key!: string;
}

export class Data {
  @IsString() @IsNotEmpty() userId!: string;
  @IsString() @IsNotEmpty() token!: string;
}
export class AuntberthaAuthResponse {
  success!: string;
  data: Data;
}
