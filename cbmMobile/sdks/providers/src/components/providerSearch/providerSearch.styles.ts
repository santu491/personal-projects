import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { isIOS } from '../../../../../src/util/commonUtils';
export const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.lightGray,
    zIndex: 1,
  },
  selectContainer: {
    flex: 1,
  },
  productTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.lightGray,
    borderRadius: 8,
    paddingLeft: 10,
  },

  accessoryIcon: {
    marginTop: 4,
  },
  accessoryIconWithGray: {
    color: appColors.gray,
  },
  input: {
    fontFamily: appFonts.medium,
    fontSize: 16,
    fontWeight: '500',
    borderRadius: 6,
    borderWidth: 0,
    borderBottomWidth: 0,
    paddingTop: 12,
    marginBottom: isIOS() ? -5 : 5,
    maxWidth: '95%',
  },
  dropdownView: {
    marginBottom: 12,
  },
  autoComplete: {
    paddingTop: 16,
    zIndex: 1,
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderRadius: 24,
    paddingHorizontal: 50,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 23,
    paddingVertical: 7,
    width: '100%',
  },
  actionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    lineHeight: 26,
  },
  buttonTextDisable: {
    color: appColors.lightDarkGray,
    fontFamily: appFonts.semiBold,
  },
  buttonDisable: {
    backgroundColor: appColors.paleGray,
  },
  dropdownContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownButton: {
    width: '45%',
  },
  tabSuggestionsListContainer: {
    marginLeft: '-4%',
    width: '105%',
  },
  label: {
    fontFamily: appFonts.medium,
    fontSize: 16,
    color: appColors.darkGray,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 4,
  },
  mandatory: {
    color: appColors.red,
  },
  errorMessage: {
    color: appColors.darkRed,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: appFonts.medium,
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 21,
  },
  sortView: {
    flexDirection: 'row',
  },
  mapButton: {
    marginLeft: 20,
  },
  inputView: {
    borderRadius: 8,
  },
  mapIcon: {
    paddingLeft: 4,
  },
});
