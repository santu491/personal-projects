import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: appColors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashParentContainer: {
    paddingHorizontal: 24,
    flex: 1,
    backgroundColor: appColors.purple,
  },

  logoContainer: {
    marginBottom: 15,
  },

  splashText: {
    fontSize: 32,
    color: appColors.white,
    textAlign: 'center',
    paddingTop: 20,
  },
  actionButton: {
    backgroundColor: appColors.white,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 24,
    paddingVertical: 9,
    alignSelf: 'center',
    paddingHorizontal: 45,
    marginTop: 30,
    width: '70%',
  },
  actionButtonText: {
    color: appColors.lightPurple,
    fontSize: 18,
    fontFamily: appFonts.semiBold,
    lineHeight: 26,
  },
  footer: {
    paddingBottom: 20,
  },
});
