import { NavigationProp, ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';

export type WithNavigation<NavProp extends NavigationProp<ParamListBase>, T> = T & {
  navigation: NavProp;
};

export interface BackHandlerNavigation {
  canGoBack: () => boolean;
  goBack: () => void;
}

export function useWithNavigation<NavProp extends NavigationProp<ParamListBase>, T extends object>(
  data: T
): WithNavigation<NavProp, T> {
  const navigation = useNavigation<NavProp>();
  useBackHandler(navigation);
  return React.useMemo(
    () => ({
      ...data,
      navigation,
    }),
    [data, navigation]
  );
}

export const useBackHandler = (navigation: BackHandlerNavigation) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    const backAction = (): boolean => {
      if (!navigation.canGoBack()) {
        return false; // Allow default back behavior if no screens to go back to
      }
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation, isFocused]);
};
