import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
export const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  title: {
    lineHeight: 30,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    fontWeight: '500',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  contactNo: {
    color: appColors.purple,
  },
});
