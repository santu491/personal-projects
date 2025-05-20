import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    borderBottomColor: appColors.paleGray,
    borderBottomWidth: 1,
  },
  bottomSheetTitleStyle: {
    fontSize: 18,
    fontFamily: appFonts.semiBold,
    color: appColors.darkGray,
    paddingBottom: 22,
  },
  descriptionContainer: {
    paddingBottom: 22,
  },
  bottomContainer: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    borderBottomColor: appColors.paleGray,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textStyle: {
    color: appColors.darkGray,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: appFonts.medium,
    textAlign: 'left',
  },
  selectedTextStyle: {
    color: appColors.darkGray,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: appFonts.semiBold,
    textAlign: 'left',
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderRadius: 24,
    paddingHorizontal: 50,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 7,
  },
  actionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.regular,
    fontWeight: '600',
    lineHeight: 26,
  },
  buttonDisable: {
    backgroundColor: appColors.lightGray,
  },
});
