import { Field, Select, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { ProgressBarHeader } from '../../../../../shared/src/components/progressBarHeader/progressBarHeader';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { AppointmentHeader } from '../../components/appointmentDescription/appointmentHeader';
import { ClinicalQuestionnaireFields } from '../../config/constants/constants';
import { clinicalQuestionnaireStyles } from './clinicalQuestionnaire.styles';
import { useClinicalQuestionnaire } from './useClinicalQuestionnaire';

export const ClinicalQuestionnaire = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    control,
    formState: { isValid },
    problemInfo,
    daysOption,
    onPressContinue,
    watch,
    onChangeValue,
    onPressCloseIcon,
    appointmentFlowStatus,
    showError,
    handleTryAgain,
  } = useClinicalQuestionnaire();

  const styles = useMemo(() => clinicalQuestionnaireStyles(), []);

  return (
    <>
      <ProgressLoader isVisible={isLoading} />
      <ProgressBarHeader
        leftArrow={true}
        totalStepsCount={appointmentFlowStatus ? 2 : 3}
        progressStepsCount={1}
        onPressCloseIcon={onPressCloseIcon}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <AppointmentHeader
            title={t('appointment.clinicalQuestionnaire.title')}
            description={t('appointment.clinicalQuestionnaire.description')}
          />
          {problemInfo && problemInfo.length > 0 ? (
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name={ClinicalQuestionnaireFields.PROBLEM}
                render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
                  <Field
                    label={t('appointment.clinicalQuestionnaire.problem')}
                    styles={styles.field}
                    accessoryEnd={<RequiredView />}
                    errorMessage={isTouched ? error?.message : undefined}
                  >
                    <Select
                      accessibilityLabel={value}
                      accessibilityHint={value}
                      testID="appointment.clinicalQuestionnaire.problem"
                      items={problemInfo}
                      value={value}
                      pickerTitle={ClinicalQuestionnaireFields.PROBLEM}
                      placeholder={t('appointment.clinicalQuestionnaire.problemPlaceholder')}
                      onValueChange={(label) => {
                        onChange(label);
                        onChangeValue();
                      }}
                      doneText={t('common.done')}
                      styles={{ input: styles.textInput }}
                    />
                  </Field>
                )}
              />
              {!appointmentFlowStatus ? (
                <Controller
                  control={control}
                  name={ClinicalQuestionnaireFields.PROBLEM_DESCRIPTION}
                  render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
                    <Field
                      label={t('appointment.clinicalQuestionnaire.problemDescription')}
                      styles={styles.field}
                      errorMessage={isTouched ? error?.message : undefined}
                    >
                      <TextInput
                        value={value}
                        placeholder={t('appointment.clinicalQuestionnaire.problemDescriptionPlaceholder')}
                        onChangeText={onChange}
                        styles={styles.multiLineTextInput}
                        multiline={true}
                      />
                    </Field>
                  )}
                />
              ) : null}
              {watch().problem ? (
                <Controller
                  control={control}
                  name={ClinicalQuestionnaireFields.LESS_PRODUCTIVE_DAYS}
                  render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
                    <Field
                      label={t('appointment.clinicalQuestionnaire.lessProductive')}
                      accessoryEnd={<RequiredView />}
                      styles={styles.field}
                      errorMessage={isTouched ? error?.message : undefined}
                    >
                      <Select
                        accessibilityLabel={value}
                        accessibilityHint={value}
                        testID="appointment.clinicalQuestionnaire.lessProductive"
                        items={daysOption}
                        value={value}
                        pickerTitle={ClinicalQuestionnaireFields.PROBLEM}
                        placeholder={t('appointment.clinicalQuestionnaire.selectPlaceholder')}
                        onValueChange={(label) => {
                          onChange(label);
                          onChangeValue();
                        }}
                        doneText="Done"
                        styles={{ input: styles.textInput }}
                      />
                    </Field>
                  )}
                />
              ) : null}

              {watch().lessProductiveDays ? (
                <Controller
                  control={control}
                  name={ClinicalQuestionnaireFields.JOB_MISSED_DAYS}
                  render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
                    <Field
                      label={t('appointment.clinicalQuestionnaire.jobMissedDays')}
                      styles={styles.field}
                      accessoryEnd={<RequiredView />}
                      errorMessage={isTouched ? error?.message : undefined}
                    >
                      <Select
                        accessibilityLabel={value}
                        accessibilityHint={value}
                        testID="appointment.clinicalQuestionnaire.jobMissedDays"
                        items={daysOption}
                        value={value}
                        pickerTitle={ClinicalQuestionnaireFields.PROBLEM}
                        placeholder={t('appointment.clinicalQuestionnaire.selectPlaceholder')}
                        onValueChange={(label) => {
                          onChange(label);
                          onChangeValue();
                        }}
                        doneText="Done"
                        styles={{ input: styles.textInput }}
                      />
                    </Field>
                  )}
                />
              ) : null}
            </View>
          ) : null}
        </ScrollView>
        <View style={styles.continue}>
          <ActionButton
            onPress={onPressContinue}
            title={t('appointment.continue')}
            disabled={isLoading ? true : !isValid}
          />
        </View>
        {showError ? (
          <AlertModel
            modalVisible={showError}
            title={t('appointments.errors.title')}
            subTitle={t('appointments.errors.genericDescription')}
            primaryButtonTitle={t('appointments.errors.tryAgainButton')}
            onHandlePrimaryButton={handleTryAgain}
            isError={true}
          />
        ) : null}
      </View>
    </>
  );
};
