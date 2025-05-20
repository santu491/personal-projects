import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP, RequestContext, RequestUtil } from '@anthem/communityapi/utils';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { collections, headers, mongoDbTables, Validation } from '../common';
import { MongoDatabaseClient } from '../database';
import { EncryptionUtil } from '../security';
import { SecureJwtToken } from './secureJwtToken';

@Service()
export class JwtFilter {
  constructor(
    @LoggerParam(__filename) private log: ILogger,
    private secureJwtToken: SecureJwtToken,
    private mongoDbSvc: MongoDatabaseClient,
    private validate: Validation
  ) { }

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

    const claims = this.secureJwtToken.decode(token);
    this.setUserIdentity(claims);
    return Promise.resolve(this.validateSecureToken(token));
  }

  async validateSecureToken(token: string) {
    const claims = {
      name: { encrypt: true },
      id: { encrypt: true },
      firstName: { encrypt: false },
      lastName: { encrypt: false },
      accessToken: { encrypt: true }
    };
    const claimsInToken = this.secureJwtToken.verify(token, claims);

    if (typeof claimsInToken !== 'boolean') {
      const query = this.validate.isHex(claimsInToken.id) ?
        {
          [mongoDbTables.users.id]: new ObjectId(claimsInToken.id)
        } :
        {
          [mongoDbTables.users.username]: claimsInToken.id
        };
      const user = await this.mongoDbSvc.readByValue(collections.USERS, query);

      if (user !== null) {
        return user.deleteRequested ? headers.ERR_CODE_TOKEN_DELETED_USER : true;
      }
    }
    // validate access token
    return claimsInToken ? true : headers.ERR_CODE_TOKEN_EXPR;
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

    if (rUrl.indexOf('public') >= 0) {
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

    claims['active'] = claims['active'] ? claims['active'] : false;
    claims['name'] = EncryptionUtil.decrypt(claims['name'], 'aes-symmetric');
    claims['id'] = EncryptionUtil.decrypt(claims['id'], 'aes-symmetric');
    if(claims['firstName']) {
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
    if (claims['email']) {
      claims['email'] = EncryptionUtil.decrypt(
        claims['email'],
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
