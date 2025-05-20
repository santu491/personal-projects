import { IJwtClaim, IJwtClaims } from '@anthem/communityadminapi/security';

export interface IPublicJwtClaims extends IJwtClaims {
  threatType?: IJwtClaim;
  authId: IJwtClaim;
  transientUsernm?: IJwtClaim;
  hcid?: IJwtClaim;
  usernm?: IJwtClaim;
  cookie?: IJwtClaim;
  groupid?: IJwtClaim;
  mcid?: IJwtClaim;
  webguid?: IJwtClaim;
  dplId?: IJwtClaim;
  mbrsequencenbr?: IJwtClaim;
  sourcesystemid?: IJwtClaim;
  dob?: IJwtClaim;
  firstNm?: IJwtClaim;
  lastNm?: IJwtClaim;
  phoneNo?: IJwtClaim;
  linkToken?: IJwtClaim;
}
