import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const modelStyles = StyleSheet.create({
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  bottomContent: {
    fontFamily: appFonts.regular,
    color: appColors.darkGray,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  borderedContainer: {
    borderColor: appColors.shadowGrey,
    borderWidth: 1,
    shadowColor: appColors.lightGray,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    padding: 24,
    backgroundColor: appColors.white,
    borderRadius: 10,
    flexGrow: 1,
  },
  subBenefitTitle: {
    fontSize: 20,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
    color: appColors.darkGray,
    paddingBottom: 20,
  },
  cardPadding: {
    paddingVertical: 10,
  },
});
