import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const modelStyles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 26,
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
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 20,
  },
  imageStyle: {
    width: '80%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontFamily: appFonts.semiBold,
    lineHeight: 24,
    textAlign: 'center',
    color: appColors.darkGray,
    marginBottom: 20,
  },
  message: {
    fontFamily: appFonts.medium,
    color: appColors.darkGray,
    fontSize: 16,
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
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

  previousButton: {
    borderColor: appColors.lightPurple,
    borderRadius: 24,
    borderWidth: 0,
    padding: 15,
    width: '40%',
    backgroundColor: appColors.white,
    marginTop: 10,
  },
  signInButton: {
    borderWidth: 2,
    width: '80%',
    marginBottom: 24,
    marginTop: 12,
  },
  previousButtonText: {
    color: appColors.lightPurple,
    fontFamily: appFonts.semiBold,
    fontSize: 16,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderRadius: 24,
    padding: 15,
    width: '80%',
  },
  actionButtonText: {
    color: appColors.white,
    fontFamily: appFonts.semiBold,
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
