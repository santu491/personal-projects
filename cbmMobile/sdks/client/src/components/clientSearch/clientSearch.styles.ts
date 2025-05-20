import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const inputStyles = StyleSheet.create({
  container: {
    marginTop: 19,
    paddingBottom: 20,
    borderRadius: 24,
    backgroundColor: appColors.white,
    shadowColor: appColors.shadowBlack,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20, // Elevation for Android
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  innerView: {
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: appFonts.medium,
    lineHeight: 22,
    color: appColors.mediumGray,
    paddingVertical: 16,
  },
  textInputStyle: {
    bottom: 5,
  },
  errorViewContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: appColors.white,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  errorViewLabel: {
    color: appColors.darkRed,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: appFonts.medium,
    paddingLeft: 10,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  suggestionsListContainer: {
    marginLeft: '-10%',
    width: '112%',
    backgroundColor: appColors.white,
    borderWidth: 0,
  },
  tabSuggestionsListContainer: {
    marginLeft: '-5%',
    width: '106%',
    backgroundColor: appColors.white,
    borderWidth: 0,
  },
  border: {
    borderWidth: 1,
  },
  image: {
    height: 222,
    width: '100%',
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },
});
