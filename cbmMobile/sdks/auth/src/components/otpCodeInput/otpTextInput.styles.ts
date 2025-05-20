import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  accessory: {
    alignItems: 'flex-end',
    backgroundColor: appColors.lighterGray,
    paddingLeft: 10,
    paddingRight: 10,
  },
  codeInputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 25,
  },
  codeInput: {
    borderColor: appColors.lightDarkGray,
    borderRadius: 8,
    borderWidth: 1,
    color: appColors.darkGray,
    fontFamily: appFonts.medium,
    fontSize: 16,
    height: 48,
    textAlign: 'center',
    width: 40,
  },
});
