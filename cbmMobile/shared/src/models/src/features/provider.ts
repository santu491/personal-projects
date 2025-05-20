export interface MemberAppointStatus {
  data?: SelectedProvider[] | [];
  isAppointmentConfirmed: boolean;
  isContinue: boolean;
  isPending: boolean;
}

export interface SelectedProvider {
  addressOne?: string;
  addressTwo?: string;
  beaconLocationId?: string;
  city?: string;
  distance?: number;
  email?: string;
  firstName?: string;
  isInsuranceCarrierAccepted?: boolean;
  isMemberOpted?: boolean;
  lastName?: string;
  name?: string;
  phone?: string;
  provDetailsId?: string;
  providerId?: number;
  providerPrefferedDateAndTime?: null;
  providerType?: string;
  state?: string;
  title?: string;
  zip?: string;
}
