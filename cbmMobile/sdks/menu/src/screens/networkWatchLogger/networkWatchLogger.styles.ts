import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const networkWatchLoggerStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: appColors.lightPurple,
  },
});
