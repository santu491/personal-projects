import { Radio } from '@sydney/motif-components';
import deepmerge from 'deepmerge';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { VisibleIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { ProgressBarHeader } from '../../../../../shared/src/components/progressBarHeader/progressBarHeader';
import { RNText } from '../../../../../shared/src/components/text/text';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { counselorSettingStyles, overrideRadioStyles } from './counselorSettings.styles';
import { useCounselorSettings } from './useCounselorSettings';

export const CounselorSettings = () => {
  const { t } = useTranslation();

  const styles = useMemo(() => deepmerge(counselorSettingStyles(), overrideRadioStyles), []);
  const {
    radioButtons,
    selectedValue,
    onChangeSettings,
    onPressContinue,
    onPressCloseIcon,
    onPressEditCounselor,
    memberAppointmentStatus,
  } = useCounselorSettings();
  return (
    <>
      <ProgressBarHeader
        leftArrow={true}
        totalStepsCount={3}
        progressStepsCount={2}
        onPressCloseIcon={onPressCloseIcon}
      />
      <View style={styles.container}>
        <ScrollView>
          <AppointmentHeader
            title={t('appointment.counselorSetting.title')}
            description={t('appointment.counselorSetting.description')}
          />
          <View style={styles.settingsContainer}>
            <RNText style={styles.settingsInfo}>{t('appointment.counselorSetting.settingsInfo')}</RNText>

            <Radio
              items={radioButtons}
              onValueChange={onChangeSettings}
              value={selectedValue}
              styles={styles.radio}
              noLineBreak
            />
            {memberAppointmentStatus?.data?.length === 0 ? (
              <TouchableOpacity style={styles.editCounselor} onPress={onPressEditCounselor}>
                <VisibleIcon />
                <RNText style={styles.editCounselorLabel}>
                  {t('appointment.counselorSetting.addOrRemoveCounselor')}
                </RNText>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
        <View style={styles.continue}>
          <ActionButton onPress={onPressContinue} title={t('appointment.continue')} disabled={!selectedValue} />
        </View>
      </View>
    </>
  );
};
