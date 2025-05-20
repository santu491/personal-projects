import { mockSecurityFilter } from '@anthem/communityadminapi/filters/mocks/mockSecurityFilter';
import { SecurityMiddleware } from './securityMiddleware';

describe('SecurityMiddleware UTest', () => {
  let middleware: SecurityMiddleware;

  beforeEach(() => {
    middleware = new SecurityMiddleware(<any>mockSecurityFilter);
  });

  it('should override headers, cookies, params, query', () => {
    expect(middleware != null);
  });

  afterEach(() => {
    mockSecurityFilter.scanRequest.mockReset();
  });
});
