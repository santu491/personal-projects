import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../../shared/src/context/appFonts';
import { checkboxStyles } from '../../../../../../shared/src/overrideStyles/checkbox.styles';
import { fieldStyles } from '../../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../../shared/src/overrideStyles/textInput.styles';
import { appColors } from '../../../../../../src/config';

export const createAccountStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...checkboxStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
        paddingBottom: 80,
      },
      innerContainer: {
        padding: 16,
      },
      inputLabel: {
        fontWeight: '500',
        fontFamily: appFonts.regular,
        fontSize: 16,
        lineHeight: 20,
      },
      inputText: {
        fontFamily: appFonts.regular,
        fontWeight: '500',
        fontSize: 16,
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
      memberIdInfo: {
        color: appColors.mediumGray,
        fontFamily: appFonts.regular,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
      },
      label: {
        fontSize: 24,
        fontFamily: appFonts.medium,
        lineHeight: 24,
        color: appColors.darkGray,
        fontWeight: '600',
        paddingBottom: 21,
        paddingLeft: 16,
      },
      labelView: {
        borderBottomWidth: 1,
        borderBottomColor: appColors.paleGray,
        marginTop: 16,
      },
      notificationContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        top: -14,
      },
      receiveNotificationsLabel: {
        paddingLeft: 8,
        fontSize: 16,
        fontFamily: appFonts.regular,
        lineHeight: 22,
        color: appColors.darkGray,
        fontWeight: '500',
      },
      buttonDisable: {
        backgroundColor: appColors.paleGray,
      },
      actionButtonText: {
        fontSize: 18,
      },
      buttonTextDisable: {
        color: appColors.lightDarkGray,
      },
      checkBoxContainer: {
        flexDirection: 'row',
        marginBottom: 28,
        alignItems: 'center',
      },
      checkBoxLabel: {
        paddingLeft: 8,
        fontSize: 16,
        fontFamily: appFonts.regular,
        lineHeight: 22,
        color: appColors.darkGray,
        fontWeight: '500',
      },
      required: {
        color: appColors.requiredRed,
      },
      description: {
        fontFamily: appFonts.regular,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
      },
      disclaimer: {
        fontWeight: 600,
        paddingTop: 25,
        marginBottom: 16,
      },
      healthInfo: {
        borderTopWidth: 1,
        paddingTop: 16,
        borderTopColor: appColors.paleGray,
      },
    }),
  };
};
