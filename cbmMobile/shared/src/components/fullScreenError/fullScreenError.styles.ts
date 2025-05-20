import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: appColors.white,
    alignContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 30,
    paddingHorizontal: 30,
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
    margin: 20,
  },
  actionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    lineHeight: 26,
    alignContent: 'center',
    alignSelf: 'center',
  },
  assistancePhoneTextStyle: {
    color: appColors.lightPurple,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: appFonts.medium,
    fontSize: 17,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
  },
});
