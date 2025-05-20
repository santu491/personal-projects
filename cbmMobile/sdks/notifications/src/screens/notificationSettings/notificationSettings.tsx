import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { MemberProfileHeader } from '../../../../menu/src/components/memberProfileHeader/memberProfileHeader';
import { LabeledSwitch } from '../../components/labeledSwitch/labeledSwitch';
import { notificationStyles } from './notificationSettings.styles';
import { useNotificationSettings } from './useNotificationSettings';

export const NotificationSettings = () => {
  const { t } = useTranslation();

  const {
    isPushNotificationEnabled,
    togglePushNotificationSwitch,
    modelVisible,
    successAlertData,
    onPressSuccessAlertButton,
  } = useNotificationSettings();
  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <View style={notificationStyles.mainContainer}>
        <MemberProfileHeader testID={'notification.profile.notification.settings'} title={t('profile.notifications')} />

        <LabeledSwitch
          testID={'notification.settings.enable.switch'}
          isToggleEnabled={isPushNotificationEnabled}
          onValueChange={togglePushNotificationSwitch}
          title={t('notifications.preferences.enableTitle')}
        />

        {modelVisible && successAlertData ? (
          <AlertModel
            modalVisible={modelVisible}
            onHandlePrimaryButton={onPressSuccessAlertButton}
            title={successAlertData.title}
            subTitle={successAlertData.description}
            primaryButtonTitle={t('authentication.continue')}
          />
        ) : null}
      </View>
    </>
  );
};
