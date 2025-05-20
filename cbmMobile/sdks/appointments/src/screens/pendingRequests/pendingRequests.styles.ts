import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const requestStyles = StyleSheet.create({
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
    color: appColors.mediumGray,
    fontWeight: '600',
    fontSize: 28,
    marginVertical: 22,
    marginHorizontal: 20,
  },
  listStyle: {
    marginTop: 20,
  },
  continueActionButton: {
    backgroundColor: appColors.lightPurple,
    borderRadius: 24,
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 15,
  },
  continueActionButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: appFonts.semiBold,
    textAlign: 'center',
  },
  linkButtonTitle: {
    fontSize: 14,
    fontFamily: appFonts.medium,
    lineHeight: 22,
    color: appColors.lightPurple,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
    alignSelf: 'center',
  },
});
