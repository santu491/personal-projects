import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { ProgressBarHeader } from '../../../../../shared/src/components/progressBarHeader/progressBarHeader';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { styles } from './selectDays.styles';
import { useSelectedDays } from './useSelectedDays';

export const SelectDays = () => {
  const { t } = useTranslation();

  const { daysInfo, isContinueButtonEnabled, onPressContinue, onPressCloseIcon, onPressDay } = useSelectedDays();
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
            title={t('appointment.selectedDays.title')}
            description={t('appointment.selectedDays.description')}
          />

          <View style={styles.grid}>
            {daysInfo.map((item) => (
              <View style={styles.gridItem} key={item.value}>
                <ActionButton
                  title={item.day}
                  onPress={() => onPressDay(item.value)}
                  style={[styles.dayButton, item.isSelected && styles.daySelected]}
                  textStyle={styles.daysLabel}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.continue}>
          <ActionButton
            onPress={onPressContinue}
            title={t('appointment.continue')}
            disabled={!isContinueButtonEnabled}
          />
        </View>
      </View>
    </>
  );
};
