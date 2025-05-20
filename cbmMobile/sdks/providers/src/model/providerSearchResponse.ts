export type SearchProvider = SearchProviderDTO;
export interface SearchProviderDTO extends SearchProviderTeleHealthCard {
  accreditationsFlag?: number;
  ageGroups?: string[];
  ageRanges?: string[];
  beaconLocationId?: string;
  boardCertFlag?: number;
  boardCertifications?: BoardCertification[];
  contact?: Contact;
  culturalCompetenceTrainingFlag?: string;
  ethnicity?: string;
  familyCareGiver?: number;
  fields?: Fields;
  gender?: string;
  handicap?: string;
  hospitalAffiliationsFlag?: number;
  id?: string;
  languages?: string[];
  licenses?: License[];
  medicaidFlag?: number;
  name?: Name;
  npi?: string;
  onlineAppointmentScheduleFlag?: number;
  practiceName?: string;
  practiceTypes?: string[];
  productType?: ProductType[];
  providerId?: number;
  providerType?: string;
  publicTransportation?: string;
  race?: string;
  sourceSystem?: SourceSystemDTO;
  specialties?: Specialty[];
  staffLanguages?: string[];
  taxid?: string[];
  taxonomyCodes?: string[];
  telehealthTypes?: TeleHealthTypes;
  title: string;
  tooltip?: Tooltip;
  unVerifiedProvider?: number;
  workHours?: WorkHour[];
  yellowLabels?: YellowLabels[];
}

export interface Tooltip {
  agesTreatedToolTip?: string;
  boardCertificationToolTip?: string;
  genderLabelToolTip?: string;
  languagesSpokenToolTip?: string;
  npiToolTip?: string;
  officeLanguagesSpokenToolTip?: string;
  practiceNameToolTip?: string;
  productTypeToolTip?: string;
  remoteMonitoringTooltip?: string;
  secureTextMessagingTooltip?: string;
  specialtiesAndServicesToolTip?: string;
  storeForwardTooltip?: string;
}

export interface License {
  certificationEntity: number;
  licenseLevelCodeDescription: number;
  licenseNumber: number;
  licenseState: number;
}

export interface BoardCertification {
  issuer: string;
}
export interface YellowLabels {
  icon?: string;
  label?: string;
  notAvailable?: boolean;
}

export interface SearchProviderTeleHealthCard {
  description?: string;
  email?: EmailDTO;
  logo?: LogoDTO;
  phoneNumber?: PhoneNumberDTO;
  subTitle?: string;
  tag?: TagDTO;
  tagNames?: string[];
  title: string;
  url?: UrlDTO;
  visitButton?: VisitButtonDTO;
}

export interface EmailDTO {
  label: string | null;
  value: string | null;
}

export interface LogoDTO {
  alt?: string;
  dmUrl: string;
  originalSize?: string;
  src: string;
}

export interface PhoneNumberDTO {
  extension: string | null;
  label: string | null;
  title: string | null;
  value: string | null;
}

export interface TagDTO {
  label: string;
  tooltip: string;
}

export interface UrlDTO {
  ariaLabel: string;
  href: string;
  isExternal: boolean;
  label: string;
  openAsSSP: boolean;
}

export interface VisitButtonDTO {
  ariaLabel: string;
  href: string;
  isExternal: boolean;
  label: string;
  openAsSSP: boolean;
}

export interface SourceSystemDTO {
  id: string;
  keyName: string;
  location: SourceSystemLocationDTO;
  systemID: string;
}

export interface SourceSystemLocationDTO {
  id: string;
  keyName: string;
  systemID: string;
}

export interface Name {
  displayName: string;
  firstName: string;
  lastName: string;
}

export interface Contact {
  address: Address;
  fax: string;
  officeEmail: string;
  phone: string;
  website: string;
}

export interface Address {
  addr1: string;
  addr2: string;
  city: string;
  location: Location;
  state: string;
  zip: string;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface WorkHour {
  day: string;
  hours: string[];
}

export interface Specialty {
  id: number;
  name: string;
  sortOrder: number;
}

export interface ProductType {
  id: number;
  name: string;
  sortOrder: number;
}

export interface TeleHealthTypes {
  flag: boolean;
  states?: string[];
  types: string[];
}

export interface Fields {
  distance: number[];
}

export interface ProviderSearchResponseDTO {
  data: ProviderSearchValue[];
}

export interface ProviderSearchValue {
  city: string;
  state: string;
  streetLine: string;
  text?: string;
  title?: string;
}

export interface GeoCodeResponseDTO {
  data: GeoCodeResponseValue;
}

export interface GeoCodeResponseValue {
  geoCoordinates: GeoCoordinates;
  state: string;
}

export interface GeoCoordinates {
  latitude: string;
  longitude: string;
}

export enum ContactViewIcons {
  DIRETION_ICON = 'Direction',
  EMAIL_ICON = 'Email',
  LOCATION_ICON = 'Location',
  PHONE_ICON = 'TelePhone',
  TELEHEALTH_ICON = 'TeleHealth',
}

export enum YellowCardIcons {
  ACCEPTING_NEW_PATIENTS = 'accepting-new-patients',
  PUBLIC_TRANSPORTATION = 'public-transportation',
  WHEEL_CHAIR_ACCESS = 'wheelchair-accessible',
}

export enum ContactViewTitle {
  DIRETION = 'Direction',
  EMAIL = 'Email',
  LOCATION = 'Location',
  PHONE = 'Phone',
  TELEHEALTH = 'TeleHealth',
}

export interface DetailedSection {
  data?: DetailedSectionData[];
  sectionTitle?: string;
}

export interface DetailedSectionData {
  description?: string | string[];
  title: string;
  tooltip?: string;
  type?: string;
}

export interface TooltipCheck {
  index: number;
  title: string;
}
export interface FieldDataDTO {
  label: string;
  placeholder?: string;
}

export interface ProviderSource {
  locationSourceId: string;
  locationSourceKeyName: string;
  sourceId: string;
  sourceName: string;
}

export interface ProfileCorrectionFormSubmit extends ProfileCorrectionForm {
  planId: string;
  planName: string;
  providerSource: ProviderSource;
}

export interface ProfileCorrectionForm {
  comments?: string;
  emailAddress?: string;
  firstName?: string;
  labels?: OptionsDataResponseDTO[];
}

export interface ProfileCorrectOptions extends OptionsDataResponseDTO {
  selected?: boolean;
}

export interface ReportProfileCorrectionForm extends Omit<ReportProfileCorrectionFormDTO, 'options'> {
  profileOptions?: ProfileCorrectOptions[];
  providerName: string;
}

export interface OptionsDataResponseDTO {
  id: number;
  label: string;
  name: string;
}

export interface OptionsDataDTO {
  data: OptionsDataResponseDTO[];
}
export interface ReportProfileCorrectionFormDTO {
  comments?: FieldDataDTO;
  contactInformationLabel?: string;
  description?: string;
  email?: FieldDataDTO;
  name?: FieldDataDTO;
  options: OptionsDataDTO;
  title?: string;
}

export interface DisclaimerCardDTO {
  disclaimer?: string;
  disclaimerLabel?: string;
  reportProfileCorrectionForm: ReportProfileCorrectionFormDTO;
}

export interface MhsudDisclaimerResponseDTO {
  data?: DisclaimerCardDTO;
}

export interface ProfileUpdateFields {
  comments: string;
  emailAddress: string;
  firstName: string;
}
