import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { checkboxStyles } from '../../../../../shared/src/overrideStyles/checkbox.styles';

export const otpStyles = () => {
  return {
    ...checkboxStyles,
    ...StyleSheet.create({
      checkMarkButtonStyle: {
        marginTop: 5,
      },
      linkButtonStyle: {
        color: appColors.lightPurple,
        fontFamily: appFonts.semiBold,
        fontSize: 14,
        lineHeight: 20,
        textDecorationColor: appColors.lightPurple,
        textDecorationLine: 'underline',
      },
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
        padding: 20,
      },
      rememberMeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 20,
        paddingRight: 10,
      },
      textContainerStyle: {
        justifyContent: 'flex-start',
        marginLeft: 10,
      },
      textStyle: {
        fontFamily: appFonts.medium,
        fontSize: 14,
        fontWeight: '500',
        textAlignVertical: 'bottom',
      },
      errorViewContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 20,
        borderColor: appColors.white,
        borderWidth: 0,
        borderRadius: 0,
        paddingHorizontal: 0,
      },
      errorViewLabel: {
        color: appColors.darkRed,
        fontSize: 14,
        lineHeight: 22,
        fontFamily: appFonts.medium,
        paddingLeft: 10,
        textAlignVertical: 'top',
        paddingTop: 0,
      },
    }),
  };
};
