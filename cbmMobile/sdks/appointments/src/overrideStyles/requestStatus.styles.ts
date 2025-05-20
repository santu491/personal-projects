import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../shared/src/context/appFonts';
import { appColors } from '../../../../src/config';

export const requestStatusStyles = StyleSheet.create({
  pending: {
    backgroundColor: appColors.paleYellow,
  },
  approved: {
    backgroundColor: appColors.paleTurquoise,
  },
  rejected: {
    backgroundColor: appColors.paleRed,
  },
  pendingTextStyle: {
    color: appColors.black,
  },
  approvedTextStyle: {
    color: appColors.black,
  },
  rejectedTextStyle: {
    color: appColors.white,
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
  },
});
