import { ErrorResponseDTO } from './error';

export interface UpdatePhoneNumberResponseDTO {
  data: UpdatePhoneNumberSuccessResponseDTO;
  errors: ErrorResponseDTO[];
}

export interface UpdatePhoneNumberSuccessResponseDTO {
  message: string;
  status: string;
}

export interface ResetSecretResponseDTO {
  data: ResetSecretSuccessResponseDTO;
  errors: ErrorResponseDTO[];
}

export interface ResetSecretSuccessResponseDTO {
  message: string;
  status: string;
}
