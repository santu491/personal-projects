import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { mockInputScanner } from '@anthem/communityapi/security/mocks/mockInputScanner';
import { APP } from '@anthem/communityapi/utils';
import { SecurityFilter } from './securityFilter';

describe('SecurityFilter UTest', () => {
  let filter: SecurityFilter;

  beforeEach(() => {
    APP.config.security.optionalUrls = ['^(GET)\\..*(test-optional)'];
    filter = new SecurityFilter();
    filter['_log'] = <any>mockILogger;
    filter['_inputScanner'] = <any>mockInputScanner;
  });

  it('should not scan optional urls', () => {
    filter.scanRequest('http://member/secure/test-optional/member/123a123/claims', 'GET', {}, {}, {}, {});
    expect(mockInputScanner.scanInput.mock.calls.length).toBe(0);
  });

  it('should not allow blacklisted headers', () => {
    APP.config.security.whitelist.headers.allowed = ['testunallowheader'];
    let result = filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', { testunallowheader1: 'testunallowheader1' }, {}, {}, {});
    expect(result.headers['testunallowheader1']).not.toBeDefined();
  });

  it('should allow not blacklisted headers', () => {
    APP.config.security.whitelist.headers.allowed = ['testunallowheader'];
    let result = filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', { testunallowheader: 'testunallowheader' }, {}, {}, {});
    expect(result.headers['testunallowheader']).toBeDefined();
  });

  it('should not allow header values with blacklist charachters', () => {
    APP.config.security.whitelist.headers.allowed = ['testunallowheader', 'testunallowheader1'];
    APP.config.security.whitelist.headers.values.testunallowheader1 = '^[a-zA-Z0-9\\~\\-_\\$]{1,32}$';
    APP.config.security.whitelist.headers.values.default = '^[a-zA-Z0-9\\-_\\$]{1,32}$';
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', { testunallowheader: 'testunal~lowheader' }, {}, {}, {});
      expect(false).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('Header value not allowed: testunal~lowheader') >= 0).toBeTruthy();
    }

    let result = filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', { testunallowheader1: 'testunal~lowheader' }, {}, {}, {});
    expect(result.headers['testunallowheader1']).toBeDefined();
  });

  it('should not allow long header values', () => {
    APP.config.security.whitelist.headers.allowed = ['testunallowheader'];
    APP.config.security.whitelist.headers.values.testunallowheader1 = '^[a-zA-Z0-9\\~\\-_\\$]{1,32}$';
    APP.config.security.whitelist.headers.values.default = '^[a-zA-Z0-9\\-_\\$]{1,32}$';
    APP.config.security.whitelist.headers.values.maxLength = 3;
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', { testunallowheader: 'testunallowheader' }, {}, {}, {});
      expect(false).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('Header value too long: testunallowheader') >= 0).toBeTruthy();
    }
  });

  it('should not allow blacklisted cookies', () => {
    APP.config.security.whitelist.cookies.allowed = ['testunallowheader'];
    let result = filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, { testunallowheader1: 'testunallowheader1' }, {}, {});
    expect(result.cookies['testunallowheader1']).not.toBeDefined();
  });

  it('should allow not blacklisted cookies', () => {
    APP.config.security.whitelist.cookies.allowed = ['testunallowheader'];
    let result = filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, { testunallowheader: 'testunallowheader' }, {}, {});
    expect(result.cookies['testunallowheader']).toBeDefined();
  });

  xit('should not allow cookie values with blacklist charachters', () => {
    APP.config.security.whitelist.cookies.allowed = ['testunallowheader', 'testunallowheader1'];
    (APP as any).config.security.whitelist.cookies.values.testunallowheader1 = '^[a-zA-Z0-9\\~\\-_\\$]{1,32}$';
    APP.config.security.whitelist.cookies.values.default = '^[a-zA-Z0-9\\-_\\$]{1,32}$';
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, { testunallowheader: 'testunal~lowheader' }, {}, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('Cookie value not allowed: testunal~lowheader') >= 0).toBeTruthy();
    }

    let result = filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, { testunallowheader1: 'testunal~lowheader' }, {}, {});
    expect(result.cookies['testunallowheader1']).toBeDefined();
  });

  xit('should not allow long cookie values', () => {
    APP.config.security.whitelist.cookies.allowed = ['testunallowheader'];
    (APP as any).config.security.whitelist.cookies.values.testunallowheader1 = '^[a-zA-Z0-9\\~\\-_\\$]{1,32}$';
    APP.config.security.whitelist.cookies.values.default = '^[a-zA-Z0-9\\-_\\$]{1,32}$';
    APP.config.security.whitelist.cookies.values.maxLength = 10;
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, { testunallowheader: 'testunallowheader' }, {}, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('Cookie value too long: testunallowheader') >= 0).toBeTruthy();
    }
  });

  it('should not allow blacklisted charachters in url param name', () => {
    APP.config.security.whitelist.urlParams.names.default = '^[a-z0-9]*$';
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {
        test: 'test1',
        'test$2': 'test2'
      }, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('URL Param name not allowed: test$2') >= 0).toBeTruthy();
    }
  });

  it('should allow blacklisted charachters in url param value [Usecase updated for Spanish]', () => {
    APP.config.security.whitelist.urlParams.names.default = '';
    APP.config.security.whitelist.urlParams.values.default = '';
    APP.config.security.whitelist.urlParams.values['test1'] = '^[a-z0-9]*$';
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {
        'test$2': 'test$2',
        'test1': 'test$1'
      }, {});
      expect(true).toBeTruthy();
    } catch (e) {
      expect(e.message.indexOf('URL Param value not allowed: test$1') >= 0).toBeFalsy();
    }
  });

  it('should not allow too long url param names', () => {
    APP.config.security.whitelist.urlParams.names.default = '';
    APP.config.security.whitelist.urlParams.values.default = '';
    APP.config.security.whitelist.urlParams.names.maxLength = 10;
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {
        test: 'test1',
        'test$2test1234': 'test$2'
      }, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('URL Param name too long: test$2test1234') >= 0).toBeTruthy();
    }
  });

  it('should not allow too long url param values', () => {
    APP.config.security.whitelist.urlParams.names.default = '';
    APP.config.security.whitelist.urlParams.values.default = '';
    APP.config.security.whitelist.urlParams.values.maxLength = 10;
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {
        test: 'test1',
        'test2': 'test$2test1234'
      }, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('URL Param value too long: test$2test1234') >= 0).toBeTruthy();
    }
  });


  it('should not allow blacklisted charachters in quertring name', () => {
    APP.config.security.whitelist.urlQueries.names.default = '^[a-z]*$';
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {}, {
        test: 'test1',
        'test$2': 'test2'
      });
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('URL Query name not allowed: test$2') >= 0).toBeTruthy();
    }
  });

  it('should not allow blacklisted charachters in quertring value', () => {
    APP.config.security.whitelist.urlQueries.names.default = '';
    APP.config.security.whitelist.urlQueries.values.default = '';
    APP.config.security.whitelist.urlQueries.values['test1'] = '\\$';
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {
        'test$2': 'test$2',
        'test1': 'test$1'
      }, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('URL Param value not allowed: test$1') >= 0).toBeDefined();
    }
  });

  it('should not allow too long quertring names', () => {
    APP.config.security.whitelist.urlQueries.names.default = '';
    APP.config.security.whitelist.urlQueries.values.default = '';
    APP.config.security.whitelist.urlQueries.names.maxLength = 10;
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {
        test: 'test1',
        'test$2test1234': 'test$2'
      }, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('URL Query name too long: test$1test1234') >= 0).toBeDefined();
    }
  });

  it('should not allow too long quertring values', () => {
    APP.config.security.whitelist.urlQueries.names.default = '';
    APP.config.security.whitelist.urlQueries.values.default = '';
    APP.config.security.whitelist.urlQueries.values.maxLength = 10;
    try {
      filter.scanRequest('http://member/secure/test/member/123a123/claims', 'POST', {}, {}, {
        test: 'test1',
        'test2': 'test$2test1234'
      }, {});
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message.indexOf('URL Query value too long: test2') >= 0).toBeDefined();
    }
  });

  afterEach(() => {
    mockInputScanner.scanInput.mockReset();
  });
});
