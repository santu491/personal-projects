import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
  hoursView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  hoursTitle: {
    marginVertical: 8,
    fontWeight: '600',
    fontSize: 18,
    color: appColors.darkGray,
  },
  downImageStyle: {
    alignSelf: 'center',
  },
  hoursExpandViewStyle: {
    marginTop: 10,
  },
  hoursUnavailable: {
    marginBottom: 4,
  },
});
