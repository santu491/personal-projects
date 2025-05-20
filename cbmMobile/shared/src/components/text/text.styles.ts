import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
export const styles = StyleSheet.create({
  rnText: {
    fontFamily: appFonts.regular,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: appColors.darkGray,
  },
  h1: {
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    fontSize: 28,
    lineHeight: 30,
    color: appColors.darkGray,
  },
  h2: {
    fontFamily: appFonts.medium,
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 32,
    color: appColors.darkGray,
  },
  h3: {
    fontFamily: appFonts.medium,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: appColors.darkGray,
  },
  h4: {
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 14,
    color: appColors.darkGray,
  },
});
