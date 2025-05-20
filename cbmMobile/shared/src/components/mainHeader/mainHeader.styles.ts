import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';

export const styles = StyleSheet.create({
  headerMainView: {
    backgroundColor: appColors.white,
    marginBottom: 2,
    shadowColor: appColors.backgroundGray,
    shadowRadius: 0.5,
    elevation: 5,
  },
});
