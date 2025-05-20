import { IJwtClaim } from '@anthem/communityapi/security';

export interface IJwtClaims {
  hcId: IJwtClaim;
  userNm?: IJwtClaim;
}
