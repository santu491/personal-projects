import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';

export const styles = StyleSheet.create({
  headerStyle: {
    color: appColors.black,
    marginTop: 20,
  },
  headerSubStyle: {
    color: appColors.purple,
  },
  headerTextStyle: {
    marginTop: 10,
    color: appColors.mediumGray,
  },
});
