import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';

export const styles = StyleSheet.create({
  headerMainView: {
    backgroundColor: appColors.white,
    elevation: 5,
    justifyContent: 'center',
    paddingBottom: 10,
    marginBottom: 2,
    shadowOpacity: 0.1,
    shadowColor: appColors.lightGray,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  authHeader: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  itemStyle: {
    borderRadius: 8,
    height: 10,
    marginHorizontal: 5,
  },
  progressViewStyle: {
    flexDirection: 'row',
  },
});
