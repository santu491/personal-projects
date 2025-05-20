import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class PollResponseRequest {
  @IsString() postId: string;
  @IsString() optionId: string;
  @IsBoolean() @IsOptional() isEdited: boolean;
}

export class UserResponse {
  @IsString() userId: string;
  @IsBoolean() edited: boolean;
}

export class PollResponse {
  @IsString() postId: string;
  @IsObject() userResponse: {};
}
