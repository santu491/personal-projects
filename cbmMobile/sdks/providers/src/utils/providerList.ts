/* eslint-disable @typescript-eslint/naming-convention */
import { ProviderFilterQuery } from '../model/providerFilter';

export interface ProvidersPayload {
  counselorName: string;
  distance?: string;
  eapPlanId?: string;
  filter?: ProviderFilterQuery[];
  latitude: number;
  longitude: number;
  page: number;
  planId?: string;
  productInfo?: string;
  productTypes?: string[];
  sort: SortQuery;
  specialties?: string[];
  state: string;
}

export interface SortQuery {
  [key: string]: string;
}

export const getProviderListPayload = (payload: ProvidersPayload) => {
  return payload.planId ? mhsudPayload(payload) : getEapPayload(payload);
};

export const getEapPayload = (payload: ProvidersPayload) => {
  const defaultPageCount = 10;
  const {
    latitude,
    longitude,
    state,
    counselorName,
    page = 0,
    filter,
    distance,
    sort,
    productInfo,
    eapPlanId,
  } = payload;

  let filterQuery = [
    {
      bool: {
        should: [
          {
            match: {
              'specialties.showInUI': 1,
            },
          },
          {
            terms: {
              'specialties.id': [],
            },
          },
          {
            bool: {
              must_not: {
                exists: {
                  field: 'specialties',
                },
              },
            },
          },
        ],
      },
    },
    {
      bool: {
        should: [
          {
            match: {
              'insurances.id': eapPlanId,
            },
          },
        ],
      },
    },
    {
      bool: {
        should: [
          {
            geo_distance: {
              distance: `${distance}miles`,
              location: {
                lat: latitude, //40.7127753, //geoCoordinates.latitude,
                lon: longitude, //-74.0059728, //geoCoordinates.longitude,
              },
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    teleHealthFlag: '1',
                  },
                },
                {
                  exists: {
                    field: 'licenses',
                  },
                },
                {
                  script: {
                    script: {
                      source: `doc['licenses.licenseState.keyword'].indexOf('${state}')>-1`,
                      lang: 'painless',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];

  if (productInfo) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    filterQuery = [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...JSON.parse(JSON.stringify(filterQuery)),
      [
        {
          bool: {
            should: [
              {
                match_phrase: {
                  'productType.name.keyword': productInfo.toUpperCase(),
                },
              },
            ],
          },
        },
      ],
    ];
  }

  const providersPayload = {
    data: {
      track_total_hits: true,
      track_scores: true,
      min_score: 0.001,
      query: {
        bool: {
          should: [
            {
              match: {
                'specialties.name.keyword': {
                  query: counselorName,
                  fuzziness: '0',
                  analyzer: 'synonym_phrase',
                  boost: 706,
                },
              },
            },
            {
              match: {
                'specialties.name.keyword': {
                  query: counselorName,
                  fuzziness: '0',
                  analyzer: 'synonym',
                  boost: 704,
                },
              },
            },
            {
              multi_match: {
                query: counselorName,
                type: 'best_fields',
                fuzzy_transpositions: false,
                fuzziness: '0',
                fields: [
                  'lastName^701',
                  'specialties.name^696',
                  'firstName^691',
                  'siteName^691',
                  'name^691',
                  'facilityRoster.name^511',
                  'addr1^491',
                  'prvTyp^481',
                  'state^471',
                  'languages.name^461',
                  'city^451',
                  'hospitalPrivs.hospitalName^441',
                  'website^431',
                  'ageRanges.name^421',
                  'officeEmail^411',
                  'addr2^401',
                  'npi^391',
                  'facilityRoster.npi^381',
                  'phone^371',
                  'licenses.licenseNumber^361',
                ],
                tie_breaker: 0.3,
              },
            },
            {
              query_string: {
                query: `*${counselorName}*`, //*`'*jason*',
                fuzziness: '0',
                type: 'best_fields',
                fields: [
                  'lastName^350',
                  'specialties.name^345',
                  'firstName^340',
                  'siteName^340',
                  'name^340',
                  'facilityRoster.name^160',
                  'addr1^140',
                  'prvTyp^130',
                  'state^120',
                  'languages.name^110',
                  'city^100',
                  'hospitalPrivs.hospitalName^90',
                  'website^80',
                  'ageRanges.name^70',
                  'officeEmail^60',
                  'addr2^50',
                  'npi^40',
                  'facilityRoster.npi^30',
                  'phone^20',
                  'licenses.licenseNumber^10',
                ],
                tie_breaker: 0.3,
              },
            },
          ],
          filter: {
            bool: {
              must: filter && filter.length > 0 ? [...filterQuery, filter] : [...filterQuery],
            },
          },
        },
      },
      stored_fields: ['_source'],
      script_fields: {
        distance: {
          script: {
            source: "(doc['location'].arcDistance(params.lat,params.lon) * 0.001 * 0.621371)",
            lang: 'painless',
            params: {
              lat: latitude, //40.7127753, //geoCoordinates.latitude, //
              lon: longitude, //-74.0059728, //geoCoordinates.longitude, //
            },
          },
        },
      },
      sort: [
        {
          ...sort,
          _geo_distance: {
            location: {
              lat: latitude, // 40.7127753, //geoCoordinates.latitude,
              lon: longitude, //-74.0059728, //geoCoordinates.longitude, //
            },
            order: 'asc',
            unit: 'mi',
            mode: 'min',
            distance_type: 'arc',
          },
        },
        {
          _geo_distance: {
            location: {
              lat: latitude, // 40.7127753, //geoCoordinates.latitude,
              lon: longitude, //-74.0059728, //geoCoordinates.longitude, //
            },
            order: 'asc',
            unit: 'mi',
            mode: 'min',
            distance_type: 'arc',
          },
        },
        {
          _score: {
            order: 'desc',
          },
        },
      ],
      size: defaultPageCount,
      from: page * defaultPageCount,
      aggs: {
        'gender.displayValue': {
          terms: {
            field: 'gender.displayValue.keyword',
            size: 99999,
          },
        },
        'languages.name': {
          terms: {
            field: 'languages.name.keyword',
            size: 99999,
            min_doc_count: 1,
          },
        },
        'telehealthTypes.telehealthType': {
          terms: {
            field: 'telehealthTypes.telehealthType.keyword',
            size: 99999,
          },
        },
        'specialties.name': {
          nested: {
            path: 'specialties',
          },
          aggs: {
            inner: {
              filter: {
                terms: {
                  'specialties.benefitPlanID.keyword': [eapPlanId],
                },
              },
              aggs: {
                specialties: {
                  terms: {
                    field: 'specialties.nameIdSortRule.keyword',
                    size: 99999,
                  },
                },
              },
            },
          },
        },
        'handicap.displayValue': {
          terms: {
            field: 'handicap.displayValue.keyword',
            size: 99999,
          },
        },
        'practiceTypes.name': {
          composite: {
            size: 10000,
            sources: [
              {
                prvTyp: {
                  terms: {
                    field: 'prvTyp.keyword',
                  },
                },
              },
              {
                name: {
                  terms: {
                    field: 'practiceTypes.name.keyword',
                  },
                },
              },
            ],
          },
        },
        'agencyTypes.name': {
          terms: {
            field: 'practiceTypes.name.keyword',
            size: 99999,
          },
        },
        'insurances.acceptingNewPatients': {
          nested: {
            path: 'insurances',
          },
          aggs: {
            inner: {
              filter: {
                terms: {
                  'insurances.id': [eapPlanId],
                },
              },
              aggs: {
                acceptingNewPatients: {
                  terms: {
                    field: 'insurances.acceptingNewPatients.keyword',
                    size: 99999,
                  },
                },
              },
            },
          },
        },
        'checkbox-onlineAppointmentScheduleFlag': {
          terms: {
            field: 'onlineAppointmentScheduleFlag',
            size: 99999,
          },
        },
        'checkbox-hospitalAffiliationsFlag': {
          terms: {
            field: 'hospitalAffiliationsFlag',
            size: 99999,
          },
        },
        'checkbox-culturallyCompetentFlag': {
          terms: {
            field: 'culturallyCompetentFlag',
            size: 99999,
          },
        },
        'checkbox-boardCertFlag': {
          terms: {
            field: 'boardCertFlag',
            size: 99999,
          },
        },
        'checkbox-accreditationsFlag': {
          terms: {
            field: 'accreditationsFlag',
            size: 99999,
          },
        },
        race: {
          terms: {
            field: 'race.keyword',
            size: 99999,
            min_doc_count: 0,
          },
        },
        ethnicity: {
          terms: {
            field: 'ethnicity.keyword',
            size: 99999,
          },
        },
        'productType.name': {
          nested: {
            path: 'productType',
          },
          aggs: {
            inner: {
              filter: {
                terms: {
                  'productType.benefitPlanID.keyword': [eapPlanId],
                },
              },
              aggs: {
                productType: {
                  terms: {
                    field: 'productType.nameIdSortRule.keyword',
                    size: 99999,
                  },
                },
              },
            },
          },
        },
        'publicTransportation.displayValue': {
          terms: {
            field: 'publicTransportation.displayValue.keyword',
            size: 99999,
          },
        },
        'ageGroups.name': {
          terms: {
            field: 'ageGroups.nameIdSortRule.keyword',
            size: 99999,
          },
        },
        'licenses.licenseLevelCodeDescription': {
          terms: {
            field: 'licenses.licenseLevelCodeDescription.keyword',
            size: 99999,
          },
        },
        'facilityAccreditations.accreditation': {
          terms: {
            field: 'facilityAccreditations.accreditation.keyword',
            size: 99999,
          },
        },
      },
    },
  };

  return {
    filterQuery,
    providersPayload,
  };
};

const mhsudPayload = (payload: ProvidersPayload) => {
  const defaultPageCount = 10;
  const {
    latitude,
    longitude,
    state,
    counselorName,
    page = 0,
    filter,
    distance,
    sort,
    planId,
    specialties,
    productTypes,
  } = payload;

  let productTypeInfo = {};
  if (productTypes && productTypes.length > 0) {
    productTypeInfo = {
      bool: {
        should: [
          {
            match: {
              'productType.showInUI': 1,
            },
          },
          {
            terms: {
              'productType.id': productTypes,
            },
          },
        ],
      },
    };
  }

  const filterQuery = [
    {
      bool: {
        should: [
          {
            match: {
              'specialties.showInUI': 1,
            },
          },
          {
            terms: {
              'specialties.id': specialties ?? [],
            },
          },
          {
            bool: {
              must_not: {
                exists: {
                  field: 'specialties',
                },
              },
            },
          },
        ],
      },
    },
    {
      ...productTypeInfo,
    },
    {
      bool: {
        should: [
          {
            match: {
              'insurances.id': planId,
            },
          },
        ],
      },
    },
    {
      bool: {
        must: [
          {
            terms: {
              prvRecTyp: ['1', '3'],
            },
          },
        ],
      },
    },
    {
      bool: {
        should: [
          {
            geo_distance: {
              distance: `${distance}miles`,
              location: {
                lat: latitude, //40.7127753, //geoCoordinates.latitude,
                lon: longitude, //-74.0059728, //geoCoordinates.longitude,
              },
            },
          },
          {
            bool: {
              must: [
                {
                  match: {
                    teleHealthFlag: '1',
                  },
                },
                {
                  exists: {
                    field: 'licenses',
                  },
                },
                {
                  script: {
                    script: {
                      source: `doc['licenses.licenseState.keyword'].indexOf('${state}')>-1`,
                      lang: 'painless',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];

  const providersPayload = {
    data: {
      track_total_hits: true,
      track_scores: true,
      min_score: 0.001,
      query: {
        bool: {
          should: [
            {
              match: {
                'specialties.name.keyword': {
                  query: counselorName,
                  fuzziness: 'AUTO',
                  analyzer: 'synonym_phrase',
                  boost: 706,
                },
              },
            },
            {
              match: {
                'specialties.name.keyword': {
                  query: counselorName,
                  fuzziness: 'AUTO',
                  analyzer: 'synonym',
                  boost: 704,
                },
              },
            },
            {
              multi_match: {
                query: counselorName,
                type: 'best_fields',
                fuzzy_transpositions: false,
                fuzziness: 'AUTO',
                fields: [
                  'lastName^701',
                  'specialties.name^696',
                  'firstName^691',
                  'siteName^691',
                  'name^691',
                  'alternateSiteName^691',
                  'facilityRoster.name^511',
                  'addr1^491',
                  'prvTyp^481',
                  'state^471',
                  'languages.name^461',
                  'city^451',
                  'hospitalPrivs.hospitalName^441',
                  'website^431',
                  'ageRanges.name^421',
                  'officeEmail^411',
                  'addr2^401',
                  'npi^391',
                  'facilityRoster.npi^381',
                  'phone^371',
                  'licenses.licenseNumber^361',
                ],
                tie_breaker: 0.3,
              },
            },
            {
              query_string: {
                query: `*${counselorName}*`, //*`'*jason*',
                fuzziness: 'AUTO',
                type: 'best_fields',
                fields: [
                  'lastName^350',
                  'specialties.name^345',
                  'firstName^340',
                  'siteName^340',
                  'name^340',
                  'alternateSiteName^340',
                  'facilityRoster.name^160',
                  'addr1^140',
                  'prvTyp^130',
                  'state^120',
                  'languages.name^110',
                  'city^100',
                  'hospitalPrivs.hospitalName^90',
                  'website^80',
                  'ageRanges.name^70',
                  'officeEmail^60',
                  'addr2^50',
                  'npi^40',
                  'facilityRoster.npi^30',
                  'phone^20',
                  'licenses.licenseNumber^10',
                ],
                tie_breaker: 0.3,
              },
            },
          ],
          filter: {
            bool: {
              must: filter && filter.length > 0 ? [...filterQuery, filter] : [...filterQuery],
            },
          },
        },
      },
      stored_fields: ['_source'],
      script_fields: {
        distance: {
          script: {
            source: "(doc['location'].arcDistance(params.lat,params.lon) * 0.001 * 0.621371)",
            lang: 'painless',
            params: {
              lat: latitude, //40.7127753, //geoCoordinates.latitude, //
              lon: longitude, //-74.0059728, //geoCoordinates.longitude, //
            },
          },
        },
      },
      sort: [
        {
          ...sort,
          _geo_distance: {
            location: {
              lat: latitude, // 40.7127753, //geoCoordinates.latitude,
              lon: longitude, //-74.0059728, //geoCoordinates.longitude, //
            },
            order: 'asc',
            unit: 'mi',
            mode: 'min',
            distance_type: 'arc',
          },
        },
        {
          _score: {
            order: 'desc',
          },
        },
      ],
      size: defaultPageCount,
      from: page * defaultPageCount,
      aggs: {
        'gender.displayValue': {
          terms: {
            field: 'gender.displayValue.keyword',
            size: 99999,
          },
        },
        'languages.name': {
          terms: {
            field: 'languages.name.keyword',
            size: 99999,
            min_doc_count: 0,
          },
        },
        'telehealthTypes.telehealthType': {
          terms: {
            field: 'telehealthTypes.telehealthType.keyword',
            size: 99999,
          },
        },
        'specialties.name': {
          nested: {
            path: 'specialties',
          },
          aggs: {
            inner: {
              filter: {
                terms: {
                  'specialties.benefitPlanID.keyword': [planId ?? '1140'],
                },
              },
              aggs: {
                specialties: {
                  terms: {
                    field: 'specialties.nameIdSortRule.keyword',
                    size: 99999,
                  },
                },
              },
            },
          },
        },
        'handicap.displayValue': {
          terms: {
            field: 'handicap.displayValue.keyword',
            size: 99999,
          },
        },
        'practiceTypes.name': {
          composite: {
            size: 10000,
            sources: [
              {
                prvTyp: {
                  terms: {
                    field: 'prvTyp.keyword',
                  },
                },
              },
              {
                name: {
                  terms: {
                    field: 'practiceTypes.name.keyword',
                  },
                },
              },
            ],
          },
        },
        'agencyTypes.name': {
          terms: {
            field: 'practiceTypes.name.keyword',
            size: 99999,
          },
        },
        'insurances.acceptingNewPatients': {
          nested: {
            path: 'insurances',
          },
          aggs: {
            inner: {
              filter: {
                terms: {
                  'insurances.id': [Number(planId)],
                },
              },
              aggs: {
                acceptingNewPatients: {
                  terms: {
                    field: 'insurances.acceptingNewPatients.keyword',
                    size: 99999,
                  },
                },
              },
            },
          },
        },
        // 'checkbox-onlineAppointmentScheduleFlag': {
        //   terms: {
        //     field: 'onlineAppointmentScheduleFlag',
        //     size: 99999,
        //   },
        // },
        'checkbox-hospitalAffiliationsFlag': {
          terms: {
            field: 'hospitalAffiliationsFlag',
            size: 99999,
          },
        },
        'checkbox-culturallyCompetentFlag': {
          terms: {
            field: 'culturallyCompetentFlag',
            size: 99999,
          },
        },
        'checkbox-boardCertFlag': {
          terms: {
            field: 'boardCertFlag',
            size: 99999,
          },
        },
        'checkbox-accreditationsFlag': {
          terms: {
            field: 'accreditationsFlag',
            size: 99999,
          },
        },
        race: {
          terms: {
            field: 'race.keyword',
            size: 99999,
            min_doc_count: 0,
          },
        },
        ethnicity: {
          terms: {
            field: 'ethnicity.keyword',
            size: 99999,
          },
        },
        'productType.name': {
          nested: {
            path: 'productType',
          },
          aggs: {
            inner: {
              filter: {
                terms: {
                  'productType.benefitPlanID.keyword': [planId ?? '1140'],
                },
              },
              aggs: {
                productType: {
                  terms: {
                    field: 'productType.nameIdSortRule.keyword',
                    size: 99999,
                  },
                },
              },
            },
          },
        },
        'publicTransportation.displayValue': {
          terms: {
            field: 'publicTransportation.displayValue.keyword',
            size: 99999,
          },
        },
        'ageGroups.name': {
          terms: {
            field: 'ageGroups.nameIdSortRule.keyword',
            size: 99999,
          },
        },
        'licenses.licenseLevelCodeDescription': {
          terms: {
            field: 'licenses.licenseLevelCodeDescription.keyword',
            size: 99999,
          },
        },
        'facilityAccreditations.accreditation': {
          terms: {
            field: 'facilityAccreditations.accreditation.keyword',
            size: 99999,
          },
        },
      },
    },
  };

  return {
    filterQuery,
    providersPayload,
  };
};
