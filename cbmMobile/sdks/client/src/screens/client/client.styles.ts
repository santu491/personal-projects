import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { drawerStyles } from '../../../../../shared/src/overrideStyles/drawer.styles';

export const clientStyles = () => {
  return {
    ...drawerStyles,
    ...StyleSheet.create({
      homeViewContainer: {
        flex: 1,
      },
      homeViewMainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
        paddingVertical: 31,
        paddingHorizontal: 18,
      },
      homeViewText: {
        fontSize: 24,
      },
      backgroundView: {
        width: '100%',
        zIndex: 1,
        flex: 1,
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        overflow: 'hidden',
        borderRadius: 20,
        marginBottom: 20,
      },
      headerStyle: {
        color: appColors.darkGray,
        lineHeight: 24,
      },
      headerSubStyle: {
        color: appColors.purple,
      },
      descriptionStyle: {
        marginTop: 10,
        color: appColors.mediumGray,
      },
      messageStyle: {
        fontSize: 16,
        marginTop: 10,
        lineHeight: 22.4,
        fontFamily: appFonts.medium,
        color: appColors.mediumGray,
        paddingRight: 50,
      },
      scrollViewStyle: {
        paddingBottom: 200,
      },
    }),
  };
};
