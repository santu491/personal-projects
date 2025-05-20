import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
export const styles = StyleSheet.create({
  textInput: {
    position: 'relative',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listView: {
    backgroundColor: appColors.white,
    borderRadius: 8,
    borderColor: appColors.paleLavender,
    top: 92,
    position: 'absolute',
    width: '100%',
    borderWidth: 1,
    zIndex: 1,
  },
  dropdownLabel: {
    color: appColors.black,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
});
