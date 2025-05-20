import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const accountRecoveryStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: appColors.white,
    flex: 1,
  },
  screenContainer: {
    paddingBottom: 110,
    paddingHorizontal: 20,
  },
  titleView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: appColors.lighterGray,
  },
  title: {
    lineHeight: 26,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '500',
  },
});
