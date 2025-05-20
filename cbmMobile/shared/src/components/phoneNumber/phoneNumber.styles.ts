import { TextInput } from '@sydney/motif-components';
import { ComponentProps } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { appColors } from '../../context/appColors';
import { textInputStyles } from '../../overrideStyles/textInput.styles';

export type PhoneNumberStyles = {
  accessory: ViewStyle;
  fontStyle: ViewStyle;
  textContainer: TextStyle;
  textInput: ComponentProps<typeof TextInput>['styles'];
};

export const phoneNumberStyles: () => PhoneNumberStyles = () => {
  return {
    ...textInputStyles,
    ...StyleSheet.create({
      accessory: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      },
      fontStyle: {
        fontSize: 16,
        color: appColors.lightDarkGray,
        paddingHorizontal: 5,
      },
      textContainer: {
        height: 25,
        width: 40,
        borderRightWidth: 1,
        borderColor: appColors.lightGray,
        marginRight: 10,
      },
    }),
  };
};
