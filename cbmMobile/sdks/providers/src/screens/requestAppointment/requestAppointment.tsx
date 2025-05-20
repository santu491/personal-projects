import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H2, RNText } from '../../../../../shared/src/components/text/text';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { requestAppointmentStyles } from './requestAppointment.styles';
import { useRequestAppointment } from './useRequestAppointment';

export const RequestAppointment = () => {
  const { t } = useTranslation();
  const { onPressContinue, isShownAlert, isSuccess, onAlertButtonPress, onPressPreviousButton, loading } =
    useRequestAppointment();
  return (
    <>
      <ProgressLoader isVisible={loading} />
      <MainHeaderComponent leftArrow={true} />
      <View style={requestAppointmentStyles.container}>
        <View style={requestAppointmentStyles.mainContainer}>
          <AppointmentHeader
            title={t('appointment.reviewDetails.requestAppointmentTitle')}
            description={t('appointment.reviewDetails.requestAppointmentDescription')}
          />
          <View style={requestAppointmentStyles.itemSeparator} />
          <View style={requestAppointmentStyles.readyToSubmitTextContainer}>
            <H2 style={requestAppointmentStyles.readyToSubmitTitle}>
              {t('appointment.reviewDetails.readyToSubmitTitle')}
            </H2>
            <RNText style={requestAppointmentStyles.readyToSubmitDescription}>
              {t('appointment.reviewDetails.readyToSubmitDescription')}
            </RNText>
            <RNText>{t('appointment.reviewDetails.readyToSubmitSubDescription')}</RNText>
          </View>
        </View>
        <View style={requestAppointmentStyles.continue}>
          <ActionButton
            title={t('appointment.previous')}
            onPress={() => onPressPreviousButton()}
            style={requestAppointmentStyles.secondaryButton}
            textStyle={requestAppointmentStyles.secondaryButtonTextStyle}
          />
          <ActionButton
            onPress={onPressContinue}
            title={t('appointment.reviewDetails.submitRequest')}
            disabled={false}
          />
        </View>
      </View>

      {!loading ? (
        <AlertModel
          modalVisible={isShownAlert}
          onHandlePrimaryButton={onAlertButtonPress}
          title={
            isSuccess
              ? t('appointment.reviewDetails.appointmentRequested')
              : t('appointment.reviewDetails.appointmentErrorTitle')
          }
          subTitle={
            isSuccess
              ? t('appointment.reviewDetails.appointmentRequestedDescription')
              : t('appointment.reviewDetails.appointmentErrorDescription')
          }
          isError={!isSuccess}
          primaryButtonTitle={t('appointment.continue')}
        />
      ) : null}
    </>
  );
};
