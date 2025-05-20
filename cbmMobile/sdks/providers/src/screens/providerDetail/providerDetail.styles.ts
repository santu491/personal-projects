import { Dimensions, StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { isAndroid } from '../../../../../src/util/commonUtils';

const { width, height } = Dimensions.get('window');
export const providerDetailsStyles = () => {
  return {
    drawer: {
      scrollContentContainer: {
        paddingHorizontal: 15,
      },
    },
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      screenContainer: {
        paddingVertical: 15,
        paddingTop: 15,
        flex: 1,
        marginBottom: isAndroid() ? 170 : 200,
      },
      scrollViewContainer: {
        paddingBottom: '70%',
      },

      toolTipIcon: {
        marginLeft: 4,
      },
      tooltipLabel: {
        color: appColors.white,
      },

      contactLabelView: {
        flexDirection: 'row',
        marginBottom: 16,
      },
      contactIcon: {
        paddingRight: 8,
        marginTop: 2,
      },
      contactDescription: {
        fontSize: 16,
      },
      link: {
        color: appColors.purple,
      },
      preferredView: {
        flexDirection: 'row',
        backgroundColor: appColors.paleGray,
        maxWidth: 103,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 8,
      },
      preferredLabel: {
        fontSize: 16,
        lineHeight: 16,
        paddingLeft: 4,
      },
      profileStyle: {
        flex: 6,
        marginRight: 6,
      },
      sectionView: {
        borderTopWidth: 1,
        borderTopColor: appColors.lighterGray,
        paddingRight: 50,
      },
      sectionTitle: {
        fontSize: 18,
        lineHeight: 24,
        marginVertical: 16,
      },
      titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      title: {
        fontSize: 14,
        lineHeight: 16,
      },
      description: {
        fontSize: 16,
        marginBottom: 16,
      },
      descriptionView: {
        flexDirection: 'row',
      },
      circle: {
        width: 6,
        height: 6,
        borderRadius: 100,
        backgroundColor: appColors.turquoise,
        marginTop: 6,
        marginRight: 12,
      },
      cardContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 16,
        padding: 16,
        borderColor: appColors.lightGray,
        marginTop: 24,
      },
      toolTipView: {
        position: 'absolute',
      },
      toolTipContainer: {
        width: 170,
        position: 'relative',
        backgroundColor: appColors.purple,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        zIndex: 100,
      },
      tooltipContent: {
        maxHeight: 111,
        paddingHorizontal: 8,
      },
      contactDetailsTitle: {
        fontSize: 16,
        fontFamily: appFonts.medium,
        textAlign: 'left',
        color: appColors.darkGray,
        lineHeight: 22,
        marginBottom: 10,
      },

      contactDetailsView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 15,
      },
      websiteView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      descTitle: {
        fontSize: 14,
        fontFamily: appFonts.regular,
        textAlign: 'left',
        color: appColors.darkGray,
        lineHeight: 20,
        marginBottom: 5,
        paddingHorizontal: 5,
      },
      requestAppointView: {
        marginVertical: 15,
        borderTopWidth: 1,
        borderTopColor: appColors.lighterGray,
        paddingTop: 15,
      },
      actionButton: {
        backgroundColor: appColors.white,
        borderColor: appColors.lightPurple,
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        height: 44,
      },
      actionButtonText: {
        color: appColors.lightPurple,
        fontSize: 18,
        fontFamily: appFonts.semiBold,
      },
      saveProviderButton: {
        backgroundColor: appColors.white,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 13,
        width: width * 0.6,
        height: 44,
        justifyContent: 'center',
        borderColor: appColors.lightPurple,
        borderWidth: 1,
      },
      saveProviderButtonText: {
        color: appColors.lightPurple,
        fontSize: 16,
        fontFamily: appFonts.semiBold,
      },
      profileView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 10,
        flexDirection: 'column',
        marginHorizontal: 15,
      },
      cardView: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: appColors.paleGray,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 25,
        flexDirection: 'column',
        marginHorizontal: 15,
        backgroundColor: appColors.lighterGray,
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 30,
      },

      subView: {
        flexDirection: 'row',
        marginVertical: 8,
        flexWrap: 'wrap',
      },

      patientsView: {
        paddingHorizontal: 7,
        borderColor: appColors.lighterGray,
        borderWidth: 1,
        borderRadius: 4,
        marginRight: 8,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
        flexDirection: 'row',
      },
      contactText: {
        fontFamily: appFonts.medium,
        fontSize: 16,
        marginVertical: 10,
        color: appColors.darkGray,
      },

      cardTitle: {
        color: appColors.darkGray,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '400',
        marginLeft: 5,
      },
      imageStyle: {
        width: width * 0.06,
        height: height * 0.02,
        resizeMode: 'contain',
        left: '-12%',
      },
      showMoreButtonStyle: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        marginLeft: 'auto',
        paddingTop: 10,
      },
      showMoreTextStyle: {
        color: appColors.purple,
        textAlign: 'right',
        fontSize: 16,
        fontFamily: appFonts.semiBold,
      },
      profileViewStyle: {
        paddingLeft: 10,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      },
      servicesViewStyle: {
        flexDirection: 'row',
      },
      disclaimerView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginHorizontal: 15,
        paddingHorizontal: 20,
        marginBottom: 50,
      },
      disclaimerTextStyle: {
        textAlign: 'left',
        color: appColors.darkGray,
        fontSize: 14,
        lineHeight: 22,
        fontFamily: appFonts.regular,
      },
      privacyPolicyTextStyle: {
        textAlign: 'left',
        color: appColors.purple,
        fontSize: 14,
        lineHeight: 22,
        fontFamily: appFonts.regular,
      },
      actionButtonDisabled: {
        backgroundColor: appColors.lineGray,
        borderColor: appColors.paleGray,
      },
    }),
  };
};
