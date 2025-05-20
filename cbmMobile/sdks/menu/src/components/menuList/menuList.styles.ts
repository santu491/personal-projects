import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const menuListStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    lineHeight: 26,
    fontSize: 16,
    flex: 0.97,
  },
  flexStyle: { flex: 1 },
  line: {
    height: 1,
    backgroundColor: appColors.mediumLightGray,
  },
});
