import { ProfileData } from '../../../../shared/src/models/src/features/auth';

export interface UserProfileResponseDTO {
  data: {
    data: ProfileData;
    status: string;
  };
}
