export interface IUiAuditItem {
  actionTime: string;
  appName: string;
  code: string;
  elapsed: number;
  location: string;
  operationName: string;
  message: string;
  parameters: { [key: string]: string };
}
