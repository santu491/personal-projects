import { ILogger, LoggerFactory } from '@anthem/communityadminapi/logger';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { AesBouncyEncryptor } from './aesBouncyEncryptor';
import { EncryptionUtil } from './encryptionUtil';
import { IJwtClaimConfigs, IJwtClaims } from './interfaces/iJwtClaim';
import { KeyStoreUtil } from './keyStoreUtil';

@Service()
export class JwtTokenUtil {
  private _aesBouncy: AesBouncyEncryptor;
  private _secret: string;
  private _log: ILogger = LoggerFactory.getLogger(__filename);

  constructor(
    private _algorithm: jwt.Algorithm,
    aesBouncyConfig: {
      secret: string;
      salt: string;
      iv: string;
    },
    keyStorePath: string,
    storeSecret: string
  ) {
    this._aesBouncy = new AesBouncyEncryptor(aesBouncyConfig.salt, aesBouncyConfig.secret, aesBouncyConfig.iv);
    const sp = this.getPassword(storeSecret);
    this._secret = this.getSecret(keyStorePath, sp);
  }

  generateToken(id: string, subject: string, expires: number, claims: IJwtClaims, issuer?: string, encryptId = true): string {
    const startDate = new Date();
    let result = '';
    const jwtOptions: jwt.SignOptions = {
      algorithm: this._algorithm,
      expiresIn: expires * 60,
      jwtid: encryptId ? EncryptionUtil.encrypt(id) : id,
      subject: subject
    };

    if (issuer) {
      jwtOptions.issuer = issuer;
    }
    result = jwt.sign(this.getClaimsForToken(claims), Buffer.from(this._secret, 'hex'), jwtOptions);
    const elapsed = ((new Date() as unknown) as number) - ((startDate as unknown) as number);
    // tslint:disable
    // eslint-disable-next-line no-console
    console.debug(`JWT_GENERATE Elapsed=${elapsed}`);
    // tslint:enable
    return result;
  }

  verify(token: string, claimConfig: IJwtClaimConfigs, subjectToValidate?: string, idToValidate?: string): boolean | { [key: string]: string } {
    const startDate = new Date();
    let result: boolean | { [key: string]: string } = false;
    const options: jwt.VerifyOptions = {
      algorithms: [this._algorithm]
    };

    if (subjectToValidate) {
      options.subject = subjectToValidate;
    }

    if (idToValidate) {
      options.jwtid = EncryptionUtil.encrypt(idToValidate);
    }

    try {
      result = this.getClaimsFromToken((jwt.verify(token, Buffer.from(this._secret, 'hex'), options) as unknown) as { [key: string]: string }, claimConfig);
    } catch (e) {
      this._log.error(e.stack);
    }

    const elapsed = ((new Date() as unknown) as number) - ((startDate as unknown) as number);
    // tslint:disable
    // eslint-disable-next-line no-console
    console.debug(`JWT_VERIFY Elapsed=${elapsed}`);
    // tslint:enable
    return result;
  }

  decode(token: string) {
    const startDate = new Date();
    const result = jwt.decode(token);
    const elapsed = ((new Date() as unknown) as number) - ((startDate as unknown) as number);
    // eslint-disable-next-line no-console
    console.debug(`JWT_DECODED Elapsed=${elapsed}`);
    return result;
  }

  protected getClaimsFromToken(payload: { [key: string]: string }, claimConfig: IJwtClaimConfigs): { [key: string]: string } {
    const claims: { [key: string]: string } = {};
    for (const key in payload) {
      const k = key === 'sub' ? 'subject' : key === 'jti' ? 'id' : key;
      if (claimConfig[k] && payload[key]) {
        claims[k] = claimConfig[k].encrypt && payload[key] ? EncryptionUtil.decrypt(payload[key]) : payload[key];
      }
    }

    return claims;
  }

  protected getClaimsForToken(originalClaims: IJwtClaims): { [key: string]: string | number } {
    const claims: { [key: string]: string | number } = {};
    for (const key in originalClaims) {
      const claim = originalClaims[key];
      if (claim.encrypt && claim.value) {
        claim.value = EncryptionUtil.encrypt(claim.value.toString());
      }

      if (claim.value) {
        claims[key] = claim.value.toString();
      }
    }

    return claims;
  }

  private getPassword(encryptedPassword: string): string {
    return this._aesBouncy.decrypt(encryptedPassword);
  }

  private getSecret(keyStorePath: string, storePassword: string): string {
    return KeyStoreUtil.getKey(keyStorePath, 'signature', storePassword);
  }
}
