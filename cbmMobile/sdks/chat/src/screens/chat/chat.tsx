import React, { useEffect } from 'react';
import { Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import WebView from 'react-native-webview';

import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { API_HOST } from '../../../../../src/config';
import { styles } from './chat.styles';
import { useChat } from './useChat';

export const Chat = () => {
  const { chatConfig, handleMessage, navigateBack, webViewRef, injectedJavaScript } = useChat();

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript('document.activeElement.blur();');
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [webViewRef]);

  if (!chatConfig) {
    return null; // or handle the undefined case appropriately
  }

  const { environment, url, deploymentId, key } = chatConfig;
  const uri = `${API_HOST}/chat.html?deploymentId=${deploymentId}&sessionId=${key}&env=${environment}&libUrl=${encodeURIComponent(url)}`;

  return (
    <>
      <MainHeaderComponent leftArrow={true} onPressLeftArrow={navigateBack} />
      <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer} enableOnAndroid={true}>
        <WebView
          style={styles.chatBottom}
          originWhitelist={['*']}
          source={{ uri }}
          javaScriptEnabled={true}
          scalesPageToFit
          cacheEnabled={false}
          onMessage={handleMessage}
          ref={webViewRef}
          injectedJavaScript={injectedJavaScript}
        />
      </KeyboardAwareScrollView>
    </>
  );
};
