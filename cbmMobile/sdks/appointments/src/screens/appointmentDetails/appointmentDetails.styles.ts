import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../src/config';

export const appointmentDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  listContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
  },
  itemSeparatorStyle: {
    borderBottomColor: appColors.lighterGray,
    borderBottomWidth: 2,
  },

  titleStyle: {
    color: appColors.purple,
    fontWeight: '600',
    fontSize: 28,
    marginVertical: 22,
    marginHorizontal: 20,
  },
});
