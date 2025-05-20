import { parse as parseUrl } from 'url';

export function lowerPathname(appUrl: string): string {
  const { pathname } = parseUrl(appUrl) as { pathname: string | undefined };
  return pathname ? appUrl.replace(pathname, pathname.toLowerCase()) : appUrl;
}
