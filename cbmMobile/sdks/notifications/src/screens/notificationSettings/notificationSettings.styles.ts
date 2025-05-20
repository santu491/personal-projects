import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const notificationStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: appColors.white,
    flex: 1,
  },
  screenContainer: {
    paddingBottom: 110,
    paddingHorizontal: 20,
  },
});
