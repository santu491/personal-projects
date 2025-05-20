import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';

export const statementOfUnderstandingStyles = StyleSheet.create({
  scrollViewStyle: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  topViewStyle: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  bottomBarStyle: {
    height: 25,
    backgroundColor: appColors.purple,
  },
});
