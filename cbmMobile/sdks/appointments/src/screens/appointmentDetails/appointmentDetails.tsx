import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { RightArrow } from '../../../../../shared/src/assets/icons/icons';
import { FullScreenError } from '../../../../../shared/src/components/fullScreenError/fullScreenError';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H4 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { NoRequests } from '../../components/noRequests/noRequests';
import { AppointmentsMenu } from '../../models/appointments';
import { appointmentDetailsStyles } from './appointmentDetails.styles';
import { useAppointmentDetails } from './useAppointmentDetails';

export const AppointmentDetails = () => {
  const { t } = useTranslation();
  const { appointmentDetailsList, handleNavigation, loading, onPressTryAgain, isServerError } = useAppointmentDetails();

  const renderDetailsContent = ({ item }: { item: AppointmentsMenu }) => {
    return (
      <TouchableOpacity onPress={() => handleNavigation(item.action)}>
        <View style={appointmentDetailsStyles.listContainer}>
          <H4 testID={'appointments.history.item'} style={appointmentDetailsStyles.listTitle}>
            {item.label}
          </H4>
          <RightArrow color={appColors.lightPurple} width={16} height={16} />
        </View>
        <View style={appointmentDetailsStyles.itemSeparatorStyle} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={appointmentDetailsStyles.container}>
        <MemberProfileHeader
          titleStyle={appointmentDetailsStyles.titleStyle}
          testID={'appointments.appointmentDetails.title'}
          title={t('appointments.appointmentDetails')}
        />
        {loading ? (
          <ProgressLoader isVisible={true} />
        ) : isServerError ? (
          <FullScreenError onPressTryAgain={onPressTryAgain} />
        ) : appointmentDetailsList ? (
          <FlatList
            testID={'appointments.details.list'}
            data={appointmentDetailsList}
            renderItem={renderDetailsContent}
          />
        ) : (
          <NoRequests />
        )}
      </View>
    </>
  );
};
