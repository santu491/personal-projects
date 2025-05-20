import { injectQueryParams } from '../injectQueryParams';

describe('injectQueryParams', () => {
  it('should add query parameters to a URL without existing parameters', () => {
    const url = 'http://example.com/path';
    const params = { foo: 'bar', baz: 'qux' };
    const result = injectQueryParams(url, params);
    expect(result).toBe('http://example.com/path?foo=bar&baz=qux');
  });

  it('should merge new query parameters with existing ones', () => {
    const url = 'http://example.com/path?existing=param';
    const params = { foo: 'bar', baz: 'qux' };
    const result = injectQueryParams(url, params);
    expect(result).toBe('http://example.com/path?existing=param&foo=bar&baz=qux');
  });

  it('should handle URLs without a host', () => {
    const url = '/path';
    const params = { foo: 'bar' };
    const result = injectQueryParams(url, params);
    expect(result).toBe('/path?foo=bar');
  });

  it('should handle URLs with a hash', () => {
    const url = 'http://example.com/path#section';
    const params = { foo: 'bar' };
    const result = injectQueryParams(url, params);
    expect(result).toBe('http://example.com/path?foo=bar#section');
  });

  it('should return the original URL if no parameters are provided', () => {
    const url = 'http://example.com/path';
    const result = injectQueryParams(url, undefined);
    expect(result).toBe('http://example.com/path');
  });

  it('should return the original URL if an empty parameter object is provided', () => {
    const url = 'http://example.com/path';
    const result = injectQueryParams(url, {});
    expect(result).toBe('http://example.com/path');
  });
});
