/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import HTML from 'react-native-render-html';

import { source } from '../../assets/statementOfUnderstanding';
import { MainHeaderComponent } from '../mainHeader/mainHeaderComponent';
import { statementOfUnderstandingStyles } from './statementOfUnderstanding.styles';

export const StatementOfUnderstandingScreen = () => {
  const { width } = useWindowDimensions();

  return (
    <>
      <MainHeaderComponent />
      <View style={statementOfUnderstandingStyles.topViewStyle}>
        <ScrollView style={statementOfUnderstandingStyles.scrollViewStyle}>
          <HTML contentWidth={width} source={source} />
        </ScrollView>
      </View>
    </>
  );
};
