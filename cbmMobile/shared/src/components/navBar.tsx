/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageStyle, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { SourceType } from '../../../src/constants/constants';
import { useAppContext } from '../../../src/context/appContext';
import { useBackToPrevious } from '../../../src/navigation/hooks/useBackToPrevious';
import { AppUrl } from '../models';
import { HeaderLeftView } from './headerLeftView';
import { HeaderRightComponent } from './headerRight/headerRightComponent';
import { HeaderTitleView } from './headerTitleView';

export interface NavProps {
  clientLogoStyle?: StyleProp<ImageStyle>;
  hideLogin?: boolean;
  leftArrow?: boolean;
  onPressLeftArrow?: () => void;

  titleView?: StyleProp<ViewStyle>;
}

export const NavBar: React.FC<NavProps> = ({ leftArrow, hideLogin, onPressLeftArrow, clientLogoStyle, titleView }) => {
  const navigation = useNavigation();
  const context = useAppContext();
  const { loggedIn, notificationCount, navigationHandler, client } = context;
  const { t } = useTranslation();

  const navigateToNotificationsScreen = useCallback(() => {
    navigationHandler.linkTo({ action: AppUrl.NOTIFICATIONS });
  }, [navigationHandler]);

  const navigateToLoginScreen = useCallback(() => {
    if (client?.source === SourceType.MHSUD) {
      navigationHandler.linkTo({ action: AppUrl.LOGIN_MHSUD });
    } else {
      navigationHandler.linkTo({ action: AppUrl.LOGIN });
    }
  }, [client?.source, navigationHandler]);

  useBackToPrevious();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateToSearchSreen = () => {};

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightComponent
          isLogin={hideLogin || loggedIn}
          isNotifcationIcon={loggedIn}
          navigateToLogin={navigateToLoginScreen}
          navigateToSearch={navigateToSearchSreen}
          naviagteToNotifications={navigateToNotificationsScreen}
          notificationCount={notificationCount}
          loginTite={t('createAccount.loginButton')}
        />
      ),

      headerLeft: () => <>{leftArrow ? <HeaderLeftView onPressLeftArrow={onPressLeftArrow} /> : null}</>,

      headerTitle: () => (
        <HeaderTitleView
          titleView={[titleView, !leftArrow && styles.titleView]}
          clientLogoStyle={[clientLogoStyle, !leftArrow && styles.clientLogoStyle]}
        />
      ),
      headerTitleAlign: 'center',
    });
  }, [
    navigation,
    loggedIn,
    navigateToLoginScreen,
    navigateToSearchSreen,
    navigateToNotificationsScreen,
    leftArrow,
    notificationCount,
    hideLogin,
    onPressLeftArrow,
    t,
    titleView,
    clientLogoStyle,
  ]);
  return <></>;
};

const styles = StyleSheet.create({
  titleView: {
    position: 'absolute',
    marginRight: 20,
  },
  clientLogoStyle: {
    height: 40,
    width: 180,
  },
});
