import { ProfileData } from '../../../../shared/src/models/src/features/auth';

export interface LoginResponseDTO {
  data: LoginSuccessResponseDTO;
}

export interface LoginSuccessResponseDTO {
  authenticated: boolean;
  createdAt: string;
  expiresAt: string;
  expiresIn: number;
  isConsentExpired: boolean;
  pingRiskId: string;
  profile: ProfileData;
  secureToken: string;
  status: string;
}
