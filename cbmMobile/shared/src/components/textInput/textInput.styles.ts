import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const styles = StyleSheet.create({
  leftIcon: { marginLeft: 10 },
  rightIcon: { marginRight: 10 },
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
  container: { height: 46, width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    borderWidth: 1,
    borderColor: appColors.lightGray,
    flexDirection: 'row',
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: appColors.white,
  },
  input: {
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    fontSize: 16,
    color: appColors.darkGray,
    fontFamily: appFonts.medium,
    fontWeight: '500',
    width: '93%',
    flex: 1,
    textAlignVertical: 'center',
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
