import * as path from 'path';
import { ILogger } from './interfaces/iLogger';
import { IUiAuditItem } from './interfaces/iUiAuditItem';
import { IUiLogItem } from './interfaces/iUiLogItem';

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

export class DefaultLogger implements ILogger {
  public DEFAULT_SCOPE = 'app';

  protected scope: string;

  constructor(scope?: string) {
    this.scope = this.parsePathToScope(scope ? scope : this.DEFAULT_SCOPE);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, undefined, args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.log('info', message, undefined, args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, undefined, args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.log('error', message, undefined, args);
  }

  public audit(message: string, ...args: unknown[]): void {
    this.log('audit', message, undefined, args);
  }

  public uiLog(logItem: IUiLogItem, ...args: unknown[]): void {
    // eslint-disable-next-line no-console
    if (typeof console[this.getUtilityLogLevel(logItem.level)] !== 'undefined') {
      // eslint-disable-next-line no-console
      console[this.getUtilityLogLevel(logItem.level)](`${this.formatScope()} ${logItem.message}`, args);
    }
  }

  public uiAudit(auditItem: IUiAuditItem, ...args: unknown[]) {
    //nop
  }

  protected getUtilityLogLevel(value: number) {
    let level: 'error' | 'debug' | 'warn' | 'info' = 'error';
    switch (value) {
      case 0:
        level = 'debug';
        break;
      case 1:
        level = 'warn';
        break;
      case 2:
        level = 'info';
        break;
      default:
        level = 'error';
    }

    return level;
  }

  protected parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath.replace(process.cwd(), '');
      filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
      filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
      filepath = filepath.replace('.ts', '');
      filepath = filepath.replace('.js', '');
      filepath = filepath.replace(path.sep, ':');
      filepath = filepath.replace('/', '.');
    }
    return filepath;
  }

  protected log(level: 'error' | 'debug' | 'warn' | 'info' | 'audit', message: string, logItem: object, args: unknown[]): void {
    // eslint-disable-next-line no-console
    if (level !== 'audit' && typeof console[level] !== 'undefined') {
      // eslint-disable-next-line no-console
      console[level](`${this.formatScope()} ${message}`, args);
    }
  }

  protected formatScope(): string {
    return `[${this.scope}]`;
  }
}
