import { Selector } from '@sydney/motif-components';
import { ComponentProps } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { appColors } from '../context/appColors';
import { appFonts } from '../context/appFonts';

export interface SelectorStyles {
  container: ViewStyle;
  item: ViewStyle;
  label: TextStyle;
  selectedItem: ViewStyle;
  selectedLabel: TextStyle;
}

export const selectorStyles: {
  selector: ComponentProps<typeof Selector>['styles'];
} = {
  selector: {
    container: {
      flexDirection: 'row',
      borderRadius: 10,
      padding: 2,
      backgroundColor: appColors.palePurple,
      marginTop: 40,
    },
    item: {
      height: '100%',
      backgroundColor: appColors.palePurple,
    },
    selectedItem: {
      backgroundColor: appColors.white,
      paddingVertical: 5,
      borderRadius: 8,
    },
    label: {
      color: appColors.purple,
      fontFamily: appFonts.medium,
      fontSize: 14,
    },
    selectedLabel: {
      color: appColors.black,
      fontFamily: appFonts.medium,
      fontSize: 14,
    },
  },
};
