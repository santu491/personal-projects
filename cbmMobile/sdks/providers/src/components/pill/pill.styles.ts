import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    paddingLeft: 9,
    color: appColors.lightPurple,
    textDecorationLine: 'underline',
  },
});
