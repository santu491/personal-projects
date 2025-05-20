import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: appColors.white,
    borderRadius: 8,
    elevation: 5,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 3,
  },
  menuItem: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
  },
  menuText: {
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: appColors.darkGray,
    marginLeft: 5,
  },
});
