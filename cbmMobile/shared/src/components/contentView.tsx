import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Linking, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

import { appStyles } from '../context/appStyles';
import { callNumber } from '../utils/utils';

interface ContentViewProps {
  source: string;
  testID?: string;
}

export const ContentView: React.FC<ContentViewProps> = ({ source, testID }) => {
  const [key, setKey] = useState(Date.now());
  const [webUrl, setWebUrl] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const ref = useRef(null);

  useEffect(() => {
    if (isFocused) {
      setKey(Date.now());
      setWebUrl(source);
    }
  }, [source, webUrl, isFocused]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const onShouldStartLoadWithRequest = (request: WebViewNavigation) => {
    const reqUrlCheck = request.url.split(':')[1];
    if (request.url.startsWith('tel:')) {
      callNumber(reqUrlCheck);
      return false;
    } else if (request.url.startsWith('sms:')) {
      const url = `sms:${reqUrlCheck}`;
      Linking.openURL(url);
      return false;
    }
    return true;
  };

  return (
    <View style={appStyles.container}>
      <WebView
        ref={ref}
        key={key}
        originWhitelist={['*']}
        source={{ uri: webUrl }}
        containerStyle={appStyles.webContainer}
        testID={testID}
        cacheEnabled={true} // to active the cache
        cacheMode={'LOAD_CACHE_ELSE_NETWORK'} // type of cache you want
        androidLayerType="hardware"
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures
        onShouldStartLoadWithRequest={(request) => {
          return onShouldStartLoadWithRequest(request);
        }}
      />
    </View>
  );
};
