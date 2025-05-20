import { Button } from '@sydney/motif-components';
import { ComponentProps } from 'react';

import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

export const buttonStyles: {
  button: ComponentProps<typeof Button>['styles'];
} = {
  button: {
    container: {
      backgroundColor: appColors.white,
      borderColor: appColors.purple,
    },
    text: {
      fontFamily: appFonts.semiBold,
      fontSize: 16,
      color: appColors.purple,
    },
  },
};
