import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const modelStyles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderBottomColor: appColors.paleGray,
  },
  bottomSheetTitleStyle: {
    fontSize: 24,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
    color: appColors.darkGray,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  message: {
    fontFamily: appFonts.medium,
    color: appColors.darkGray,
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  link: {
    color: appColors.lightPurple,
    fontWeight: '600',
  },
  bottomTitleContent: {
    marginTop: 15,
  },
  bottomContent: {
    fontFamily: appFonts.regular,
    color: appColors.darkGray,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
