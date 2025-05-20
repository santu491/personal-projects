import { IsDate, IsString } from 'class-validator';

export class SearchTerm {
  @IsString() id: string;
  @IsString() term: string;
  @IsDate() createdDate: Date;
}
