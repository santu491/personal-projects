import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';

export const personalDetailsStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
        paddingBottom: 80, // this is to matain the footer buttons at the bottom of the screen
      },
      loginLink: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
      },
      textColorStyle: {
        color: appColors.mediumGray,
      },
      linkButtonStyle: {
        fontSize: 16,
        fontFamily: appFonts.medium,
        lineHeight: 22,
        color: appColors.lightPurple,
        textDecorationLine: 'underline',
        textDecorationColor: appColors.lightPurple,
      },
      footerButtons: {
        paddingHorizontal: 20,
      },
      subTitleStyle: {
        color: appColors.mediumGray,
        fontFamily: appFonts.medium,
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 10,
      },
    }),
  };
};
