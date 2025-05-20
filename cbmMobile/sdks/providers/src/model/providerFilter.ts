import { ErrorResponseDTO } from '../../../auth/src/models/error';
import { SelectedProvider } from './providerContextInfo';
import { SearchProviderDTO } from './providerSearchResponse';
export interface ProviderFilterDTO {
  attribute: string;
  data: FilterOption[];
  isCheckbox?: true;
  isMoreOptionFlag?: boolean;
  isOpened?: boolean;
  name: string;
}

export interface FilterOption {
  attribute: string;
  count: number;
  defaultValue?: number;
  isSelected?: boolean;
  title: string;
}

export interface ProviderFilterQuery {
  bool: {
    should: MatchPhrase[];
  };
}

export interface MatchPhrase {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  match_phrase: {
    [key: string]: string | number;
  };
}

export interface SortInfo {
  id: number;
  label: string;
  query?: string;
}

export interface ProviderAppointmentStatusDTO {
  data: AppointmentMemberSuccessDTO;
  errors: ErrorResponseDTO[];
}

export interface AppointmentMemberSuccessDTO {
  data?: MemberAppointmentData[];
  message: string;
  success: boolean;
}

export interface MemberAppointmentData {
  selectedProviders?: SelectedProvider[];
}

export interface ProviderListDTO {
  data: ProviderListResponseSuccessDTO;
}

export interface ProviderListResponseSuccessDTO {
  filters: ProviderFilterDTO[];
  providers: SearchProviderDTO[];
  total: number;
}

export type ProviderFilter = ProviderFilterDTO;

export interface ProviderPlanPreferenceSuccessDTO {
  data?: ProviderPlanPreferenceDTO;
}

export interface DisClaimerContentDTO {
  content: string;
  screenName: string;
}

export interface ProviderPlanPreferenceDTO {
  benefitPlanName: string;
  disclaimers: DisClaimerContentDTO[];
  productTypes: string[];
  specialties: string[];
}

export enum DisclaimerScreenNames {
  DETAILS = 'DETAILS',
  EMAIL = 'EMAIL',
  HOME = 'HOME',
  PRINT = 'PRINT',
  RESULTS = 'RESULTS',
}
