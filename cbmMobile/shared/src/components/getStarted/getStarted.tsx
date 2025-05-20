import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { ActionButton } from '../actionButton';
import { modelStyles } from './getStarted.styles';

interface GetStartProps {
  onPressLink: () => void;
  onPressPrimaryButton: () => void;
  onPressSecondaryButton: () => void;
}

export const GetStarted: React.FC<GetStartProps> = ({ onPressPrimaryButton, onPressSecondaryButton, onPressLink }) => {
  const { t } = useTranslation();

  return (
    <>
      <View style={modelStyles.headerContainer}>
        <Text style={modelStyles.bottomSheetTitleStyle} testID={'client.bottomSheet.model'}>
          {t('client.getStart')}
        </Text>
      </View>

      <View style={modelStyles.descriptionContainer}>
        <Text style={modelStyles.message}>{t('client.getStartDescription')}</Text>
        <ActionButton
          onPress={onPressPrimaryButton}
          title={t('client.createAccount')}
          style={modelStyles.actionButton}
          textStyle={modelStyles.actionButtonText}
          testID={'client.bottomSheet.createAccount'}
        />
        <ActionButton
          onPress={onPressSecondaryButton}
          title={t('client.signIn')}
          style={[modelStyles.previousButton, modelStyles.signInButton]}
          textStyle={modelStyles.previousButtonText}
          testID={'client.bottomSheet.signIn'}
        />
        <Text style={modelStyles.bottomContent}>{t('client.doNotWantToCreateAccount')}</Text>
        <TouchableOpacity onPress={onPressLink}>
          <Text style={[modelStyles.message, modelStyles.link]}>{t('client.continueAsGuest')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
