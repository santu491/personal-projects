import { IJwtClaimConfigs, IJwtClaims } from './iJwtClaim';

export interface IJwtToken {
  generateToken(id: string, subject: string, claims: IJwtClaims): string | Promise<string>;
  verify(token: string, claimConfig: IJwtClaimConfigs, id?: string, subject?: string): boolean | { [key: string]: string } | Promise<boolean | { [key: string]: string }>;
}
