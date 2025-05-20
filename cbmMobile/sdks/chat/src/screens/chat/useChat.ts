import { StackActions } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import WebView from 'react-native-webview';

import { isIOS } from '../../../../../src/util/commonUtils';
import { useChatContext } from '../../context/chat.sdkContext';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const { chatConfig, navigation, loggedIn } = useChatContext();
  const webViewRef = useRef<WebView>(null);

  const navigateBack = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage('clearMsg');
    }
    if (loggedIn) {
      navigation.goBack();
    } else {
      navigation.dispatch(StackActions.popToTop());
      navigation.dispatch(StackActions.popToTop());
    }
  }, [loggedIn, navigation]);

  useEffect(() => {
    const backAction = () => {
      navigateBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigateBack]);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    if (event.nativeEvent.data === 'back') {
      navigateBack();
    }
  };

  const listener = isIOS() ? 'window' : 'document';
  const injectedJavaScript = `
    ${listener}.addEventListener('message', function(event) {
      if (event.data === 'clearMsg') {
        Genesys("command", "Messenger.clear", () => {
          console.log('Chat cleared');
        });
      }
    });
  `;

  return {
    loading,
    setLoading,
    chatConfig,
    handleMessage,
    navigateBack,
    webViewRef,
    injectedJavaScript,
  };
};
