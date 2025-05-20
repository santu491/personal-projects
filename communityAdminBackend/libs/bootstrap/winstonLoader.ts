import { LoggerFactory } from '@anthem/communityadminapi/logger';
import { APP } from '@anthem/communityadminapi/utils';
import * as winston from 'winston';
import { DefaultLogger2 } from './logger';
import { ICustomLogger, StaticLogger } from './staticLogger';

const { combine, printf } = winston.format;

export function winstonLoader() {
  const customLevels = winston.config.syslog.levels;
  customLevels.audit = customLevels.crit;
  const transports = [];
  if (APP.config.logging.console) {
    transports.push(
      new winston.transports.Console({
        level: APP.config.logging.level.toLowerCase(),
        handleExceptions: false
      })
    );
  }

  if (APP.config.logging.file) {
    transports.push(
      new winston.transports.File({
        level: APP.config.logging.level.toLowerCase(),
        filename: APP.config.logging.logFile,
        maxsize: APP.config.logging.maxSize,
        tailable: true,
        maxFiles: APP.config.logging.maxFiles
      })
    );
  }

  if (APP.config.audit.file) {
    transports.push(
      new winston.transports.File({
        level: 'audit',
        filename: APP.config.audit.auditFile,
        maxsize: APP.config.audit.maxSize,
        tailable: true,
        maxFiles: APP.config.audit.maxFiles
      })
    );
  }

  const myFormat = printf((info) => {
    return `${info.message}`;
  });

  StaticLogger.logger = winston.createLogger({
    levels: customLevels,
    format: combine(myFormat),
    transports: transports
  }) as ICustomLogger;

  LoggerFactory.setLogger(DefaultLogger2);
}
