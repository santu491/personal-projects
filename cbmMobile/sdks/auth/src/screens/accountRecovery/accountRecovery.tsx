import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { RightArrow } from '../../../../../shared/src/assets/icons/icons';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H4 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../shared/src/context/appColors';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { accountRecoveryStyles } from './accountRecovery.styles';
import { useAccountRecovery } from './useAccountRecovery';

export const AccountRecovery = () => {
  const { t } = useTranslation();
  const { navigateToResetSecretScreen } = useAccountRecovery();
  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={accountRecoveryStyles.mainContainer}>
        <MemberProfileHeader testID={'auth.profile.account.recovery'} title={t('profile.password')} />
        <TouchableOpacity onPress={navigateToResetSecretScreen}>
          <View style={accountRecoveryStyles.titleView}>
            <H4 style={accountRecoveryStyles.title}>{t('profile.accountSecret.title')}</H4>
            <RightArrow color={appColors.lightPurple} width={16} height={16} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
