import * as qs from 'querystring';
import { parse as parseUrl } from 'url';

import { isEmpty } from 'lodash';

export function injectQueryParams(origUri: string, addParams: qs.ParsedUrlQueryInput | undefined): string {
  const parsedUrl = parseUrl(origUri, true);

  const queryParams = {
    ...parsedUrl.query,
    ...addParams,
  };

  const query = isEmpty(queryParams) ? '' : `?${qs.stringify(queryParams)}`;
  const path = `${parsedUrl.pathname}${query}${parsedUrl.hash ?? ''}`;

  if (!parsedUrl.host) {
    return path;
  }

  // re-construct the uri by appending all the query params
  return `${parsedUrl.protocol}//${parsedUrl.host}${path}`;
}
