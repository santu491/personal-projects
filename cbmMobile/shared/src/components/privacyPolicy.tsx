import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

import { source } from '../assets/privacyPolicyText';
import { appColors } from '../context/appColors';
import { MainHeaderComponent } from './mainHeader/mainHeaderComponent';

export const PrivacyPolicyScreen = () => {
  const handleNavigation = (event: WebViewNavigation) => {
    if (event.url.startsWith('mailto:') || event.url.startsWith('http') || event.url.startsWith('https')) {
      Linking.openURL(event.url);
      return false;
    }
    return true;
  };

  return (
    <>
      <MainHeaderComponent hideLogin={true} />
      <View style={styles.privacyTopViewStyle}>
        <WebView
          originWhitelist={['*']}
          source={{ html: source.html }}
          style={styles.bottomBarStyle}
          onShouldStartLoadWithRequest={handleNavigation}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  privacyTopViewStyle: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  bottomBarStyle: {
    marginBottom: 20,
  },
});
