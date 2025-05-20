import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
export const styles = StyleSheet.create({
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
  leftIcon: {
    paddingLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.lightGray,
    justifyContent: 'space-between',
  },

  inputContainerStyle: {
    backgroundColor: appColors.white,
    borderRadius: 0,
    marginRight: 4,
  },

  input: {
    flex: 1,
  },

  suggestionsListContainer: {
    backgroundColor: appColors.white,
    marginLeft: '-9%',
    width: '110%',
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.paleLavender,
  },
  suggestionListText: {
    color: appColors.black,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    fontFamily: appFonts.medium,
    margin: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorMessage: {
    paddingLeft: 5,
    lineHeight: 18,
    fontWeight: '500',
    color: appColors.darkRed,
  },
  errorView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
});
