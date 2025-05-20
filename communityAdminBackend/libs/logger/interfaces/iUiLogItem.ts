export interface IUiLogItem {
  level: number;
  message: string;
  timestamp: string;
  userAgent: string;
  url: string;
  appName?: string;
  location?: string;
}
