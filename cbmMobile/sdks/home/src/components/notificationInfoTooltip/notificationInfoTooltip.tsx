import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { CloseIcon } from '../../../../../shared/src/assets/icons/icons';
import { CustomTooltip } from '../../../../../shared/src/components/customTooltip/customTooltip';
import { RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { notificationInfoTooltipStyles } from './notificationInfoTooltip.styles';
import { useNotificationInfoTooltip } from './useNotificationInfoTooltip';

export const NotificationInfoTooltip = () => {
  const { t } = useTranslation();
  const { visible, onPressCloseIcon } = useNotificationInfoTooltip();

  return visible ? (
    <CustomTooltip
      tooltipView={
        <>
          <TouchableOpacity
            testID="home.notificationInfotooltip.closeButton"
            onPress={onPressCloseIcon}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            style={notificationInfoTooltipStyles.closeIconView}
          >
            <CloseIcon color={appColors.gray} />
          </TouchableOpacity>
          <RNText testID={'home.notificationInfotooltip.title'} style={notificationInfoTooltipStyles.title}>
            {t('home.notificationInfoTooltip.title')}
          </RNText>
          <RNText testID={'home.notificationInfotooltip.subTitle'} style={notificationInfoTooltipStyles.subTitle}>
            {t('home.notificationInfoTooltip.subTitle')}
            <RNText testID={'home.notificationInfotooltip.accountText'} style={notificationInfoTooltipStyles.account}>
              {`${t('common.space')}${t('home.notificationInfoTooltip.account')}${t('common.space')}`}
            </RNText>
            <RNText testID={'home.notificationInfotooltip.menuText'} style={notificationInfoTooltipStyles.subTitle}>
              {t('home.notificationInfoTooltip.menu')}
            </RNText>
          </RNText>
          <View style={notificationInfoTooltipStyles.notchContainer}>
            <View style={notificationInfoTooltipStyles.notch} />
          </View>
        </>
      }
      popoverPosition={notificationInfoTooltipStyles.popOverPosition}
      visible={visible}
      popoverContainerStyle={notificationInfoTooltipStyles.popoverContainer}
    />
  ) : null;
};
