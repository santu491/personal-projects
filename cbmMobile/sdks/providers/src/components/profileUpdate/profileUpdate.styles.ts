import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { checkboxStyles } from '../../../../../shared/src/overrideStyles/checkbox.styles';
import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';

export const profileUpdateStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...checkboxStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      description: {
        marginVertical: 15,
        fontSize: 16,
      },
      infoLabel: {
        fontSize: 16,
      },
      continue: {
        width: '100%',
        paddingHorizontal: 20,
        marginVertical: 20,
      },
      secondaryButton: {
        backgroundColor: appColors.white,
        borderColor: appColors.lightPurple,
        borderWidth: 1,
      },
      secondaryButtonTextStyle: {
        color: appColors.lightPurple,
      },
      primary: {
        marginBottom: 10,
      },
      title: {
        fontSize: 26,
        fontWeight: '600',
        fontFamily: appFonts.semiBold,
        lineHeight: 32,
        color: appColors.darkGray,
      },
      name: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: appFonts.semiBold,
        lineHeight: 18,
        color: appColors.darkGray,
        marginLeft: 8,
        marginVertical: 3,
      },
      nameContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15,
      },
      checkboxContainer: {
        flex: 1,
        flexDirection: 'row',
      },
      optionLabel: {
        fontSize: 16,
        marginLeft: 10,
        marginVertical: 4,
      },
      optionsContainer: {
        marginVertical: 10,
      },
    }),
  };
};
