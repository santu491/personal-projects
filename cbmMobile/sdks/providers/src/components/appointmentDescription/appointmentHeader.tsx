import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

interface AppointmentDescriptionProps {
  description: string;
  descriptionStyle?: StyleProp<TextStyle>;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const AppointmentHeader = (props: AppointmentDescriptionProps) => {
  const { title, description, titleStyle, descriptionStyle } = props;
  return (
    <View style={styles.container}>
      <H1 style={[styles.title, titleStyle]}>{title}</H1>
      <H3 style={[styles.description, descriptionStyle]}>{description}</H3>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingBottom: 23,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.paleGray,
  },
  title: {
    lineHeight: 24,
    paddingBottom: 25,
  },
  description: {
    fontFamily: appFonts.regular,
    lineHeight: 22.4,
    fontSize: 16,
  },
});
