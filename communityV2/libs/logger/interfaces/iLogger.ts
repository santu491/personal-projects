import { Audit } from './../audit';
import { IUiAuditItem } from './iUiAuditItem';
import { IUiLogItem } from './iUiLogItem';

export interface ILogger {
  DEFAULT_SCOPE: string;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string | Error, ...args: unknown[]): void;
  audit(message: Audit | string, ...args: unknown[]): void;
  uiLog(logItem: IUiLogItem): void;
  uiAudit(logItem: IUiAuditItem): void;
}
