import { CommonActions, Route, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

import { BACK_TO_PREVIOUS_PARAM } from '../../../shared/src/models';

export function useBackToPrevious() {
  const navigation = useNavigation();
  const route = useRoute<Route<string, { [BACK_TO_PREVIOUS_PARAM]?: string } | undefined>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (
        !route.params?.[BACK_TO_PREVIOUS_PARAM] ||
        e.data.action.type === 'REPLACE' ||
        e.data.action.type === 'RESET'
      ) {
        return;
      }
      unsubscribe(); // don't trigger preventDefault multiple times

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // pop current/nested stack(s) to top
      navigation.dispatch(StackActions.popToTop());
      navigation.dispatch(StackActions.popToTop());
      // instruct tab navigator to goBack as well
      navigation.dispatch(CommonActions.goBack());
    });

    return unsubscribe;
  }, [navigation, route]);
}
