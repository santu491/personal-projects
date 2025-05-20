import { Field, InputScroll, Select, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { DatePicker } from '../../../../../shared/src/components/datePicker/datePicker';
import { LinkWithText } from '../../../../../shared/src/components/linkWithText/linkWithText';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { isIOS } from '../../../../../src/util/commonUtils';
import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AuthProfileTitle } from '../../components/authProfile/authProfileTitle';
import { ProgressHeader } from '../../components/progressHeader/progressHeader';
import { GENDER_OPTIONS, RELATIONSHIP_OPTIONS, STATES } from '../../constants/constants';
import { PersonalDetailFieldNames } from '../../models/signUp';
import { personalDetailsStyles } from './personalDetails.styles';
import { usePersonalDetails } from './usePersonalDetails';

export const PersonalDetails = () => {
  const { t } = useTranslation();
  const {
    navigateToSignUpScreen,
    handleContinueButton,
    control,
    formState: { isValid },
    dateOfBirthMaxDate,
  } = usePersonalDetails();
  const styles = useMemo(() => personalDetailsStyles(), []);

  return (
    <>
      <ProgressHeader leftArrow={true} totalStepsCount={3} progressStepsCount={1} />
      <View style={styles.mainContainer}>
        <InputScroll>
          <AuthProfileTitle
            title={t('signUp.title')}
            subTitle={t('signUp.description')}
            testID={'auth.signUp.title'}
            subTitleStyle={styles.subTitleStyle}
          />
          <View style={styles.loginLink}>
            <LinkWithText
              label={t('signUp.signInLinkText')}
              linkText={t('login.title')}
              onPress={navigateToSignUpScreen}
            />
          </View>
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
                  onChangeText={onChange}
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
                  onChangeText={onChange}
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
                onDateChange={(selectedDate) => onChange(selectedDate)}
                editable={true}
                required={true}
                placeholderText={t('signUp.dateOfBirthPlaceholder')}
                hasError={isTouched}
                errorMessage={error?.message}
                maximumDate={dateOfBirthMaxDate}
                confirmText={t('signUp.done')}
              />
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.GENDER}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.gender')}
                styles={styles.field}
                errorMessage={isTouched ? error?.message : undefined}
                accessoryEnd={<RequiredView />}
              >
                <Select
                  testID="signUp.gender"
                  accessibilityLabel={value}
                  items={GENDER_OPTIONS}
                  value={value}
                  pickerTitle="Gender"
                  placeholder={t('signUp.genderPlaceholder')}
                  onValueChange={(gender) => {
                    onChange(gender);
                  }}
                  doneText="Done"
                  styles={{ input: styles.textInput }}
                  accessibilityHint={value}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.RELATIONSHIP_STATUS}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.relationship')}
                styles={styles.field}
                errorMessage={isTouched ? error?.message : undefined}
                accessoryEnd={<RequiredView />}
              >
                <Select
                  testID="signUp.relationshipStatus"
                  accessibilityLabel={value}
                  items={RELATIONSHIP_OPTIONS}
                  value={value}
                  pickerTitle="Relationship Status"
                  placeholder={t('signUp.relationshipPlaceholder')}
                  onValueChange={(status) => {
                    onChange(status ?? '');
                  }}
                  doneText="Done"
                  styles={{ input: styles.textInput }}
                  accessibilityHint={value}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.ADDRESS_LINE_ONE}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.addressLineOne')}
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
                  onChangeText={onChange}
                  placeholder={t('signUp.addressLineOnePlaceholder')}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.ADDRESS_LINE_TWO}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.addressLineTwo')}
                styles={styles.field}
                errorMessage={isTouched ? error?.message : undefined}
              >
                <TextInput
                  styles={styles.textInput}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                  placeholder={t('signUp.addressLineTwoPlaceholder')}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.STATE}
            render={({ field: { onChange, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.state')}
                styles={styles.field}
                errorMessage={isTouched ? error?.message : undefined}
                accessoryEnd={<RequiredView />}
              >
                <Select
                  accessibilityLabel={value}
                  accessibilityHint={value}
                  testID="signUp.state"
                  items={STATES}
                  value={value}
                  pickerTitle="State"
                  placeholder={t('signUp.statePlaceholder')}
                  onValueChange={(state) => {
                    onChange(state ?? '');
                  }}
                  doneText="Done"
                  styles={{ input: styles.textInput }}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.CITY}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.city')}
                styles={styles.field}
                errorMessage={isTouched ? error?.message : undefined}
                accessoryEnd={<RequiredView />}
              >
                <TextInput
                  styles={styles.textInput}
                  onBlur={() => {
                    onChange(value);
                    onBlur();
                  }}
                  onChangeText={onChange}
                  placeholder={t('signUp.cityPlaceholder')}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={PersonalDetailFieldNames.ZIPCODE}
            render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
              <Field
                label={t('signUp.zipcode')}
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
                  onChangeText={onChange}
                  placeholder={t('signUp.zipcodePlaceholder')}
                  keyboardType="numeric"
                  returnKeyType={isIOS() ? 'done' : 'next'}
                  maxLength={5}
                />
              </Field>
            )}
          />
        </InputScroll>

        <AuthFooterButtons
          secondaryButtonTitle={t('authentication.continue')}
          onPressContinueButton={handleContinueButton}
          footerViewStyle={styles.footerButtons}
          disabled={!isValid}
        />
      </View>
    </>
  );
};
