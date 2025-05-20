export const extractJwtFromCookies = (rawCookies: string) => {
  const cookies = rawCookies ? rawCookies.split('; ') : [];
  for (const cookie of cookies) {
    if (cookie.includes('jwt=')) {
      return cookie.split('=')[1];
    }
  }
  return null;
};
