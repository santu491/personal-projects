import { normalizePathname } from '../normalizePathname';

describe('normalizePathname', () => {
  it('should return the same URL if pathname is "/"', () => {
    const url = 'http://example.com/';
    const result = normalizePathname(url);
    expect(result).toBe(url);
  });

  it('should add a leading slash if missing', () => {
    const url = 'http://example.com/path';
    const expected = 'http://example.com/path';
    const result = normalizePathname(url);
    expect(result).toBe(expected);
  });

  it('should remove a trailing slash if present', () => {
    const url = 'http://example.com/path/';
    const expected = 'http://example.com/path';
    const result = normalizePathname(url);
    expect(result).toBe(expected);
  });

  it('should add a leading slash and remove a trailing slash', () => {
    const url = 'http://example.com/path/';
    const expected = 'http://example.com/path';
    const result = normalizePathname(url);
    expect(result).toBe(expected);
  });

  it('should return the same URL if pathname is already normalized', () => {
    const url = 'http://example.com/path';
    const result = normalizePathname(url);
    expect(result).toBe(url);
  });
});
