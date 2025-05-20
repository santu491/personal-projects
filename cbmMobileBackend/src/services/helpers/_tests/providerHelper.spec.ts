import {TelehealthType} from '../../../types/providersRequest';
import {
  convertTime,
  createProviderFilters,
  createYellowLabels,
  formatProvider,
  transformProvidersList,
  transformWorkHours,
} from '../providerHelper';

describe('providerHelper', () => {
  describe('transformProvidersList', () => {
    it('should return an empty array for empty input', () => {
      const result = transformProvidersList([]);
      expect(result).toEqual([]);
    });

    it('should return an empty array for null input', () => {
      const result = transformProvidersList(null);
      expect(result).toEqual([]);
    });

    it('should correctly transform valid provider data', () => {
      const providersList = [
        {
          _source: {
            prvId: 71759,
            casID: 0,
            svcLocID: 148812,
            name: 'SOLEIL MINNELLA LMHC',
            firstName: 'SOLEIL',
            lastName: 'MINNELLA',
            title: 'LMHC',
            siteName: 'LAWRENCE GENEN MD INC',
            alternateSiteName: 'LAWRENCE GENEN MD INC',
            genderFlag: 'F',
            addr1: '11 Park Pl',
            addr2: '',
            city: 'New York',
            state: 'NY',
            zip: '10007-2801',
            website: 'Not Available',
            location: {
              lat: 40.71287,
              lon: -74.00817,
            },
            cAQHID: 15580962,
            medicaidFlag: 1,
            autismFlag: 0,
            beaconLocationId: 'F098145',
            oudFlag: 0,
            pKIDFlag: 0,
            pSMIFlag: 0,
            pSUDFlag: 0,
            onlineAppointmentScheduleFlag: 0,
            npi: '1043759020',
            taxonomyCodes: [
              {
                taxonomyCode: '101YM0800X',
              },
              {
                taxonomyCode: '1041C0700X',
              },
            ],
            culturalCompetenceTrainingFlag: 'Y',
            hospitalAffiliationsFlag: 0,
            culturallyCompetentFlag: 1,
            boardCertFlag: 0,
            accreditationsFlag: 0,
            handicapFlag: 'Y',
            publicTransportationFlag: 'Y',
            officeEmail: 'Not Available',
            phone: '8886842779',
            fax: '3233662966',
            preferredProvider: 1,
            unVerifiedProvider: 0,
            practiceTypes: [
              {
                id: 5,
                name: 'COUNSELOR',
              },
            ],
            prvTyp: 'Practitioner',
            prvRecTyp: 1,
            lastUpdate: '2024-06-21T05:04:07.657',
            prefixID: 0,
            ageGroups: [
              {
                id: 1,
                name: 'Young Child (0 - 4)',
                nameAndSortOrder: 'Young Child (0 - 4)|1',
                nameIdSortRule: 'Young Child (0 - 4)|1|1|0',
              },
            ],
            ageRanges: [
              {
                id: 1,
                name: ' 0 - 999 ',
              },
            ],
            languages: [
              {
                id: 552,
                name: 'ENGLISH',
              },
            ],
            staffLanguages: [
              {
                languageName: 'ENGLISH',
              },
            ],
            serviceLocations: [
              {
                svcLocID: 148809,
                svcLocName: 'LAWRENCE GENEN MD INC',
              },
            ],
            specialties: [
              {
                id: 7,
                name: 'ANXIETY DISORDERS',
                sortOrder: 370,
                showInDetails: 1,
                nameAndSortOrder: 'ANXIETY DISORDERS|370',
                showInUI: 1,
                nameIdSortRule: 'ANXIETY DISORDERS|7|370|1',
              },
            ],
            productType: [
              {
                id: 10146,
                name: 'EMPLOYEE ASSISTANCE PROGRAM',
                sortOrder: 3,
                showInDetails: 1,
                nameAndSortOrder: 'EMPLOYEE ASSISTANCE PROGRAM|3',
                showInUI: 0,
                nameIdSortRule: 'EMPLOYEE ASSISTANCE PROGRAM|10146|3|0',
              },
            ],
            insurances: [
              {
                id: '278',
                name: 'KAISER PERMANENTE OF NORTHERN CALIFORNIA - COMMERCIAL',
                acceptingNewPatients: 'YES',
                langVOCRule: 0,
              },
            ],
            workHours: [
              {
                day: 'FRI',
                hours: [
                  {
                    from: 700,
                    to: 2100,
                  },
                ],
              },
              {
                day: 'MON',
                hours: [
                  {
                    from: 700,
                    to: 2100,
                  },
                ],
              },
              {
                day: 'SAT',
                hours: [
                  {
                    from: 700,
                    to: 2100,
                  },
                ],
              },
              {
                day: 'SUN',
                hours: [
                  {
                    from: 700,
                    to: 2100,
                  },
                ],
              },
              {
                day: 'THU',
                hours: [
                  {
                    from: 700,
                    to: 2100,
                  },
                ],
              },
              {
                day: 'TUE',
                hours: [
                  {
                    from: 700,
                    to: 2100,
                  },
                ],
              },
              {
                day: 'WED',
                hours: [
                  {
                    from: 700,
                    to: 2100,
                  },
                ],
              },
            ],
            licenses: [
              {
                licenseLevelCodeDescription: 'COUNSELOR',
                licenseState: 'NY',
                licenseNumber: '011497',
                certificationEntity: 'NEW YORK, STATE OF (GENERAL)',
              },
              {
                licenseLevelCodeDescription: 'COUNSELOR',
                licenseState: 'NY',
                licenseNumber: '123',
                certificationEntity: 'NEW YORK, STATE OF (GENERAL)',
              },
            ],
            handicap: {
              sourceValue: 'Y',
              displayValue: 'YES',
            },
            publicTransportation: {
              sourceValue: 'Y',
              displayValue: 'YES',
            },
            gender: {
              sourceValue: 'F',
              displayValue: 'FEMALE',
            },
            race: 'WHITE',
            ethnicity: 'NOT HISPANIC OR LATINO',
            supportFamilyCaregivers: 0,
            sourcesystem: {
              sourceID: '1150857',
              sourceSystemKeyName: 'PROVNO',
              sourceSystemID: '1',
              sourceSystemName: 'CONNECTS',
            },
            sourcesystemLocation: {
              sourceID: 'F098145',
              sourceSystemKeyName: 'VENDOR',
              sourceSystemID: '1',
              sourceSystemName: 'CONNECTS',
            },
            objectID: 71759,
            fields: undefined,
            id: undefined,
            sort: undefined,
            yellowLabels: ['Accepting new patients'],
            teleHealthFlag: 1,
          },
        },
      ];
      const expected = [
        {
          providerId: 71759,
          name: {
            displayName: 'SOLEIL MINNELLA LMHC',
            firstName: 'SOLEIL',
            lastName: 'MINNELLA',
          },
          title: 'LMHC',
          providerType: 'Practitioner',
          contact: {
            address: {
              addr1: '11 Park Pl',
              addr2: '',
              city: 'New York',
              state: 'NY',
              zip: '10007-2801',
              location: {lat: 40.71287, lon: -74.00817},
            },
            fax: '3233662966',
            officeEmail: 'Not Available',
            website: 'Not Available',
            phone: '8886842779',
          },
          workHours: [
            {day: 'FRI', hours: ['7:00 AM - 9:00 PM']},
            {day: 'MON', hours: ['7:00 AM - 9:00 PM']},
            {day: 'SAT', hours: ['7:00 AM - 9:00 PM']},
            {day: 'SUN', hours: ['7:00 AM - 9:00 PM']},
            {day: 'THU', hours: ['7:00 AM - 9:00 PM']},
            {day: 'TUE', hours: ['7:00 AM - 9:00 PM']},
            {day: 'WED', hours: ['7:00 AM - 9:00 PM']},
          ],
          languages: ['ENGLISH'],
          specialties: [{id: 7, name: 'ANXIETY DISORDERS', sortOrder: 370}],
          ageGroups: ['Young Child (0 - 4)'],
          productType: [
            {id: 10146, name: 'EMPLOYEE ASSISTANCE PROGRAM', sortOrder: 3},
          ],
          telehealthTypes: {
            flag: true,
            states: ['NY'],
            types: [],
          },
          handicap: 'Y',
          publicTransportation: 'Y',
          gender: 'F',
          race: 'WHITE',
          ethnicity: 'NOT HISPANIC OR LATINO',
          onlineAppointmentScheduleFlag: 0,
          accreditationsFlag: 0,
          ageRanges: [' 0 - 999 '],
          beaconLocationId: 'F098145',
          boardCertFlag: 0,
          culturalCompetenceTrainingFlag: 'Y',
          hospitalAffiliationsFlag: 0,
          npi: '1043759020',
          staffLanguages: ['ENGLISH'],
          taxonomyCodes: ['101YM0800X', '1041C0700X'],
          unVerifiedProvider: 0,
          fields: undefined,
          id: undefined,
          yellowLabels: [
            'Preferred Provider',
            'Virtual counselor',
            'Accepting new patients',
          ],
        },
      ];
      const result = transformProvidersList(providersList);
      expect(result).toEqual(expected);
    });

    it('should handle incomplete provider data without errors', () => {
      const providersList = [
        {
          _source: {
            prvId: '123',
            name: 'Test Name',
          },
        },
      ];
      const teleHealth = new TelehealthType(false);
      const expected = [
        {
          providerId: '123',
          name: {
            displayName: 'Test Name',
            firstName: undefined,
            lastName: undefined,
          },
          contact: {
            address: {
              addr1: undefined,
              addr2: undefined,
              city: undefined,
              location: undefined,
              zip: undefined,
              state: undefined,
            },
            fax: undefined,
            officeEmail: undefined,
            phone: undefined,
            website: undefined,
          },
          workHours: [],
          languages: [],
          specialties: [],
          ageGroups: [],
          productType: [],
          telehealthTypes: teleHealth,
          title: undefined,
          unVerifiedProvider: undefined,
          ageRanges: [],
          staffLanguages: [],
          taxonomyCodes: [],
          supportFamilyCaregivers: undefined,
          beaconLocationId: '',
          boardCertFlag: undefined,
          accreditationsFlag: undefined,
          ethnicity: undefined,
          fields: undefined,
          gender: undefined,
          handicap: undefined,
          hospitalAffiliationsFlag: undefined,
          culturalCompetenceTrainingFlag: undefined,
          id: undefined,
          providerType: undefined,
          publicTransportation: undefined,
          npi: undefined,
          onlineAppointmentScheduleFlag: undefined,
          race: undefined,
          yellowLabels: [],
        },
      ];
      const result = transformProvidersList(providersList);
      expect(result).toEqual(expected);
    });
  });

  describe('convertTime', () => {
    it('should convert time correctly', () => {
      const result = convertTime(930);
      expect(result).toEqual('9:30 AM');
    });
  });

  describe('transformWorkHours', () => {
    it('should return an empty array for empty input', () => {
      const result = transformWorkHours([]);
      expect(result).toEqual([]);
    });

    it('should correctly transform work hours', () => {
      const workHours = [
        {
          day: 'Monday',
          hours: [
            {from: 900, to: 1200},
            {from: 1300, to: 1700},
          ],
        },
        {
          day: 'Tuesday',
          hours: [
            {from: 900, to: 1200},
            {from: 1300, to: 1700},
          ],
        },
      ];
      const expected = [
        {
          day: 'Monday',
          hours: ['9:00 AM - 12:00 PM', '1:00 PM - 5:00 PM'],
        },
        {
          day: 'Tuesday',
          hours: ['9:00 AM - 12:00 PM', '1:00 PM - 5:00 PM'],
        },
      ];
      const result = transformWorkHours(workHours);
      expect(result).toEqual(expected);
    });
  });

  describe('createProviderFilters', () => {
    const filterObj = {
      'specialties.name': {
        doc_count: 10659,
        inner: {
          doc_count: 10650,
          specialties: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'ANXIETY DISORDERS|7|370|1',
                doc_count: 799,
                displayLabel: 'ANXIETY DISORDERS',
                gt_translate_keys: ['displayLabel'],
              },
            ],
          },
        },
      },
      'checkbox-onlineAppointmentScheduleFlag': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 0,
            doc_count: 8091,
            displayLabel: '0',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 1,
            doc_count: 183,
            displayLabel: '1',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      ethnicity: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'NOT HISPANIC OR LATINO',
            doc_count: 851,
            displayLabel: 'NOT HISPANIC OR LATINO',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'HISPANIC OR LATINO',
            doc_count: 64,
            displayLabel: 'HISPANIC OR LATINO',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      race: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'WHITE',
            doc_count: 555,
            displayLabel: 'WHITE',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'BLACK OR AFRICAN AMERICAN',
            doc_count: 338,
            displayLabel: 'BLACK OR AFRICAN AMERICAN',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'ageGroups.name': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'Adult (18 - 64)|4|4|0',
            doc_count: 1145,
            displayLabel: 'Adult (18 - 64)',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'Adult (12 - 18)|3|3|0',
            doc_count: 1145,
            displayLabel: 'Adult (12 - 18)',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'Geriatric (65+) |5|5|0',
            doc_count: 7271,
            displayLabel: 'Geriatric (65+) ',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'insurances.acceptingNewPatients': {
        doc_count: 199660,
        inner: {
          doc_count: 1163,
          acceptingNewPatients: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'YES',
                doc_count: 1162,
                displayLabel: 'YES',
                gt_translate_keys: ['displayLabel'],
              },
              {
                key: 'NO',
                doc_count: 1,
                displayLabel: 'NO',
                gt_translate_keys: ['displayLabel'],
              },
            ],
          },
        },
      },
      'productType.name': {
        doc_count: 3070,
        inner: {
          doc_count: 1163,
          productType: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'EMPLOYEE ASSISTANCE PROGRAM|10146|3|0',
                doc_count: 1163,
              },
            ],
          },
        },
      },
      'languages.name': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'ENGLISH',
            doc_count: 1158,
            displayLabel: 'ENGLISH',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'SPANISH',
            doc_count: 181,
            displayLabel: 'SPANISH',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'publicTransportation.displayValue': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'YES',
            doc_count: 614,
            displayLabel: 'YES',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'NO',
            doc_count: 549,
            displayLabel: 'NO',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'gender.displayValue': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'FEMALE',
            doc_count: 982,
            displayLabel: 'FEMALE',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'MALE',
            doc_count: 176,
            displayLabel: 'MALE',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'licenses.licenseLevelCodeDescription': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'SOCIAL WORKER',
            doc_count: 627,
            displayLabel: 'SOCIAL WORKER',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'COUNSELOR',
            doc_count: 407,
            displayLabel: 'COUNSELOR',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'handicap.displayValue': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'YES',
            doc_count: 712,
            displayLabel: 'YES',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'NO',
            doc_count: 451,
            displayLabel: 'NO',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'telehealthTypes.telehealthType': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'Telehealth Services',
            doc_count: 768,
            displayLabel: 'Telehealth Services',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 'Audio/Video',
            doc_count: 717,
            displayLabel: 'Audio/Video',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
      'practiceTypes.name': {
        after_key: {
          prvTyp: 'Practitioner',
          name: 'SOCIAL WORKER',
        },
        buckets: [
          {
            key: {
              prvTyp: 'Facility',
              name: 'COMMUNITY MENTAL HEALTH CENTER OR PUB HLTH AGENCY',
              displayLabel: 'COMMUNITY MENTAL HEALTH CENTER OR PUB HLTH AGENCY',
              gt_translate_keys: ['displayLabel'],
            },
            doc_count: 4,
          },
          {
            key: {
              prvTyp: 'Facility',
              name: 'OUTPATIENT CLINIC',
              displayLabel: 'OUTPATIENT CLINIC',
              gt_translate_keys: ['displayLabel'],
            },
            doc_count: 1,
          },
        ],
      },
      'checkbox-accreditationsFlag': {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 0,
            doc_count: 4962,
            displayLabel: '0',
            gt_translate_keys: ['displayLabel'],
          },
          {
            key: 1,
            doc_count: 6,
            displayLabel: '1',
            gt_translate_keys: ['displayLabel'],
          },
        ],
      },
    };

    it('should return an empty array for null input', () => {
      const result = createProviderFilters(null);
      expect(result).toEqual([]);
    });

    it('should return an empty array for empty input', () => {
      const result = createProviderFilters({});
      expect(result).toEqual([]);
    });

    it('should successfully return filters array', () => {
      const result = createProviderFilters(filterObj);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('createYellowLabels', () => {
    it('should return label based on key', () => {
      const provider = {
        preferredProvider: 0,
        unVerifiedProvider: 0,
        autismFlag: 0,
        oudFlag: 1,
      };
      const result = createYellowLabels(provider);
      expect(result).toEqual(['OUD']);
    });

    it('should return empty array for no labels', () => {
      const provider = {};
      const result = createYellowLabels(provider);
      expect(result).toEqual([]);
    });
  });

  describe('formatProvider', () => {
    const provider = {
      licenses: [
        {
          licenseLevelCodeDescription: 'COUNSELOR',
          licenseState: 'NY',
          licenseNumber: '011497',
          certificationEntity: 'NEW YORK, STATE OF (GENERAL)',
        },
        {
          licenseLevelCodeDescription: 'COUNSELOR',
          licenseState: 'NY',
          licenseNumber: '123',
          certificationEntity: 'NEW YORK, STATE OF (GENERAL)',
        },
      ],
      teleHealthFlag: 1,
      telehealthTypes: [
        {
          telehealthType: 'Audio/Video',
        },
        {
          telehealthType: 'Telehealth Services',
        },
      ],
    };

    it('should format provider correctly', () => {
      const result = formatProvider(provider);
      expect(result).not.toBeNull();
    });
  });
});
