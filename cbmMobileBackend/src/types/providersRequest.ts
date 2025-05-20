import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AddressRequest {
  @IsString() @IsNotEmpty() data!: string;
}

export class ProviderDetailRequest {
  @IsBoolean() @IsNotEmpty() track_total_hits!: boolean;
  @IsBoolean() @IsNotEmpty() track_scores!: boolean;
  @IsNumber() @IsNotEmpty() min_score!: number;
  @IsNotEmpty() query!: unknown;
  @IsNotEmpty() stored_fields!: unknown;
  @IsNotEmpty() script_fields!: unknown;
  @IsNotEmpty() sort!: unknown;
  @IsNumber() @IsNotEmpty() size!: number;
  @IsNumber() @IsNotEmpty() from!: number;
  @IsNotEmpty() aggs!: unknown;
}

export class ProvidersListRequest {
  @IsNotEmpty() data!: ProviderDetailRequest;
}

export class SendEmailRequest {
  @IsString() @IsNotEmpty() type!: string;
  @IsString() @IsNotEmpty() criteria!: string;
  @IsString() @IsNotEmpty() @IsEmail() recipient!: string;
  @IsString() @IsNotEmpty() disclaimer!: string;
  @IsString() @IsNotEmpty() token!: string;
  @IsString() @IsNotEmpty() txtValue!: string;
  @IsString() @IsNotEmpty() timestamp!: string;
}

export type ProviderCommonData = {
  id: string;
  name: string;
  sortOrder?: number;
};

export type ProviderFlagData = {
  sourceValue: string;
  displayVale: string;
};

export type ProviderServiceLocation = {
  svcLocID: number;
  svcLocName: string;
};

export type ProviderInsurance = {
  id: string;
  name: string;
  acceptingNewPatients: string;
  langVOCRule: number;
};

export type ProviderWorkHours = {
  day: string;
  hours: string;
};

export class TelehealthType {
  flag: boolean;
  states?: string[];
  types?: string[];

  constructor(flag: boolean) {
    this.flag = flag;
    this.states = [];
    this.types = [];
  }
}

export type Provider = {
  id: string;
  providerId: number;
  name: {
    displayName: string;
    firstName: string;
    lastName: string;
  };
  title: string;
  providerType: string;
  contact: {
    address: {
      addr1: string;
      addr2: string;
      city: string;
      state: string;
      zip: string;
      location: string;
    };
    fax: string;
    officeEmail: string;
    website: string;
    phone: string;
  };
  workHours: ProviderWorkHours[];
  practiceTypes: string[];
  languages: string[];
  specialties: Array<ProviderCommonData>;
  ageGroups: string[];
  serviceLocations: ProviderServiceLocation[];
  productType: Array<ProviderCommonData>;
  insurances: ProviderInsurance[];
  telehealthType: TelehealthType;
  handicap: string;
  publicTransportation: ProviderFlagData;
  gender: string;
  race: string;
  ethnicity: string;
  isFavorite: boolean;
  fields: {
    distance: number[];
  };
  sort: number[];
  displayTags: string[];
  onlineAppointmentScheduleFlag: number;
  accreditationsFlag: number;
  ageRanges: string[];
  alternateSiteName: string;
  autismFlag: number;
  boardCertFlag: number;
  cAQHID: number;
  casID: number;
  culturalCompetenceTrainingFlag: string;
  culturallyCompetentFlag: number;
  hospitalAffiliationsFlag: number;
  lastUpdate: string;
  medicaidFlag: number;
  npi: string;
  objectID: number;
  oudFlag: number;
  pKIDFlag: number;
  preferredProvider: number;
  prefixID: number;
  siteName: string;
  staffLanguages: string[];
  supportFamilyCaregivers: number;
  svcLocID: number;
  taxonomyCodes: string[];
  unVerifiedProvider: number;
  yellowLabels: string[];
};

export type ProviderListResponse = {
  providers: Provider[];
  filters: ProviderFilter[];
  total: number;
};

export type FilterData = {
  title: string;
  count: number;
  attribute?: string;
  defaultValue?: number;
};
export class ProviderFilter {
  name: string;
  attribute: string;
  data: FilterData[];
  isCheckbox?: boolean;
  isMoreOptionFlag?: boolean;

  constructor(name: string, attribute: string) {
    this.name = name;
    this.attribute = attribute;
    this.data = [];
  }
}
