import { extractJwtFromCookies } from '../jwt';

describe('extractJwtFromCookies', () => {
  it('should return the JWT token if present in cookies', () => {
    const rawCookies = 'session=abc; jwt=token123; path=/';
    const result = extractJwtFromCookies(rawCookies);
    expect(result).toBe('token123');
  });

  it('should return null if JWT token is not present in cookies', () => {
    const rawCookies = 'session=abc; path=/';
    const result = extractJwtFromCookies(rawCookies);
    expect(result).toBeNull();
  });

  it('should return null if rawCookies is an empty string', () => {
    const rawCookies = '';
    const result = extractJwtFromCookies(rawCookies);
    expect(result).toBeNull();
  });

  it('should return null if rawCookies is undefined', () => {
    const result = extractJwtFromCookies('');
    expect(result).toBeNull();
  });

  it('should return the correct JWT token if multiple cookies are present', () => {
    const rawCookies = 'session=abc; jwt=token123; anotherCookie=value; jwt=token456';
    const result = extractJwtFromCookies(rawCookies);
    expect(result).toBe('token123');
  });
});
