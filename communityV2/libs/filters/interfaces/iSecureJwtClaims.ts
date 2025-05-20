import { IJwtClaim, IJwtClaims } from '@anthem/communityapi/security';

export interface ISecureJwtClaims extends IJwtClaims {
  name: IJwtClaim;
  id: IJwtClaim;
  firstName?: IJwtClaim;
  lastName?: IJwtClaim;
  accessToken?: IJwtClaim;
  active: IJwtClaim;
  isDevLogin?: IJwtClaim;
}
