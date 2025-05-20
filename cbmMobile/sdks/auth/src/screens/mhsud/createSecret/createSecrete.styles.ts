import { StyleSheet } from 'react-native';

import { fieldStyles } from '../../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../../shared/src/overrideStyles/textInput.styles';
import { appColors } from '../../../../../../src/config';

export const createSecreteStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...StyleSheet.create({
      mainContainer: {
        padding: 16,
      },
      scrollView: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      //   loginLink: {
      //     flexDirection: 'row',
      //     marginTop: 10,
      //     marginBottom: 20,
      //   },
      //   textColorStyle: {
      //     color: appColors.mediumGray,
      //   },
      //   linkButtonStyle: {
      //     fontSize: 16,
      //     fontFamily: appFonts.medium,
      //     lineHeight: 22,
      //     color: appColors.lightPurple,
      //     textDecorationLine: 'underline',
      //     textDecorationColor: appColors.lightPurple,
      //   },
      //   footerButtons: {
      //     paddingHorizontal: 20,
      //   },
      //   subTitleStyle: {
      //     color: appColors.mediumGray,
      //     fontFamily: appFonts.medium,
      //     fontSize: 16,
      //     lineHeight: 22,
      //     marginBottom: 10,
      //   },
    }),
  };
};
