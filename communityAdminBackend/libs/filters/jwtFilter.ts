import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, RequestContext, RequestUtil } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';
import { EncryptionUtil } from '../security';
import { SecureJwtToken } from './secureJwtToken';

@Service()
export class JwtFilter {
  constructor(
    @LoggerParam(__filename) private log: ILogger,
    private secureJwtToken: SecureJwtToken
  ) {}

  public async validateToken(
    url: string,
    method: string,
    headers: { [key: string]: string },
    body: { [key: string]: string },
    query: { [key: string]: string }
  ) {
    const token = (RequestUtil.getAuthToken(headers, query) || '').replace(
      'Bearer ',
      ''
    );
    if (this.isAuthorizationOptional(url, method, headers, query, token)) {
      return Promise.resolve(true);
    }

    if (!token) {
      this.log.error('Authorization token missing.');
      return Promise.resolve(false);
    }

    if (url.indexOf('/scheduler') >= 0) {
      const rUrl = `${method.toUpperCase()}.${url}`;
      if (rUrl.indexOf('/scheduler') >= 0) {
        return true;
      }
    }

    const claims = this.secureJwtToken.decode(token);
    this.setUserIdentity(claims);
    return Promise.resolve(
      this.validateSecureToken(headers, body, query, token, url, method)
    );
  }

  validateSecureToken(
    headers: { [key: string]: string },
    body: { [key: string]: string },
    query: { [key: string]: string },
    token: string,
    url: string,
    method: string
  ): boolean {
    const claims = {
      name: { encrypt: true },
      id: { encrypt: true },
      firstName: { encrypt: false },
      lastName: { encrypt: false },
      accessToken: { encrypt: true }
    };
    const claimsInToken = this.secureJwtToken.verify(token, claims);
    // validate access token
    return claimsInToken ? true : false;
  }

  isAuthorizationOptional(
    url: string,
    method: string,
    headers: { [key: string]: string },
    query: { [key: string]: string },
    token: string
  ): boolean {
    if (
      APP.config.env === 'local' &&
      !headers['authorization'] &&
      !query['authorization'] &&
      !query['Authorization']
    ) {
      return true;
    }

    let result = false;
    const rUrl = `${method.toUpperCase()}.${url}`;

    if (rUrl.indexOf('/public') >= 0) {
      return true;
    }

    for (const urlRegex of APP.config.jwt.optionalUrls) {
      if (new RegExp(urlRegex, 'i').test(rUrl)) {
        if (!(rUrl.endsWith('/login') && token)) {
          result = true;
        }
        break;
      }
    }

    return result;
  }

  setUserIdentity(claims: string | { [key: string]: string }): void {
    //This will add claims to userIdentity

    claims['id'] = EncryptionUtil.decrypt(claims['id'], 'aes-symmetric');
    claims['name'] = EncryptionUtil.decrypt(claims['name'], 'aes-symmetric');
    claims['active'] = claims['active'] ? claims['active'] : false;
    if (claims['firstName']) {
      claims['firstName'] = EncryptionUtil.decrypt(
        claims['firstName'],
        'aes-symmetric'
      );
    }

    if (claims['lastName']) {
      claims['lastName'] = EncryptionUtil.decrypt(
        claims['lastName'],
        'aes-symmetric'
      );
    }
    if (claims['role']) {
      claims['role'] = EncryptionUtil.decrypt(
        claims['role'],
        'aes-symmetric'
      );
    }
    if (claims['accessToken']) {
      claims['accessToken'] = EncryptionUtil.decrypt(
        claims['accessToken'],
        'aes-symmetric'
      );
    }
    RequestContext.setContextItem('userIdentity', JSON.stringify(claims));
  }
}
