import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const menuCellStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    lineHeight: 20,
    fontSize: 14,
    flex: 1,
    marginLeft: 10,
    fontWeight: '500',
    fontFamily: appFonts.regular,
    color: appColors.veryDarkGray,
    textTransform: 'none',
    letterSpacing: 0,
  },
  flexStyle: { flex: 1 },
  extraMargin: {
    marginLeft: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: appFonts.regular,
    lineHeight: 22,
    color: appColors.darkGray,
    textTransform: 'none',
    letterSpacing: 0,
  },
});
