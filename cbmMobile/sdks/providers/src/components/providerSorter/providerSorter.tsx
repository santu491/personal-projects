import { useFocusEffect } from '@react-navigation/native';
import { useAccessibility } from '@sydney/motif-components';
import React, { useCallback, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { RightMarkIcon } from '../../../../../shared/src/assets/icons/icons';
import { SortInfo } from '../../model/providerFilter';
import { styles } from './providerSorter.styles';

export interface ProviderSorterProps {
  dataArray: SortInfo[];
  onPress: (text: SortInfo) => void;
  selectedInfo: SortInfo;
  title: string;
}

export const ProviderSorter: React.FC<ProviderSorterProps> = ({ title, dataArray, selectedInfo, onPress }) => {
  const viewRef = useRef<View>(null);
  const { setAccessibilityFocus } = useAccessibility();

  useFocusEffect(
    useCallback(() => {
      if (viewRef.current) {
        setAccessibilityFocus(viewRef);
      }
    }, [setAccessibilityFocus])
  );

  const renderItem = ({ item }: { item: SortInfo }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        accessibilityLabel={item.label}
        accessibilityRole="button"
        testID={`provider.${item.label}`}
      >
        <View style={styles.item} accessible={true}>
          <Text style={item.label === selectedInfo.label ? styles.selectedTextStyle : styles.textStyle}>
            {item.label}
          </Text>

          {item.label === selectedInfo.label ? <RightMarkIcon /> : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View ref={viewRef} accessible={true}>
      <View style={styles.headerContainer} accessible={true}>
        <Text style={styles.bottomSheetTitleStyle} testID={'test-sortby-providers'}>
          {title}
        </Text>
      </View>
      <View style={styles.descriptionContainer} accessible={true}>
        <FlatList
          scrollEnabled={false}
          data={dataArray}
          renderItem={(item) => renderItem(item)}
          keyExtractor={(item) => item.label}
        />
      </View>
    </View>
  );
};
