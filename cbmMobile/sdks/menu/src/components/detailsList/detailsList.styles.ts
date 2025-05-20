import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const detailsListStyles = StyleSheet.create({
  container: {
    height: 'auto',
    borderColor: appColors.lightGray,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: appColors.white,
    marginHorizontal: 20,
    paddingBottom: 20,
    marginTop: 30,
  },
  label: {
    fontFamily: appFonts.semiBold,
    lineHeight: 20,
    fontSize: 16,
    width: '40%',
    color: appColors.black,
  },
  value: {
    lineHeight: 20,
    fontSize: 16,
    width: '60%',
    paddingLeft: 10,
  },
  itemSeparatorStyle: {
    height: 0.8,
    marginHorizontal: 14,
    backgroundColor: appColors.lightGray,
    marginVertical: 4,
  },
  flexStyle: { flex: 1, backgroundColor: appColors.white },
  cardStyle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 18,
  },
  title: {
    fontSize: 20,
    color: appColors.purple,
    marginVertical: 20,
    marginHorizontal: 16,
  },
});
