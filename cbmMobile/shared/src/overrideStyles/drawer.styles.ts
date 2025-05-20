import { Drawer } from '@sydney/motif-components';
import { ComponentProps } from 'react';

import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

export const drawerStyles: {
  drawer: ComponentProps<typeof Drawer>['styles'];
} = {
  drawer: {
    scrollContentContainer: {
      paddingHorizontal: 0,
    },
    drawerHeader: {
      container: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginLeft: -15,
      },
      headerText: {
        fontWeight: '600',
        color: appColors.darkGray,
        textAlign: 'center',
        marginRight: 35,
        fontFamily: appFonts.semiBold,
      },
    },
    childComponentsStyles: {
      drawerCloseButton: {
        closeIcon: {
          color: appColors.darkGray,
        },
      },
    },
  },
};
