import * as winston from 'winston';
import {CommonConstants, LogLevels} from '../constants';
import {APP} from './app';

const {combine, printf, colorize, timestamp, align} = winston.format;
let log: winston.Logger;
winston.addColors(LogLevels.colors);

const setLogger = () => {
  log = winston.createLogger({
    levels: LogLevels.levels,
    level: APP.config.logLevel,
    format: combine(
      colorize({all: true}),
      timestamp({
        format: CommonConstants.dateFormateString,
      }),
      align(),
      printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  return log;
};

const logger = () => {
  if (!log) {
    log = setLogger();
  }

  return log;
};

export default logger;
