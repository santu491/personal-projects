import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
import { drawerStyles } from '../../overrideStyles/drawer.styles';

export const immediateAssistanceStyles = () => {
  return {
    ...drawerStyles,
    ...StyleSheet.create({
      bottomSheetTitleStyle: {
        fontSize: 18,
        fontFamily: appFonts.semiBold,
        textAlign: 'center',
        fontWeight: '600',
        color: appColors.darkGray,
      },
      descriptionContainer: {
        paddingHorizontal: 22,
        paddingVertical: 24,
      },
      content: {
        paddingHorizontal: 15,
      },
      contactInfoView: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        paddingRight: 14,
      },
      horizontalLine: {
        borderBottomColor: appColors.lightGray,
        borderBottomWidth: 1,
        marginLeft: 40,
        marginRight: 20,
      },
      contactUsDescription: {
        fontSize: 17,
        fontFamily: appFonts.medium,
        color: appColors.black,
        textAlign: 'left',
        paddingVertical: 10,
        lineHeight: 24,
        marginBottom: 0,
        fontWeight: '500',
      },
      assistancePhoneTextStyle: {
        color: appColors.lightPurple,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: appFonts.medium,
        fontSize: 17,
        textDecorationLine: 'underline',
        textDecorationColor: appColors.lightPurple,
      },
      assistanceMainView: {
        backgroundColor: appColors.lightPurple,
        marginTop: 10,
      },
      immediateAssistanceComponentStyle: {
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      immediateAssistanceTextStyle: {
        color: appColors.white,
        fontFamily: appFonts.medium,
        fontSize: 14,
        lineHeight: 16,
        textDecorationLine: 'underline',
      },
      headerContainer: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderBottomColor: appColors.paleGray,
        borderBottomWidth: 1,
      },
      titleStyle: {
        fontSize: 18,
        fontFamily: appFonts.semiBold,
        padding: 20,
        color: appColors.darkGray,
      },
      actionButton: {
        backgroundColor: appColors.lightPurple,
        borderColor: appColors.lightPurple,
        borderWidth: 2,
        borderRadius: 24,
        paddingHorizontal: 30,
        marginTop: 15,
      },
      actionButtonText: {
        color: appColors.white,
        fontSize: 16,
        fontFamily: appFonts.semiBold,
        lineHeight: 26,
        alignContent: 'center',
        alignSelf: 'center',
      },
      iconPadding: {
        paddingTop: 5,
      },
    }),
  };
};
