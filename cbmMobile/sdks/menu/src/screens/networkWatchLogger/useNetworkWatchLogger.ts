import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

import { useMenuContext } from '../../context/menu.sdkContext';

export const useNetworkWatchLogger = () => {
  const { navigation, navigationHandler } = useMenuContext();
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
  }, [navigationHandler, navigation, onPressLeftArrow]);

  return {
    onPressLeftArrow,
  };
};
