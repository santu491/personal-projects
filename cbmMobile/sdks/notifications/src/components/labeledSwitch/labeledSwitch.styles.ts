import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';

export const notificationStyles = StyleSheet.create({
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
  switchView: {
    justifyContent: 'flex-end',
    position: 'relative',
    marginLeft: 'auto',
  },
  switchStyle: {
    borderColor: appColors.purple,
    borderWidth: 1,
  },
});
