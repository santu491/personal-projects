import { IncomingHttpHeaders } from 'http';
import * as https from 'https';

interface IResponse {
  status: number;
  headers: { [key: string]: string } | IncomingHttpHeaders;
  body: string;
}

/**
 * DO NOT USE THIS.
 * this is intended for http calls required before application is started
 */
async function makeHttpsRequest(url: string, method: 'GET' | 'POST' = 'GET', headers = {}, timeout = 15000): Promise<Error | IResponse> {
  return new Promise((resolve, reject) => {
    const [hostPart, ...paths] = url.replace('https://', '').split('/');
    const [host, port] = hostPart.split(':');

    const options: https.RequestOptions = {
      hostname: host,
      port: port ? parseInt(port) : 443,
      path: `/${paths.join('/')}`,
      method: method,
      rejectUnauthorized: false,
      headers: headers,
      timeout
    };

    const req = https.request(options, (res) => {
      const statusCode = res.statusCode;
      const responseHeaders = res.headers;
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: statusCode,
          headers: responseHeaders,
          body: body
        });
      });
    });

    req.on('timeout', () => {
      req.abort();
      reject({
        status: -1
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

export class ConfigLoader {
  static async loadSpringCloudConfig(configUrl: string, api: string, env: string): Promise<unknown> {
    try {
      configUrl = `${configUrl}/${api}/config?env=${env}`;
      const resp = (await makeHttpsRequest(configUrl) as IResponse);
      return JSON.parse(resp.body);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('spring clound config error', error);
    }

    return {};
  }
}
