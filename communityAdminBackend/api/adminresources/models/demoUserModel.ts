import { IsString } from 'class-validator';

export class DemoUser {
  @IsString() username: string;
  @IsString() _id: string;
}
