export interface AppUpdateResponseDTO {
  data: AppUpdateSuccessResponseDTO;
}

export interface AppUpdateSuccessResponseDTO {
  isForceUpdate: boolean;
  platform: string;
}
