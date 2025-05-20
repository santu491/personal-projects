export interface TouMassEmailInfo {
  allUsers: UsersMailInfo;
  commercialUsers: UsersMailInfo;
  medicaidUsers: UsersMailInfo;
  touVersion: string;
  lastUpdatedTouAt: Date;
}

export interface UsersMailInfo {
  totalUsersCount: number;
  emailReceivedCount: number;
}
