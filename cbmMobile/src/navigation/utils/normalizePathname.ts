import { parse as parseUrl } from 'url';

/** Ensures leading slash and removes trailing slash */
export function normalizePathname(appUrl: string): string {
  const { pathname } = parseUrl(appUrl);
  let url = appUrl;
  if (pathname && pathname !== '/') {
    if (pathname[0] !== '/') {
      url = url.replace(pathname, `/${pathname}`);
    }
    if (pathname[pathname.length - 1] === '/') {
      url = url.replace(pathname, pathname.slice(0, pathname.length - 1));
    }
  }
  return url;
}
