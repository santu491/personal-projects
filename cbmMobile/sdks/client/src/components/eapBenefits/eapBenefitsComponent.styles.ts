import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: appColors.white,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomInnerContainer: {
    backgroundColor: appColors.white,
    width: '100%',
    height: '40%',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 2,
    borderColor: appColors.lightGray,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  skipTitle: {
    color: appColors.purple,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  title: {
    color: appColors.purple,
    fontSize: 24,
    fontWeight: 600,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  description: {
    color: appColors.darkGray,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: appFonts.medium,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 24,
    marginHorizontal: 50,
  },
  actionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    lineHeight: 26,
    alignContent: 'center',
    alignSelf: 'center',
  },
  skipButton: {
    marginTop: 64,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.lightPurple,
    borderRadius: 24,
    paddingVertical: 9,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: appColors.white,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    paddingRight: 5,
  },
});
