import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H2, H3, RNText } from '../../../../../shared/src/components/text/text';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { styles } from './scheduleAppointment.styles';
import { ScheduleAppointmentDrawer } from './scheduleAppointmentDrawer/scheduleAppointmentDrawer';
import { useScheduleAppointment } from './useScheduleAppointment';

export const ScheduleAppointment = () => {
  const {
    appointmentInfo,
    onPressContinue,
    onPressLeftArrow,
    isAlertEnabled,
    alertInfo,
    providerName,
    onPressContact,
    clientSupportNumber,
  } = useScheduleAppointment();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      {isAlertEnabled && alertInfo ? (
        <AlertModel
          modalVisible={isAlertEnabled}
          onHandlePrimaryButton={alertInfo.onHandlePrimaryButton}
          onHandleSecondaryButton={alertInfo.onHandleSecondaryButton}
          title={alertInfo.title}
          subTitle={
            <RNText>
              {`${t('appointment.alert.preSelected.preselectedMessage')}${t('common.space')}`}

              <RNText style={styles.subtitle}> [ {providerName} ] </RNText>
              {t('common.space')}
              {`${t('appointment.alert.preSelected.customerSupportMessage')}${t('common.space')}`}
              <RNText onPress={onPressContact} style={styles.textLink}>
                {clientSupportNumber}
              </RNText>
            </RNText>
          }
          primaryButtonTitle={alertInfo.primaryButtonTitle}
          secondaryButtonTitle={alertInfo.secondaryButtonTitle}
          showIndicatorIcon={true}
          isError={alertInfo.isError}
          errorIndicatorIconColor={alertInfo.errorIndicatorIconColor}
        />
      ) : null}
      {!isAlertEnabled && <ScheduleAppointmentDrawer />}
      <MainHeaderComponent onPressLeftArrow={onPressLeftArrow} />

      <ScrollView style={styles.container}>
        <AppointmentHeader
          title={t('appointment.requestAppointment.title')}
          description={t('appointment.requestAppointment.description')}
        />

        <View style={styles.appointmentContentView}>
          <View style={styles.contentContainer}>
            {appointmentInfo.map((item, index) => (
              <View style={styles.contentView} key={item.title}>
                <View style={styles.serialNumberView}>
                  <H3 style={styles.serialNo}>{`0${index + 1}`}</H3>
                </View>
                <View style={styles.infoView}>
                  <H2 style={styles.title}>{item.title}</H2>
                  <RNText style={styles.description}>{item.description}</RNText>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.continue}>
        <ActionButton title={t('appointment.continue')} onPress={onPressContinue} />
      </View>
    </View>
  );
};
