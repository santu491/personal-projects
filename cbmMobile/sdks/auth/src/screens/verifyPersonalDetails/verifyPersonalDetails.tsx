import { Field, InputScroll, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { DatePicker } from '../../../../../shared/src/components/datePicker/datePicker';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AuthProfileTitle } from '../../components/authProfile/authProfileTitle';
import { ProgressHeader } from '../../components/progressHeader/progressHeader';
import { FlowName } from '../../config/constants/auth';
import { AccountSetUpFieldNames, PersonalDetailFieldNames } from '../../models/signUp';
import { useVerifyPersonalDetails } from './useVerifyPersonalDetails';
import { verifyPersonalDetailsStyles } from './verifyPersonalDetails.styles';

export const VerifyPersonalDetails = () => {
  const { t } = useTranslation();
  const {
    dateOfBirthMaxDate,
    control,
    formState: { isValid },
    handleContinueButton,
    loading,
    flowName,
    apiError,
    updateApiError,
    isShownErrorAlert,
    onPressErrorAlert,
  } = useVerifyPersonalDetails();
  const styles = useMemo(() => verifyPersonalDetailsStyles(), []);

  return (
    <>
      <ProgressHeader leftArrow={true} totalStepsCount={3} progressStepsCount={1} />
      <View style={styles.mainContainer}>
        <ProgressLoader isVisible={loading} />
        <InputScroll>
          <AuthProfileTitle
            title={
              flowName === FlowName.FORGOT_SECRET
                ? t('verifyPersonalDetails.forgotSecret')
                : t('verifyPersonalDetails.title')
            }
            subTitle={t('verifyPersonalDetails.description')}
            testID={'auth.verifyPersonalDetails.title'}
            subTitleStyle={styles.subTitleStyle}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.FIRST_NAME}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.firstName')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={styles.textInput}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={(firstNameValue) => {
                    onChange(firstNameValue);
                    updateApiError();
                  }}
                  placeholder={t('signUp.firstNamePlaceholder')}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name={PersonalDetailFieldNames.LAST_NAME}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.lastName')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={styles.textInput}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={(lastNameValue) => {
                    onChange(lastNameValue);
                    updateApiError();
                  }}
                  placeholder={t('signUp.lastNamePlaceholder')}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.DATE_OF_BIRTH}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <DatePicker
                title={t('signUp.dateOfBirth')}
                date={value}
                onDateChange={(selectedDate) => {
                  onChange(selectedDate);
                  updateApiError();
                }}
                editable={true}
                required={true}
                placeholderText={t('signUp.dateOfBirthPlaceholder')}
                hasError={isTouched}
                errorMessage={error?.message}
                maximumDate={dateOfBirthMaxDate}
              />
            )}
          />

          <Controller
            control={control}
            name={AccountSetUpFieldNames.EMAIL}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('accountSetUp.email')}
                styles={styles.field}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={styles.textInput}
                  value={value}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={(emailValue) => {
                    onChange(emailValue);
                    updateApiError();
                  }}
                  placeholder={t('accountSetUp.emailPlaceholder')}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                />
              </Field>
            )}
          />
        </InputScroll>

        <AuthFooterButtons
          primaryButtonTitle={t('authentication.previous')}
          secondaryButtonTitle={t('authentication.continue')}
          onPressContinueButton={handleContinueButton}
          footerViewStyle={styles.footerButtons}
          disabled={!isValid}
        />
        {isShownErrorAlert ? (
          <AlertModel
            modalVisible={isShownErrorAlert}
            onHandlePrimaryButton={onPressErrorAlert}
            title={
              flowName === FlowName.FORGOT_SECRET
                ? t('authErrors.forgotSecretErrorTitle')
                : t('authErrors.forgotUserNameErrorTitle')
            }
            subTitle={apiError}
            isError={true}
            primaryButtonTitle={t('authErrors.tryAgainButton')}
          />
        ) : null}
      </View>
    </>
  );
};
