import { Screen } from '../navigation/appointment.navigationTypes';

export interface AppointmentStatus {
  action: {
    screenName: string;
  };
  data?: string[];
  label: string;
}

export interface ListDataItem {
  label: string;
  value: string;
}
export interface HistoryList {
  label: string;
  value: string | undefined;
}

export interface AppointmentTabStatusResponseDTO {
  data: AppointmentTabStatusResponseSuccessDTO;
}

export interface AppointmentTabStatusResponseSuccessDTO {
  id: string;
  isApproved: boolean;
  isInactivated: boolean;
  isInitiated: boolean;
  isRedDotVisible: boolean;
}

export interface AppointmentsResponseDTO {
  data: AppointmentListDataDTO[] | AppointmentListDataDTO | null;
}

export interface AddressDTO {
  addressOne: string;
  addressTwo: string;
  city: string;
  state: string;
  stateCode: string;
  zipcode: string;
}

export interface CommunicationDTO {
  consent: boolean;
  mobileNumber: string;
}

export interface MemberPreferredSlotDTO {
  days: string[] | undefined;
  time: string | undefined;
}

export interface WorkFlowStatusDTO {
  action: string;
  actionDate: string;
  reason: null;
}

export interface SelectedProvidersDTO {
  addressOne: string;
  addressTwo: string;
  beaconLocationId: string;
  city: string;
  currentStatus: string;
  distance: number;
  email: string;
  firstName: string;
  isInsuranceCarrierAccepted: boolean;
  isMemberOpted: boolean;
  isNewTimeProposed: boolean;
  lastName: string;
  name: string;
  phone: string;
  provDetailsId: string;
  providerId: string;
  providerPrefferedDateAndTime: string;
  providerType: string;
  state: string;
  title: string;
  workFlowStatus: [WorkFlowStatusDTO];
  zip: string;
}

export interface AppointmentHistoryDTO {
  action: string;
  actionDate: string;
}

export interface QuestionnaireDTO {
  answer: string;
  jobMissedDays: string;
  lessProductivedays: string;
  presentingProblem: string;
}

export interface ClinicalQuestionsDTO {
  dateOfQuestionnaire: string;
  questionnaire: [QuestionnaireDTO];
}

export interface MemberRemindersDTO {
  firstReminder: boolean;
  secondReminder: boolean;
}

export interface PdrRemindersDTO {
  firstReminder: boolean;
  secondReminder: boolean;
}

export interface ProviderItemData {
  label: string;
  value: string;
}

export interface AppointmentHistoryList {
  appointmentCurrentStatus: string;
  appointmentHistory: [AppointmentHistoryDTO];
  appointmentScheduledDateAndTime: string;
  appointmentType: string;
  clientName: string;
  clinicalQuestions: ClinicalQuestionsDTO;
  dateOfInitiation: string;
  email: string;
  employerType: string;
  firstName: string;
  id: string;
  lastName: string;
  memberPrefferedSlot: MemberPreferredSlotDTO;
  phone: string;
  planName: string;
  selectedProviders: SelectedProvidersDTO[];
  updatedAt: string;
}

export interface AppointmentListDataDTO {
  appointmentCurrentStatus: string;
  appointmentHistory: [AppointmentHistoryDTO];
  appointmentScheduledDateAndTime: string;
  appointmentType: string;
  clientName: string;
  clinicalQuestions: ClinicalQuestionsDTO;
  communication: AddressDTO;
  dateOfInitiation: string;
  dob: string;
  email: string;
  employerType: string;
  firstName: string;
  gender: string;
  groupId: string;
  healthInsuranceCarrier: string;
  iamguid: string;
  id: string;
  isApproved?: boolean;
  isInactivated?: boolean;
  isInitiated?: boolean;
  isNewTimeProposed: boolean;
  isProcessedBy72Hrs: boolean;
  isTimingCustomized: boolean;
  lastName: string;
  lastVisitedDate: string;
  memberOptedProvider: null;
  memberPrefferedSlot: MemberPreferredSlotDTO;
  memberReminders: MemberRemindersDTO[];
  mrefNumber: null;
  pdrReminders: PdrRemindersDTO[];
  phone: string;
  planName: string;
  selectedProviders?: SelectedProvidersDTO[];
  updatedAt: string;
}

export interface ErrorResponseDTO {
  attemptsRemaining?: number;
  error: string;
  errorType: string;
  message: string;
  status: string;
  statusCode: string;
}

export enum AppointmentCurrentStatus {
  IS_APPROVED = 'Approved',
  IS_INITIATED = 'Initiated',
  IS_IN_ACTIVATED = 'Inactive',
}

export enum RequestLabels {
  COUNSELORS = 'counselors',
  DATE_TIME = 'date/time',
  MULTIPLE_RESPONSES = 'MULTIPLERESPONSES',
  STATUS = 'status',
}

export enum RequestHistoryApi {
  CANCELED = 'CANCELED',
  CONFIRMED = 'APPROVED',
  PENDING = 'INITIATED',
}

export enum RequestCurrentStatus {
  ACCEPTED = 'ACCEPTED',
  APPROVED = 'APPROVED',
  APPROVED_BY_OTHERS = 'APPROVEDBYOTHERS',
  DECLINED = 'DECLINED',
  INITIATED = 'INITIATED',
  MBR_CANCEL = 'MBRCANCEL',
  MBR_NO_RESPONSE = 'MBRNORESPONSE',
  MULTIPLE_RESPONSES = 'MULTIPLERESPONSES',
  NEW_TIME_PROPOSED = 'NEWTIMEPROPOSED',
  PDR_CANCEL = 'PDRCANCEL',
  PDR_NO_RESPONSE = 'PDRNORESPONSE',
  REJECTED = 'REJECTED',
}
export interface PdrRemindersDTO {
  firstReminder: boolean;
  secondReminder: boolean;
}

export interface CancelRequestDTO {
  appointmentScheduledDateAndTime?: string;
  id: string | undefined;
  lastUpdatedStatus?: string;
  memberApprovedTimeForEmail?: string;
  providerId?: string;
  status?: string | RequestCurrentStatus;
}

export interface CancelResponseDTO {
  data: number;
}

export interface AppointmentsMenu {
  action: Screen;
  label: string;
}
