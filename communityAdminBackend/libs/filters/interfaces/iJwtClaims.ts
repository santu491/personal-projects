import { IJwtClaim } from '@anthem/communityadminapi/security';

export interface IJwtClaims {
  hcId: IJwtClaim;
  userNm?: IJwtClaim;
}
