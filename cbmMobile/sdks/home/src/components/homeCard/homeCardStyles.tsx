import { Dimensions, StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

const { width } = Dimensions.get('window');

export const homeCardStyles = StyleSheet.create({
  loaderView: {
    position: 'absolute',
    top: '40%',
    left: '45%',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCard: {
    padding: 12,
    backgroundColor: appColors.white,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  featuredTitle: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: appColors.darkGray,
    paddingBottom: 8,
  },
  featuredDescription: {
    fontFamily: appFonts.regular,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    color: appColors.darkGray,
    paddingBottom: 8,
  },
  link: {
    fontWeight: '600',
    color: appColors.lightPurple,
    paddingBottom: 8,
    paddingRight: 8,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: appColors.lightGray,
  },
  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    paddingBottom: 8,
  },

  backgroundImage: {
    height: 267,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 5,
  },
  providerImage: {
    width: '100%',
    height: 172,
    borderRadius: 16,
  },
  imageBorder: {
    borderRadius: 20,
  },
  actionButton: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 20,
    padding: 6,
    width: width * 0.6,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 200,
  },
  learnMoreButton: {
    backgroundColor: appColors.white,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 7,
    marginTop: 20,
    marginHorizontal: 24,
  },
  actionButtonText: {
    color: appColors.lightPurple,
    fontSize: 18,
    fontFamily: appFonts.semiBold,
    lineHeight: 26,
    alignContent: 'center',
    alignSelf: 'center',
    fontWeight: 600,
  },
  searchButtonTextColor: {
    color: appColors.white,
  },
  subHeaderDescStyle: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: appFonts.medium,
    color: appColors.mediumGray,
    marginHorizontal: 20,
  },

  featureView: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  titleStyle: {
    fontFamily: appFonts.semiBold,
    fontWeight: 600,
    color: appColors.darkGray,
    fontSize: 18,
    marginTop: 2,
    lineHeight: 24,
  },
  titleTextStyle: {
    fontFamily: appFonts.semiBold,
    color: appColors.black,
    marginHorizontal: 16,
  },
  courseText: {
    fontFamily: appFonts.semiBold,
    color: appColors.black,
    marginVertical: 15,
  },
  allServicesStyle: {
    color: appColors.lightPurple,
    fontFamily: appFonts.semiBold,
    marginRight: 10,
  },
  card: {
    backgroundColor: appColors.paleGray,
    borderRadius: 20,
  },
  serviceCard: {
    backgroundColor: appColors.white,
    borderRadius: 8,
    width: 180,
    flexGrow: 1,
  },
  resourseCard: {
    backgroundColor: appColors.white,
    borderRadius: 8,
    width: 232,
    flexDirection: 'row',
  },
  courseContentView: {
    marginBottom: 20,
    paddingBottom: 20,
  },
  contentDesc: {
    fontFamily: appFonts.medium,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 500,
    color: appColors.mediumGray,
    height: 80,
  },
  lineViewStyle: {
    backgroundColor: appColors.lineGray,
    height: 1,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  contentType: {
    lineHeight: 20,
    fontSize: 18,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  counselorTitle: {
    fontFamily: appFonts.semiBold,
    color: appColors.mediumGray,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
  },
  criticalTitle: {
    fontFamily: appFonts.semiBold,
    color: appColors.mediumGray,
    marginBottom: 8,
    fontSize: 24,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: appFonts.medium,
    color: appColors.darkGray,
  },
  subView: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  patientsView: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: appColors.lighterGray,
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  credibleMindView: {
    minHeight: 1000,
    maxHeight: 1500,
  },
  featuredLabel: {
    marginVertical: 20,
  },
  featuredView: {
    marginHorizontal: 15,
  },
  courseImageView: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 10,
  },
  criticalView: {
    paddingHorizontal: 16,
    borderRadius: 20,
    paddingTop: 18,
  },
  criticalSubContainer: {
    backgroundColor: appColors.white,
    borderRadius: 20,
    padding: 20,
  },
  criticalEventDescription: {
    color: appColors.mediumGray,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: appFonts.medium,
    lineHeight: 22,
  },
  criticalEventSupportNumber: {
    color: appColors.lightPurple,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: appFonts.medium,
    lineHeight: 22,
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: appColors.lineGray,
    marginVertical: 16,
  },
  cardContainer: {
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 66,
  },
  homeCardContent: {
    paddingHorizontal: 0,
  },
  criticalEvent: {
    backgroundColor: appColors.veryLightGray,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  providerSearchButton: {
    marginTop: 16,
  },
  iconStyle: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    marginTop: 16,
  },
  iconView: {
    position: 'absolute',
    bottom: 2,
    right: 16,
    marginBottom: 16,
  },
  resourcesImageStyle: {
    width: 246,
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  resourceCardContent: {
    width: '70%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  serviceTitle: {
    paddingTop: 22,
    fontWeight: '600',
    fontSize: 20,
  },
  viewBackground: {
    backgroundColor: appColors.lightPurple,
  },
  tagsView: {
    marginHorizontal: 4,
  },
});
