import { Dimensions, StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  topToBottomText: {
    color: appColors.white,
    fontFamily: appFonts.regular,
    fontWeight: '600',
    paddingEnd: 10,
  },
  topToBottom: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: appColors.darkPurple,
    backgroundColor: appColors.darkPurple,
    borderWidth: 2,
    borderRadius: 20,
    elevation: 2,
    marginBottom: 5,
    padding: 8,
    shadowColor: appColors.black,
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    width: width * 0.5,
  },
});
