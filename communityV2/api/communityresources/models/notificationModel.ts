import { IsString } from 'class-validator';

export class NotificationMessage {
  @IsString() title: string;
  @IsString() body: string;
}

export enum NotificationContentType {
  STORY,
  POST
}
