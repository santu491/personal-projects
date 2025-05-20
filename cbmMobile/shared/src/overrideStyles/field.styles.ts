/* eslint-disable @typescript-eslint/naming-convention */
import { Field } from '@sydney/motif-components';
import { ComponentProps } from 'react';

import { ErrorIndicatorIcon } from '../assets/icons/icons';
import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

export const fieldStyles: {
  field: ComponentProps<typeof Field>['styles'];
} = {
  field: {
    label: {
      color: appColors.mediumGray,
      fontFamily: appFonts.semiBold,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'left',
    },
    fieldError: {
      label: {
        color: appColors.error,
        fontFamily: appFonts.medium,
        fontSize: 14,
        marginLeft: 3,
      },
      icon: {
        height: 14,
        width: 14,
        color: appColors.error,
      },
      container: {
        justifyContent: 'center',
      },
      ErrorIcon: ErrorIndicatorIcon,
    },
    validationDropdown: {
      text: {
        color: appColors.lightDarkGray,
        fontFamily: appFonts.medium,
        fontSize: 14,
        marginLeft: 10,
      },
      inputEmptyIcon: {
        marginRight: 5,
      },
      invalid: {
        color: appColors.error,
      },
      invalidIcon: {
        color: appColors.error,
      },
      inputEmpty: {
        color: appColors.lightDarkGray,
      },
      icon: {
        width: 14,
        height: 14,
        marginRight: 0,
      },
      CancelIcon: ErrorIndicatorIcon,
    },
  },
};
