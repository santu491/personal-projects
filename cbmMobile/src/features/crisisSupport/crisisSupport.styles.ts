import { StyleSheet } from 'react-native';

import { appFonts } from '../../../shared/src/context/appFonts';
import { appColors } from '../../config';

export const crisisStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  titleDescription: {
    fontWeight: '500',
    fontFamily: appFonts.medium,
    fontSize: 16,
    color: appColors.darkGray,
  },
  listContainer: {
    marginBottom: 140,
    paddingHorizontal: 20,
  },
  sectionListStyle: {
    marginTop: 20,
    backgroundColor: appColors.white,
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
});
