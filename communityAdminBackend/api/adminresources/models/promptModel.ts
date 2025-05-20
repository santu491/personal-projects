import { IsArray, IsObject, IsString } from 'class-validator';

export class Prompt {
  @IsString() question: string;
  @IsString() sectionTitle?: string;
  @IsString() helpText?: string;
  @IsString() sensitiveContentText?: string;
}

export class PromptModel extends Prompt {
  @IsString() promptId: string;
}

export class PromptData{
  @IsString() promptId: string;
  @IsObject() en: Prompt;
  @IsObject() es: Prompt;
}

export class PromptRequest {
  @IsString() communityId: string;
  @IsArray() prompts: PromptData[];
}

export class PromptRequestData {
  @IsArray() en: PromptModel[];
  @IsArray() es: PromptModel[];
}
