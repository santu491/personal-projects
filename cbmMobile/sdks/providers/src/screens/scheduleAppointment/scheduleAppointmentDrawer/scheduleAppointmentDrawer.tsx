import { Drawer } from '@sydney/motif-components';
import React, { useMemo } from 'react'; // Import the 'React' module
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ActionButton } from '../../../../../../shared/src/components';
import { H1, H3, RNText } from '../../../../../../shared/src/components/text/text';
import { EMERGENCY_SERVICE_NUMBER, MENTAL_HEALTH_CRISIS_NUMBER } from '../../../../../../src/constants/constants';
import { AppointMentScheduleModelType } from '../../../config/constants/constants';
import { appointmentDrawerStyles } from './scheduleAppointmentDrawer.styles';
import { useScheduleAppointmentDrawer } from './useScheduleAppointmentDrawer';

export const ScheduleAppointmentDrawer = () => {
  const { drawerContent, isShownAppointmentDrawer, clientSupportNumber, onPressPrimaryButton, onPressContact } =
    useScheduleAppointmentDrawer();
  const styles = useMemo(() => appointmentDrawerStyles(), []);
  const { t } = useTranslation();

  const description = () => {
    switch (drawerContent.type) {
      case AppointMentScheduleModelType.CONFIRM_EXPERIENCE:
        return (
          <View style={styles.experienceView}>
            <H3 style={styles.experienceDescription}>{drawerContent.description} </H3>
            <View style={styles.subDescriptionView}>
              <View style={styles.circle} />
              <RNText style={styles.subDescription}>{t('appointment.confirmExperienceModal.violenceContent')}</RNText>
            </View>
            <View style={styles.subDescriptionView}>
              <View style={styles.circle} />
              <RNText style={styles.subDescription}>{t('appointment.confirmExperienceModal.hurtingContent')}</RNText>
            </View>
          </View>
        );
      case AppointMentScheduleModelType.CONTACT:
        return (
          <View style={styles.descriptionView}>
            <H3 style={styles.descriptionContent}>
              {`${t('appointment.contactModal.appointmentForSomeOne')}${t('common.space')}`}
              <H3 style={styles.textLink} onPress={() => clientSupportNumber && onPressContact(clientSupportNumber)}>
                {clientSupportNumber}
              </H3>{' '}
              {t('appointment.contactModal.serviceRepresentatives')}
            </H3>
          </View>
        );
      case AppointMentScheduleModelType.HELP:
        return (
          <View style={[styles.descriptionView, styles.helpModalDescription]}>
            <H3 style={styles.descriptionContent}>
              {`${t('appointment.helpModal.certifiedCounselor')}${t('common.space')} `}
              <H3 style={styles.textLink} onPress={() => clientSupportNumber && onPressContact(clientSupportNumber)}>
                {clientSupportNumber}
              </H3>
              {t('common.space')}
              {`${t('appointment.helpModal.emergencyService')}${t('common.space')}`}
              <H3 style={styles.textLink} onPress={() => onPressContact(EMERGENCY_SERVICE_NUMBER)}>
                {t('appointment.helpModal.emergencyServiceNo')}
              </H3>
              {t('common.space')}
              {`${t('appointment.helpModal.mentalHealthCrisis')}${t('common.space')}`}
              <H3 style={styles.textLink} onPress={() => onPressContact(MENTAL_HEALTH_CRISIS_NUMBER)}>
                {t('appointment.helpModal.mentalHealthCrisisNo')}
              </H3>
              {t('common.dot')}
            </H3>
          </View>
        );
      default:
        return <H3 style={styles.description}>{drawerContent.description}</H3>;
    }
  };
  return (
    <Drawer
      styles={styles.drawer}
      visible={isShownAppointmentDrawer}
      hideDrawerHeader
      onRequestClose={() => {}}
      children={
        <>
          <View style={styles.titleView}>
            <H1 style={styles.title}>{drawerContent.title}</H1>
          </View>
          <View style={styles.container}>
            <View style={styles.contentView}>{description()}</View>
            <ActionButton
              title={drawerContent.primaryButton}
              onPress={() => onPressPrimaryButton(drawerContent.primaryButton)}
              style={styles.topButton}
              textStyle={styles.topButtonTextStyle}
            />
            <ActionButton
              title={drawerContent.secondaryButton}
              testID={'providers.scheduleAppointmentDrawer.secondaryButton'}
              onPress={() => onPressPrimaryButton(drawerContent.secondaryButton)}
            />
          </View>
        </>
      }
    />
  );
};
