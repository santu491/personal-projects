import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../shared/src/context/appColors';
import { appFonts } from '../../../../../shared/src/context/appFonts';
import { drawerStyles } from '../../../../../shared/src/overrideStyles/drawer.styles';

export const findCounselorStyles = () => {
  return {
    drawer: {
      ...drawerStyles.drawer,
      scrollContentContainer: {
        paddingHorizontal: 15,
      },
    },
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      container: {
        paddingHorizontal: 16,
      },
      titleView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: 12,
      },
      subtitleView: {
        marginTop: 8,
      },
      description: {
        flexDirection: 'row',
        lineHeight: 20.8,
      },
      providerSearch: { marginTop: 16, zIndex: 1 },
      disclaimerComponentStyle: {
        marginTop: 70,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: appColors.lightGray,
        borderWidth: 1,
        borderRadius: 24,
        alignSelf: 'center',
      },
      disclaimerText: {
        color: appColors.lightPurple,
        fontSize: 16,
        textDecorationColor: appColors.lightPurple,
        fontFamily: appFonts.semiBold,
        marginTop: -3,
        marginRight: 5,
      },
      disclaimerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
      },
    }),
  };
};
