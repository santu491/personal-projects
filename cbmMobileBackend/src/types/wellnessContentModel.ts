import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TopicsResponse {
  @IsNumber() numResults!: number;
  @IsArray() @IsNotEmpty() @ValidateNested() results!: Topic[];
}

export class Topic {
  @IsString() path?: string;
  @IsString() title!: string;
  @IsString() description?: string;
  @IsString() imageUrl?: string;
}
