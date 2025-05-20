import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ContactType } from '../../../../../shared/src/utils/utils';
import { DetailedSection, DetailedSectionData, SearchProvider } from '../../model/providerSearchResponse';

export const useProviderInfo = (provider: SearchProvider) => {
  const { t } = useTranslation();
  const contacts = useMemo(() => {
    const data: DetailedSectionData[] = [
      {
        title: t('providerDetail.practiceName'),
        tooltip: provider.tooltip?.practiceNameToolTip,
        description: provider.practiceName,
      },

      {
        title: t('providerDetail.phone'),
        description: provider.contact?.phone,
        type: ContactType.PHONE,
      },
      {
        title: t('providerDetail.email'),
        description: provider.contact?.officeEmail,
        type: ContactType.EMAIL,
      },
      {
        title: t('providerDetail.address'),
        description:
          provider.contact?.address.addr1 +
          ', ' +
          provider.contact?.address.city +
          ', ' +
          provider.contact?.address.state +
          ' ' +
          provider.contact?.address.zip +
          ` (${provider.fields?.distance[0].toPrecision(2)} ${t('providerDetail.miles')})`,
        type: ContactType.ADDRESS,
      },

      {
        title: t('providerDetail.fax'),
        description: provider.contact?.fax,
        type: ContactType.FAX,
      },
      {
        title: t('providerDetail.webSite'),
        description: provider.contact?.website,
        type: ContactType.WEBSITE,
      },
    ];
    return {
      sectionTitle: t('providerDetail.contacts'),
      data,
    };
  }, [
    provider.contact?.address.addr1,
    provider.contact?.address.city,
    provider.contact?.address.state,
    provider.contact?.address.zip,
    provider.contact?.fax,
    provider.contact?.officeEmail,
    provider.contact?.phone,
    provider.contact?.website,
    provider.fields?.distance,
    provider.practiceName,
    provider.tooltip?.practiceNameToolTip,
    t,
  ]);

  const aboutProvider = useCallback(() => {
    const data: DetailedSectionData[] = [
      {
        title: t('providerDetail.gender'),
        tooltip: provider.tooltip?.genderLabelToolTip,
        description: provider.gender === 'F' ? t('providerDetail.female') : t('providerDetail.male'),
      },
      {
        title: t('providerDetail.race'),
        description: provider.race?.toUpperCase(),
      },
      {
        title: t('providerDetail.ethnicity'),
        description: provider.ethnicity?.toUpperCase(),
      },
      {
        title: t('providerDetail.agesTreated'),
        tooltip: provider.tooltip?.agesTreatedToolTip,
        description: provider.ageRanges?.find((item) => item.trim().includes('999'))
          ? t('providerDetail.allAges')
          : provider.ageRanges?.join(', ').toUpperCase(),
      },
      {
        title: t('providerDetail.languagesSpoken'),
        tooltip: provider.tooltip?.languagesSpokenToolTip,
        description: provider.languages?.join(', ').toUpperCase(),
      },
    ];
    const section: DetailedSection = {
      sectionTitle: t('providerDetail.aboutProvider'),
      data,
    };
    return section;
  }, [provider, t]);

  const providerDetails = useCallback(() => {
    const boardCertifications = provider.boardCertifications?.map((item) => item.issuer).join('\n');
    const data: DetailedSectionData[] = [
      {
        title: t('providerDetail.providerType'),
        description: provider.practiceTypes,
      },
      {
        title: t('providerDetail.culturalCompetency'),
        description: provider.culturalCompetenceTrainingFlag?.toUpperCase() === 'Y' ? 'YES' : 'NO', // need
      },
      {
        title: t('providerDetail.boardCertification'),
        tooltip: provider.tooltip?.boardCertificationToolTip,
        description: boardCertifications, // need to discuss
      },
      {
        title: t('providerDetail.hospitalPrivileges'),
        description: provider.hospitalAffiliationsFlag === 0 ? 'Not Available' : 'YES',
      },
      {
        title: t('providerDetail.npi'),
        tooltip: provider.tooltip?.npiToolTip,
        description: provider.npi,
      },
      {
        title: t('providerDetail.taxonomy'),
        description: provider.taxonomyCodes?.join('\n').toUpperCase(),
      },
      {
        title: t('providerDetail.officeLanguage'),
        tooltip: provider.tooltip?.officeLanguagesSpokenToolTip,
        description: provider.staffLanguages?.join(', ').toUpperCase(), // need to discuss
      },
      {
        title: t('providerDetail.productType'),
        tooltip: provider.tooltip?.productTypeToolTip,
        description:
          provider.productType?.length === 1
            ? provider.productType[0].name
            : provider.productType?.map((item) => item.name),
      },
    ];
    const section: DetailedSection = {
      sectionTitle: t('providerDetail.providerDetails'),
      data,
    };
    return section;
  }, [provider, t]);

  const telehealthDeatils = useCallback(() => {
    const data: DetailedSectionData[] = [
      {
        title: t('providerDetail.telehealthService'),
        description: provider.telehealthTypes?.types,
      },
      {
        title: t('providerDetail.teleHealthStateLicense'),
        description: provider.telehealthTypes?.states,
      },
      {
        title: t('providerDetail.familyCaregiver'),
        description: provider.familyCareGiver === 0 ? t('providerDetail.notAvailable') : t('providerDetail.yes'),
      },
    ];
    const isDataAvailable = data.some((item) => {
      if (Array.isArray(item.description)) {
        return item.description.length > 0;
      } else if (typeof item.description === 'string') {
        return item.description.trim() !== '';
      }
      return false;
    });
    const section: DetailedSection = isDataAvailable
      ? {
          sectionTitle: t('providerDetail.telehealthDetails'),
          data,
        }
      : {};

    return section;
  }, [provider.familyCareGiver, provider.telehealthTypes?.states, provider.telehealthTypes?.types, t]);

  const specialties = useCallback(() => {
    const data: DetailedSectionData[] = [
      {
        title: t('providerDetail.serviceProvided'),
        description:
          provider.specialties?.length === 1
            ? provider.specialties[0].name
            : provider.specialties?.map((item) => item.name),
      },
    ];
    const section: DetailedSection =
      (provider.specialties?.length ?? 0) > 0
        ? {
            sectionTitle: t('providerDetail.specialties'),
            data,
          }
        : {};
    return section;
  }, [provider.specialties, t]);

  const data: DetailedSection[] = useMemo(() => {
    return [aboutProvider(), providerDetails(), telehealthDeatils(), specialties()];
  }, [aboutProvider, providerDetails, specialties, telehealthDeatils]);

  return {
    data,
    contacts,
  };
};
