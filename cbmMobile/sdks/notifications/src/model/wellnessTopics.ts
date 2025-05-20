import { ErrorResponseDTO } from '../../../auth/src/models/error';

export interface WellnessTopicsTitle {
  selectTopic: boolean;
}

export interface WellnessTopicsResponseDTO {
  data: WellnessTopicsListSuccessDTO;
  errors: ErrorResponseDTO[];
}
export interface WellnessTopicsListSuccessDTO {
  numResults: number;
  results: WellnesssTopicsListDTO[];
}

export interface WellnesssTopicsListDTO {
  description: string;
  id: string;
  imageUrl: string;
  path: string;
  title: string;
}

export interface WellnesssTopicsList {
  id: string;
  isSelected: boolean;
  title: string;
}

export interface GetMemberPreferenceResponseDTO {
  data: GetMemberPreferenceSuccessDTO | string;
  errors: ErrorResponseDTO[];
}

export interface GetMemberPreferenceSuccessDTO {
  pushNotifications: GetMemberPreferenceData;
}

export interface GetMemberPreferenceData {
  enabled: boolean;
  topics: string[] | undefined;
}
