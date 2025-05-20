import { Field, InputScroll, TextInput } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { PhoneNumber } from '../../../../../shared/src/components/phoneNumber/phoneNumber';
import { PhoneNumberLink } from '../../../../../shared/src/components/phoneNumberLink';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { RequiredView } from '../../../../../shared/src/components/requiredView';
import { RNText } from '../../../../../shared/src/components/text/text';
import { ChatOfflineComponent } from '../../components/chatOffline';
import { ChatFieldNames } from '../../model/chat';
import { startChatStyles } from './startChat.styles';
import { useStartChat } from './useStartChat';

export const StartChat = () => {
  const {
    loading,
    t,
    control,
    onStartChatButtonClick,
    formState: { isValid },
    phoneNumberTapped,
    isChatFlowEnabled,
    genesysChat,
  } = useStartChat();
  const styles = useMemo(() => startChatStyles(), []);

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={styles.mainContainer}>
        <ProgressLoader isVisible={loading} />
        {isChatFlowEnabled ? (
          <InputScroll>
            <View style={styles.description}>
              <PhoneNumberLink
                textStyles={styles.phoneLink}
                text={genesysChat?.header ?? ''}
                phoneNumberTapped={phoneNumberTapped}
              />
            </View>
            <View style={styles.description}>
              <RNText>{genesysChat?.anonymousUserHeader}</RNText>
            </View>
            <Controller
              control={control}
              name={ChatFieldNames.FIRST_NAME}
              render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
                <Field
                  label={t('chat.firstName')}
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
                    }}
                    placeholder={t('chat.firstNamePlaceholder')}
                  />
                </Field>
              )}
            />
            <Controller
              control={control}
              name={ChatFieldNames.LAST_NAME}
              render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
                <Field
                  label={t('chat.lastName')}
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
                    }}
                    placeholder={t('chat.lastNamePlaceholder')}
                  />
                </Field>
              )}
            />

            <Controller
              control={control}
              name={ChatFieldNames.EMAIL}
              render={({ field: { onChange, onBlur, value }, fieldState: { isTouched, error } }) => (
                <Field
                  label={t('chat.email')}
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
                    }}
                    placeholder={t('chat.emailPlaceholder')}
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

            <Controller
              control={control}
              name={ChatFieldNames.PHONE_NUMBER}
              render={({ field: { onChange, value, onBlur }, fieldState: { isTouched, error } }) => (
                <Field
                  label={t('chat.phoneNumber')}
                  styles={styles.field}
                  accessoryEnd={<RequiredView />}
                  errorMessage={isTouched ? error?.message : undefined}
                >
                  <PhoneNumber
                    placeholder={t('chat.phoneNumberPlaceholder')}
                    onChange={onChange}
                    value={value}
                    accessibilityHint="phone number"
                    onBlur={() => {
                      onChange(value);
                      onBlur();
                    }}
                  />
                </Field>
              )}
            />

            <ActionButton
              onPress={onStartChatButtonClick}
              title={t('chat.startChat')}
              textStyle={styles.actionButtonText}
              testID={'chat.button.startChat'}
              disabled={!isValid}
            />
          </InputScroll>
        ) : (
          <ChatOfflineComponent />
        )}
      </View>
    </>
  );
};
