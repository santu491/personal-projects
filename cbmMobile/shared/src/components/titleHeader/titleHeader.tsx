import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { LargeBackArrow, MoreIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
import { HeaderLeftView } from '../headerLeftView';

export interface NavProps {
  onPressLeftArrow?: () => void;
  onPressRightIcon?: () => void;
  title: string;
}

export const TitleHeader: React.FC<NavProps> = ({ onPressLeftArrow, onPressRightIcon, title }) => {
  return (
    <View style={styles.container}>
      <HeaderLeftView onPressLeftArrow={onPressLeftArrow} backArrowStyle={styles.backArrow} icon={<LargeBackArrow />} />
      <Text style={styles.label}>{title}</Text>
      {onPressRightIcon ? (
        <TouchableOpacity style={styles.rightSpace} onPress={onPressRightIcon}>
          <MoreIcon />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightSpace} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: appColors.white,
    borderBottomWidth: 1,
    borderBottomColor: appColors.lighterGray,
  },
  rightSpace: {
    width: 50,
  },
  label: {
    fontFamily: appFonts.semiBold,
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 24,
    color: appColors.darkGray,
  },
  backArrow: {
    backgroundColor: appColors.red,
    marginLeft: 24,
    width: 0,
    height: 0,
  },
});
