import CMEmbeddable from '@crediblemind/embeddable-react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import Config from 'react-native-config';
import WebView from 'react-native-webview';

import { usePushNotification } from '../../../src/hooks/usePushNotification';
import { MainHeaderComponent } from './mainHeader/mainHeaderComponent';

/**
 * CredibleMind Component
 *
 * This component renders the CredibleMind embeddable widget along with a main header.
 * It uses the `useRoute` hook to get the navigation parameters and passes them to the
 * CMEmbeddable component.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const CredibleMindComponent = ({ url }: { url: string }): JSX.Element => {
  const embeddableRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);

  useEffect(() => {
    setWebViewKey((prevKey) => prevKey + 1);
  }, [url]);

  const { clearPushNotificationPayload } = usePushNotification({
    onPermissionsGrantedUpdate: () => {},
  });

  const handleBackPress = () => {
    if (canGoBack) {
      embeddableRef.current?.goBack();
    } else {
      clearPushNotificationPayload();
      navigation.goBack();
    }
  };
  const handleNavigationStateChange = (navState: { canGoBack: boolean }) => {
    setCanGoBack(navState.canGoBack);
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} onPressLeftArrow={handleBackPress} />
      <CMEmbeddable
        ref={embeddableRef}
        key={webViewKey}
        clientIdentifier={Config.CREDIBLEMIND_CLIENT_IDENTIFIER || ''}
        onNavigationStateChange={handleNavigationStateChange}
        env={Config.CREDIBLEMIND_ENVIRONMENT || ''}
        components={url}
      />
    </>
  );
};
