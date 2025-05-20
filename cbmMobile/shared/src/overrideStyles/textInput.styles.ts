import { TextInput } from '@sydney/motif-components';
import { ComponentProps } from 'react';

import { isIOS } from '../../../src/util/commonUtils';
import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

export const textInputStyles: {
  textInput: ComponentProps<typeof TextInput>['styles'];
} = {
  textInput: {
    input: {
      borderRadius: 5,
      borderWidth: 1,
      color: appColors.darkGray,
      fontFamily: appFonts.semiBold,
      fontSize: 14,
      paddingLeft: 5,
      textAlign: 'left',
      textAlignVertical: 'center',
      placeholderTextColor: appColors.lightDarkGray,
      paddingTop: isIOS() ? 12 : 0,
    },
    focused: {
      borderColor: appColors.lightPurple,
    },
    error: {
      borderColor: appColors.darkRed,
    },
    accessoryIcon: {
      color: appColors.lightPurple,
    },
  },
};
