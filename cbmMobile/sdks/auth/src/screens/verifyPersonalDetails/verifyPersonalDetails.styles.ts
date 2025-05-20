import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';

export const verifyPersonalDetailsStyles = () => {
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
    }),
  };
};
