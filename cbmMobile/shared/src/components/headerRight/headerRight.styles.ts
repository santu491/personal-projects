import { Dimensions, StyleSheet } from 'react-native';

import { isIOS } from '../../../../src/util/commonUtils';
import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
const { width } = Dimensions.get('window');
console.log('xxx device width:', width);

export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: isIOS() ? 20 : width === 360 ? 10 : 5,
    paddingTop: isIOS() ? 8 : width === 360 ? 15 : 8,
  },
  loginTextStye: {
    color: appColors.darkGray,
    fontFamily: appFonts.semiBold,
    fontSize: 14,
    textAlign: 'left',
  },
  headerSearchIconStyle: { marginLeft: 10, width: 20, height: 20 },
  iconStyle: {
    width: 24,
    height: 24,
    marginTop: isIOS() ? -5 : 10,
  },
});
