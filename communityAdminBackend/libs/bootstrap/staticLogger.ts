import * as winston from 'winston';

export interface ICustomLogger extends winston.Logger {
  audit: winston.LeveledLogMethod;
}

export class StaticLogger {
  public static logger: ICustomLogger = null;
}
