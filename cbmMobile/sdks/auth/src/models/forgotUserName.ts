import { ErrorResponseDTO } from './error';

export interface ForgotUserNameResponseDTO {
  data: ForgotUserNameSuccessResponseDTO;
  errors: ErrorResponseDTO[];
}

export interface ForgotUserNameSuccessResponseDTO {
  contacts: ChanelContactDTO[];
  isEmailVerified: boolean;
  isPhonePresent: boolean;
  message: string;
  pingRiskId: string;
  status: string;
}

export interface ChanelContactDTO {
  channel: string;
  contactValue: string;
}
