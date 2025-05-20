import {
  IsArray,
  IsBoolean,
  IsInt,
  IsString,
  ValidateNested
} from 'class-validator';
import { Binder } from './binderModel';
import { Community } from './communitiesModel';
import { ContentModel } from './contentModel';
import { Topic } from './healthWiseModel';
import { Library } from './libraryModel';
import {
  IContactsDetail,
  IMemberAuthenticateResponse,
  IMemberTwoFALoginThreatResponse,
  IUserAccountSummary,
  MemberType
} from './memberModel';
import { ProgramListResponse } from './programsModel';
import { Prompt } from './promptModel';
import { Reaction } from './reactionModel';
import { LocalCategoryResponseModel, SearchTerm } from './searchTermModel';
import { Story, StoryResponse } from './storyModel';
import { User } from './userModel';

export type ValueType =
  | string
  | User
  | Community
  | Binder
  | Prompt
  | Story
  | StoryResponse
  | Topic
  | StoryResponse[]
  | SearchTerm[]
  | ProgramListResponse
  | IMemberAuthenticateResponse
  | MemberType
  | IUserAccountSummary
  | IContactsDetail[]
  | LocalCategoryResponseModel
  | ContentModel
  | IMemberTwoFALoginThreatResponse
  | Reaction[]
  | Library;

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

export interface IError {
  message: string;
}
