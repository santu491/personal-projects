import { lowerPathname } from '../lowerPathname';

describe('lowerPathname', () => {
  it('should convert the pathname to lowercase', () => {
    const url = 'http://example.com/Path/To/Resource';
    const expected = 'http://example.com/path/to/resource';
    const result = lowerPathname(url);
    expect(result).toBe(expected);
  });

  it('should return the same URL if pathname is already lowercase', () => {
    const url = 'http://example.com/path/to/resource';
    const result = lowerPathname(url);
    expect(result).toBe(url);
  });

  it('should handle URLs without a pathname', () => {
    const url = 'http://example.com';
    const result = lowerPathname(url);
    expect(result).toBe(url);
  });

  it('should handle URLs with a trailing slash', () => {
    const url = 'http://example.com/Path/';
    const expected = 'http://example.com/path/';
    const result = lowerPathname(url);
    expect(result).toBe(expected);
  });

  it('should handle URLs with query parameters', () => {
    const url = 'http://example.com/Path?query=param';
    const expected = 'http://example.com/path?query=param';
    const result = lowerPathname(url);
    expect(result).toBe(expected);
  });

  it('should handle URLs with hash fragments', () => {
    const url = 'http://example.com/Path#fragment';
    const expected = 'http://example.com/path#fragment';
    const result = lowerPathname(url);
    expect(result).toBe(expected);
  });
});
