import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';
export const profileDetailsPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  buttonContainer: {
    backgroundColor: appColors.white,
  },
  actionButton: {
    borderColor: appColors.lightPurple,
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    marginBottom: 50,
  },
  actionButtonText: {
    color: appColors.lightPurple,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
  },
});
