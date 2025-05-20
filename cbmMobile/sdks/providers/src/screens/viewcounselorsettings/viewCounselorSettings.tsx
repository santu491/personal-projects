import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { VisibleIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { ProgressBarHeader } from '../../../../../shared/src/components/progressBarHeader/progressBarHeader';
import { H2, H3, RNText } from '../../../../../shared/src/components/text/text';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { useViewCounselorSettings } from './useViewCounselorSettings';
import { viewCounselorSettingStyles } from './viewCounselorSettings.styles';

export const ViewCounselorSettings = () => {
  const { t } = useTranslation();
  const { onPressContinue, days, time, onPressCloseIcon, onPressEditCounselor, memberAppointmentStatus } =
    useViewCounselorSettings();
  return (
    <>
      <ProgressBarHeader
        leftArrow={true}
        totalStepsCount={3}
        progressStepsCount={3}
        onPressCloseIcon={onPressCloseIcon}
      />
      <View style={viewCounselorSettingStyles.container}>
        <View style={viewCounselorSettingStyles.mainContainer}>
          <AppointmentHeader
            title={t('appointment.reviewDetails.title')}
            description={t('appointment.reviewDetails.description')}
          />
          <View style={viewCounselorSettingStyles.itemSeparator} />
          <View style={viewCounselorSettingStyles.counselorSettings}>
            <H2 style={viewCounselorSettingStyles.counselorSettingsTitle}>
              {t('appointment.reviewDetails.counselorSettings')}
            </H2>
            <View style={viewCounselorSettingStyles.itemSeparator} />
            <View>
              <H3 style={viewCounselorSettingStyles.question}>{t('appointment.reviewDetails.preferredSlot')}</H3>
              <RNText>{t('appointment.reviewDetails.appliesToText')}</RNText>
              {days.length === 0 && (
                <View style={[viewCounselorSettingStyles.roundButton, viewCounselorSettingStyles.counselorView]}>
                  <RNText>{t('appointment.counselorSetting.availablePerCounselor')}</RNText>
                </View>
              )}
              <View style={viewCounselorSettingStyles.daysView}>
                {days.map((day) => (
                  <View key={day} style={viewCounselorSettingStyles.roundButton}>
                    <RNText style={viewCounselorSettingStyles.roundButtonText}>{day}</RNText>
                  </View>
                ))}
              </View>
              <View style={viewCounselorSettingStyles.timeView}>
                {time ? (
                  <View style={viewCounselorSettingStyles.roundButton}>
                    <RNText style={viewCounselorSettingStyles.roundButtonText}>{time}</RNText>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
          {memberAppointmentStatus?.data?.length === 0 ? (
            <TouchableOpacity style={viewCounselorSettingStyles.editCounselor} onPress={onPressEditCounselor}>
              <VisibleIcon />
              <RNText style={viewCounselorSettingStyles.editCounselorLabel}>
                {t('appointment.counselorSetting.addOrRemoveCounselor')}
              </RNText>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={viewCounselorSettingStyles.continue}>
          <ActionButton onPress={onPressContinue} title={t('appointment.continue')} disabled={false} />
        </View>
      </View>
    </>
  );
};
