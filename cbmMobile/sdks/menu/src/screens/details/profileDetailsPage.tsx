import { useRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { DetailsList } from '../../components/detailsList/detailsList';
import { MemberProfileHeader } from '../../components/memberProfileHeader/memberProfileHeader';
import { DetailDataList } from '../../models/menu';
import { profileDetailsPageStyles } from './profileDetailsPage.styles';
import { useProfileDetailsPage } from './useProfileDetailsPage';

export const ProfileDetailsPage = () => {
  const { handleEditPhoneNumber } = useProfileDetailsPage();
  const route = useRoute();
  const { t } = useTranslation();
  const { listData, title } = route.params as DetailDataList;

  return (
    <>
      <MainHeaderComponent />
      <View style={profileDetailsPageStyles.container}>
        <MemberProfileHeader title={title} />
        <DetailsList listData={listData} title={title} />
      </View>
      {title === t('profile.contactInfo') ? (
        <View style={profileDetailsPageStyles.buttonContainer}>
          <ActionButton
            onPress={handleEditPhoneNumber}
            title={t('profile.editPhone')}
            style={profileDetailsPageStyles.actionButton}
            textStyle={profileDetailsPageStyles.actionButtonText}
            testID={'menu.profiledetails.button'}
          />
        </View>
      ) : null}
    </>
  );
};
