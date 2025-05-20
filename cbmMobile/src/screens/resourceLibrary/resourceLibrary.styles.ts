import { StyleSheet } from 'react-native';

import { appFonts } from '../../../shared/src/context/appFonts';
import { appColors } from '../../config';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  h1: {
    lineHeight: 36.4,
  },
  card: {
    backgroundColor: appColors.paleGray,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  contentDesc: {
    fontFamily: appFonts.medium,
    marginVertical: 10,
  },
  titleStyle: {
    fontFamily: appFonts.semiBold,
    color: appColors.black,
    fontSize: 18,
    marginTop: 2,
    lineHeight: 24,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: appColors.lineGray,
    marginVertical: 16,
  },
  subView: {
    flexDirection: 'row',
    marginTop: 4,
    paddingBottom: 8,
    flexWrap: 'wrap',
  },
  patientsView: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: appColors.lighterGray,
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: appFonts.medium,
    color: appColors.darkGray,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  bannerTitle: {
    paddingLeft: 5,
    paddingVertical: 10,
  },
  h3: {
    lineHeight: 20.8,
    fontFamily: appFonts.regular,
    marginBottom: 16,
  },
});
