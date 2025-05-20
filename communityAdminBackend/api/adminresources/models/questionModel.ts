import { IsBoolean, IsDate, IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { User } from './userModel';

export class Question {
  @IsString() id: string;
  @IsString() storyId: string;
  @IsString() communityId: string;
  @IsString() displayName: string;
  @IsString() userId: string;
  @IsString() questionText: string;
  @IsDate() createdDate: Date;
  @IsBoolean() read: boolean;
  @IsBoolean() answered: boolean;
  @IsBoolean() isAnswerRead: boolean;
  @IsDate() answeredDateTime: Date;
  @IsString() answerText: string;
  @IsString() profilePicture: string;
  @IsInt() authorAge: number;
  @IsString() recipient: string;
}

export class QuestionResponse extends Question {
  @IsObject() currentUser: User;
  @IsObject() questionAuthor: User;
  @IsString() communityTitle: string;
  @IsBoolean() isStoryRemoved: boolean;
}

export class QuestionModel {
  @IsString() @IsOptional() id: string;
  @IsString() storyId: string;
  @IsString() displayName: string;
  @IsString() userId: string;
  @IsString() questionText: string;
  @IsBoolean() @IsOptional() isQuestionProfane: boolean;
}
export class UserQuestionAnswerModel
{
  @IsString() storyId: string;
  @IsString() currentUserId: string;
  @IsString() answer: string;
  @IsString() questionId: string;
  @IsBoolean() @IsOptional() isAnswerProfane: boolean;
}
