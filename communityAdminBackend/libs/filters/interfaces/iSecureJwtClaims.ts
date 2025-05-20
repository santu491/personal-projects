import { IJwtClaim, IJwtClaims } from '@anthem/communityadminapi/security';

export interface ISecureJwtClaims extends IJwtClaims {
  id: IJwtClaim;
  name: IJwtClaim;
  firstName: IJwtClaim;
  lastName: IJwtClaim;
  role: IJwtClaim;
  accessToken?: IJwtClaim;
  active: IJwtClaim;
  isDevLogin?: IJwtClaim;
}
