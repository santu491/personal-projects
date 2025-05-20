import { Field, Select } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { ProgressBarHeader } from '../../../../../shared/src/components/progressBarHeader/progressBarHeader';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { ClinicalQuestionnaireFields } from '../../config/constants/constants';
import { timeRangeStyles } from './selectTimeRange.styles';
import { useSelectTimeRange } from './useSelectTimeRange';

export const SelectTimeRange = () => {
  const styles = useMemo(() => timeRangeStyles(), []);
  const { t } = useTranslation();
  const { timeRange, onChangeTimeRange, onPressContinue, selectedTimeRange, onPressCloseIcon } = useSelectTimeRange();

  return (
    <>
      <ProgressBarHeader
        leftArrow={true}
        totalStepsCount={3}
        progressStepsCount={2}
        onPressCloseIcon={onPressCloseIcon}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <AppointmentHeader
            title={t('appointment.selectTimeRange.title')}
            description={t('appointment.selectTimeRange.description')}
          />
          <View style={styles.selector}>
            <Field label={t('appointment.selectTimeRange.title')} styles={styles.field}>
              <Select
                accessibilityLabel={selectedTimeRange}
                accessibilityHint={selectedTimeRange}
                testID="appointment.selectTimeRange"
                items={timeRange}
                value={selectedTimeRange}
                pickerTitle={ClinicalQuestionnaireFields.PROBLEM}
                placeholder={t('appointment.selectTimeRange.selectTimeRangePlaceHolder')}
                onValueChange={onChangeTimeRange}
                doneText={t('common.done')}
                styles={{ input: styles.textInput }}
              />
            </Field>
          </View>
        </ScrollView>
        <View style={styles.continue}>
          <ActionButton onPress={onPressContinue} title={t('appointment.continue')} disabled={!selectedTimeRange} />
        </View>
      </View>
    </>
  );
};
