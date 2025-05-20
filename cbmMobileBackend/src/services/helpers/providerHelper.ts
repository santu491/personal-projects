import {
  ObjectKeys,
  ProviderFilters,
  ResponseLabels,
  YellowLabels,
} from '../../constants';
import {
  FilterData,
  Provider,
  ProviderCommonData,
  ProviderFilter,
  TelehealthType,
} from '../../types/providersRequest';

export function convertTime(time: number): string {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ((hours + 11) % 12) + 1; // Converts 0-23 hour format into 1-12 format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export function transformWorkHours(
  workHours: Array<{day: string; hours: Array<{from: number; to: number}>}>,
): Array<{day: string; hours: string[]}> {
  // Convert hours from number format to string
  const workDayTimings = workHours?.map(({day, hours}) => {
    const timings = hours.map(period => {
      const from = convertTime(period.from);
      const to = convertTime(period.to);
      return `${from} - ${to}`;
    });
    return {
      day,
      hours: timings,
    };
  });

  if (!workDayTimings?.length) return [];

  return workDayTimings;

  // Group the days based on hours of operation
  // Uncomment if the days need to be grouped with workday timings
  /*
  const groupedByHours: {[key: string]: string[]} = {};
  workDayTimings.forEach(({day, hours}) => {
    if (!groupedByHours[hours]) {
      groupedByHours[hours] = [];
    }
    groupedByHours[hours].push(day);
  });

  return Object.entries(groupedByHours).map(([hours, days]) => ({
    days,
    hours,
  }));*/
}

export const createYellowLabels = (provider: any) => {
  const tags: string[] = [];

  YellowLabels.forEach(({key, label}) => {
    if (provider[key]) {
      tags.push(label);
    }
  });

  if (provider?.insurances) {
    const accceptsNewPatient = provider.insurances.find(
      (insurance: any) => insurance?.acceptingNewPatients === 'YES',
    );
    if (accceptsNewPatient) {
      tags.push(ResponseLabels.ACCEPT_PATIENT);
    }
  }

  return tags;
};

export function formatProvider(provider: any) {
  const telehealthTypes = new TelehealthType(!!provider?.teleHealthFlag);
  if (telehealthTypes.flag) {
    const telehealthStates =
      provider?.licenses?.map((license: any) => license.licenseState) || [];
    telehealthTypes.types =
      provider?.telehealthTypes?.map(
        ({telehealthType}: {telehealthType: string}) => telehealthType,
      ) || [];
    telehealthTypes.states = Array.from(new Set(telehealthStates));
  }

  return {
    providerId: provider.prvId,
    name: {
      displayName: provider.name,
      firstName: provider.firstName,
      lastName: provider.lastName,
    },
    title: provider.title,
    providerType: provider.prvTyp,
    contact: {
      address: {
        addr1: provider.addr1,
        addr2: provider.addr2,
        city: provider.city,
        state: provider.state,
        zip: provider.zip,
        location: provider.location,
      },
      fax: provider.fax,
      officeEmail: provider.officeEmail,
      website: provider.website,
      phone: provider.phone,
    },
    workHours: transformWorkHours(provider?.workHours),
    languages:
      provider?.languages?.map(({name}: ProviderCommonData) => name) || [],
    specialties:
      provider?.specialties?.map(
        ({id, name, sortOrder}: ProviderCommonData) => ({
          id,
          name,
          sortOrder,
        }),
      ) || [],
    ageGroups:
      provider?.ageGroups?.map(({name}: ProviderCommonData) => name) || [],
    productType:
      provider?.productType
        ?.filter(
          ({name}: ProviderCommonData) =>
            name.toUpperCase() !== ObjectKeys.BOTH,
        )
        .map(({id, name, sortOrder}: ProviderCommonData) => ({
          id,
          name,
          sortOrder,
        })) || [],
    telehealthTypes,
    handicap: provider?.handicapFlag,
    publicTransportation: provider?.publicTransportationFlag,
    gender: provider?.gender?.sourceValue,
    race: provider.race,
    ethnicity: provider.ethnicity,
    onlineAppointmentScheduleFlag: provider.onlineAppointmentScheduleFlag,
    accreditationsFlag: provider.accreditationsFlag,
    ageRanges:
      provider?.ageRanges?.map(({name}: ProviderCommonData) => name) || [],
    boardCertFlag: provider.boardCertFlag,
    culturalCompetenceTrainingFlag: provider.culturalCompetenceTrainingFlag,
    hospitalAffiliationsFlag: provider.hospitalAffiliationsFlag,
    npi: provider.npi,
    staffLanguages:
      provider?.staffLanguages?.map(
        ({languageName}: {languageName: string}) => languageName,
      ) || [],
    taxonomyCodes:
      provider?.taxonomyCodes?.map(
        ({taxonomyCode}: {taxonomyCode: string}) => taxonomyCode,
      ) || [],
    unVerifiedProvider: provider.unVerifiedProvider,
    yellowLabels: createYellowLabels(provider),
    beaconLocationId: provider?.sourcesystemLocation?.sourceID || '',
  };
}

export function transformProvidersList(providersList: any): Provider[] {
  if (!providersList?.length) return [];

  return providersList.map((providerData: any) => {
    const provider = providerData[ObjectKeys.SOURCE];

    return {
      ...formatProvider(provider),
      fields: providerData.fields,
      id: providerData[ObjectKeys.ID],
    };
  });
}

function createFilterOptions(
  filterTitle: string,
  displayAttribute: string,
  attribute: string,
  filterData: any,
): ProviderFilter {
  const filterOption = new ProviderFilter(filterTitle, displayAttribute);
  filterOption.data = filterData[attribute]?.buckets.map(
    (bucket: {[key: string]: string | number}) => ({
      title: bucket.displayLabel,
      count: bucket.doc_count,
    }),
  );
  return filterOption;
}

function sortAgeGroupFilter(ageGroups: any) {
  return ageGroups.sort((a: {key: string}, b: {key: string}) => {
    const aValue = parseInt(a.key.split('|')[1], 10);
    const bValue = parseInt(b.key.split('|')[1], 10);
    return aValue - bValue;
  });
}

function createCheckboxOption(
  id: string,
  displayName: string,
  filterData: any,
): FilterData | null {
  const checkboxFilter = filterData[id]?.buckets?.find(
    (dataFilter: {key: number}) => dataFilter.key === 1,
  );
  return checkboxFilter
    ? {title: displayName, count: checkboxFilter[ObjectKeys.DOC_COUNT]}
    : null;
}

export function createProviderFilters(filterData: any) {
  const filters: ProviderFilter[] = [];
  if (!filterData) return [];

  if (filterData[ProviderFilters.onlineAppointments.identifier]) {
    const onlineAppointments = new ProviderFilter(
      '',
      ProviderFilters.onlineAppointments.displayAttribute,
    );
    const onlineAppointmentData = createCheckboxOption(
      ProviderFilters.onlineAppointments.identifier,
      ProviderFilters.onlineAppointments.displayName,
      filterData,
    );

    onlineAppointments.data = onlineAppointmentData
      ? [onlineAppointmentData]
      : [
          {
            title: ProviderFilters.onlineAppointments.displayName,
            count: 0,
          },
        ];
    onlineAppointments.isCheckbox = true;
    filters.push(onlineAppointments);
  }

  if (filterData[ProviderFilters.productType.identifier]) {
    const productTypes = new ProviderFilter(
      ProviderFilters.productType.displayName,
      ProviderFilters.productType.displayAttribute,
    );
    productTypes.data = filterData[
      ProviderFilters.productType.identifier
    ]?.inner?.productType?.buckets?.map((productType: any) => ({
      title: productType.key.split('|')[0],
      count: productType.doc_count,
    }));
    filters.push(productTypes);
  }

  if (filterData[ProviderFilters.ageGroup.identifier]) {
    filterData[ProviderFilters.ageGroup.identifier].buckets =
      sortAgeGroupFilter(
        filterData[ProviderFilters.ageGroup.identifier].buckets,
      );
    filters.push(
      createFilterOptions(
        ProviderFilters.ageGroup.displayName,
        ProviderFilters.ageGroup.displayAttribute,
        ProviderFilters.ageGroup.identifier,
        filterData,
      ),
    );
  }

  [
    ProviderFilters.telehealthType,
    ProviderFilters.languages,
    ProviderFilters.gender,
    ProviderFilters.race,
    ProviderFilters.handicap,
    ProviderFilters.ethnicity,
    ProviderFilters.transportation,
  ].forEach(({displayName, identifier, displayAttribute}) => {
    if (filterData[identifier]) {
      filters.push(
        createFilterOptions(
          displayName,
          displayAttribute,
          identifier,
          filterData,
        ),
      );
    }
  });

  if (filterData[ProviderFilters.newPatients.identifier]) {
    const acceptingNewPatients = new ProviderFilter(
      ProviderFilters.newPatients.displayName,
      ProviderFilters.newPatients.displayAttribute,
    );
    acceptingNewPatients.data = filterData[
      ProviderFilters.newPatients.identifier
    ]?.inner?.acceptingNewPatients?.buckets?.map(
      (newPatient: {[key: string]: string | number}) => ({
        title: newPatient.displayLabel,
        count: newPatient.doc_count,
      }),
    );
    filters.push(acceptingNewPatients);
  }

  if (filterData[ProviderFilters.practiceTypes.identifier]) {
    const providerTypes = new ProviderFilter(
      ProviderFilters.practiceTypes.displayName,
      ProviderFilters.practiceTypes.displayAttribute,
    );
    providerTypes.data = filterData[
      ProviderFilters.practiceTypes.identifier
    ]?.buckets?.map((providerType: any) => ({
      title: providerType?.key?.displayLabel,
      count: providerType?.doc_count,
    }));
    filters.push(providerTypes);
  }

  if (filterData[ProviderFilters.specialty.identifier]) {
    const specialties = new ProviderFilter(
      ProviderFilters.specialty.displayName,
      ProviderFilters.specialty.displayAttribute,
    );
    specialties.data = filterData[
      ProviderFilters.specialty.identifier
    ]?.inner?.specialties?.buckets?.map(
      (specialty: {[key: string]: string | number}) => ({
        title: specialty.displayLabel,
        count: specialty.doc_count,
      }),
    );
    filters.push(specialties);
  }

  const moreOptionsData: FilterData[] = [];
  [
    ProviderFilters.accreditions,
    ProviderFilters.boardCertified,
    ProviderFilters.culturalcompetancy,
    ProviderFilters.hospitalAffiliation,
  ].forEach(({displayName, identifier, displayAttribute}) => {
    const optionData = createCheckboxOption(
      identifier,
      displayName,
      filterData,
    );
    if (optionData) {
      moreOptionsData.push({
        ...optionData,
        attribute: displayAttribute,
        defaultValue: 1,
      });
    }
  });

  if (moreOptionsData.length) {
    const moreOptions = new ProviderFilter(
      ProviderFilters.moreOptions.displayName,
      ProviderFilters.moreOptions.identifier,
    );
    moreOptions.data = moreOptionsData;
    moreOptions.isMoreOptionFlag = true;
    filters.push(moreOptions);
  }
  return filters;
}
