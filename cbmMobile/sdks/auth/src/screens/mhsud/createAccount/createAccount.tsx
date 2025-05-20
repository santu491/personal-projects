import { CheckBox, Field, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ActionButton } from '../../../../../../shared/src/components';
import { DatePicker } from '../../../../../../shared/src/components/datePicker/datePicker';
import { MainHeaderComponent } from '../../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../../shared/src/components/progressLoader';
import { RequiredView } from '../../../../../../shared/src/components/requiredView';
import { TitleHeader } from '../../../../../../shared/src/components/titleHeader/titleHeader';
import { convertPhoneNumber } from '../../../../../../shared/src/utils/utils';
import { Popup } from '../../../components/popup/popup';
import { CreateAccountMhsudFieldNames } from '../../../models/signUp';
import { createAccountStyles } from './createAccount.styles';
import { useCreateAccount } from './useCreateAccount';
export const CreateAccountMhsud = () => {
  const { t } = useTranslation();
  const {
    handleContinueButton,
    control,
    formState: { isValid },
    dateOfBirthMaxDate,
    isChecked,
    handleCheckboxChange,
    onCloseVerifyEmailPopup,
    onPressResendVerification,
    isVerifyEmailPopupVisible,
    isResendVerificationPopupVisible,
    isLoading,
    onCloseError,
    isError,
  } = useCreateAccount();

  const styles = useMemo(() => createAccountStyles(), []);
  return (
    <>
      {isLoading ? <ProgressLoader isVisible={isLoading} /> : null}
      <MainHeaderComponent leftArrow={false} isImmediateAssistanceVisible={false} />
      {isVerifyEmailPopupVisible ? (
        <Popup
          title={t('mhsud.createAccount.verifyEmailAddress')}
          description={t('mhsud.createAccount.verifyEmailDescription')}
          onPressCloseIcon={onCloseVerifyEmailPopup}
          linkText={t('mhsud.createAccount.resendVerification')}
          isVisible={isVerifyEmailPopupVisible}
          onPressLink={onPressResendVerification}
        />
      ) : null}
      {isError ? (
        <Popup
          title={t('mhsud.createAccount.error.somethingWentWrong')}
          description={t('mhsud.createAccount.error.tryAgain')}
          onPressCloseIcon={onCloseVerifyEmailPopup}
          isVisible={isError}
          primaryButtonText="Ok"
          onPressPrimaryButton={onCloseError}
        />
      ) : null}

      {isResendVerificationPopupVisible && !isVerifyEmailPopupVisible ? (
        <Popup
          title={t('mhsud.createAccount.emailResent')}
          description={t('mhsud.createAccount.verifyEmailDescription')}
          onPressCloseIcon={onCloseVerifyEmailPopup}
          isVisible={isResendVerificationPopupVisible}
        />
      ) : null}

      <KeyboardAwareScrollView style={styles.mainContainer}>
        <TitleHeader title={t('mhsud.createAccount.title')} />
        <View style={styles.innerContainer}>
          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.FIRST_NAME}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('mhsud.createAccount.firstName')}
                styles={{ ...(styles.field ?? {}), label: { ...(styles.field?.label ?? {}), ...styles.inputLabel } }}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={{
                    ...(styles.textInput ?? {}),
                    input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                  maxLength={45}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.LAST_NAME}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('mhsud.createAccount.lastName')}
                styles={{ ...(styles.field ?? {}), label: { ...(styles.field?.label ?? {}), ...styles.inputLabel } }}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={{
                    ...(styles.textInput ?? {}),
                    input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.MEMBER_ID}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('mhsud.createAccount.memberId')}
                styles={{ ...(styles.field ?? {}), label: { ...(styles.field?.label ?? {}), ...styles.inputLabel } }}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={{
                    ...(styles.textInput ?? {}),
                    input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                />
                <Text style={styles.memberIdInfo}>Your member ID number on your insurance card</Text>
              </Field>
            )}
          />

          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.DATE_OF_BIRTH}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <DatePicker
                filedStyles={{
                  ...(styles.field ?? {}),
                  label: { ...(styles.field?.label ?? {}), ...styles.inputLabel },
                }}
                textInputStyles={{
                  ...(styles.textInput ?? {}),
                  input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                }}
                title={t('mhsud.createAccount.dob')}
                date={value}
                onDateChange={(selectedDate) => {
                  onChange(selectedDate);
                }}
                editable={true}
                required={true}
                hasError={isTouched}
                errorMessage={error?.message}
                maximumDate={dateOfBirthMaxDate}
                confirmText={t('signUp.done')}
              />
            )}
          />
          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.EMAIL_ADDRESS}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('mhsud.createAccount.email')}
                styles={{ ...(styles.field ?? {}), label: { ...(styles.field?.label ?? {}), ...styles.inputLabel } }}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={{
                    ...(styles.textInput ?? {}),
                    input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                  value={value}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.CONFIRM_EMAIL_ADDRESS}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('mhsud.createAccount.confirmEmail')}
                styles={{ ...(styles.field ?? {}), label: { ...(styles.field?.label ?? {}), ...styles.inputLabel } }}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={{
                    ...(styles.textInput ?? {}),
                    input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                  value={value}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.PHONE_NUMBER}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('mhsud.createAccount.phoneNumber')}
                styles={{ ...(styles.field ?? {}), label: { ...(styles.field?.label ?? {}), ...styles.inputLabel } }}
                accessoryEnd={<RequiredView />}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={{
                    ...(styles.textInput ?? {}),
                    input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={(text) => onChange(convertPhoneNumber(text))}
                  keyboardType="number-pad"
                  maxLength={17} // Adjusted max length for formatted phone number
                  placeholder="+1 (---) --- ----"
                  value={value}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.PHONE_EXTENSION}
            render={({ field: { onChange, onBlur, value } }) => (
              <Field
                label={t('mhsud.createAccount.phoneExtension')}
                styles={{ ...(styles.field ?? {}), label: { ...(styles.field?.label ?? {}), ...styles.inputLabel } }}
              >
                <TextInput
                  styles={{
                    ...(styles.textInput ?? {}),
                    input: { ...(styles.textInput?.input ?? {}), ...styles.inputText },
                  }}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={value}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={CreateAccountMhsudFieldNames.NOTIFICATION_CHECK_BOX}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.notificationContainer}
                onPress={() => onChange(!value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: value }}
                accessibilityLabel={t('mhsud.createAccount.receiveNotifications')}
              >
                <CheckBox
                  checked={value}
                  onPress={() => onChange(!value)}
                  styles={styles.roundCheckbox}
                  testID="mhsud.createAccount.receiveNotifications"
                />
                <View>
                  <Text style={styles.receiveNotificationsLabel}>{t('mhsud.createAccount.receiveNotifications')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.healthInfo}>
            <Text style={styles.description}>{t('mhsud.createAccount.description')}</Text>
          </View>
          <Text style={(styles.description, styles.disclaimer)}>{t('mhsud.createAccount.disclaimer')}</Text>
          <TouchableOpacity
            style={styles.checkBoxContainer}
            onPress={handleCheckboxChange}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
            accessibilityLabel={t('mhsud.createAccount.accept')}
          >
            <CheckBox
              checked={isChecked}
              onPress={handleCheckboxChange}
              styles={styles.roundCheckbox}
              testID="mhsud.createAccount.accept"
            />
            <View>
              <Text style={styles.checkBoxLabel}>
                {t('mhsud.createAccount.accept')}
                <Text style={styles.required}>{t('common.space')}*</Text>
              </Text>
            </View>
          </TouchableOpacity>
          <ActionButton
            title={t('mhsud.login.continue')}
            onPress={handleContinueButton}
            style={!(isValid && isChecked) && styles.buttonDisable}
            disabled={!(isValid && isChecked)}
            textStyle={[styles.actionButtonText, !(isValid && isChecked) && styles.buttonTextDisable]}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
