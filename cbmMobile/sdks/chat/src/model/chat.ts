export enum ChatFieldNames {
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  PHONE_NUMBER = 'phone',
}

export interface ChatData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ChatSessionWithDate extends ChatSession {
  key: string;
  time: number;
}

export interface ChatSession extends ChatData {
  lob: string;
}

export interface ChatAvailabilitySuccessResponseDTO {
  config?: string;
  isChatFlowEnabled: boolean;
}

export interface ChatSessionSuccessResponseDTO {
  key: string;
}

export interface ChatSessionResponseDataDTO {
  data: ChatSessionSuccessResponseDTO;
}

export interface ChatResponseDTO {
  data: ChatAvailabilitySuccessResponseDTO;
}
