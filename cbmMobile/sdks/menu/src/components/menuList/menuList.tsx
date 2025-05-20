import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { RightArrow } from '../../../../../shared/src/assets/icons/icons';
import { H4 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { Menu } from '../../models/menu';
import { menuListStyles } from './menuList.styles';

interface MenuListProps {
  listData?: Menu[];
  onPress?: (item: Menu) => void;
}

export const MenuList: React.FC<MenuListProps> = ({ listData, onPress }) => {
  const renderMenuContent = ({ item }: { item: Menu }) => {
    return (
      <>
        <TouchableOpacity style={menuListStyles.menu} onPress={() => onPress?.(item)}>
          <H4 style={menuListStyles.menuTitle}>{item.label}</H4>
          <RightArrow color={appColors.lightPurple} width={16} height={16} />
        </TouchableOpacity>
        <View style={menuListStyles.line} />
      </>
    );
  };
  return (
    <FlatList
      testID={'menu.menulist.list'}
      data={listData}
      style={menuListStyles.flexStyle}
      renderItem={renderMenuContent}
    />
  );
};
