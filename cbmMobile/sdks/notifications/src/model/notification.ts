export interface NotificationResponseDTO {
  data: ErrorResponseDTO | NotificationsResponseDTO | NotificationUpdateDTO;
}

export interface NotificationUpdateDTO {
  message: string;
}
export interface ErrorResponseDTO {
  attemptsRemaining?: number;
  error: string;
  errorType: string;
  message: string;
  status: string;
  statusCode: string;
}

export interface NotificationsResponseDTO {
  count: number;
  notifications: NotificationDTO[];
}

export enum NotificationType {
  INSIGHTS = 'Insights',
  PODCAST = 'Podcast',
  VIDEO = 'Video',
}

export enum NotificationButtonType {
  LISTEN = 'Listen',
  READ = 'Read',
  WTACH = 'Watch',
}

export interface NotificationDTO {
  body: string;
  createdTS: string;
  deeplink: string;
  delivered: boolean;
  notificationId: string;
  primaryTopic: string;
  title: string;
  type: string;
  viewedTS?: string;
}

export interface Notification {
  createdDate: string;
  description: string;
  id: string;
  title: string;
  topic: string;
  type: NotificationButtonType;
  url: string;
  viewDate?: string;
}

export enum Installations {
  DELETE_INSTALLATION = 'DELETE_INSTALLATION',
  SAVE_INSTALLATION = 'SAVE_INSTALLATION',
}

export interface NotificationInstallationResponseDTO {
  data: string;
}

export interface SuccessPreferencesAlertData {
  description: string;
  title: string;
}

export interface ReadNotificationResponseDTO {
  data: NotificationUnReadDTO;
}

export interface NotificationUnReadDTO {
  unreadCount: number;
}
