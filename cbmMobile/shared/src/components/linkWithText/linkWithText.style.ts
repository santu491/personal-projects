import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const linkWithTextStyles = StyleSheet.create({
  textColorStyle: {
    color: appColors.mediumGray,
  },
  linkButtonStyle: {
    fontFamily: appFonts.semiBold,
    fontSize: 16,
    color: appColors.purple,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
  },
  higlightColor: {
    backgroundColor: appColors.white,
  },
});
