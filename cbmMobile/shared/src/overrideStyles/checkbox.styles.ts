import { CheckBox } from '@sydney/motif-components';
import { ComponentProps } from 'react';

import { appColors } from '../context/appColors';

export const checkboxStyles: {
  checkbox: ComponentProps<typeof CheckBox>['styles'];
  roundCheckbox: ComponentProps<typeof CheckBox>['styles'];
} = {
  checkbox: {
    container: {
      marginTop: 3,
      width: 20,
      height: 20,
      borderColor: appColors.gray,
      backgroundColor: appColors.white,
    },
    icon: {
      color: appColors.lightPurple,
    },
    checked: {
      container: {
        borderColor: appColors.lightPurple,
        backgroundColor: appColors.white,
      },
    },
  },
  roundCheckbox: {
    container: {
      marginTop: 3,
      width: 22,
      height: 22,
      borderRadius: 4, // Make the checkbox round
      borderColor: appColors.lightPurple,
      backgroundColor: appColors.white,
    },
    icon: {
      color: appColors.white,
    },

    checked: {
      container: {
        borderColor: appColors.lightPurple,
        backgroundColor: appColors.lightPurple,
      },
    },
  },
};
