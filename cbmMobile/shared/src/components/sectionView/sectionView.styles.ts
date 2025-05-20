import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';

export const styles = StyleSheet.create({
  sectionViewStyle: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: appColors.lightGray,
    paddingVertical: 20,
    flexDirection: 'column',
    marginBottom: 25,
    marginHorizontal: 15,
    marginTop: 30,
  },
  headerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  innerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerTitleStyle: {
    textAlign: 'left',
    color: appColors.darkGray,
    fontSize: 16,
    fontFamily: appFonts.medium,
    lineHeight: 24,
  },
  subTitleStyle: {
    textAlign: 'left',
    color: appColors.lightDarkGray,
    fontSize: 14,
    fontFamily: appFonts.regular,
    lineHeight: 22,
    marginTop: 8,
  },
  lineViewStyle: {
    backgroundColor: appColors.paleGray,
    height: 1,
    width: '100%',
    marginTop: 10,
  },

  descTitle: {
    fontSize: 14,
    fontFamily: appFonts.regular,
    textAlign: 'left',
    color: appColors.darkGray,
    lineHeight: 20,
    marginTop: 8,
  },

  subTitle: {
    fontSize: 14,
    fontFamily: appFonts.regular,
    textAlign: 'left',
    color: appColors.darkGray,
    lineHeight: 20,
    marginTop: 8,
    marginLeft: 5,
  },
  contactSectionTitle: {
    fontSize: 14,
    fontFamily: appFonts.medium,
    textAlign: 'left',
    color: appColors.darkGray,
    lineHeight: 22,
  },
  additionalDetailsViewStyle: {
    flexDirection: 'column',
  },
  detailsSubViewStyle: {
    flexDirection: 'row',
  },
});
