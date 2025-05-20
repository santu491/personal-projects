export class UserReqModel {
  _id!: string;
  email!: string;
  roles!: string[];
}
export class Notification {
  createdTS?: string;
  notificationId!: string;
  delivered!: boolean;
  primaryTopic!: string;
  viewedTS?: string;
}

export class Audit {
  createdTS!: string;
  lastLoginTS!: string;
  lastLogoutTS!: string;
  updatedTS!: string;
}

export class DeviceInfo {
  badge?: number;
  locale?: string;
  platform!: string;
  createdAt!: string;
  updatedAt?: string;
  osVersion!: string;
  appVersion!: string;
  deviceToken!: string;
  endpointArn?: string;
  timeZoneOffset?: string;
}

export class Preferences {
  pushNotifications!: {
    enabled: boolean;
    topics: string[];
  };
}

export class User {
  audit!: Audit;
  status!: string;
  iamguid!: string;
  clientName!: string;
  isDemoUser!: boolean;
  employerType!: string;
  preferences?: Preferences;
  deviceInfo?: DeviceInfo[];
  notifications?: Notification[];
}
