import { DefaultLogger } from './defaultLogger';
import { ILogger } from './interfaces/iLogger';

export class LoggerFactory {
  private static logger: new (scope?: string) => ILogger = DefaultLogger;

  public static getLogger(scope?: string): ILogger {
    return new this.logger(scope);
  }

  public static setLogger(type: new (scope?: string) => ILogger) {
    this.logger = type;
  }
}
