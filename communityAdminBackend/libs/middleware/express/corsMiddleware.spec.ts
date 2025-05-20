import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { APP } from '@anthem/communityadminapi/utils';
import { CorsMiddleware } from './corsMiddleware';

describe('CorsMiddleware UTest', () => {
  let middleware: CorsMiddleware;

  beforeEach(() => {
    APP.config.cors.allowedRequestDomains = '(wellpoint.com|localhost|api\\.|memberapi\\.)';
    APP.config.cors.allowedOrigins = '(secure|stage|www|secure-gateway|membersecure|prod)\\..*(anthem.com|bcbsga.com|empireblue.com)';
    middleware = new CorsMiddleware(<any>mockILogger);
  });

  it('verify null', () => {
    expect(middleware != null);
  });

  afterEach(() => {
    //nop
  });
});
