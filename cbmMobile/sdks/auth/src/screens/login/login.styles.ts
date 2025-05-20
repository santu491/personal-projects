import { Dimensions, StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';
import { dimensionCheck, isAndroid } from '../../../../../src/util/commonUtils';

export const overrideFieldStyles = {
  field: {
    container: {
      marginBottom: 5,
      textAlign: 'center',
    },
  },
};

export const loginStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      backButtonStyle: {
        marginTop: isAndroid() ? 20 : 50,
      },
      titleView: {
        justifyContent: 'center',
        paddingVertical: dimensionCheck() ? 10 : 40,
        alignSelf: 'center',
      },
      logoTitleView: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
      subTitleView: {
        textAlign: 'center',
        marginTop: 5,
      },
      loginInputContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingVertical: 15,
      },
      loginLink: {
        flexDirection: 'row',
        marginTop: 10,
      },
      linkButtonStyle: {
        fontSize: 16,
        fontFamily: appFonts.medium,
        lineHeight: 22,
        color: appColors.lightPurple,
        textDecorationLine: 'underline',
        textDecorationColor: appColors.lightPurple,
      },
      forgotUserNameStyle: {
        fontSize: 14,
        fontFamily: appFonts.semiBold,
        lineHeight: 22,
        color: appColors.lightPurple,
        textDecorationLine: 'underline',
        textDecorationColor: appColors.lightPurple,
      },
      textColorStyle: {
        color: appColors.mediumGray,
      },
      textInputRow: {
        flexDirection: 'column',
        marginTop: 25,
        justifyContent: 'flex-start',
      },
      actionButton: {
        backgroundColor: appColors.lightPurple,
        borderRadius: 24,
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 12,
      },
      buttonDisable: {
        backgroundColor: appColors.lightGray,
      },
      actionButtonText: {
        color: appColors.white,
        fontSize: 16,
        fontFamily: appFonts.semiBold,
      },
      loingAccountRecoveryLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      },
      buildNumber: {
        fontSize: 14,
        fontFamily: appFonts.semiBold,
        lineHeight: 22,
        color: appColors.lightPurple,
        textDecorationLine: 'underline',
        textDecorationColor: appColors.lightPurple,
        marginTop: 30,
      },
      footerButtons: {
        paddingHorizontal: 20,
        marginBottom: isAndroid() ? 30 : 10,
      },
    }),
  };
};
