import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../shared/src/context/appFonts';
import { appColors } from '../../../../src/config';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: appColors.white,
    alignContent: 'center',
    flex: 1,
  },
  searchIconView: {
    alignSelf: 'center',
    paddingVertical: 15,
  },
  description: {
    fontSize: 14,
    paddingHorizontal: 25,
    fontWeight: '500',
    color: appColors.darkGray,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: appFonts.medium,
    paddingVertical: 15,
  },
  assistance: {
    paddingVertical: 5,
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
  homeButtonView: {
    flex: 1,
    justifyContent: 'flex-end',
    bottom: 100,
  },
});
