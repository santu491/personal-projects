import { LoggerFactory } from '@anthem/communityadminapi/logger';
import { BcryptHash, IJwtClaimConfigs, IJwtToken, JwtAlgorithms, JwtTokenUtil } from '@anthem/communityadminapi/security';
import { APP } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';
import { IPublicJwtClaims } from './interfaces/iPublicJwtClaims';

@Service()
export class PublicJwtToken implements IJwtToken {
  private _tokenUtil: JwtTokenUtil;
  private _log = LoggerFactory.getLogger(__filename);

  constructor() {
    this._tokenUtil = new JwtTokenUtil(JwtAlgorithms.HS256, APP.config.security.encryption.bouncyEncryption, APP.config.security.encryption.storePath, APP.config.security.encryption.storeSecret);
  }

  async generateToken(id: string, subject: string, claims: IPublicJwtClaims, expires?: number, hashId = false): Promise<string> {
    if (!id && !subject) {
      throw Error(`Missing id ${id} or subject ${subject}`);
    }

    if (hashId) {
      id = await this.hashId(id);
    }

    return Promise.resolve(this._tokenUtil.generateToken(id, subject || '', expires || APP.config.jwt.expiration, claims, 'CP_PUBLIC', false));
  }

  async verify(token: string, claimConfig: IJwtClaimConfigs, url: string, id?: string, webguid?: string) {
    const claims = this._tokenUtil.verify(token, claimConfig);
    let result: boolean | { [key: string]: string } = false;
    if (claims !== false && typeof claims !== 'boolean') {
      //id = await this.hashId(id);
      if (id && !(await BcryptHash.compare(id, claims.id.replace('$2a$', '$2b$')))) {
        this._log.error('jwt token id verification failed.');
        result = false;
      } else {
        result = claims;
      }

      if (!result && webguid && claims.subject !== 'login') {
        if (claims.subject !== webguid) {
          this._log.error('jwt token webguid verification failed.');
        } else {
          result = claims;
        }
      }

      if (result) {
        result = claims;
        result.id = id;
      }

      if (this.needAuthenticated(url) && claims.threatType === 'AUTHENTICATE' && claims.authId === 'N') {
        this._log.error('url needs authentication through 2fa flow.');
        result = false;
      }
    } else {
      result = false;
    }

    return Promise.resolve(result);
  }

  private async hashId(id: string) {
    const startDate = new Date();
    id = await BcryptHash.hash(id, 10);
    //TODO: remove after java migration all apis.
    //spring java prepends $2a$ instead of $2b$
    id = id.replace('$2b$', '$2a$');
    const elapsed = ((new Date() as unknown) as number) - ((startDate as unknown) as number);
    this._log.debug(`BCRYPT_HASH Elapsed=${elapsed}`);
    return id;
  }

  private needAuthenticated(rUrl: string): boolean {
    let result = false;
    if (new RegExp(APP.config.jwt.publicAuthenticatedUrls, 'i').test(rUrl)) {
      result = true;
    }

    return result;
  }
}
