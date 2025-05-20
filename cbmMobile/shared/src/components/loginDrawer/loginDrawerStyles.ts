import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const modelStyles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 16,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: appColors.paleGray,
  },
  bottomSheetTitleStyle: {
    fontSize: 24,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
    color: appColors.darkGray,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
  },

  message: {
    fontFamily: appFonts.medium,
    color: appColors.darkGray,
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 20,
    marginBottom: 24,
  },

  bottomContent: {
    fontFamily: appFonts.medium,
    color: appColors.darkGray,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  link: {
    color: appColors.lightPurple,
    fontWeight: '600',
  },

  createAccountButton: {
    borderColor: appColors.lightPurple,
    backgroundColor: appColors.white,
    borderWidth: 2,
    width: '100%',
    marginBottom: 24,
    marginTop: 12,
  },

  createAccountButtonText: {
    color: appColors.lightPurple,
    fontFamily: appFonts.semiBold,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: appColors.lightPurple,
    borderRadius: 24,
    padding: 15,
    width: '100%',
  },
  loginButtonText: {
    color: appColors.white,
    fontFamily: appFonts.semiBold,
    fontSize: 18,
    textAlign: 'center',
  },
});
