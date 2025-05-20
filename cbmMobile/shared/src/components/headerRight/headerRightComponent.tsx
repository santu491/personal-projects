import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { HeaderSearchIcon, SignInIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { NotificationsIcon } from '../notificationsIcon';
import { styles } from './headerRight.styles';

interface HeaderRightProps {
  isLogin: boolean;
  isNotifcationIcon: boolean;
  isSearchIcon?: boolean;
  loginTite?: string;
  naviagteToNotifications?: () => void;
  navigateToLogin?: () => void;
  navigateToSearch?: () => void;
  notificationCount?: number | undefined;
}

export const HeaderRightComponent = ({
  isLogin,
  navigateToLogin,
  navigateToSearch,
  naviagteToNotifications,
  notificationCount,
  isNotifcationIcon,
  isSearchIcon = false,
  loginTite,
}: HeaderRightProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.mainContainer}>
      {!isLogin ? (
        <TouchableOpacity
          onPress={navigateToLogin}
          accessibilityLabel={loginTite ?? t('common.signIn')}
          accessibilityRole="button"
          testID={'login-button'}
        >
          <View style={styles.iconStyle}>
            <SignInIcon color={appColors.lightPurple} />
          </View>
        </TouchableOpacity>
      ) : null}
      {isSearchIcon ? (
        <TouchableOpacity
          onPress={navigateToSearch}
          accessibilityLabel="Search"
          accessibilityRole="button"
          testID={'header.search.icon'}
          style={styles.headerSearchIconStyle}
        >
          <HeaderSearchIcon />
        </TouchableOpacity>
      ) : null}

      {isNotifcationIcon ? (
        <NotificationsIcon notificationCount={notificationCount} navigateToNotifications={naviagteToNotifications} />
      ) : null}
    </View>
  );
};
