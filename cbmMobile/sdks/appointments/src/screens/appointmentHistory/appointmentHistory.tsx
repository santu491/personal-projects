import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { RightArrow } from '../../../../../shared/src/assets/icons/icons';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H4 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { AppointmentsMenu } from '../../models/appointments';
import { appointmentStyles } from './appointmentHistory.styles';
import { useAppointmentHistory } from './useAppointmentHistory';

export const AppointmentHistory = () => {
  const { t } = useTranslation();
  const {
    appointmentHistoryData,
    handleAppointmentHistoryNavigation,
    isShownLoginAlert,
    onHandleSignIn,
    onCloseAlert,
  } = useAppointmentHistory();

  const renderHistoryContent = ({ item }: { item: AppointmentsMenu }) => {
    return (
      <TouchableOpacity onPress={() => handleAppointmentHistoryNavigation(item.action)}>
        <View style={appointmentStyles.listContainer}>
          <H4 testID={'appointments.history.item'} style={appointmentStyles.listTitle}>
            {item.label}
          </H4>
          <RightArrow color={appColors.lightPurple} width={16} height={16} />
        </View>
        <View style={appointmentStyles.itemSeparatorStyle} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <MainHeaderComponent leftArrow={false} />
      <View style={appointmentStyles.container}>
        <MemberProfileHeader
          titleStyle={appointmentStyles.titleStyle}
          testID={'appointments.history.title'}
          title={t('appointments.title')}
        />

        <FlatList
          testID={'appointments.history.list'}
          data={appointmentHistoryData}
          renderItem={renderHistoryContent}
        />
        {isShownLoginAlert ? (
          <AlertModel
            modalVisible={isShownLoginAlert}
            onRequestClose={onCloseAlert}
            onHandlePrimaryButton={onHandleSignIn}
            title={t('appointments.preLogin.title')}
            subTitle={t('appointments.preLogin.description')}
            isError={true}
            primaryButtonTitle={t('appointments.preLogin.signInButton')}
            errorIndicatorIconColor={appColors.lightDarkGray}
          />
        ) : null}
      </View>
    </>
  );
};
