import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';
import { appColors } from '../../../../../src/config';

export const startChatStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
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
      actionButtonText: {
        color: appColors.white,
        fontFamily: appFonts.semiBold,
        fontSize: 16,
      },
      description: {
        marginBottom: 15,
      },
      phoneLink: {
        textAlign: 'left',
      },
    }),
  };
};
