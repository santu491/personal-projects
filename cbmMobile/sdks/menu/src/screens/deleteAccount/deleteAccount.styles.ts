import { StyleSheet } from 'react-native';

import { appFonts } from '../../../../../shared/src/context/appFonts';
import { checkboxStyles } from '../../../../../shared/src/overrideStyles/checkbox.styles';
import { drawerStyles } from '../../../../../shared/src/overrideStyles/drawer.styles';
import { appColors } from '../../../../../src/config';

export const deleteAccountStyles = () => {
  return {
    ...checkboxStyles,
    ...drawerStyles,
    ...StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: appColors.white,
      },
      subContainer: {
        marginHorizontal: 20,
        marginVertical: 16,
        paddingVertical: 10,
      },
      buttonContainer: {
        backgroundColor: appColors.white,
      },
      titleText: {
        fontSize: 18,
        paddingVertical: 10,
      },
      dotView: {
        flexDirection: 'row',
      },
      dotStyle: {
        height: 4,
        width: 4,
        borderRadius: 2,
        backgroundColor: appColors.black,
        marginRight: 10,
        alignSelf: 'center',
      },
      dotText: {
        alignSelf: 'center',
        textAlign: 'center',
      },
      headerText: {
        paddingVertical: 18,
      },
      actionButton: {
        borderColor: appColors.white,
        backgroundColor: appColors.lightPurple,
        borderWidth: 1,
        borderRadius: 20,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        marginBottom: 50,
      },
      actionButtonText: {
        color: appColors.white,
        fontSize: 16,
        fontFamily: appFonts.semiBold,
      },
      sheetText: {
        marginTop: 30,
      },
      confirmText: {
        marginTop: 10,
        marginBottom: 30,
      },
      checkBoxUi: { marginLeft: 16, justifyContent: 'center', marginTop: 14 },
      checkBoxView: { flexDirection: 'row' },
      bottomSheetView: {
        marginHorizontal: 40,
      },
      bottomSheetTitleStyle: {
        fontSize: 18,
        fontFamily: appFonts.semiBold,
        padding: 12,
        color: appColors.darkGray,
        textAlign: 'center',
      },
      cancelButtonText: {
        color: appColors.lightPurple,
      },
      cancelButton: {
        backgroundColor: appColors.white,
      },
      drawerButtonText: { color: appColors.white, fontSize: 16, fontFamily: appFonts.semiBold },
      drawerActionButton: {
        borderColor: appColors.lightPurple,
        backgroundColor: appColors.lightPurple,
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 6,
        marginBottom: 10,
        width: 350,
      },
      disableDrawerActionButton: {
        backgroundColor: appColors.lightGray,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        padding: 6,
        marginBottom: 10,
        width: 350,
      },
      disableDrawerButtonText: { color: appColors.white, fontSize: 16, fontFamily: appFonts.semiBold },

      drawerContainer: {
        paddingHorizontal: 20,
      },
      contentView: {
        paddingHorizontal: 14,
      },
      titleView: {
        borderBottomWidth: 1,
        borderBottomColor: appColors.paleGray,
      },
    }),
  };
};
