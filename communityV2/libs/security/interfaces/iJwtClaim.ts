export interface IJwtClaim {
  value: string | boolean;
  encrypt: boolean;
}

export interface IJwtClaimConfig {
  encrypt?: boolean;
}

export interface IJwtClaims {
  [key: string]: IJwtClaim;
}

export interface IJwtClaimConfigs {
  [key: string]: IJwtClaimConfig;
}
