import { AuditHelper } from '@anthem/communityapi/audit';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { AuditFilter } from './auditFilter';

describe('AuditFilter UTest', () => {
  let filter: AuditFilter;

  beforeEach(() => {
    AuditHelper.getRequestCookieLog = jest.fn(() => { return 'cookies'; });
    AuditHelper.getRequestAudit = jest.fn(() => { return 'audit request log'; }) as any;
    filter = new AuditFilter(<any>mockILogger);
  });

  it('should audit request/response and debug request cookies', () => {
    filter.auditRequest({ cookie: {'Authorization': 'test'}} as any, {}, new Date(), {}, 200, 'GET', 'http://public/test');
    expect(mockILogger.debug.mock.calls[0]).toContain('cookies');
  });

  afterEach(() => {
    mockILogger.audit.mockReset();
    mockILogger.debug.mockReset();
  });
});
