import { Radio } from '@sydney/motif-components';
import { ComponentProps } from 'react';

import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

export const radioStyles: {
  radio: ComponentProps<typeof Radio>['styles'];
} = {
  radio: {
    itemContainer: {
      borderColor: appColors.lightGray,
      minHeight: 30,
      paddingVertical: 5,
    },
    itemLabel: {
      color: appColors.mediumGray,
      fontFamily: appFonts.semiBold,
      fontSize: 14,
      lineHeight: 22,
    },
    dot: {
      dotInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: appColors.lightPurple,
      },
      dotOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: appColors.lightGray,
      },
    },
  },
};
