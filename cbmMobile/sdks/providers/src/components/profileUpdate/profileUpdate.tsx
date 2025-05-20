import { CheckBox, Field, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { ProfileIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { H1, H2, RNText } from '../../../../../shared/src/components/text/text';
import { ProfileUpdateFieldNames } from '../../config/constants/constants';
import { profileUpdateStyles } from './profileUpdate.styles';
import { ProfileUpdateProps, useProfileUpdate } from './useProfileUpdate';

export const ProfileUpdate = ({ profileInfo, closeModal, handleProfileSubmit }: ProfileUpdateProps) => {
  const styles = useMemo(() => profileUpdateStyles(), []);
  const { control, handleCancel, onProfileOptionChange, handleSubmit, options } = useProfileUpdate({
    profileInfo,
    closeModal,
    handleProfileSubmit,
  });
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.mainContainer}>
      <H1 style={styles.title}>{profileInfo?.title}</H1>
      <View style={styles.nameContainer}>
        <ProfileIcon />
        <H2 style={styles.name}>{profileInfo?.providerName}</H2>
      </View>
      {profileInfo?.description ? <RNText style={styles.description}>{profileInfo.description}</RNText> : null}
      <View style={styles.optionsContainer}>
        {options?.map((option) => (
          <TouchableOpacity
            style={styles.checkboxContainer}
            key={option.name}
            onPress={() => onProfileOptionChange(option)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: option.selected }}
            accessibilityLabel={option.name}
          >
            <CheckBox
              checked={option.selected ?? false}
              onPress={() => onProfileOptionChange(option)}
              styles={styles.checkbox}
            />
            <RNText style={styles.optionLabel}>{option.label}</RNText>
          </TouchableOpacity>
        ))}
      </View>
      {profileInfo?.comments ? (
        <Controller
          control={control}
          name={ProfileUpdateFieldNames.ADDITIONAL_COMMENTS}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
            <Field
              label={profileInfo.comments?.label ?? ''}
              styles={styles.field}
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
                }}
                placeholder={t('providerDetail.typeHere')}
              />
            </Field>
          )}
        />
      ) : null}
      {profileInfo?.contactInformationLabel ? (
        <RNText style={styles.infoLabel}>{profileInfo.contactInformationLabel}</RNText>
      ) : null}
      {profileInfo?.name ? (
        <Controller
          control={control}
          name={ProfileUpdateFieldNames.NAME}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
            <Field
              label={profileInfo.name?.label ?? ''}
              styles={styles.field}
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
                }}
                placeholder={profileInfo.name?.placeholder}
              />
            </Field>
          )}
        />
      ) : null}
      {profileInfo?.email ? (
        <Controller
          control={control}
          name={ProfileUpdateFieldNames.EMAIL}
          render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
            <Field
              label={profileInfo.email?.label ?? ''}
              styles={styles.field}
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
                }}
                placeholder={profileInfo.email?.placeholder}
              />
            </Field>
          )}
        />
      ) : null}
      <View style={styles.continue}>
        <ActionButton
          style={styles.primary}
          onPress={handleSubmit}
          title={t('providerDetail.submit')}
          disabled={false}
          testID="provider.profileUpdate.submit"
        />
        <ActionButton
          title={t('providerDetail.cancel')}
          onPress={handleCancel}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonTextStyle}
        />
      </View>
    </ScrollView>
  );
};
