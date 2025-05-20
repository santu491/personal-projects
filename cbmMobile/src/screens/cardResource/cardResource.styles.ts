import { StyleSheet } from 'react-native';

import { appFonts } from '../../../shared/src/context/appFonts';
import { appColors } from '../../config';

export const styles = StyleSheet.create({
  contentContainer: { paddingBottom: 40 },
  container: {
    flex: 1,
    backgroundColor: appColors.white,
    paddingHorizontal: 16,
    paddingTop: 16,

    paddingBottom: 100,
  },
  imageOnLoading: {
    height: 0,
  },
  h1: {
    lineHeight: 36.4,
  },
  h3: {
    lineHeight: 20.8,
    fontFamily: appFonts.regular,
  },
  loaderView: {
    paddingVertical: 30,
  },

  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 175,
    borderRadius: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  bannerContainer: {
    paddingBottom: 10,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  bannerTitle: {
    paddingBottom: 16,
    paddingTop: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22.4,
    color: appColors.darkGray,
    fontFamily: appFonts.regular,
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
    marginBottom: 7,
  },
  contactView: {
    paddingTop: 13,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: appColors.purple,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 15,
    marginBottom: 24,
  },
  contactDetails: { flex: 1 },
  contactTitle: {
    paddingBottom: 16,
  },

  telephoneIcon: {
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 7,
  },
  number: {
    color: appColors.purple,
    textDecorationLine: 'underline',
  },

  getHelpCases: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 8,
  },
  getHelpCasesImage: {
    height: 18.75,
    width: 22.5,
  },
  getHelpCasesDescription: {
    fontSize: 16,
    lineHeight: 21.6,
    color: appColors.darkGray,
    fontFamily: appFonts.regular,
    fontWeight: '500',
    paddingTop: 16,
    marginLeft: 12,
    marginRight: 50,
  },
  exclusiveBenefitsHeader: {
    paddingTop: 24,
  },
  getHelpCasesImageView: {
    backgroundColor: appColors.lighterGray,
    padding: 11,
    borderRadius: 8,
    marginTop: 12,
  },
  exclusiveBenefitsView: {
    flexDirection: 'row',
    backgroundColor: appColors.lighterGray,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  exclusiveBenefitsImage: {
    width: 30,
    height: 30,
    marginRight: 24,
    alignSelf: 'center',
  },
  exclusiveBenefitsTitle: {
    flex: 1,
  },
});
