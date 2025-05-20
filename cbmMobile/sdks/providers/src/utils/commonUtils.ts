import { SearchProvider } from '../model/providerSearchResponse';

export const detailsKeysArray = [
  { title: 'title', displayTitle: 'Title' },
  {
    title: 'culturalCompetenceTrainingFlag',
    displayTitle: 'Cultural Competency Training',
  },
  { title: 'ageRanges', displayTitle: 'Age treated' },
  { title: 'npi', displayTitle: 'NPI' },
  { title: 'taxonomyCodes', displayTitle: 'Taxonomy' },
  { title: 'hospitalAffiliationsFlag', displayTitle: 'Hospital privileges' },
  { title: 'gender', displayTitle: 'Gender' },
  { title: 'boardCertFlag', displayTitle: 'Board certification(s)' },
  { title: 'languages', displayTitle: 'Languages' },
  { title: 'staffLanguages', displayTitle: 'Language(s) Spoken by Office Staff' },
  { title: 'race', displayTitle: 'Race' },
  { title: 'ethnicity', displayTitle: 'Ethnicity' },
  { title: 'accreditationsFlag', displayTitle: 'Accreditations' },
  { title: 'productType', displayTitle: 'Product Type' },
];

export enum AditionalDetails {
  NA = 'NA',
  NO = 'No',
  NOT_APPLICABLE = 'Not Applicable',
  NOT_AVAILABLE = 'Not available',
  YES = 'Yes',
}

export const NOT_AVAILABLE = 'Not Available';

export enum WeekDays {
  FRI = 'FRI',
  MON = 'MON',
  SAT = 'SAT',
  SUN = 'SUN',
  THU = 'THU',
  TUE = 'TUE',
  WED = 'WED',
}

// Convert the name to pascal case
export const toPascalCase = (name?: string) => {
  return (
    name?.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
      return g1.toUpperCase() + g2.toLowerCase();
    }) ?? ''
  );
};

export const getWorkHoursArray = (response?: SearchProvider) => {
  const timeArray: {
    day: WeekDays;
    hours: string;
    key: number;
    key2: number;
  }[] = [];
  const workHours = response?.workHours;
  const weekDaysArray = [
    WeekDays.MON,
    WeekDays.TUE,
    WeekDays.WED,
    WeekDays.THU,
    WeekDays.FRI,
    WeekDays.SAT,
    WeekDays.SUN,
  ];

  if (workHours) {
    weekDaysArray.map((day, index) => {
      const dayHoursArray = workHours.find((item) => day.toUpperCase().includes(item.day));

      if (dayHoursArray) {
        timeArray.push({
          key: index,
          key2: index,
          day,
          hours: dayHoursArray.hours[0],
        });
      } else {
        timeArray.push({
          key: index,
          key2: index,
          day,
          hours: AditionalDetails.NOT_AVAILABLE,
        });
      }
    });
  }

  return timeArray;
};

export const convertTo12Hour = (time: number) => {
  let hours = Math.floor(time / 100);
  let minutes: number | string = time % 100;
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes} ${period}`;
};
