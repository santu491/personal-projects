import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';

export const homeStyles = StyleSheet.create({
  error: {
    marginHorizontal: 20,
  },
  homeViewContainer: {
    marginBottom: 20,
    flex: 1,
  },
  clientLogoStyle: {
    height: 26,
    width: 180,
    marginLeft: 10,
  },
  titleView: {
    position: 'absolute',
    right: -110,
  },
  containerMargin: {
    marginHorizontal: 8,
  },
  header: {
    paddingRight: 32,
  },
  exploreMoreView: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  exploreMore: {
    color: appColors.lightPurple,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    marginRight: 8,
  },
  rightArrowIcon: {
    paddingTop: 3,
  },
  homeViewMainContainer: {
    backgroundColor: appColors.veryLightGray,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: appFonts.semiBold,
    color: appColors.black,
    fontWeight: '600',
    lineHeight: 26,
  },
  sectionImage: {
    height: 217,
    marginHorizontal: 16,
    borderRadius: 24,
    marginTop: 16,
  },
  exploreMoreTopicsTitle: {
    marginHorizontal: 16,
    paddingVertical: 14,
  },
  exploreMoreTopicsButtonsView: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  trendingTopicsView: {
    backgroundColor: appColors.paleGray,
    marginTop: 21,
    paddingBottom: 23,
  },
  trendingTopicsList: {
    width: 220,
    backgroundColor: appColors.white,
    flexGrow: 1,
    marginRight: 0,
  },
  exploreMoreTopicsList: {
    width: 278,
    backgroundColor: appColors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexGrow: 1,
  },
  tabTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    flexWrap: 'wrap',
    color: appColors.darkGray,
  },
  tabView: {
    marginRight: 8,
    backgroundColor: appColors.white,
    borderColor: appColors.lightPurple,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
  },
  tabViewInactive: {
    backgroundColor: appColors.white,
    borderColor: appColors.lightGray,
    borderWidth: 1,
  },
  tabTextInactive: {
    color: appColors.darkGray,
  },
  backgroundImageStyle: {
    width: 246,
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  tagTextStyle: {
    color: appColors.lightPurple,
    fontSize: 16,
  },
  tagViewStyle: {
    borderWidth: 0,
    backgroundColor: appColors.white,
    paddingLeft: 0,
  },
  rowDirection: {
    flexDirection: 'row',
  },
  sectionTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  viewAll: {
    color: appColors.lightPurple,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    fontFamily: appFonts.regular,
  },
  serviceView: {
    marginHorizontal: 8,
  },
  servicesCardView: {
    marginHorizontal: 8,
  },
  resourceCardView: {
    marginHorizontal: 4,
  },
  resourceView: {
    marginHorizontal: 8,
  },
  providerContainer: {
    marginHorizontal: 16,
  },
  resourceCard: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  exploreMoreTabsView: {
    marginHorizontal: 16,
  },
});
