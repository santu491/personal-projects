import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { drawerStyles } from '../../../../../shared/src/overrideStyles/drawer.styles';

export const providerListStyles = () => {
  return {
    ...drawerStyles,
    ...StyleSheet.create({
      container: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      bottomContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 50,
      },
      actionButtonText: {
        color: appColors.white,
        fontSize: 18,
        fontFamily: appFonts.regular,
      },
      buttonSubText: {
        fontSize: 14,
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: appFonts.regular,
        color: appColors.mediumGray,
        marginTop: 10,
      },
      buttonSubTextNav: {
        color: appColors.lightPurple,
        fontFamily: appFonts.regular,
        fontSize: 14,
      },
      buildStyle: {
        marginTop: 30,
        fontFamily: appFonts.regular,
        color: appColors.mediumGray,
      },
      counselorInputContainer: {
        height: '60%',
        paddingTop: 16,
      },
      counsellorView: {
        flex: 1,
        paddingHorizontal: 20,
      },
      description: {
        fontSize: 16,
        flexDirection: 'row',
        fontFamily: appFonts.regular,
        color: appColors.mediumGray,
      },
      filterButton: {
        backgroundColor: appColors.lightPurple,
        borderColor: appColors.lightPurple,
        alignSelf: 'flex-end',
      },
      filterIcon: {
        width: 24,
        height: 24,
        alignSelf: 'center',
      },
      filterIconView: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignContent: 'center',
        marginLeft: 10,
      },
      flatListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 30,
      },
      flatListContentContainer: {
        paddingBottom: '50%',
      },
      flatListContentContainerWithProvidersSelect: {
        paddingBottom: '140%',
      },
      hr: {
        height: 1,
        backgroundColor: appColors.lighterGray,
        marginTop: 18,
      },
      itemText: {
        fontSize: 15,
        margin: 2,
      },
      listComponentStyle: {
        marginTop: 10,
      },
      loader: {
        alignSelf: 'center',
      },
      loaderViewStyle: {
        marginBottom: 20,
      },
      mainContainer: {
        backgroundColor: appColors.white,
      },
      moreprovidersResultCountText: {
        fontSize: 13,
        fontFamily: appFonts.semiBold,
        color: appColors.white,
      },
      notificationListStyle: {
        backgroundColor: appColors.white,
      },
      providersResultCountText: {
        color: appColors.darkGray,
      },
      resultFound: {
        fontSize: 16,
        fontWeight: '500',
      },
      result: {
        fontSize: 18,
      },
      zeroResultsText: {
        color: appColors.darkRed,
      },
      searchResultsTitle: {
        flexDirection: 'row',
      },
      clearFilter: {
        color: appColors.lightPurple,
      },
      clearFilterContainer: {
        marginTop: 10,
      },
      providerScrollView: {
        backgroundColor: appColors.white,
      },
      searchTitle: {
        fontSize: 24,
        fontFamily: appFonts.semiBold,
        textAlign: 'left',
        color: appColors.darkGray,
      },
      sortView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 20,
      },
      subtitleView: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 8,
        marginVertical: 16,
        justifyContent: 'space-between',
        backgroundColor: appColors.white,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: appColors.lighterGray,
      },
      titleView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      title: {
        color: appColors.darkGray,
        fontFamily: appFonts.regular,
        fontWeight: '600',
        fontSize: 28,
      },
      resultCountView: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
        backgroundColor: appColors.lightPurple,
        borderColor: appColors.lighterGray,
        borderRadius: 12,
        marginRight: 8,
        marginTop: 12,
        marginBottom: 18,
        width: '90%',
        alignSelf: 'center',
      },
      resultText: {
        color: appColors.white,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 23.4,
      },
      clickContinue: {
        fontWeight: '500',
        lineHeight: 18.2,
        color: appColors.white,
        textAlign: 'center',
        paddingTop: 3,
        paddingBottom: 8,
      },
      continueButton: {
        backgroundColor: appColors.lightGray,
      },
      continueButtonText: {
        color: appColors.lightPurple,
        fontSize: 18,
        fontFamily: appFonts.semiBold,
      },
      errorMessage: {
        marginTop: 7,
      },
      providerSearch: {
        marginHorizontal: 20,
        marginTop: 24,
      },
      disableContinueButton: {
        backgroundColor: appColors.white,
        marginTop: 7,
      },
      disableResultCountView: {
        backgroundColor: appColors.lighterGray,
      },
      disableText: {
        color: appColors.placeholderText,
      },
      disableClickContinue: {
        color: appColors.darkGray,
      },
      disableContinueButtonText: {
        color: appColors.white,
      },
      searching: {
        backgroundColor: appColors.darkPurple,
      },
    }),
  };
};
