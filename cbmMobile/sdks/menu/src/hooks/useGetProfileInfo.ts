import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppUrl } from '../../../../shared/src/models';
import { MenuData } from '../../../../shared/src/models/src/features/menu';
import { isProd } from '../../../../src/config';
import { toPascalCase } from '../../../../src/util/commonUtils';
import { formatPhoneNumber } from '../../../auth/src/config/util/commonUtils';
import { useMenuContext } from '../context/menu.sdkContext';
import { Menu } from '../models/menu';
import { Screen } from '../navigation/menu.navigationTypes';
import { getConsent } from '../utils/util';

export const useGetProfileInfo = () => {
  const { navigation, navigationHandler, userProfileData, loggedIn, menuData } = useMenuContext();

  const { t } = useTranslation();

  const fullName = useMemo(() => {
    return `${toPascalCase(userProfileData?.firstName)} ${toPascalCase(userProfileData?.lastName)}`;
  }, [userProfileData?.firstName, userProfileData?.lastName]);

  const menuDataInfo = menuData?.map((item: MenuData) => {
    return {
      label: item.label,
      redirectUrl: item.redirectUrl,
      openURLInNewTab: item.openURLInNewTab,
      path: item.path,
    };
  });

  const loggedInMenuData: Menu[] = loggedIn
    ? [
        {
          label: t('menu.account'),
          action: {
            hideTabBar: true,
            screenName: Screen.PROFILE,
          },
          onPress: () => {
            navigation.navigate(Screen.PROFILE);
          },
        },
      ]
    : [];

  const networkLogData: Menu[] = !isProd
    ? [
        {
          label: t('menu.networkLogger'),
          action: {
            hideTabBar: true,
            screenName: Screen.NETWORK_WATCH_LOGGER,
          },
          onPress: () => {
            navigation.navigate(Screen.NETWORK_WATCH_LOGGER);
          },
        },
      ]
    : [];

  const finalMenuData = [...(menuDataInfo ?? []), ...loggedInMenuData, ...networkLogData];

  const personalData = [
    {
      label: t('profile.name'),
      value: fullName,
    },
    {
      label: t('profile.dob'),
      value: userProfileData?.dob,
    },
    {
      label: t('profile.gender'),
      value: userProfileData?.gender,
    },
    {
      label: t('profile.relationshipStatus'),
      value: userProfileData?.relStatus,
    },
    {
      label: t('profile.address'),
      value:
        userProfileData?.address &&
        `${toPascalCase(userProfileData.address.state)}, ${toPascalCase(userProfileData.address.city)}, ${toPascalCase(userProfileData.address.stateCode)} ${toPascalCase(userProfileData.address.zipcode)}`,
    },
  ];

  const contactData = [
    {
      label: t('profile.phone'),
      value: userProfileData?.communication && formatPhoneNumber(userProfileData.communication.mobileNumber),
    },
    {
      label: t('profile.availability'),
      value: userProfileData?.communication && getConsent(userProfileData.communication.consent),
    },
    {
      label: t('profile.email'),
      value: userProfileData?.emailAddress ?? '',
    },
  ];

  const employmentData = [
    {
      label: t('profile.empStatus'),
      value: userProfileData?.empStatus,
    },
    {
      label: t('profile.jobTitle'),
      value: userProfileData?.jobTitle,
    },
    {
      label: t('profile.userType'),
      value: userProfileData?.userType,
    },
  ];

  const profileData: Menu[] = [
    {
      label: t('profile.personalInfo'),
      action: {
        hideTabBar: true,
        screenName: Screen.PROFILE_DETAILS,
      },
      onPress: () => {
        navigation.navigate(Screen.PROFILE_DETAILS, { listData: personalData, title: t('profile.personalInfo') });
      },
    },
    {
      label: t('profile.contactInfo'),
      action: {
        hideTabBar: true,
        screenName: Screen.PROFILE_DETAILS,
      },
      onPress: () => {
        navigation.navigate(Screen.PROFILE_DETAILS, { listData: contactData, title: t('profile.contactInfo') });
      },
    },
    {
      label: t('profile.empInfo'),
      action: {
        screenName: Screen.PROFILE_DETAILS,
      },
      onPress: () => {
        navigation.navigate(Screen.PROFILE_DETAILS, { listData: employmentData, title: t('profile.empInfo') });
      },
    },
    {
      label: t('profile.wellnessTopics'),
      action: {
        hideTabBar: true,
        screenName: Screen.WELLNESS_TOPICS,
      },
      onPress: () => {
        navigation.navigate(Screen.WELLNESS_TOPICS);
      },
    },
    {
      label: t('profile.notifications'),
      action: {
        screenName: AppUrl.NOITFICATION_SETTINGS,
      },
      onPress: () => {
        navigationHandler.linkTo({ action: AppUrl.NOITFICATION_SETTINGS });
      },
    },
    {
      label: t('profile.deleteAccount'),
      action: {
        hideTabBar: true,
        screenName: Screen.DELETE_ACCOUNT,
      },
      onPress: () => {
        navigation.navigate(Screen.DELETE_ACCOUNT);
      },
    },
  ];

  return {
    menuData,
    loggedInMenuData,
    profileData,
    personalData,
    contactData,
    employmentData,
    fullName,
    finalMenuData,
  };
};
