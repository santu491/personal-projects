import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../../shared/src/context/appFonts';
import { textInputStyles } from '../../../../../../shared/src/overrideStyles/textInput.styles';
import { appColors } from '../../../../../../src/config';

export const loginMhsudStyles = () => {
  return {
    ...textInputStyles,
    ...StyleSheet.create({
      description: {
        fontSize: 16,
        fontFamily: appFonts.regular,
        color: appColors.darkGray,
        lineHeight: 22,
        fontWeight: '500',
        marginVertical: 16,
        paddingRight: 10,
      },
      scrollView: {
        backgroundColor: appColors.white,
      },
      container: {
        paddingHorizontal: 16,
      },
      labelView: {
        flexDirection: 'row',
        marginBottom: 8,
        justifyContent: 'space-between',
        marginTop: 14,
      },
      required: {
        color: appColors.requiredRed,
      },
      forgotEmail: {
        fontSize: 14,
        fontFamily: appFonts.regular,
        color: appColors.lightPurple,
        fontWeight: '400',
        lineHeight: 20,
      },
      actionButton: {
        marginTop: 22,
        marginBottom: 45,
      },
      link: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: appFonts.regular,
        color: appColors.lightPurple,
        fontWeight: '600',
        lineHeight: 22,
      },
      buttonDisable: {
        backgroundColor: appColors.paleGray,
      },
      buttonTextDisable: {
        color: appColors.lightDarkGray,
      },
      actionButtonText: {
        fontSize: 18,
        lineHeight: 26,
        fontFamily: appFonts.regular,
        fontWeight: '600',
      },
    }),
  };
};
