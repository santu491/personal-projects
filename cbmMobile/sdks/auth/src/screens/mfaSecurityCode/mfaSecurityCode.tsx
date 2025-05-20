import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { AuthFooterButtons } from '../../components/authProfile/authFooterButtons';
import { AuthProfileTitle } from '../../components/authProfile/authProfileTitle';
import { ProgressHeader } from '../../components/progressHeader/progressHeader';
import { SecurityCodeList } from '../../components/securityCodeList/securityCodeList';
import { styles } from './mfaSecurityCode.styles';
import { useMfaSecurityCode } from './useMfaSecurityCode';

export const MFASecurityCode = () => {
  const { t } = useTranslation();
  const {
    handleContinueButton,
    handlePressMFAOption,
    handlePreviousButton,
    isContinueButtonEnabled,
    getContacts,
    selectedMfa,
  } = useMfaSecurityCode();

  return (
    <>
      <ProgressHeader leftArrow={true} totalStepsCount={2} progressStepsCount={1} />

      <View style={styles.mainContainer}>
        <ScrollView>
          <AuthProfileTitle
            title={t('authentication.selectOptionTitle')}
            subTitle={t('authentication.selectOptionDescription')}
            testID={'auth.mfa.profile.title'}
          />

          <SecurityCodeList
            mfaOptions={getContacts}
            handlePress={handlePressMFAOption}
            selectedMfa={selectedMfa}
            testID={'auth.mfa.securityCodeList'}
          />
        </ScrollView>

        <AuthFooterButtons
          primaryButtonTitle={t('authentication.previous')}
          secondaryButtonTitle={t('authentication.continue')}
          onPressPreviousButton={handlePreviousButton}
          onPressContinueButton={handleContinueButton}
          showPreviousButton={true}
          disabled={!isContinueButtonEnabled}
        />
      </View>
    </>
  );
};
