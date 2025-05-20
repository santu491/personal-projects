import { Dimensions, StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

const height = Dimensions.get('window').height;

export const notificationInfoTooltipStyles = StyleSheet.create({
  popoverContainer: {
    position: 'absolute',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    width: '65%',
    backgroundColor: appColors.white,
  },
  closeIconView: {
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 10,
    alignSelf: 'flex-end',
    right: 15,
    zIndex: 10,
  },
  title: {
    color: appColors.purple,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: appFonts.semiBold,
    textAlign: 'left',
  },
  subTitle: {
    color: appColors.darkGray,
    fontSize: 14,
    fontWeight: 400,
    fontFamily: appFonts.regular,
    textAlign: 'left',
    marginTop: 10,
    lineHeight: 22,
  },
  account: {
    color: appColors.darkGray,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: appFonts.semiBold,
    textAlign: 'left',
    lineHeight: 22,
  },
  notchContainer: {
    position: 'absolute',
    bottom: 0,
    left: '95%',
    width: 0,
    height: 0,
    overflow: 'visible',
  },
  notch: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: appColors.white,
    borderRightWidth: 10,
    borderRightColor: appColors.transparent,
    borderLeftWidth: 10,
    borderLeftColor: appColors.transparent,
  },
  popOverPosition: { top: height - 245, right: 15 },
});
