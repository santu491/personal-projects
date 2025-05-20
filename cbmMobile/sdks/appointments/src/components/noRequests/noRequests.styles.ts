import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: appColors.white,
    alignContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 60,
    fontWeight: '600',
    color: appColors.darkGray,
    lineHeight: 32,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
    paddingVertical: 15,
  },
  searchIconView: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 25,
    fontWeight: '500',
    color: appColors.darkGray,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: appFonts.medium,
    paddingVertical: 15,
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  actionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    lineHeight: 26,
    alignContent: 'center',
    alignSelf: 'center',
  },
});
