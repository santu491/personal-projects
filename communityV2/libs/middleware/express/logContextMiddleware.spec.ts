import { RequestContext } from '@anthem/communityapi/utils';
import { LogContextMiddleware } from './logContextMiddleware';

describe('NotFoundMiddleware UTest', () => {
  let middleware: LogContextMiddleware;

  beforeEach(() => {
    RequestContext.initLoggingContext = jest.fn();
    middleware = new LogContextMiddleware();
  });

  it('verify null', () => {
    expect(middleware != null);
  });
  afterEach(() => {
    //nop
  });
});
