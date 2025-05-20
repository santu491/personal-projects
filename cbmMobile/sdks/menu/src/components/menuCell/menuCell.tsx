import React from 'react';
import { TouchableOpacity } from 'react-native';

import { RightArrow } from '../../../../../shared/src/assets/icons/icons';
import { RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../shared/src/context/appColors';
import { MenuItem } from '../../models/menu';
import { menuCellStyles } from './menuCell.styles';

export interface MenuCellProps {
  menuIcon: React.ReactElement | null;
  menuItem: MenuItem;
  onPress: () => void;
}

export const MenuCell = ({ menuIcon, menuItem, onPress }: MenuCellProps) => {
  return (
    <TouchableOpacity testID="menuCell" style={menuCellStyles.menu} onPress={onPress}>
      {menuItem.icon ? menuIcon : null}
      <RNText style={[menuCellStyles.menuTitle, !menuItem.icon ? menuCellStyles.extraMargin : menuCellStyles.label]}>
        {menuItem.label}
      </RNText>
      <RightArrow color={appColors.lightPurple} width={14} height={14} />
    </TouchableOpacity>
  );
};
