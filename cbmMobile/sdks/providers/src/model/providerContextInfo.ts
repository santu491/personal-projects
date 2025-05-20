export interface ScheduleAppointmentInfo {
  clinicalQuestions?: ClinicalQuestions;
  memberSlot?: MemberPrefferedSlot;
}

export interface MemberPrefferedSlot {
  days?: string[] | undefined;
  time?: string | undefined;
}

export interface ClinicalQuestions {
  questionnaire: QuestionnaireInfo[];
}

export interface QuestionnaireInfo {
  answer: string;
  jobMissedDays: string;
  lessProductivedays: string;
  presentingProblem: string;
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
