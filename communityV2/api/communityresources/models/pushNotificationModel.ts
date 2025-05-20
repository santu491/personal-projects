import { IsArray, IsBoolean, IsDate, IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export interface IPushNotification {
  CommunicationId: string;
  ReferenceCommunicationId?: string;
  PersonId?: string;
  Hcid?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  DOB?: string;
  Brand?: string;
  PlanState?: string;
  GroupId?: string;
  GroupNm?: string;
  DysToDlvr?: string;
  SourceOfMessage?: string;
  SourcePrioritization?: string;
  MessageType?: string;
  WebGUID?: string;
  UserName?: string;
  Message: Array<IMessage>;
  ProxyId?: string;
}

export interface IMessage {
  id: string;
  channel?: string;
  subject?: string;
  body?: string;
  deepLink?: string;
  messageType?: string;
}

export interface IMessageProducer {
  communicationId?: string;
  personId?: string;
  sourceOfMessage?: string;
  firstName?: string;
  lastName?: string;
  message?: Array<IMessage>
}

export enum MessageSource {
  FREE_TEXT = 'FreeText',
  COM_EXPLORE = 'comExplorer'
}

export enum SourcePrioritization {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum MessageType {
  PUBLISH_STORY = 'PublishStory',
  QUESTION_SENT = 'QuestionIsSent',
  RESPONSE_TO_QUESTION = 'ResponseToQuestionIsSent'
}

export enum NotificationMessage {
  QuestionCreatedTitle = 'New question received',
  QuestionCreatedContent = 'A member asked a question about your story.',
  AnswerCreatedTitle = 'Your question has been answered',
  AnswerCreatedContent = 'A member answered a question you asked about their story.',
  StoryCreatedTitle = 'New story available',
  StoryCreatedContent = 'A new story has been shared to your community.',
  ReactionTitle = 'Has reacted to your story',
  ReactionContent = 'A member has reacted to your story'
}

export class DeepLink {
  @IsString() lable: string;
  @IsString() url: string;
}

export class PushNotificationTemplate {
  @IsObject() @IsOptional() deepLink: DeepLink;
  @IsString() name: string;
  @IsString() title: string;
  @IsString() body: string;
  @IsString() activityText: string;
  @IsBoolean() active: boolean;
  @IsString() @IsOptional() communityId: string;
  @IsBoolean() @IsOptional() checkStoryStatus: boolean;
  @IsBoolean() @IsOptional() userJoinedCommunity: boolean;
}

export class PushNotificationContent {
  @IsString() language: string;
  @IsString() version: string;
  @IsString() contentType: string;
  @IsString() createdBy: string;
  @IsString() updatedBy: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsArray() pushNotificationTemplate: PushNotificationTemplate[];
}

export class ScheduledPNData {
  @IsDate() createdAt: Date;
  @IsString() receiverId: string;
  @IsInt() weekCount: number;
  @IsString() name: string;
  @IsDate() sendOn: Date;
  @IsString() @IsOptional() env?: string;
  @IsString() @IsOptional() type?: string;
  @IsString() @IsOptional() activityText?: string;
  @IsString() @IsOptional() deepLink?: string;
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() body?: string;
  @IsString() @IsOptional() communityId?: string;
  @IsObject() @IsOptional() deepLinkInApp?: DeepLink;
  @IsBoolean() @IsOptional() checkStoryStatus?: boolean;
  @IsBoolean() @IsOptional() userJoinedCommunity?: boolean;
  @IsBoolean() @IsOptional() isSent: boolean;
}
