import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { appColors } from '../../../../../src/config';

export const exploreMoreResourcesStyles = StyleSheet.create({
  exploreContainer: {
    flex: 1,
    backgroundColor: appColors.white,
    paddingHorizontal: 15,
  },
  exploreTitle: {
    fontFamily: appFonts.bold,
    fontSize: 24,
    paddingTop: 20,
  },
  exploreSubTitle: {
    paddingTop: 6,
  },
});
