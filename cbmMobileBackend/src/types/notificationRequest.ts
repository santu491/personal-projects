import {IsIn, IsNotEmpty, IsString, IsUrl} from 'class-validator';
import {Category} from '../constants';

export class CreateNotification {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsNotEmpty()
  @IsIn(Object.values(Category))
  category!: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  deepLinkUrl!: string;
}

export class DeleteNotification {
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export class MessageSQS {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsString()
  @IsNotEmpty()
  notificationId!: string;

  @IsString()
  @IsNotEmpty()
  env!: string;
}
