import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';
export const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: appColors.darkGray,
    fontFamily: appFonts.regular,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: appColors.darkGray,
    fontFamily: appFonts.regular,
    marginBottom: 24,
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: appColors.lightPurple,
    fontFamily: appFonts.regular,
    textAlign: 'center',
  },
});
