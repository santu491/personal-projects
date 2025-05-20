import { StyleSheet } from 'react-native';

import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';
import { appColors } from '../../../../../src/config';

export const phoneNumberStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      screenContainer: {
        paddingBottom: 110,
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      footerButtons: {
        paddingHorizontal: 20,
      },
    }),
  };
};
