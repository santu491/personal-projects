import { useCallback, useEffect, useState } from 'react';

import { useHomeContext } from '../../context/home.sdkContext';
import { Screen } from '../../navigation/home.navigationTypes';

export const useLanding = () => {
  const [showDrawer, setShowDrawer] = useState(true);
  const homeContext = useHomeContext();

  const { navigation, navigationHandler } = homeContext;

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const onPressContinueAsGuest = useCallback(() => {
    navigation.navigate(Screen.HOME);
  }, [navigation]);

  const navigateToLogin = () => {
    //created placeholder for login
  };

  const navigateToSignUp = () => {
    //created placeholder for signup
  };

  const onRequestClose = () => {
    setShowDrawer(false);
  };

  return {
    onPressContinueAsGuest,
    navigateToLogin,
    navigateToSignUp,
    onRequestClose,
    showDrawer,
  };
};
