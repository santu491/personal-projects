import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  downImageStyle: {
    alignSelf: 'center',
  },
  contactText: {
    fontFamily: appFonts.medium,
    fontSize: 16,
    marginVertical: 8,
    color: appColors.darkGray,
  },
  contactView: { flexDirection: 'row', marginVertical: 3 },
  listTitle: {
    fontSize: 14,
    color: appColors.lightPurple,
    fontFamily: appFonts.regular,
    marginHorizontal: 4,
  },
  text: {
    fontSize: 14,
    color: appColors.lightPurple,
    fontFamily: appFonts.regular,
    marginHorizontal: 4,
  },
  phoneText: {
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
  },
});
