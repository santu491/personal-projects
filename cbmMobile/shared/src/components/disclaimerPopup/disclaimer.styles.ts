import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const styles = StyleSheet.create({
  descriptionStyle: {
    color: appColors.lightDarkGray,
    fontSize: 14,
    fontFamily: appFonts.medium,
    lineHeight: 20,
  },
  learnLinkStyle: {
    color: appColors.lightPurple,
    fontSize: 14,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
    fontFamily: appFonts.semiBold,
  },
  transparentViewStyle: {
    flex: 1,
    backgroundColor: appColors.thickGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelBackgroundStyle: {
    backgroundColor: appColors.gray,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    flex: 1,
    backgroundColor: appColors.white,
    marginHorizontal: 30,
    marginVertical: 75,
    borderRadius: 8,
  },
  headerContainerStyle: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderBottomColor: appColors.paleGray,
    borderBottomWidth: 1,
  },
  titleStyle: {
    fontSize: 18,
    fontFamily: appFonts.semiBold,
    padding: 20,
    color: appColors.darkGray,
  },
  copyRightsDesriptionViewStyle: {
    flex: 0.75,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  disclaimerBottomContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  disclaimerOkButtonStyle: {
    backgroundColor: appColors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    width: 180,
    height: 44,
  },
  disclaimerOkButtonText: {
    color: appColors.lightPurple,
    fontSize: 18,
    fontFamily: appFonts.semiBold,
  },
  closeView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 20,
    width: 24,
    height: 24,
  },
  closeImage: {
    flex: 1,
    resizeMode: 'contain',
    width: 24,
    height: 24,
  },
  copyRightComponentStyle: {
    marginTop: 25,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: appColors.lightGray,
    borderWidth: 1,
    borderRadius: 24,
  },
  contactUsDescription: {
    fontSize: 16,
    fontFamily: appFonts.medium,
    color: appColors.darkGray,
    textAlign: 'left',
    padding: 10,
  },
});
