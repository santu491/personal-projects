import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { AuditHelper } from './auditHelper';
import { AuditParam } from './enums/auditParam';

describe('AuditHelper UTest', () => {
  beforeEach(() => {
    AuditHelper['_log'] = <any>mockILogger;
  });

  it('get cookies header audit record', () => {
    expect(AuditHelper.getRequestCookieLog('test')).toBe('Cookie="test"');
    expect(AuditHelper.getRequestCookieLog(undefined)).toBe('Cookie=""');
  });

  it('get audit record for request', () => {
    let startDt = new Date().setMinutes(-1);
    let audit = AuditHelper.getRequestAudit(
      {
        'user-agent': 'unittest browser',
        referer: 'https://www.anthem.com/test/',
      },
      { test: 'test2' },
      (startDt as unknown) as Date,
      { resp: 'test3' },
      200,
      'POST',
      'http://test/api/uat?startDt=2018-01-01',
      []
    );
    expect(audit.parameters.find((h) => h.name === AuditParam.URL).value).toBe(
      'http://test/api/uat?startDt=2018-01-01'
    );
    expect(
      audit.parameters.find((h) => h.name === AuditParam.HTTP_METHOD).value
    ).toBe('POST');
    expect(
      audit.parameters.find((h) => h.name === AuditParam.REFERER).value
    ).toBe('https://www.anthem.com/test/');
    expect(
      audit.parameters.find((h) => h.name === AuditParam.USER_AGENT).value
    ).toBe('unittest browser');
    expect(
      audit.parameters.find((h) => h.name === AuditParam.REQUEST).value
    ).toBe('{"test":"test2"}');
    expect(
      audit.parameters.find((h) => h.name === AuditParam.RESPONSE).value
    ).toBe('response body skipped');
    expect(
      audit.parameters.find((h) => h.name === AuditParam.ELAPSED).value > 1
    ).toBeTruthy();
  });

  it('get audit record for multipart request', () => {
    let startDt = new Date().setMinutes(-1);
    let audit = AuditHelper.getRequestAudit(
      {
        'user-agent': 'unittest browser',
        referer: 'https://www.anthem.com/test/',
      },
      { test: 'test2' },
      (startDt as unknown) as Date,
      { resp: 'test3' },
      200,
      'POST',
      'http://test/api/uat?startDt=2018-01-01',
      ([{ size: 100 }, { size: 222 }] as unknown) as Blob[]
    );
    expect(
      audit.parameters.find((h) => h.name === AuditParam.MULTIPART_REQUEST)
        .value
    ).toBe('{"totalSize":322}');
  });

  it('audit record should remove files from auditing in request data', () => {
    let startDt = new Date().setMinutes(-1);
    let audit = AuditHelper.getRequestAudit(
      {
        'user-agent': 'unittest browser',
        referer: 'https://www.anthem.com/test/',
      },
      { files: [{}, {}] },
      (startDt as unknown) as Date,
      { resp: 'test3' },
      200,
      'POST',
      'http://test/api/uat?startDt=2018-01-01',
      ([{ size: 100 }, { size: 222 }] as unknown) as Blob[]
    );
    expect(
      audit.parameters.find((h) => h.name === AuditParam.REQUEST).value
    ).toBe('{}');
  });

  it('audit record should mask request props', () => {
    let startDt = new Date().setMinutes(-1);
    let audit = AuditHelper.getRequestAudit(
      {},
      {
        test: [
          { creditCardNumber: '****' },
          { bankRoutingNumber: '****', test: { bankAccountNumber: '****' } },
        ],
      },
      (startDt as unknown) as Date,
      {
        test: [
          { creditCardNumber: '****' },
          { bankRoutingNumber: '****', test: { bankAccountNumber: '****' } },
        ],
      },
      200,
      'POST',
      '/v3/authenticate'
    );
    let req = audit.parameters.find((h) => h.name === AuditParam.REQUEST);
    expect(req.value).toBe(
      '{"test":[{"creditCardNumber":"****"},{"bankRoutingNumber":"****","test":{"bankAccountNumber":"****"}}]}'
    );
  });
});
