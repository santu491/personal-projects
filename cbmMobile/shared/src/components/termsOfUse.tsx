/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import HTML from 'react-native-render-html';

import { source } from '../assets/termsOfUseText';
import { appColors } from '../context/appColors';
import { MainHeaderComponent } from './mainHeader/mainHeaderComponent';

export const TermsOfUseScreen = () => {
  const { width } = useWindowDimensions();

  return (
    <>
      <MainHeaderComponent hideLogin={true} />
      <View style={styles.privacyTopViewStyle}>
        <ScrollView style={styles.privacyScrollViewStyle}>
          <HTML contentWidth={width} source={source} />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  privacyScrollViewStyle: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  privacyTopViewStyle: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  bottomBarStyle: {
    height: 25,
    backgroundColor: appColors.purple,
  },
});
