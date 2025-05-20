import { ImageSourcePropType } from 'react-native';

import { ErrorResponseDTO } from './error';
import { MessageDTO } from './signUp';

export interface MfaResponseDTO {
  data: MessageDTO | ChannelSuccessResponseDTO | OtpResponseDTO | ForgotResponseDTO;
  errors: ErrorResponseDTO[];
}

export interface ForgotResponseDTO {
  cookie: string;
  flowName: string;
  message: string;
  secureToken?: string;
  status: string;
}
export interface CommunicationDTO {
  consent: boolean;
  mobileNumber: string;
  timestamp: string;
}

export interface ChannelSuccessResponseDTO {
  contacts: ChannelContact[];
  isEmailVerified: boolean;
  isPhonePresent: boolean;
  message: string;
  status: string;
}

export interface ChannelContact {
  channel: string;
  contactValue: string;
  description: string;
  image: ImageSourcePropType;
  verifyOtpDesc: string;
}

export interface OtpResponseDTO {
  message: string;
  pingDeviceId: string;
  pingUserId: string;
  status: string;
}

export interface MfaData {
  flowName: string;
  isEmailVerified: boolean;
  pingRiskId: string;
  userName: string;
}

export interface RememberMeDeviceResponseDTO {
  data: RememberMeDeviceSuccessResponseDTO;
}

export interface RememberMeDeviceSuccessResponseDTO {
  deviceCookie: string;
  status: string;
}

export interface SuccessAlertData {
  description: string;
  title: string;
}
