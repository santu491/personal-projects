import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';
import { isIOS } from '../../../../../src/util/commonUtils';

const PROFILE_IMAGE_SIZE = 46;

export const menuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
    paddingTop: 20,
  },
  menu: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSeparatorStyle: {
    borderBottomColor: appColors.mediumDarkGray,
    borderBottomWidth: 1,
  },
  iconMain: {
    flexDirection: 'row',
    flex: 0.96,
  },
  signText: {
    alignSelf: 'center',
    fontSize: 18,
    marginLeft: 6,
    color: appColors.lightPurple,
  },
  signOutText: {
    textDecorationLine: 'underline',
  },
  menuTitle: {
    textAlign: 'center',
  },
  actionButton: {
    borderColor: appColors.lightPurple,
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: '35%',
    marginVertical: 20,
  },
  actionButtonText: {
    color: appColors.lightPurple,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
  },
  flexStyle: { flex: 1 },
  menuHeader: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: isIOS() ? 70 : 35,
    justifyContent: 'center',
  },
  circle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 46,
    height: 46,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: appColors.lightPurple,
  },
  text: {
    fontFamily: appFonts.semiBold,
    fontSize: PROFILE_IMAGE_SIZE / 2.5,
    color: appColors.white,
    lineHeight: PROFILE_IMAGE_SIZE / 2,
  },
  version: {
    alignSelf: 'center',
    color: appColors.lightPurple,
    paddingBottom: 5,
    marginTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderColor: appColors.transparent,
  },
  headerContainer: {
    alignItems: 'flex-start',
    backgroundColor: appColors.white,
    paddingVertical: 10,
  },
  icon: {
    color: appColors.lightPurple,
    width: 14,
    height: 14,
  },
  headerTextContainer: {
    marginHorizontal: 10,
    width: 200,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: 10,
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
  primaryButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
  },
  primaryButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
  },
});
