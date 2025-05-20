import {APP} from '../../app';
import {AuditFilter} from '../../audit/auditFilter';
import {appConfig} from '../../mockData';

describe('AuditFilter', () => {
  let auditFilter: AuditFilter;

  beforeEach(() => {
    APP.config.security = appConfig.security;
    auditFilter = new AuditFilter();
  });

  describe('getAuditedBody', () => {
    it('should return an empty string if input.data is undefined', () => {
      const input = {};
      const result = auditFilter.getAuditedBody(input);
      expect(result).toEqual('');
    });

    it('should return the masked body as a string', () => {
      const input = {data: {name: 'John', age: 30}};
      const result = auditFilter.getAuditedBody(input);
      expect(result).toEqual('{"name":"********","age":"30"}');
    });
  });

  describe('getRequestUrl', () => {
    it('should return the original URL if it does not contain a query string', () => {
      const config = {url: 'https://example.com/api/users'};
      const result = auditFilter.getRequestUrl(config);
      expect(result).toEqual('https://example.com/api/users');
    });

    it('should return the scanned URL if it contains a query string', () => {
      const config = {url: 'https://example.com/api/users?sort=desc&name=John'};
      const result = auditFilter.getRequestUrl(config);
      expect(result).toEqual(
        'https://example.com/api/users?sort=desc&name=********',
      );
    });
  });

  describe('maskBody', () => {
    it('should return the input as is if it is not a string or object', () => {
      const input = '123';
      const result = auditFilter.maskData(input);
      expect(result).toEqual(123);
    });

    it('should return the masked input as an object', () => {
      const input = {name: 'John', age: 30};
      const result = auditFilter.maskData(input);
      expect(result).toEqual({name: '********', age: '30'});
    });

    it('should return the masked input as a string', () => {
      const input = 'name=John&age=30';
      const result = auditFilter.maskData(input);
      expect(result).toEqual('name=John&age=30');
    });
  });

  describe('getAuditedRequestBody', () => {
    it('should return an empty string if input is undefined', () => {
      const input = undefined;
      const result = auditFilter.getAuditedRequestBody(input);
      expect(result).toEqual('');
    });

    it('should return the masked input as a string', () => {
      const input = {name: 'John', age: 30};
      const result = auditFilter.getAuditedRequestBody(input);
      expect(result).toEqual('{"name":"********","age":"30"}');
    });
  });
});
