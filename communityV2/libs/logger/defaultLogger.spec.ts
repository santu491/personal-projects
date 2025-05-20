import { DefaultLogger } from './defaultLogger';

describe('DefaultLogger UTest', () => {
  let logger: DefaultLogger;

  beforeEach(() => {
    logger = new DefaultLogger(`${process.cwd()}/test/defaultLogger.spec.ts`);
  });

  it('should log path to source file', () => {
    logger.debug('test log record');
  });
});
