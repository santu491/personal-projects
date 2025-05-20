import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { generateAbbreviation } from '../../../../../shared/src/utils/utils';
import { toPascalCase } from '../../../../../src/util/commonUtils';
import { MenuList } from '../../components/menuList/menuList';
import { useGetProfileInfo } from '../../hooks/useGetProfileInfo';
import { profileStyles } from './profile.styles';
import { useProfile } from './useProfile';

export const Profile = () => {
  const { userProfileData, navigateToDetailsPage, onPressLeftArrow } = useProfile();
  const { profileData, fullName } = useGetProfileInfo();

  const { t } = useTranslation();

  return (
    <>
      <MainHeaderComponent onPressLeftArrow={onPressLeftArrow} />
      <View style={profileStyles.container}>
        <H1 style={profileStyles.title} testID="menu.profile.title">
          {t('profile.account')}
        </H1>
        <View style={profileStyles.titleContainer}>
          <View style={profileStyles.circle}>
            <H1 style={profileStyles.text}>{generateAbbreviation(fullName).slice(0, 2)}</H1>
          </View>
          <View style={profileStyles.profileViewStyle}>
            <H1 style={profileStyles.nameText}>{fullName}</H1>
            <H3>{toPascalCase(userProfileData?.jobTitle)}</H3>
          </View>
        </View>
        <View style={profileStyles.itemSeparatorStyle} />
        <MenuList listData={profileData} onPress={navigateToDetailsPage} />
      </View>
    </>
  );
};
