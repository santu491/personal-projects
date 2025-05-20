import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: appColors.lightPurple,
    borderRadius: 24,
    marginTop: 12,
    padding: 12,
    width: '100%',
  },
  actionButtonText: {
    color: appColors.white,
    fontFamily: appFonts.semiBold,
    fontSize: 16,
  },
  buttonDisable: {
    backgroundColor: appColors.lightGray,
  },
  buttonsViewStyle: {
    alignSelf: 'center',
    backgroundColor: appColors.white,
    bottom: 0,
    paddingBottom: 30,
    paddingTop: 10,
    position: 'absolute',
    width: '100%',
  },
  previousButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: appColors.lightPurple,
    borderRadius: 24,
    backgroundColor: appColors.white,
    borderWidth: 1,
    padding: 12,
    width: '100%',
  },
  previousButtonText: {
    color: appColors.lightPurple,
    fontFamily: appFonts.semiBold,
    fontSize: 16,
  },
  subTitleStyle: {
    fontFamily: appFonts.medium,
    fontSize: 14,
    lineHeight: 16,
    marginTop: 20,
  },
  titleStyle: {
    color: appColors.purple,
    lineHeight: 30,
  },
});
