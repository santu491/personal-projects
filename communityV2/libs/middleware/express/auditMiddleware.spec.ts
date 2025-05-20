import { mockAuditFilter } from '@anthem/communityapi/filters/mocks/mockAuditFilter';
import { AuditMiddleware } from './auditMiddleware';

describe('AuditMiddleware UTest', () => {
  let middleware: AuditMiddleware;

  beforeEach(() => {
    middleware = new AuditMiddleware(<any>mockAuditFilter);
  });

  it('should cache data if request is cacheable and response is 200 status', () => {
    expect(middleware != null);
  });

  afterEach(() => {
    mockAuditFilter.auditRequest.mockReset();
  });
});
