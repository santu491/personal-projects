import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';
import { H3, RNText } from './text/text';

export interface PhoneNumberLinkProps {
  phoneNumberTapped: () => void;
  text: string;
  textStyles?: StyleProp<TextStyle>;
}

export const PhoneNumberLink = ({ text, phoneNumberTapped, textStyles }: PhoneNumberLinkProps) => {
  const phoneRegex = /(\d{3}-?\d{3}-?\d{4})/;
  const parts = text.split(phoneRegex);

  return (
    <View style={styles.container}>
      <RNText style={[styles.description, textStyles]}>
        {parts.map((part) => {
          if (phoneRegex.test(part)) {
            return (
              <H3
                key={part}
                style={styles.phoneLink}
                onPress={() => {
                  phoneNumberTapped();
                }}
              >
                {part}
              </H3>
            );
          }
          return <RNText key={part}>{part}</RNText>;
        })}
      </RNText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    textAlign: 'center',
  },
  phoneLink: {
    color: appColors.lightPurple,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: appFonts.medium,
    fontSize: 17,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
  },
});
