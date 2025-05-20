import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';

import { WarningIcon } from '../../../../../shared/src/assets/icons/icons';
import { styles } from './profileCorrectionDropDown.styles';

interface DropdownMenuProps {
  onClose: () => void;
  onSelect: () => void;
  options: string[];
}

export const ProfileCorrectionDropDown = ({ options, onSelect, onClose }: DropdownMenuProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <TouchableOpacity style={styles.overlay} testID="overlay" onPress={onClose}>
      <Animated.View style={[styles.menu, { opacity: fadeAnim }]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            testID={option}
            style={styles.menuItem}
            onPress={() => {
              onSelect();
              onClose();
            }}
          >
            <WarningIcon />
            <Text style={styles.menuText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </TouchableOpacity>
  );
};
