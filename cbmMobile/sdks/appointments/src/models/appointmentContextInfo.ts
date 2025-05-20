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
  appointmentId: string;
  clinicalQuestions?: ClinicalQuestions;
  currentStatus: string;
  dateOfInitiation?: string;
  distance: number;
  firstName: string;
  isNewTimeProposed: boolean;
  lastName: string;
  memberApprovedTimeForEmail: string;
  memberPrefferedSlot: MemberPrefferedSlot;
  name: string;
  providerId: string;
  providerPrefferedDateAndTime: string;
  providerType: string;
  title: string;
  workFlowStatus?: WorkFlowStatus[];
}

export interface WorkFlowStatus {
  action: string;
  actionDate: string;
  reason: string | null;
}
