export enum AppointMentScheduleModelType {
  CONFIRM_EXPERIENCE = 'confirmExperience',
  CONTACT = 'contact',
  HELP = 'help',
  IDENTIFY_REQUESTER = 'identifyRequester',
}

export enum ClinicalQuestionnaireFields {
  JOB_MISSED_DAYS = 'jobMissedDays',
  LESS_PRODUCTIVE_DAYS = 'lessProductiveDays',
  PROBLEM = 'problem',
  PROBLEM_DESCRIPTION = 'problemDescription',
}

export const EMPLOYER_TYPE: string = 'BEACON';

export enum SelectCounselorSetting {
  FIRST_AVAILABLE = 'firstAvailable',
  PREFERRED_DATE = 'preferredDate',
}

export enum DaysInfoKeys {
  FRIDAY = 'Fri',
  MONDAY = 'Mon',
  SATURDAY = 'Sat',
  SUNDAY = 'Sun',
  THURSDAY = 'Thu',
  TUESDAY = 'Tue',
  WEDNESDAY = 'Wed',
}

export enum TimeRange {
  AFTERNOON = '12:00 PM to 3:00 PM',
  EARLY_MORNING = '6:00 AM to 9:00 AM',
  EVENING = '3:00 PM to 6:00 PM',
  MORNING = '9:00 AM to 12:00 PM',
  NIGHT = '6:00 PM to 9:00 PM',
}

export const ALERT_TYPE = {
  ADD_COUNSELOR: 'ADD_COUNSELOR',
  LIMIT_ADD_COUNSELOR: 'LIMIT_ADD_COUNSELOR',
  REMOVE_COUNSELOR: 'REMOVE_COUNSELOR',
  COUNSELOR_REMOVED: 'COUNSELOR_REMOVED',
  ALL_COUNSELOR_REMOVED: 'ALL_COUNSELOR_REMOVED',
  PENDING_REQUEST: 'PENDING_REQUEST',
  APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
};

export const RE_DIRECT_URL_API_TYPE = {
  TELEHEALTH_EMOTIONAL_SUPPORT: 'telehealth.emotionalSupport',
  PROVIDERS_FIND_COUNSELOR: 'providers.findCounselor',
  PROVIDERS_TELE_HEALTH: 'findACounselor.telehealth',
  WELLNESS: 'wellness',
  WORK_LIFE_RESOURCE: 'workLifeResources',
  LEGAL_SUPPORT: 'findLegalSupport',
  PLAN_FINANCE: 'planFinances',
  CARD_DETAILS: 'cardDetails',
};

export const DISCLAIMER_PARAMETERS = [
  '/:items/root/:items/responsivegrid/:items/provider_search_sect/disclaimer',
  '/:items/root/:items/responsivegrid/:items/provider_search_sect/disclaimerLabel',
];

export const MHSUD_PARAMETERS = [
  '/:items/root/:items/responsivegrid/:items/provider_profile_vie/reportProfileCorrectionForm',
];

export enum ProfileUpdateFieldNames {
  ADDITIONAL_COMMENTS = 'comments',
  EMAIL = 'emailAddress',
  NAME = 'firstName',
}
