import * as winston from 'winston';
import logger from '../logger';

jest.mock('winston', () => {
  return {
    format: {
      combine: jest.fn(),
      printf: jest.fn(),
      colorize: jest.fn(),
      timestamp: jest.fn(),
      align: jest.fn(),
      simple: jest.fn(),
    },
    createLogger: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
    })),
    transports: {
      Console: jest.fn(),
    },
    addColors: jest.fn(),
  };
});

describe('Logger', () => {
  it('should return a logger', () => {
    const log = logger();
    expect(log).toBeDefined();
    expect(log.info).toBeDefined();
    expect(log.error).toBeDefined();
  });

  it('should create the logger only once', () => {
    const logger1 = logger();
    const logger2 = logger();
    expect(logger1).toBe(logger2);
    expect(winston.createLogger).toHaveBeenCalledTimes(1);
  });
});
