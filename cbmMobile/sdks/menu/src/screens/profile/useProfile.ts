import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

import { useMenuContext } from '../../context/menu.sdkContext';
import { Menu } from '../../models/menu';

export const useProfile = () => {
  const { navigation, navigationHandler, userProfileData } = useMenuContext();

  const onPressLeftArrow = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
    const backAction = (): boolean => {
      onPressLeftArrow();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation, navigationHandler, onPressLeftArrow]);

  const navigateToDetailsPage = (item: Menu) => {
    item.onPress?.();
  };

  return {
    userProfileData,
    navigateToDetailsPage,
    onPressLeftArrow,
  };
};
