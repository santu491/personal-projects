import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';
export const styles = StyleSheet.create({
  title: {
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: appColors.veryPaleGray,
  },
  table: {
    borderLeftWidth: 1,
    borderRightWidth: 1,

    borderColor: appColors.veryPaleGray,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  headerCell: {
    paddingRight: 8,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: appFonts.regular,
  },
  cell: {
    paddingRight: 8,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: appFonts.regular,
  },
  cell1: {
    flex: 2,
  },
  cell2: {
    flex: 1,
  },
  cell3: {
    flex: 3,
  },
  header: {
    backgroundColor: appColors.veryPaleGray,
    padding: 8,
  },
  body: {
    borderBottomWidth: 1,
    borderColor: appColors.veryPaleGray,
    padding: 8,
  },
});
