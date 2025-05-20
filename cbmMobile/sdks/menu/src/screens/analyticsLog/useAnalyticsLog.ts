import { Assurance } from '@adobe/react-native-aepassurance';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { useMenuContext } from '../../context/menu.sdkContext';

export const useAnalyticsLog = () => {
  const [sessionURL, setSessionURL] = useState<string>('');
  const { navigation } = useMenuContext();

  const onPressLeftArrow = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSessionURLChange = (analyticsURL: string) => {
    setSessionURL(analyticsURL);
  };

  const onStartAnalyticsSessionButtonPress = () => {
    try {
      if (sessionURL.trim() !== '') {
        Assurance.startSession(sessionURL);
        navigation.goBack();
      } else {
        Alert.alert('Session URL is empty', 'Please enter session URL');
      }
    } catch (error) {
      console.debug(`Failed to start analytics session : ${error}`);
    }
  };
  return {
    onStartAnalyticsSessionButtonPress,
    onSessionURLChange,
    sessionURL,
    onPressLeftArrow,
  };
};
