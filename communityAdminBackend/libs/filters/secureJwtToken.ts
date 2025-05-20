import { IJwtClaimConfigs, IJwtToken, JwtAlgorithms, JwtTokenUtil } from '@anthem/communityadminapi/security';
import { APP } from '@anthem/communityadminapi/utils';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { ISecureJwtClaims } from './interfaces/iSecureJwtClaims';

@Service()
export class SecureJwtToken implements IJwtToken {
  private _tokenUtil: JwtTokenUtil;

  constructor() {
    this._tokenUtil = new JwtTokenUtil(JwtAlgorithms.HS256, APP.config.security.encryption.bouncyEncryption, APP.config.security.encryption.storePath, APP.config.security.encryption.storeSecret);
  }

  generateToken(id: string, subject: string, claims: ISecureJwtClaims) {
    if (!id || !subject) {
      throw Error(`Missing id ${id} or subject ${subject}`);
    }
    return this._tokenUtil.generateToken(id, subject, APP.config.jwt.expiration, claims);
  }

  generategbdToken(id: string, subject: string) {
    if (!id || !subject) {
      throw Error(`Missing id ${id} or subject ${subject}`);
    }
    return this._tokenUtil.generateToken(id, subject, APP.config.jwt.expiration, {});
  }

  verify(token: string, claimConfig: IJwtClaimConfigs, id?: string, subject?: string) {
    let result = this._tokenUtil.verify(token, claimConfig);
    if (result !== false && typeof result !== 'boolean') {
      //handle extra validations
      if (result && id && (result.id || '').toLowerCase() !== (id || '').toLowerCase()) {
        result = false;
      }
    }

    return result;
  }

  decode(token: string) {
    const result = this._tokenUtil.decode(token);
    return result;
  }

  verifyRSA(token: string) {
    try {
      const result = jwt.verify(token, APP.config.restApi.internal.tokenValidationPublicToken, { algorithms: ['RS256'] });
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log((error as Error).name);
      return false;
    }
  }
}
